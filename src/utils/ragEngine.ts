import { UserProfile, SchemeData, SchemeEvaluation, RerankScoreBreakdown, RetrievedEvidenceChunk } from '../types';
import { OFFICIAL_SCHEMES } from '../data/schemes';

export interface HardRuleCheckResult {
  passed: boolean;
  disqualifications: string[];
  eligibilityRatio: number; // 0 to 1
}

/**
 * Deterministic Hard Rule Checks (PDF Section 8 & FR6)
 * Strict boundary conditions: age limits, state restrictions, landholding limits, income thresholds, gender.
 */
export function checkHardRules(profile: UserProfile, scheme: SchemeData): HardRuleCheckResult {
  const disqualifications: string[] = [];
  const rules = scheme.hardRules;

  // 1. Age check
  if (rules.minAge !== undefined && profile.age < rules.minAge) {
    disqualifications.push(`Age ${profile.age} is below minimum required age of ${rules.minAge}`);
  }
  if (rules.maxAge !== undefined && profile.age > rules.maxAge) {
    disqualifications.push(`Age ${profile.age} exceeds maximum allowed age of ${rules.maxAge}`);
  }

  // 2. Gender check
  if (rules.allowedGenders && rules.allowedGenders.length > 0) {
    if (profile.gender !== 'all' && !rules.allowedGenders.includes(profile.gender as any)) {
      disqualifications.push(`Restricted to ${rules.allowedGenders.join(', ')} applicants`);
    }
  }

  // 3. State / Location check
  if (rules.allowedStates && rules.allowedStates.length > 0) {
    const isAllIndia = rules.allowedStates.includes('All India');
    if (!isAllIndia && profile.state && !rules.allowedStates.some(s => s.toLowerCase() === profile.state.toLowerCase())) {
      disqualifications.push(`State-specific scheme for ${rules.allowedStates.join(', ')} (Applicant is in ${profile.state})`);
    }
  }

  // 4. Occupation check
  if (rules.allowedOccupations && rules.allowedOccupations.length > 0) {
    const normalizedOcc = profile.occupation.toLowerCase().trim();
    const isMatched = rules.allowedOccupations.some(occ => {
      if (occ === 'farmer' && (normalizedOcc.includes('farm') || normalizedOcc.includes('agri') || normalizedOcc.includes('cultivat'))) return true;
      if (occ === 'student' && normalizedOcc.includes('stud')) return true;
      if (occ === 'artisan' && (normalizedOcc.includes('artisan') || normalizedOcc.includes('craft') || normalizedOcc.includes('weaver') || normalizedOcc.includes('carpenter'))) return true;
      if (occ === 'street_vendor' && (normalizedOcc.includes('vendor') || normalizedOcc.includes('hawker') || normalizedOcc.includes('seller'))) return true;
      return occ === normalizedOcc;
    });

    if (!isMatched) {
      disqualifications.push(`Designed for ${rules.allowedOccupations.join(', ')} (Applicant occupation is ${profile.occupation})`);
    }
  }

  // 5. Landholding check
  if (rules.requiresLandholding && (!profile.landholding_acres || profile.landholding_acres <= 0)) {
    disqualifications.push('Mandatory cultivable landholding required; applicant has 0 acres recorded');
  }
  if (rules.maxLandholdingAcres !== undefined && profile.landholding_acres > rules.maxLandholdingAcres) {
    disqualifications.push(`Landholding of ${profile.landholding_acres} acres exceeds maximum limit of ${rules.maxLandholdingAcres} acres`);
  }

  // 6. Income threshold check
  if (rules.maxIncome !== undefined && profile.annual_income > rules.maxIncome) {
    disqualifications.push(`Annual income ₹${profile.annual_income.toLocaleString()} exceeds scheme ceiling of ₹${rules.maxIncome.toLocaleString()}`);
  }

  // 7. Category / Social group check
  if (rules.allowedCategories && rules.allowedCategories.length > 0) {
    if (!rules.allowedCategories.includes(profile.category)) {
      disqualifications.push(`Restricted to ${rules.allowedCategories.join(', ')} categories (Applicant is ${profile.category})`);
    }
  }

  // 8. BPL Card requirement
  if (rules.requiresBPL && !profile.has_bpl_card) {
    disqualifications.push('Requires verified Below Poverty Line (BPL) / Antyodaya status');
  }

  const passed = disqualifications.length === 0;
  const eligibilityRatio = passed ? 1.0 : Math.max(0.1, 1 - (disqualifications.length * 0.3));

  return {
    passed,
    disqualifications,
    eligibilityRatio,
  };
}

/**
 * Computes semantic relevance score between user query / profile interests and scheme content
 */
