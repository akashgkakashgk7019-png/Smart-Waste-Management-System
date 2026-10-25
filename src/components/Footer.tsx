import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Recycle, Leaf, MapPin, Phone, Mail, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  return (
    <footer className="w-full bg-[#081628] text-slate-200 border-t border-[#123B5D]">
      {/* 1. Official Clean Karnataka Mission Awareness Strip */}
      <div className="bg-[#0B1B32] border-b border-[#123B5D] px-4 sm:px-6 lg:px-8 py-3.5 text-xs">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center flex-wrap justify-center md:justify-start gap-2.5">
            {/* Karnataka Yellow & Red State Flag Colors */}
            <div
              className="flex flex-col w-4 h-3 rounded-[2px] overflow-hidden border border-white/25 shrink-0 shadow-2xs"
              title="State of Karnataka Flag"
              aria-label="Karnataka Flag"
            >
              <span className="h-1.5 w-full bg-[#FFD700]" />
              <span className="h-1.5 w-full bg-[#D60000]" />
            </div>

            <Leaf className="w-4 h-4 text-[#34D399] shrink-0" />
            <strong className="font-bold text-white tracking-wide">
              {t.cleanKarnatakaMission}:
            </strong>
            <span className="text-slate-300">
              {t.cleanMissionNotice}
            </span>
          </div>

          <button
            onClick={() => setCurrentTab('segregation')}
            className="text-[#34D399] hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer group whitespace-nowrap"
          >
            <span>{t.readManual}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#34D399] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. Main 4-Column Grid: Seamless matching with SMARTWASTE theme */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Column 1: Brand Emblem, Mission & Scope Notice */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* Standard Official SMARTWASTE Logo Emblem */}
            <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-[#059669] via-[#166534] to-[#0B2545] flex items-center justify-center text-white shadow-md shrink-0">
              <Recycle className="w-6 h-6 text-emerald-100" />
              <Leaf className="w-3.5 h-3.5 text-[#34D399] absolute -top-1 -right-1" />
              <MapPin className="w-3.5 h-3.5 text-emerald-300 absolute -bottom-1 -left-1" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  SMART<span className="text-[#34D399]">WASTE</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#0B2545] text-[#34D399] border border-[#34D399]/40 leading-none">
                  Karnataka
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium line-clamp-1">
                {t.smartwasteSubtitle}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {t.footerDesc}
          </p>

          <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#123B5D] text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#34D399]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span>{t.projectScopeNoticeLabel}:</span>
            </div>
            <p className="text-slate-300 leading-normal">
              {t.footerProjectNotice}
            </p>
          </div>
        </div>

        {/* Column 2: Quick Portals & Workflows */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
            <h4 className="text-xs font-bold tracking-wider text-white uppercase">
              {t.quickLinks}
            </h4>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>
              <button
                onClick={() => setCurrentTab('home')}
                className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-slate-500">›</span>
                <span>{t.home}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('segregation')}
                className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-slate-500">›</span>
                <span>{t.wasteSegregation}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('report')}
                className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-slate-500">›</span>
                <span>{t.reportWaste}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('pickup')}
                className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-slate-500">›</span>
                <span>{t.requestPickup}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('track')}
                className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-slate-500">›</span>
                <span>{t.trackComplaint}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('map')}
                className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-slate-500">›</span>
                <span>{t.collectionMap}</span>
              </button>
            </li>
            {user?.role === 'ADMIN' && (
              <li>
                <button
                  onClick={() => setCurrentTab('route-planner')}
                  className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer text-emerald-400 font-semibold"
                >
                  <span className="text-[#34D399]">›</span>
                  <span>{language === 'kn' ? 'ಮಾರ್ಗ ಯೋಜಕ' : language === 'hi' ? 'रूट प्लानर' : 'Route Planner'}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-600/50">
                    ADMIN DISPATCH
                  </span>
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => setCurrentTab('quiz')}
                className="hover:text-[#34D399] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-slate-500">›</span>
                <span>
                  {language === 'kn' ? 'ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ ರಸಪ್ರಶ್ನೆ' : language === 'hi' ? 'पृथक्करण प्रश्नोत्तरी' : 'Segregation Quiz & Badges'}
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Karnataka Municipal Corporations Supported */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <h4 className="text-xs font-bold tracking-wider text-white uppercase">
              {t.karnatakaMunicipalities}
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0" />
              <span>Bruhat Bengaluru Mahanagara Palike (BBMP)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
              <span>Mysuru City Corporation (MCC)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
              <span>Mangaluru City Corporation (MCC)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
              <span>Hubballi-Dharwad Municipal Corp (HDMC)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
              <span>Belagavi City Corporation (BCC)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
              <span>Tumakuru City Corporation (TCC)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shrink-0" />
              <span>Karnataka State Pollution Control Board (KSPCB)</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Helplines & Grievances */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
            <h4 className="text-xs font-bold tracking-wider text-white uppercase">
              {t.contactEmergency}
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            {/* Civic Grievance Helpline */}
            <div className="p-2.5 rounded-xl bg-[#0B1B32] border border-[#123B5D] flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-300 font-medium block">
                  {t.civicHelplineLabel}:
                </span>
                <span className="font-mono text-sm font-bold text-[#34D399]">
                  1533 / 1969 <span className="text-[11px] font-normal text-slate-400">({t.tollFree})</span>
                </span>
              </div>
            </div>

            {/* BBMP Control Room */}
            <div className="p-2.5 rounded-xl bg-[#0B1B32] border border-[#123B5D] flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-300 font-medium block">
                  {t.bbmpControlRoom}:
                </span>
                <span className="font-mono text-slate-200">
                  080-22660000 / 080-22221188
                </span>
              </div>
            </div>

            {/* Grievance Email */}
            <div className="p-2.5 rounded-xl bg-[#0B1B32] border border-[#123B5D] flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-300 font-medium block">
                  {t.grievanceEmailLabel}:
                </span>
                <span className="font-mono text-slate-200 truncate block">
                  support.smartwaste@karnataka.gov.in
                </span>
              </div>
            </div>

            {/* Citizen Charter SLA */}
            <div className="p-2.5 rounded-xl bg-[#0B1B32] border border-[#123B5D] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-300 font-medium block">
                  {t.citizenCharterLabel}:
                </span>
                <span className="text-slate-400 leading-normal">
                  {t.citizenCharterDesc}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Footer Bar */}
      <div className="border-t border-[#123B5D] bg-[#051326] px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-400">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} SMARTWASTE Karnataka. {t.allRightsReserved}
          </p>

          <div className="flex items-center flex-wrap justify-center gap-4">
            <button
              onClick={() => setCurrentTab('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.aboutUs}
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => setCurrentTab('help')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.helpSupport}
            </button>
            <span className="text-slate-600">·</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#081628] border border-[#123B5D] text-slate-300">
              <div
                className="flex flex-col w-3 h-2 rounded-[1px] overflow-hidden border border-white/25 shrink-0"
                title="Karnataka Flag"
              >
                <span className="h-1 w-full bg-[#FFD700]" />
                <span className="h-1 w-full bg-[#D60000]" />
              </div>
              <span className="text-[11px] font-medium">
                {t.developedForKarnataka}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
