import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, Layers, Globe, Cpu } from 'lucide-react';

interface HeaderProps {
  currentTab: 'assistant' | 'knowledge';
  onTabChange: (tab: 'assistant' | 'knowledge') => void;
  language: 'en' | 'hi' | 'kn';
  onLanguageChange: (lang: 'en' | 'hi' | 'kn') => void;
  hasApiKey: boolean;
  backendInfo?: {
    connected: boolean;
    schemeCount: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  hasApiKey,
  backendInfo,
}) => {
  return (
    <header className="bg-white border-b-2 border-slate-900 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-5 pb-4 gap-4">
          {/* Logo & Title */}
          <div
            className="cursor-pointer select-none"
            onClick={() => onTabChange('assistant')}
          >
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-none text-slate-900">
                SCHEM<span className="text-blue-600">OS</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1.5 text-slate-500">
              Government Scheme Welfare Assistant
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-bold uppercase tracking-wider overflow-x-auto pb-0.5">
            <button
              id="tab-assistant"
              onClick={() => onTabChange('assistant')}
              className={`pb-1 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'assistant'
                  ? 'border-b-2 border-blue-600 text-slate-900 font-black'
                  : 'border-b-2 border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>Assistance</span>
            </button>

            <button
              id="tab-knowledge"
              onClick={() => onTabChange('knowledge')}
              className={`pb-1 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'knowledge'
                  ? 'border-b-2 border-blue-600 text-slate-900 font-black'
                  : 'border-b-2 border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>Official Portals</span>
            </button>
          </nav>

          {/* Right Actions: Language & Model status */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {backendInfo?.connected && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 border border-green-700 bg-green-50 text-[10px] font-mono font-bold uppercase text-green-900">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                <span>FastAPI • {backendInfo.schemeCount.toLocaleString()} Schemes</span>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 border border-slate-900 bg-slate-50 text-[10px] font-mono font-bold uppercase text-slate-900">
              <Cpu className="w-3 h-3 text-blue-600" />
              <span>Gemini 3.6 Flash</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="select-language"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                aria-label="Language"
                className="bg-white border border-slate-900 text-slate-900 font-bold uppercase text-[11px] py-1 px-2 cursor-pointer focus:outline-none focus:border-blue-600 tracking-wider"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
