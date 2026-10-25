import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Phone, Mail, MapPin, Clock, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export const HelpSupportPage: React.FC<{
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
          Municipal Grievance Helplines
        </span>
      </div>
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
          Citizen Assistance & Helplines
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          {t.helpSupport} & Grievance Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Need assistance with waste collection, missed auto-tipper visits, or reporting illegal dumping? Connect with municipal support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Helplines Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Phone className="w-5 h-5 text-emerald-700" />
            <span>Karnataka Municipal Helplines</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Swachhata All-India Helpline:</span>
              <span className="font-mono text-emerald-700 font-bold text-sm">1969 (Toll-Free)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">24x7 National urban sanitation line</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">BBMP Sahaaya Control Room (Bengaluru):</span>
              <span className="font-mono text-emerald-700 font-bold text-sm">1533 / 080-22660000</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct municipal grievance registration</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">KSPCB Pollution Control Helpline:</span>
              <span className="font-mono text-emerald-700 font-bold text-sm">080-25589112</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Report hazardous industrial & biomedical dumping</p>
            </div>
          </div>
        </div>

        {/* Support Request Guidelines */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Citizen Service Level Agreements (SLA)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <p className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="font-bold text-emerald-950 block mb-0.5">Roadside Blackspot Clearance:</span>
              Resolved within 24 to 48 hours following online complaint registration.
            </p>

            <p className="p-3 rounded-xl bg-sky-50/60 border border-sky-100">
              <span className="font-bold text-sky-950 block mb-0.5">Doorstep Bulk Pickup:</span>
              Scheduled within 48 to 72 hours based on chosen date and capacity slot.
            </p>

            <div className="pt-2">
              <span className="font-bold text-slate-800 block mb-1">Direct Grievance Email:</span>
              <span className="font-mono text-slate-600">support.smartwaste@karnataka.gov.in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
