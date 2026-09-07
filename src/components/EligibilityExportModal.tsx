import React from 'react';
import { UserProfile, SchemeEvaluation } from '../types';
import { ShieldCheck, Printer, X, Download, ExternalLink, CheckSquare } from 'lucide-react';

interface EligibilityExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  evaluations: SchemeEvaluation[];
  globalSummary?: string;
}

export const EligibilityExportModal: React.FC<EligibilityExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  evaluations,
  globalSummary,
}) => {
  if (!isOpen) return null;

  const eligibleSchemes = evaluations.filter((e) => e.passedHardRules);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-slate-900 overflow-hidden shadow-2xl animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b-2 border-slate-900 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                Citizen Welfare Eligibility Dossier
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Official source-grounded summary for Common Service Centre (CSC) & Panchayat submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 border border-slate-900 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer border border-transparent hover:border-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div id="printable-dossier" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Citizen Demographics Card */}
          <div className="p-4 border-2 border-slate-900 bg-slate-50 space-y-3">
            <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1">
              Citizen Verified Demographics Record
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Age / Gender</span>
                <span className="font-bold text-slate-900">{profile.age} yrs • {profile.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Location</span>
                <span className="font-bold text-slate-900">{profile.district ? `${profile.district}, ` : ''}{profile.state}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Occupation</span>
                <span className="font-bold text-slate-900 uppercase font-mono">{profile.occupation.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Annual Income</span>
                <span className="font-mono font-black text-slate-900">₹{profile.annual_income.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Landholding</span>
                <span className="font-mono font-bold text-slate-900">{profile.landholding_acres || 0} Acres</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Social Category</span>
                <span className="font-bold text-slate-900">{profile.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">BPL Ration Card</span>
                <span className="font-bold text-slate-900">{profile.has_bpl_card ? 'Yes (Verified)' : 'No'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">SCHEMOS Verified Date</span>
                <span className="font-mono font-bold text-slate-900">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* AI Grounded Summary */}
          {globalSummary && (
            <div className="p-4 border border-slate-900 bg-blue-50/70 text-xs text-slate-800 space-y-1.5">
              <span className="font-black text-blue-900 uppercase tracking-widest text-[10px] block">
                SCHEMOS Assessment Overview
              </span>
              <p className="leading-relaxed font-medium">{globalSummary}</p>
            </div>
          )}

          {/* Qualified Schemes Table */}
          <div className="space-y-4">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-2 flex items-center justify-between">
              <span>Recommended Schemes ({eligibleSchemes.length})</span>
              <span className="text-[10px] font-mono text-slate-500">Source Grounded</span>
            </h4>

            <div className="space-y-4">
              {eligibleSchemes.map((ev, idx) => (
                <div key={ev.scheme.id} className="border border-slate-900 p-4 space-y-2.5 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 border border-blue-300">
                        Scheme #{idx + 1} • {ev.scores.finalScore ? `SCHEMOS Score: ${(ev.scores.finalScore * 100).toFixed(0)}%` : ''}
                      </span>
                      <h5 className="font-black text-base uppercase text-slate-900 mt-1 tracking-tight">
                        {ev.scheme.name}
                      </h5>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{ev.scheme.ministry}</p>
                    </div>
                    <span className="text-xs font-black uppercase text-slate-900 bg-slate-100 px-3 py-1 border border-slate-300">
                      {ev.scheme.financialValue}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {ev.groundedExplanation || ev.scheme.summary}
                  </p>

                  <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-black uppercase text-[10px] text-slate-700 block mb-1 tracking-wider">
                        Mandatory Documents Needed:
                      </span>
                      <ul className="space-y-1 text-slate-700 text-xs">
                        {ev.scheme.requiredDocuments.map((doc, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-black uppercase text-[10px] text-slate-700 block mb-1 tracking-wider">
                        Official Application Link:
                      </span>
                      <span className="text-blue-600 font-mono text-xs underline break-all font-bold">
                        {ev.scheme.officialUrl}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">
                        Ref: {ev.scheme.guidelineDocument}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Authority Disclaimer */}
          <div className="p-3 bg-slate-100 border border-slate-300 text-[11px] text-slate-600 leading-relaxed">
            <strong className="font-black uppercase text-slate-800">Statutory Disclaimer:</strong> SCHEMOS is an AI public service assistant providing grounded retrieval based on official notifications. Final eligibility, beneficiary selection, and fund disbursements are subject to physical verification and sanction by the designated Central/State departmental nodal officers.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-2 border-slate-900 bg-white flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-500 font-mono text-[10px]">SCHEMOS Public Service System • Source Grounded</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-900 hover:bg-slate-100 text-slate-900 font-black uppercase text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
