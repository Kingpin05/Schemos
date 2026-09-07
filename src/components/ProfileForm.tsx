import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, User, MapPin, Briefcase, IndianRupee, Tractor, ShieldAlert, Search, RefreshCw } from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Uttar Pradesh',
  'Bihar',
  'Delhi',
  'Tamil Nadu',
  'Rajasthan',
  'Andhra Pradesh',
  'Telangana',
  'Madhya Pradesh',
  'West Bengal',
  'Gujarat',
  'Kerala',
  'Punjab',
  'Haryana',
  'Odisha',
  'Assam',
  'Other State / UT'
];

const OCCUPATIONS = [
  { value: 'farmer', label: 'Farmer / Cultivator' },
  { value: 'agricultural_worker', label: 'Agricultural Laborer' },
  { value: 'artisan', label: 'Traditional Artisan / Craftsperson' },
  { value: 'street_vendor', label: 'Street Vendor / Hawker' },
  { value: 'self_employed', label: 'Self-Employed / Micro Entrepreneur' },
  { value: 'daily_wage', label: 'Daily Wage Worker / Construction' },
  { value: 'student', label: 'Student (High School / College)' },
  { value: 'unemployed', label: 'Unemployed Youth' },
  { value: 'senior_citizen', label: 'Senior Citizen (Retired)' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'salaried', label: 'Private / Contract Salaried' },
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChange,
  query,
  onQueryChange,
  onSubmit,
  isLoading,
}) => {
  const loadPreset = (preset: Partial<UserProfile> & { promptQuery?: string }) => {
    onChange({
      ...profile,
      ...preset,
    });
    if (preset.promptQuery !== undefined) {
      onQueryChange(preset.promptQuery);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-900 p-6 sm:p-8">
      {/* Sample Personas Quick-Load Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Benchmark Personas
          </span>
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">1-Click Fill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* PDF Example Persona */}
          <button
            id="persona-pdf-farmer"
            type="button"
            onClick={() =>
              loadPreset({
                age: 42,
                state: 'Karnataka',
                district: 'Dharwad',
                occupation: 'farmer',
                annual_income: 250000,
                landholding_acres: 1.5,
                gender: 'male',
                category: 'OBC',
                has_bpl_card: false,
                is_differently_abled: false,
                promptQuery: 'Farmer in Karnataka seeking crop insurance and direct agricultural financial assistance',
              })
            }
            className="text-left p-3 border-2 border-slate-900 bg-blue-50/70 hover:bg-blue-100/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                PDF: Dharwad Farmer
              </span>
              <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.5">
                KA • 42y
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 mt-1">
              1.5 ac land • OBC • ₹2.5L income
            </p>
          </button>

          {/* Student Persona */}
          <button
            id="persona-student"
            type="button"
            onClick={() =>
              loadPreset({
                age: 20,
                state: 'Maharashtra',
                district: 'Pune',
                occupation: 'student',
                annual_income: 180000,
                landholding_acres: 0,
                gender: 'female',
                category: 'SC',
                has_bpl_card: false,
                is_differently_abled: false,
                promptQuery: 'College student seeking post-matric scholarship and tuition fee reimbursement',
              })
            }
            className="text-left p-3 border border-slate-900 bg-white hover:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                SC College Student
              </span>
              <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-800 px-1.5 py-0.5">
                MH • 20y
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              SC Scholar • Pune • ₹1.8L income
            </p>
          </button>

          {/* Artisan Persona */}
          <button
            id="persona-artisan"
            type="button"
            onClick={() =>
              loadPreset({
                age: 34,
                state: 'Uttar Pradesh',
                district: 'Varanasi',
                occupation: 'artisan',
                annual_income: 140000,
                landholding_acres: 0,
                gender: 'male',
                category: 'OBC',
                has_bpl_card: false,
                is_differently_abled: false,
                promptQuery: 'Traditional weaver artisan needing modern tools incentive and collateral-free loan',
              })
            }
            className="text-left p-3 border border-slate-900 bg-white hover:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                Weaver Artisan
              </span>
              <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-800 px-1.5 py-0.5">
                UP • 34y
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Traditional Craft • ₹1.4L income
            </p>
          </button>
        </div>
      </div>

      <div className="border-t-2 border-slate-900 my-6" />

      {/* Main Profile Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-5"
      >
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
            Citizen Profile Parameters
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Deterministic Constraint Inputs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Age */}
          <div className="flex flex-col">
            <label htmlFor="input-age" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Citizen Age (Years)
            </label>
            <input
              id="input-age"
              type="number"
              min={1}
              max={110}
              value={profile.age || ''}
              onChange={(e) => onChange({ ...profile, age: Number(e.target.value) || 0 })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label htmlFor="select-gender" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Gender
            </label>
            <select
              id="select-gender"
              value={profile.gender}
              onChange={(e) => onChange({ ...profile, gender: e.target.value as any })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Transgender</option>
              <option value="all">All / Prefer not to say</option>
            </select>
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label htmlFor="select-state" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              State / Region
            </label>
            <select
              id="select-state"
              value={profile.state}
              onChange={(e) => onChange({ ...profile, state: e.target.value })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="flex flex-col">
            <label htmlFor="input-district" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              District / City
            </label>
            <input
              id="input-district"
              type="text"
              placeholder="e.g. Dharwad, Pune"
              value={profile.district}
              onChange={(e) => onChange({ ...profile, district: e.target.value })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none placeholder:text-slate-400 font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Occupation */}
          <div className="flex flex-col">
            <label htmlFor="select-occupation" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-slate-400" />
              Occupation / Livelihood
            </label>
            <select
              id="select-occupation"
              value={profile.occupation}
              onChange={(e) => onChange({ ...profile, occupation: e.target.value })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              {OCCUPATIONS.map((occ) => (
                <option key={occ.value} value={occ.value}>
                  {occ.label}
                </option>
              ))}
            </select>
          </div>

          {/* Annual Household Income */}
          <div className="flex flex-col">
            <label htmlFor="input-income" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-slate-400" />
              Annual Family Income (₹)
            </label>
            <input
              id="input-income"
              type="number"
              step={10000}
              min={0}
              value={profile.annual_income || ''}
              onChange={(e) => onChange({ ...profile, annual_income: Number(e.target.value) || 0 })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              required
            />
            <div className="flex gap-2 mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <button
                type="button"
                onClick={() => onChange({ ...profile, annual_income: 120000 })}
                className="hover:text-blue-600 underline font-mono"
              >
                ₹1.2L
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => onChange({ ...profile, annual_income: 250000 })}
                className="hover:text-blue-600 underline font-mono"
              >
                ₹2.5L
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => onChange({ ...profile, annual_income: 500000 })}
                className="hover:text-blue-600 underline font-mono"
              >
                ₹5L
              </button>
            </div>
          </div>

          {/* Agricultural Landholding */}
          <div className="flex flex-col">
            <label htmlFor="input-land" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <Tractor className="w-3 h-3 text-slate-400" />
              Cultivable Land (Acres)
            </label>
            <input
              id="input-land"
              type="number"
              step={0.1}
              min={0}
              max={50}
              value={profile.landholding_acres ?? ''}
              onChange={(e) => onChange({ ...profile, landholding_acres: Number(e.target.value) || 0 })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            <p className="text-[10px] font-mono uppercase text-slate-500 mt-1">
              {profile.landholding_acres > 0
                ? profile.landholding_acres <= 5
                  ? 'Marginal/Small (≤5 ac)'
                  : 'Medium/Large (>5 ac)'
                : 'Zero / Non-agri land'}
            </p>
          </div>

          {/* Social Category */}
          <div className="flex flex-col">
            <label htmlFor="select-category" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Social Category
            </label>
            <select
              id="select-category"
              value={profile.category}
              onChange={(e) => onChange({ ...profile, category: e.target.value as any })}
              className="p-3 bg-white border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="General">General</option>
              <option value="OBC">OBC (Other Backward Classes)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="EWS">EWS (Economically Weaker Section)</option>
            </select>
          </div>
        </div>

        {/* Toggles: BPL Card & Differently Abled */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 cursor-pointer select-none">
            <input
              id="checkbox-bpl"
              type="checkbox"
              checked={profile.has_bpl_card || false}
              onChange={(e) => onChange({ ...profile, has_bpl_card: e.target.checked })}
              className="w-4 h-4 rounded-none border-2 border-slate-900 accent-blue-600"
            />
            <span>Holds BPL / Antyodaya (AAY) Ration Card</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 cursor-pointer select-none">
            <input
              id="checkbox-pwd"
              type="checkbox"
              checked={profile.is_differently_abled || false}
              onChange={(e) => onChange({ ...profile, is_differently_abled: e.target.checked })}
              className="w-4 h-4 rounded-none border-2 border-slate-900 accent-blue-600"
            />
            <span>Person with Disability (PwD Benchmark)</span>
          </label>
        </div>

        {/* Specific Query / Search Prompt */}
        <div className="pt-2 flex flex-col">
          <label htmlFor="input-rag-query" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Search className="w-3 h-3 text-blue-600" />
              Citizen Query / Natural Language Intent
            </span>
            <span className="font-mono text-slate-400">Dense Vector Search Context</span>
          </label>
          <div className="relative">
            <input
              id="input-rag-query"
              type="text"
              placeholder="e.g. 'Farmer in Dharwad seeking agricultural financial support and crop insurance'"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="w-full p-3 pr-20 bg-slate-50 border border-slate-900 font-bold text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="font-medium">
              Verified against <strong>14+ Central & State Statutes</strong> with deterministic rule bounds.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="btn-reset-profile"
              type="button"
              onClick={() => {
                onChange({
                  age: 30,
                  state: 'Karnataka',
                  district: '',
                  occupation: 'farmer',
                  annual_income: 200000,
                  landholding_acres: 1.0,
                  gender: 'male',
                  category: 'General',
                  has_bpl_card: false,
                  is_differently_abled: false,
                });
                onQueryChange('');
              }}
              className="px-5 py-3.5 border border-slate-900 text-slate-900 hover:bg-slate-100 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              id="btn-submit-rag"
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-none px-8 py-3.5 bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-blue-600 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking Eligibility...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Update Parameters & Retrieve</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
