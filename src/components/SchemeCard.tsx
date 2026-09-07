import React, { useState } from 'react';
import { SchemeEvaluation } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Calculator,
  ShieldCheck,
  Building,
  Sparkles,
  Layers,
} from 'lucide-react';

interface SchemeCardProps {
  evaluation: SchemeEvaluation;
  onOpenKnowledgeChunk?: (schemeId: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ evaluation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'benefits' | 'documents' | 'procedure' | 'evidence'>('benefits');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [showFormula, setShowFormula] = useState(false);

  const { scheme, passedHardRules, hardRuleDisqualifications, scores, eligibilityStatus, groundedExplanation, missingInformationNotice, citations, retrievedEvidenceChunks } = evaluation;

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const getStatusBadge = () => {
    if (!passedHardRules) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase bg-slate-200 text-slate-600 border border-slate-300">
          <XCircle className="w-3.5 h-3.5 text-slate-600" />
          Rule Excluded
        </span>
      );
    }
    switch (eligibilityStatus) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase bg-green-100 text-green-800 border border-green-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
            Fully Match
          </span>
        );
      case 'likely':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Likely Match
          </span>
        );
      case 'conditional':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            Conditional Match
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`scheme-card-${scheme.id}`}
      className={`border-2 transition-all p-6 relative ${
        passedHardRules
          ? 'bg-white border-slate-900'
          : 'bg-slate-50/90 border-slate-300 opacity-85'
      }`}
    >
      {/* Card Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-slate-300 bg-slate-100 text-slate-700">
                {scheme.category}
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-slate-300 bg-slate-100 text-slate-700 font-mono">
                {scheme.state}
              </span>
            </div>

            <h3 className={`text-xl font-black uppercase tracking-tight pt-1 ${
              passedHardRules ? 'text-slate-900' : 'text-slate-600'
            }`}>
              {scheme.name}
            </h3>

            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{scheme.ministry}</span>
            </div>
          </div>

          {/* Eligibility Match Pill */}
          <div className="flex flex-col items-end gap-1">
            <button
              id={`btn-formula-${scheme.id}`}
              type="button"
              onClick={() => setShowFormula(!showFormula)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-900 hover:bg-blue-50 text-slate-900 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
              title="Click to view eligibility match breakdown"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Eligibility Match:</span>
              <span className="text-blue-600 font-mono font-black">
                {(scores.finalScore * 100).toFixed(1)}%
              </span>
            </button>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Verified Match</span>
          </div>
        </div>

        {/* Score Formula Breakdown Drawer */}
        {showFormula && (
          <div className="mt-4 p-4 bg-slate-100 border border-slate-900 text-xs space-y-2.5 font-mono text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between text-slate-900 font-sans font-black uppercase tracking-wide">
              <span className="flex items-center gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Eligibility Match Breakdown
              </span>
              <span className="text-[10px] font-mono text-slate-500">Criteria Weights</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-sans pt-1">
              <div className="p-2.5 bg-white border border-slate-300">
                <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider">Semantic Sim (0.35)</span>
                <span className="font-mono font-black text-slate-900 text-sm">{(scores.semanticSimilarity * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-300">
                <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider">Hard Rules (0.25)</span>
                <span className="font-mono font-black text-slate-900 text-sm">{(scores.eligibilityMatch * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-300">
                <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider">Location (0.20)</span>
                <span className="font-mono font-black text-slate-900 text-sm">{(scores.locationMatch * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-300">
                <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider">Occupation (0.10)</span>
                <span className="font-mono font-black text-slate-900 text-sm">{(scores.occupationMatch * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-300">
                <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider">Other Criteria (0.10)</span>
                <span className="font-mono font-black text-slate-900 text-sm">{(scores.otherCriteria * 100).toFixed(0)}%</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-600 font-mono pt-1">
              Formula: {scores.formulaText}
            </p>
          </div>
        )}

        {/* Financial Value Banner */}
        <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 border border-slate-900 bg-blue-50 text-xs text-slate-900 font-bold uppercase tracking-wide">
          <span className="text-slate-500 font-mono">Assistance:</span>
          <span className="font-black text-slate-900">{scheme.financialValue}</span>
        </div>

        {/* Summary */}
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {scheme.summary}
        </p>

        {/* Hard Rule Disqualifications (if any) */}
        {!passedHardRules && hardRuleDisqualifications.length > 0 && (
          <div className="mt-3.5 p-3.5 border-2 border-slate-900 bg-rose-50 text-xs text-rose-900 space-y-1">
            <div className="font-black uppercase tracking-wider flex items-center gap-1.5 text-rose-900 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
              Deterministic Rule Disqualification Reason:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-rose-800 text-xs pl-1 font-medium">
              {hardRuleDisqualifications.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Grounded AI Explanation */}
        {groundedExplanation && (
          <div className="mt-3.5 p-3.5 border border-slate-900 bg-slate-50 text-xs text-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-800 font-black text-[10px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Source-Grounded Eligibility Evaluation
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              {groundedExplanation}
            </p>
          </div>
        )}

        {/* Missing Information Notice (PDF Section 10) */}
        {missingInformationNotice && passedHardRules && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-400 p-3">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-black uppercase tracking-wider text-[10px] block mb-0.5">Notice for Verification: </span>
              <span className="text-amber-950 font-medium">{missingInformationNotice}</span>
            </div>
          </div>
        )}

        {/* Quick Action & Source Footer matching Design HTML */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Source: <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-mono">{scheme.guidelineDocument || scheme.officialUrl.replace('https://', '')}</a>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ref ID: <span className="text-slate-900 font-mono font-bold">{scheme.id.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              id={`link-official-${scheme.id}`}
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-900 hover:text-blue-600 font-black uppercase text-xs tracking-wider"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>

            <button
              id={`btn-expand-${scheme.id}`}
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 font-black uppercase tracking-wider text-[11px] hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Specs' : 'View Specs & Chunks'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Accordion: Tabs for Benefits, Documents, Procedure & Retrieved Chunks */}
      {isExpanded && (
        <div className="border-t-2 border-slate-900 bg-slate-50/70 p-5 mt-4 -mx-6 -mb-6 animate-fadeIn">
          {/* Internal Tab switcher */}
          <div className="flex items-center gap-4 border-b border-slate-300 pb-2 mb-4 text-xs font-bold uppercase tracking-wider overflow-x-auto">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'benefits'
                  ? 'border-blue-600 text-slate-900 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              Key Benefits
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-slate-900 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              Document Checklist ({scheme.requiredDocuments.length})
            </button>
            <button
              onClick={() => setActiveTab('procedure')}
              className={`pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'procedure'
                  ? 'border-blue-600 text-slate-900 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              Application Steps
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'evidence'
                  ? 'border-blue-600 text-slate-900 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              Evidence Chunks ({retrievedEvidenceChunks.length})
            </button>
          </div>

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-2 text-xs text-slate-800">
              <ul className="space-y-2">
                {scheme.benefits.map((benefit, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents Tab: Interactive citizen checklist */}
          {activeTab === 'documents' && (
            <div className="space-y-2.5 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Verify documents ready before submitting to state portal or Common Service Centre (CSC):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scheme.requiredDocuments.map((doc, dIdx) => (
                  <label
                    key={dIdx}
                    className={`flex items-start gap-2.5 p-3 border transition-colors cursor-pointer select-none ${
                      checkedDocs[doc]
                        ? 'bg-blue-50 border-slate-900 text-slate-900 font-bold'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-900'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedDocs[doc] || false}
                      onChange={() => toggleDoc(doc)}
                      className="w-4 h-4 mt-0.5 rounded-none border-2 border-slate-900 accent-blue-600"
                    />
                    <span className="flex-1 text-xs">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Procedure Tab */}
          {activeTab === 'procedure' && (
            <div className="space-y-3 text-xs text-slate-800">
              <ol className="space-y-3">
                {scheme.applicationProcedure.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-3 bg-white p-3 border border-slate-300">
                    <span className="w-5 h-5 bg-slate-900 text-white font-black font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="pt-2">
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-black uppercase text-xs tracking-wider hover:bg-blue-600 transition-colors"
                >
                  <span>Go to Official Application Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Evidence Chunks Tab (RAG Transparency) */}
          {activeTab === 'evidence' && (
            <div className="space-y-3 text-xs text-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Official text chunks extracted from scheme gazettes and guidelines used for grounded RAG generation:
              </p>
              <div className="space-y-2.5">
                {retrievedEvidenceChunks.map((chunk, cIdx) => (
                  <div key={cIdx} className="p-3.5 bg-white border border-slate-900 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-1.5 text-slate-900">
                        <FileText className="w-3 h-3 text-blue-600" />
                        Chunk [{chunk.chunkId}] • {chunk.section}
                      </span>
                      <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 font-bold">
                        Relevance: {(chunk.relevanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-slate-700 italic text-xs leading-relaxed bg-slate-50 p-2.5 border border-slate-200 font-mono">
                      "{chunk.content}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Citations List */}
              <div className="pt-3 border-t border-slate-300">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Official Statute Citations
                </span>
                <ul className="space-y-1.5">
                  {citations.map((cite, ciIdx) => (
                    <li key={ciIdx} className="flex items-center justify-between text-xs p-2 bg-white border border-slate-200">
                      <span className="text-slate-800 font-bold uppercase tracking-tight">{cite.title}</span>
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px] font-bold"
                      >
                        {cite.section}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