export function computeSemanticSimilarity(
  query: string,
  profile: UserProfile,
  scheme: SchemeData
): { score: number; evidenceChunks: RetrievedEvidenceChunk[] } {
  const queryTokens = (query || '').toLowerCase().split(/[\s,.-]+/).filter(t => t.length > 2);
  const profileTokens = [
    profile.occupation,
    profile.state,
    profile.district,
    profile.category,
    profile.landholding_acres > 0 ? 'land' : '',
    profile.landholding_acres > 0 ? 'farmer' : '',
    profile.annual_income <= 250000 ? 'low income' : '',
  ].map(t => t.toLowerCase());

  const searchTokens = Array.from(new Set([...queryTokens, ...profileTokens])).filter(Boolean);

  const evidenceChunks: RetrievedEvidenceChunk[] = [];
  let totalChunkScore = 0;

  scheme.chunks.forEach(chunk => {
    const chunkText = `${chunk.section} ${chunk.content}`.toLowerCase();
    let hitCount = 0;

    searchTokens.forEach(token => {
      if (chunkText.includes(token)) hitCount += 1;
    });

    if (queryTokens.length > 0) {
      queryTokens.forEach(token => {
        if (chunkText.includes(token)) hitCount += 2; // Higher weight for user prompt query
      });
    }

    const chunkRelevance = Math.min(1.0, (hitCount / Math.max(2, searchTokens.length)) * 1.4);
    if (chunkRelevance > 0.05 || evidenceChunks.length === 0) {
      evidenceChunks.push({
        chunkId: chunk.chunkId,
        schemeId: scheme.id,
        section: chunk.section,
        content: chunk.content,
        relevanceScore: Number(chunkRelevance.toFixed(2)),
      });
      totalChunkScore += chunkRelevance;
    }
  });

  // Also match against scheme name and summary
  const metaText = `${scheme.name} ${scheme.shortName} ${scheme.category} ${scheme.summary}`.toLowerCase();
  let metaHits = 0;
  searchTokens.forEach(t => {
    if (metaText.includes(t)) metaHits++;
  });

  const baseScore = Math.min(1.0, (metaHits / Math.max(1, searchTokens.length)) * 0.6 + (totalChunkScore / Math.max(1, scheme.chunks.length)) * 0.4);
  const finalSim = Math.max(0.2, Math.min(0.98, Number(baseScore.toFixed(3))));

  // Sort evidence chunks descending by relevance
  evidenceChunks.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return {
    score: finalSim,
    evidenceChunks: evidenceChunks.slice(0, 3),
  };
}

/**
 * Exact Reranking Strategy formula from PDF Section 9:
 * Final Score = 0.35 × Semantic Similarity + 0.25 × Eligibility Match + 0.20 × Location Match + 0.10 × Occupation Match + 0.10 × Other Criteria
 */
export function computeRerankScore(
  profile: UserProfile,
  scheme: SchemeData,
  semanticSim: number,
  hardCheck: HardRuleCheckResult
): RerankScoreBreakdown {
  // 1. Eligibility Match (0 to 1)
  const eligibilityMatch = hardCheck.passed ? 1.0 : hardCheck.eligibilityRatio * 0.3;

  // 2. Location Match (0 to 1)
  let locationMatch = 0.5; // Default for central All India
  if (scheme.hardRules.allowedStates && scheme.hardRules.allowedStates.length > 0) {
    if (scheme.hardRules.allowedStates.includes('All India')) {
      locationMatch = 0.85;
    } else if (scheme.hardRules.allowedStates.some(s => s.toLowerCase() === profile.state.toLowerCase())) {
      locationMatch = 1.0; // Exact state match bonus
    } else {
      locationMatch = 0.05;
    }
  } else {
    locationMatch = 0.85;
  }

  // 3. Occupation Match (0 to 1)
  let occupationMatch = 0.5;
  if (scheme.hardRules.allowedOccupations && scheme.hardRules.allowedOccupations.length > 0) {
    const normOcc = profile.occupation.toLowerCase();
    const matches = scheme.hardRules.allowedOccupations.some(o => normOcc.includes(o) || o.includes(normOcc));
    occupationMatch = matches ? 1.0 : 0.1;
  } else {
    occupationMatch = 0.8; // Open to general occupations
  }

  // 4. Other Criteria (Income bracket, Category, Land, Age alignment)
  let otherCriteria = 0.6;
  if (profile.annual_income <= (scheme.hardRules.maxIncome || 500000)) otherCriteria += 0.2;
  if (scheme.hardRules.requiresLandholding && profile.landholding_acres > 0) otherCriteria += 0.2;
  otherCriteria = Math.min(1.0, otherCriteria);

  // Apply PDF formula:
  // Final Score = 0.35 * Sim + 0.25 * Elig + 0.20 * Loc + 0.10 * Occ + 0.10 * Other
  const rawFinalScore = (
    0.35 * semanticSim +
    0.25 * eligibilityMatch +
    0.20 * locationMatch +
    0.10 * occupationMatch +
    0.10 * otherCriteria
  );

  const finalScore = Number(rawFinalScore.toFixed(3));
  const formulaText = `0.35×${semanticSim.toFixed(2)} + 0.25×${eligibilityMatch.toFixed(2)} + 0.20×${locationMatch.toFixed(2)} + 0.10×${occupationMatch.toFixed(2)} + 0.10×${otherCriteria.toFixed(2)} = ${finalScore.toFixed(3)}`;

  return {
    semanticSimilarity: Number(semanticSim.toFixed(3)),
    eligibilityMatch: Number(eligibilityMatch.toFixed(3)),
    locationMatch: Number(locationMatch.toFixed(3)),
    occupationMatch: Number(occupationMatch.toFixed(3)),
    otherCriteria: Number(otherCriteria.toFixed(3)),
    finalScore,
    formulaText,
  };
}

