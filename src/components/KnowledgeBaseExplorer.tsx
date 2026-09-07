import React, { useState, useEffect } from 'react';
import { OFFICIAL_SCHEMES } from '../data/schemes';
import { SchemeData } from '../types';
import { Search, ExternalLink, BookOpen, FileText, CheckCircle2, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';

export const KnowledgeBaseExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [schemes, setSchemes] = useState<SchemeData[]>(OFFICIAL_SCHEMES);
  const [totalCount, setTotalCount] = useState<number>(OFFICIAL_SCHEMES.length);
  const [activeScheme, setActiveScheme] = useState<SchemeData>(OFFICIAL_SCHEMES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories = [
    'All',
    'Agriculture,Rural & Environment',
    'Social welfare & Empowerment',
    'Education & Learning',
    'Business & Entrepreneurship',
    'Housing & Shelter',
    'Health & Wellness',
    'Banking,Financial Services and Insurance',
    'Women and Child',
  ];

  // Fetch schemes from backend with debounce
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set('search', searchTerm.trim());
        if (selectedCategory !== 'All') params.set('category', selectedCategory);
        params.set('limit', '80');

        const res = await fetch(`/api/schemes?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.schemes && Array.isArray(data.schemes)) {
            setSchemes(data.schemes);
            setTotalCount(data.totalCount || data.schemes.length);
            if (data.schemes.length > 0) {
              setActiveScheme(data.schemes[0]);
            }
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend schemes search failed, falling back to local dataset:', err);
      }

      if (isMounted) {
        // Local fallback
        const filtered = OFFICIAL_SCHEMES.filter((scheme) => {
          const matchesCategory = selectedCategory === 'All' || scheme.category.includes(selectedCategory);
          const matchesSearch =
            !searchTerm.trim() ||
            scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.summary.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesCategory && matchesSearch;
        });
        setSchemes(filtered);
        setTotalCount(filtered.length);
        if (filtered.length > 0) {
          setActiveScheme(filtered[0]);
        }
        setIsLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-slate-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest mb-2 border border-blue-300">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Official Portals & Guidelines
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              Government Schemes Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct access to official central and state government gazettes, ministry portals, and operational guidelines from the 3,400 schemes database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
            <div className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 bg-blue-100 text-blue-900 border border-blue-400 font-mono">
              {totalCount} Authoritative Schemes Indexed
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search across 3,400 schemes by name, keyword, crop, subsidy (e.g. 'farmer', 'solar', 'loan')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 border-slate-900 font-bold text-slate-900 focus:border-blue-600 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 gap-1.5 text-xs">
            {categories.map((cat) => {
              const label = cat === 'All' ? 'All' : cat.split('&')[0].trim();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 whitespace-nowrap font-black uppercase tracking-wider text-[11px] transition-colors cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Pane */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-900 divide-y-2 divide-slate-200 overflow-hidden max-h-[720px] overflow-y-auto">
          {schemes.map((scheme) => {
            const isSelected = activeScheme && scheme.id === activeScheme.id;
            return (
              <button
                id={`kb-scheme-${scheme.id}`}
                key={scheme.id}
                onClick={() => setActiveScheme(scheme)}
                className={`w-full text-left p-4 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-700">
                      {scheme.category || 'Welfare'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                      {scheme.state || 'National'}
                    </span>
                  </div>
                  <h4 className="text-sm font-black uppercase text-slate-900 leading-snug">
                    {scheme.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {scheme.summary}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 mt-1 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
              </button>
            );
          })}

          {schemes.length === 0 && !isLoading && (
            <div className="p-8 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
              No government schemes match your filter criteria.
            </div>
          )}
        </div>

        {/* Right Detail & Chunk Inspector Pane */}
        {activeScheme && (
          <div className="lg:col-span-7 bg-white border-2 border-slate-900 p-6 sm:p-7 space-y-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300">
                  {activeScheme.category || 'General Welfare'}
                </span>
                <a
                  href={activeScheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-900 font-black uppercase tracking-wider hover:text-blue-600"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                </a>
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-2">
                {activeScheme.name}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Ministry: {activeScheme.ministry || 'Government of India'} • Ref: <span className="font-mono text-slate-700">{activeScheme.guidelineDocument || activeScheme.name}</span>
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-slate-900 text-xs text-slate-900 space-y-1">
              <span className="font-black uppercase tracking-widest text-[10px] text-slate-600 block">Financial Assistance:</span>
              <p className="font-black text-sm text-slate-900">{activeScheme.financialValue || 'Direct Financial / In-kind Assistance'}</p>
            </div>

            {/* Benefits Overview */}
            {activeScheme.benefits && activeScheme.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Key Scheme Benefits
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-300 text-xs text-slate-800 space-y-1.5 leading-relaxed">
                  {activeScheme.benefits.map((b, i) => (
                    <p key={i}>• {b}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Application Procedure */}
            {activeScheme.applicationProcedure && activeScheme.applicationProcedure.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Application Procedure
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-300 text-xs text-slate-800 space-y-2 leading-relaxed">
                  {activeScheme.applicationProcedure.map((step, i) => (
                    <p key={i}>{step}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Text Chunks in Vector Knowledge Base */}
            {activeScheme.chunks && activeScheme.chunks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Indexed Chunks in Vector Knowledge Base
                  </h4>
                  <span className="text-[10px] font-mono uppercase text-slate-400">FAISS Vector Index (3,400 Schemes)</span>
                </div>

                <div className="space-y-3">
                  {activeScheme.chunks.map((chunk) => (
                    <div key={chunk.chunkId} className="p-4 border border-slate-900 bg-slate-50/60 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black uppercase text-[11px] text-slate-900">
                          [{chunk.chunkId}] Section: {chunk.section}
                        </span>
                        {chunk.pageOrClause && (
                          <span className="text-[10px] text-blue-700 font-mono font-bold uppercase bg-blue-100 px-2 py-0.5 border border-blue-300">
                            {chunk.pageOrClause}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-mono pt-1 bg-white p-2.5 border border-slate-200 italic">
                        "{chunk.content}"
                      </p>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-1">
                        Source: <span className="text-slate-700">{chunk.sourceDoc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Documents */}
            {activeScheme.requiredDocuments && activeScheme.requiredDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Required Documents Checklist
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeScheme.requiredDocuments.map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-slate-900 font-bold text-xs uppercase border border-slate-900"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
