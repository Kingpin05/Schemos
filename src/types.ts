export interface UserProfile {
  age: number;
  state: string;
  district: string;
  occupation: string;
  annual_income: number;
  landholding_acres: number;
  gender: 'male' | 'female' | 'other' | 'all';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  is_differently_abled?: boolean;
  has_bpl_card?: boolean;
  marital_status?: 'single' | 'married' | 'widowed' | 'divorced';
  special_tags?: string[];
}

export interface SchemeChunk {
  chunkId: string;
  section: 'Eligibility' | 'Benefits' | 'Documents' | 'Application Procedure' | 'Exclusions';
  content: string;
  sourceDoc: string;
  pageOrClause?: string;
}

export interface SchemeHardRules {
  minAge?: number;
  maxAge?: number;
  allowedGenders?: ('male' | 'female' | 'other')[];
  allowedOccupations?: string[];
  maxIncome?: number;
  maxLandholdingAcres?: number;
  requiresLandholding?: boolean;
  allowedCategories?: string[];
  allowedStates?: string[]; // Empty or ['All India'] means national
  requiresBPL?: boolean;
}

export interface SchemeData {
  id: string;
  name: string;
  shortName: string;
  ministry: string;
  state: string;
  category: 'Agriculture & Rural' | 'Healthcare' | 'Housing' | 'Social Welfare' | 'Financial & Business' | 'Education & Skill' | 'Women & Child' | 'Energy & Green';
  summary: string;
  hardRules: SchemeHardRules;
  benefits: string[];
  financialValue: string;
  requiredDocuments: string[];
  applicationProcedure: string[];
  officialUrl: string;
  departmentPortal: string;
  guidelineDocument: string;
  lastUpdated: string;
  chunks: SchemeChunk[];
}

export interface RerankScoreBreakdown {
  semanticSimilarity: number; // 0 to 1 (Weight 0.35)
  eligibilityMatch: number;   // 0 to 1 (Weight 0.25)
  locationMatch: number;      // 0 to 1 (Weight 0.20)
  occupationMatch: number;    // 0 to 1 (Weight 0.10)
  otherCriteria: number;      // 0 to 1 (Weight 0.10)
  finalScore: number;         // 0 to 1
  formulaText: string;
}

export interface RetrievedEvidenceChunk {
  chunkId: string;
  schemeId: string;
  section: string;
  content: string;
  relevanceScore: number;
}

export interface SchemeEvaluation {
  scheme: SchemeData;
  passedHardRules: boolean;
  hardRuleDisqualifications: string[];
  scores: RerankScoreBreakdown;
  eligibilityStatus: 'confirmed' | 'likely' | 'conditional' | 'ineligible';
  retrievedEvidenceChunks: RetrievedEvidenceChunk[];
  groundedExplanation?: string;
  missingInformationNotice?: string;
  citations: Array<{
    title: string;
    url: string;
    referenceText: string;
    section: string;
  }>;
}

export interface RagPipelineStep {
  stepNumber: number;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'skipped';
  metrics?: {
    candidateCount?: number;
    hardPassedCount?: number;
    topKRetrieved?: number;
    executionTimeMs?: number;
    modelUsed?: string;
  };
}

export interface RagPipelineTelemetry {
  steps: RagPipelineStep[];
  totalSchemesEvaluated: number;
  hardFilterPassedCount: number;
  topMatchesCount: number;
  executionTimeMs: number;
  aiGrounded: boolean;
}