/**
 * Evaluates all schemes with the complete SCHEMOS end-to-end workflow:
 * Filtering -> Semantic Retrieval -> Reranking -> Evidence Assembly -> Citations
 */
export function evaluateAllSchemes(
  profile: UserProfile,
  query: string = '',
  schemes: SchemeData[] = OFFICIAL_SCHEMES
): SchemeEvaluation[] {
  const results: SchemeEvaluation[] = schemes.map(scheme => {
    // 1. Hard Rule Filtering
    const hardCheck = checkHardRules(profile, scheme);

    // 2. Semantic Similarity & Evidence Retrieval
    const { score: semanticSim, evidenceChunks } = computeSemanticSimilarity(query, profile, scheme);

    // 3. Reranking using PDF formula
    const scores = computeRerankScore(profile, scheme, semanticSim, hardCheck);

    // 4. Determine status
    let eligibilityStatus: 'confirmed' | 'likely' | 'conditional' | 'ineligible' = 'likely';
    if (!hardCheck.passed) {
      eligibilityStatus = 'ineligible';
    } else if (scores.finalScore >= 0.82) {
      eligibilityStatus = 'confirmed';
    } else if (scores.finalScore >= 0.65) {
      eligibilityStatus = 'likely';
    } else {
      eligibilityStatus = 'conditional';
    }

    // 5. Missing Information Notice per PDF Section 10
    let missingInformationNotice: string | undefined;
    if (scheme.hardRules.requiresLandholding && profile.landholding_acres > 0) {
      missingInformationNotice = 'Final approval requires verified Record of Rights (Pahani/RTC) and Aadhaar e-KYC.';
    } else if (scheme.hardRules.maxIncome && profile.annual_income > 0) {
      missingInformationNotice = 'Income verification certificate issued by Revenue Department (Tahsildar) is needed for application.';
    }

    // 6. Assemble Citations
    const citations = [
      {
        title: `${scheme.shortName} Official Portal`,
        url: scheme.officialUrl,
        referenceText: `Hosted by ${scheme.ministry}`,
        section: 'Portal',
      },
      {
        title: scheme.guidelineDocument,
        url: scheme.officialUrl,
        referenceText: `Official Government Scheme Notification`,
        section: 'Gazette / Guidelines',
      }
    ];

    // Fallback Grounded Explanation if LLM is offline
    const groundedExplanation = hardCheck.passed
      ? `Based on official guidelines from ${scheme.ministry}, applicant meets the core parameters (Age ${profile.age}, ${profile.occupation} in ${profile.state || 'India'}, Annual Income ₹${profile.annual_income.toLocaleString()}${profile.landholding_acres ? `, ${profile.landholding_acres} acres landholding` : ''}). Eligible for ${scheme.financialValue}. Verification will be performed by concerned authority via ${scheme.departmentPortal}.`
      : `Application disqualified under hard eligibility criteria: ${hardCheck.disqualifications.join('; ')}.`;

    return {
      scheme,
      passedHardRules: hardCheck.passed,
      hardRuleDisqualifications: hardCheck.disqualifications,
      scores,
      eligibilityStatus,
      retrievedEvidenceChunks: evidenceChunks,
      groundedExplanation,
      missingInformationNotice,
      citations,
    };
  });

  // Sort by finalScore descending, with passedHardRules prioritized
  results.sort((a, b) => {
    if (a.passedHardRules && !b.passedHardRules) return -1;
    if (!a.passedHardRules && b.passedHardRules) return 1;
    return b.scores.finalScore - a.scores.finalScore;
  });

  return results;
}
