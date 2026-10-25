import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, Recycle, MapPin, Users, HeartHandshake, Leaf, Phone } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export const AboutPage: React.FC<{
  setCurrentTab?: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
          About Karnataka SMARTWASTE
        </span>
      </div>
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
          Karnataka Environmental Initiative
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          About SMARTWASTE Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          A dedicated municipal technological platform built to streamline solid waste segregation, citizen reporting, doorstep bulk collections, and transparent civic tracking across Karnataka.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-xs">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Project Mission & Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            SMARTWASTE addresses the chronic challenge of roadside garbage accumulation and unsegregated waste dumping across Karnataka’s rapidly growing urban and peri-urban centers. Through digital source-segregation awareness, a step-by-step grievance reporting workflow, and real-time municipal field dispatch, the platform bridges the gap between citizens and local urban local bodies (ULBs).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <Recycle className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-slate-900">14 Waste Streams</h4>
            <p className="text-slate-500">Comprehensive educational categorization adhering to Karnataka Solid Waste Management guidelines.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <h4 className="font-bold text-slate-900">4-Stage SLA</h4>
            <p className="text-slate-500">Strict 24–48 hour municipal resolution guarantee with photographic proof and citizen feedback.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <Users className="w-5 h-5 text-amber-700" />
            <h4 className="font-bold text-slate-900">3 Verified Roles</h4>
            <p className="text-slate-500">Distinct workflows for Citizens, Waste Collection Field Staff, and Municipal Administrators.</p>
          </div>
        </div>

        {/* Project Scope & Academic Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <span className="font-bold block">Academic Demonstration & Major Project Disclaimer:</span>
          <p className="text-amber-800 leading-relaxed">
            This platform is developed as a Bachelor of Engineering major project capstone. While designed to mirror authentic Karnataka municipal operations, it operates independently as an educational technology prototype.
          </p>
        </div>
      </div>
    </div>
  );
};
