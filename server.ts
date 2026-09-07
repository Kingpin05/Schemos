import express from "express";
import path from "path";
import fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { OFFICIAL_SCHEMES } from "./src/data/schemes";
import { evaluateAllSchemes } from "./src/utils/ragEngine";
import { UserProfile } from "./src/types";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

app.use(express.json());

// --- Python FastAPI Subprocess Management ---
let pythonProcess: ChildProcess | null = null;

async function isBackendAlive(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, {
      signal: AbortSignal.timeout(1500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function resolvePythonCommand(): string {
  const preferred = "C:\\Users\\Vedant\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";
  if (fs.existsSync(preferred)) {
    return preferred;
  }
  return "python";
}

async function ensureBackendRunning() {
  const alreadyRunning = await isBackendAlive();
  if (alreadyRunning) {
    console.log(`[Gateway] Python FastAPI backend is already active at ${BACKEND_URL}`);
    return;
  }

  const pythonCmd = resolvePythonCommand();
  const backendDir = path.join(process.cwd(), "backend");

  console.log(`[Gateway] Auto-spawning GovRAG Python backend (${pythonCmd}) on port 8000...`);

  pythonProcess = spawn(pythonCmd, ["-m", "uvicorn", "app.main:app", "--port", "8000"], {
    cwd: backendDir,
    stdio: "inherit",
    shell: true,
  });

  pythonProcess.on("error", (err) => {
    console.warn("[Gateway] Failed to spawn Python backend process:", err.message);
  });

  pythonProcess.on("exit", (code, signal) => {
    console.log(`[Gateway] Python backend exited with code ${code}, signal ${signal}`);
  });

  // Poll for up to 15 seconds to confirm FastAPI is ready
  for (let attempt = 1; attempt <= 30; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (await isBackendAlive()) {
      console.log(`[Gateway] Python FastAPI backend is connected and healthy at ${BACKEND_URL}!`);
      return;
    }
  }
  console.warn(`[Gateway] Backend startup is taking longer than usual. Reverse proxy with fallback is active.`);
}

function cleanUpBackend() {
  if (pythonProcess && pythonProcess.pid) {
    console.log("[Gateway] Gracefully shutting down Python backend...");
    try {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", pythonProcess.pid.toString(), "/f", "/t"]);
      } else {
        pythonProcess.kill("SIGTERM");
      }
    } catch (e: any) {
      console.error("[Gateway] Error stopping backend:", e.message);
    }
  }
}

process.on("exit", cleanUpBackend);
process.on("SIGINT", () => {
  cleanUpBackend();
  process.exit();
});
process.on("SIGTERM", () => {
  cleanUpBackend();
  process.exit();
});

// --- Reverse Proxy Middleware for /api/* to FastAPI ---
app.use("/api", async (req, res, next) => {
  try {
    const targetUrl = `${BACKEND_URL}/api${req.url}`;
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (key.toLowerCase() !== "host" && typeof value === "string") {
        headers.set(key, value);
      }
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      signal: AbortSignal.timeout(60000), // 60 second timeout for complex RAG
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get("content-type") || "";

    res.status(response.status);
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.send(text);
    }
  } catch (err: any) {
    // If proxy failed (e.g. backend still starting up or offline), gracefully continue to fallback routes
    console.warn(`[Gateway] Proxy to FastAPI failed (${err.message}). Activating local fallback.`);
    return next();
  }
});

// --- In-Process Fallback Handlers (Guarantees zero-downtime if backend is offline) ---

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback 1: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    schemeCount: OFFICIAL_SCHEMES.length,
    backendConnected: false,
    mode: "fallback",
  });
});

// Fallback 2: Knowledge Base Schemes
app.get("/api/schemes", (_req, res) => {
  res.json({
    schemes: OFFICIAL_SCHEMES,
    totalCount: OFFICIAL_SCHEMES.length,
    mode: "fallback",
  });
});

// Fallback 3: Core Recommendation Engine
app.post("/api/rag-recommend", async (req, res) => {
  const startTime = Date.now();
  try {
    const { profile, query } = req.body as { profile: UserProfile; query?: string };
    if (!profile) {
      return res.status(400).json({ error: "Missing user profile in request payload" });
    }

    const evaluated = evaluateAllSchemes(profile, query || "", OFFICIAL_SCHEMES);
    const passedHardFilter = evaluated.filter((e) => e.passedHardRules);

    const executionTimeMs = Date.now() - startTime;
    return res.json({
      success: true,
      evaluatedSchemes: evaluated,
      globalSummary: `Evaluated ${OFFICIAL_SCHEMES.length} authoritative schemes against your demographic parameters (Age ${profile.age}, ${profile.occupation} in ${profile.state || "India"}, Annual Income ₹${profile.annual_income.toLocaleString()}). Identified ${passedHardFilter.length} applicable schemes meeting strict eligibility bounds.`,
      telemetry: {
        totalSchemesEvaluated: OFFICIAL_SCHEMES.length,
        hardFilterPassedCount: passedHardFilter.length,
        topMatchesCount: Math.min(passedHardFilter.length, 5),
        executionTimeMs,
        aiGrounded: false,
      },
    });
  } catch (error: any) {
    console.error("Error in fallback /api/rag-recommend:", error);
    res.status(500).json({ error: error.message || "Failed to process RAG recommendation" });
  }
});

// --- Vite Middleware for Development & Static Production Serving ---
async function startServer() {
  // Start or verify Python FastAPI backend
  await ensureBackendRunning();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Gateway] GovRAG Full-Stack Gateway running on http://0.0.0.0:${PORT}`);
    console.log(`[Gateway] Frontend accessible at: http://localhost:${PORT}`);
    console.log(`[Gateway] Python FastAPI proxying to: ${BACKEND_URL}`);
  });
}

startServer();
