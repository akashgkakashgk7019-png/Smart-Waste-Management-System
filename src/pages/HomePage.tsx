import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  AlertCircle,
  Truck,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  Users,
  Megaphone,
  BookOpen,
  Clock,
  Compass,
  Award
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalComplaints: 3,
    resolvedComplaints: 1,
    totalWasteKg: 185,
    activeWards: 198
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: user ? { Authorization: `Bearer ${localStorage.getItem('smartwaste_token')}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (data.summary) {
          setStats({
            totalComplaints: data.summary.totalComplaints,
            resolvedComplaints: data.summary.resolvedComplaints,
            totalWasteKg: data.summary.totalWasteKg,
            activeWards: 198
          });
        }
      })
      .catch(() => {
        // Fallback to initial DB values
      });
  }, [user]);

  const faqs = [
    {
      q: t.faq1Q,
      a: t.faq1A
    },
    {
      q: t.faq2Q,
      a: t.faq2A
    },
    {
      q: t.faq3Q,
      a: t.faq3A
    },
    {
      q: t.faq4Q,
      a: t.faq4A
    },
    {
      q: t.faq5Q,
      a: t.faq5A
    }
  ];

  return (
    <div className="w-full overflow-hidden flex flex-col">
      {/* 1. SEAMLESS FULL-WIDTH PHOTOREALISTIC HERO SECTION */}
      <section
        className="relative overflow-hidden bg-[#0B1B32] text-white w-full min-h-[720px] sm:min-h-[780px] md:min-h-[840px] lg:min-h-[880px] xl:min-h-[920px] 2xl:min-h-[960px] flex flex-col justify-between border-b border-[#123B5D]"
      >
        {/* Dedicated Panoramic Background Layer: Positioned cleanly above the metrics strip with bottom anchoring so trees, garden & building base are 100% visible downward */}
        <div
          className="absolute inset-x-0 top-0 bottom-[76px] sm:bottom-[84px] pointer-events-none"
          style={{
            backgroundImage: "url('/assets/smartwaste_hero_photo.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Subtle Dark Navy Gradient Overlay on the Left: Keeps white headings & buttons 100% readable while the full building scenery stays clearly visible in the center and right */}
        <div className="absolute inset-x-0 top-0 bottom-[76px] sm:bottom-[84px] bg-linear-to-r from-[#081628]/95 via-[#081628]/80 md:via-[#081628]/55 to-transparent pointer-events-none" />

        {/* Content layer: Left-aligned, high contrast */}
        <div className="relative z-10 w-full max-w-7xl 2xl:max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-20 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl lg:max-w-4xl space-y-4 sm:space-y-5 text-left">
            {/* Official Karnataka Initiative Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B2545]/90 border border-[#34D399]/40 backdrop-blur-md shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
              <span className="text-xs sm:text-sm font-semibold text-[#34D399] tracking-wide">
                {t.karnatakaInitiativeBadge}
              </span>
            </div>

            {/* Title: SMART (#FFFFFF) and WASTE (#34D399) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black tracking-tight leading-none text-[#FFFFFF] drop-shadow-md">
              SMART<span className="text-[#34D399]">WASTE</span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-bold text-[#FFFFFF] tracking-tight leading-snug drop-shadow-sm">
              {t.heroSubHeading}
            </h2>

            {/* Paragraph Description */}
            <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed max-w-xl font-normal drop-shadow-xs">
              {t.heroDescription}
            </p>

            {/* Three Action Buttons in One Neat Horizontal Row on Desktop */}
            <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3 sm:gap-3.5 md:gap-4 pt-3 sm:pt-4 w-full">
              {/* 1. Primary Button — Report Waste: bg #059669, text #FFFFFF, hover #047857 */}
              <button
                onClick={() => setCurrentTab('report')}
                className="h-12 min-h-[48px] px-5 sm:px-6 bg-[#059669] hover:bg-[#047857] text-[#FFFFFF] rounded-full text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Megaphone className="w-4 h-4 text-white shrink-0" />
                <span>{t.btnReportWaste}</span>
                <ArrowRight className="w-4 h-4 text-white shrink-0" />
              </button>

              {/* 2. Secondary Button — Learn Waste Segregation: bg #081628/85, border #10B981, text #FFFFFF, hover bg #059669/20 */}
              <button
                onClick={() => setCurrentTab('segregation')}
                className="h-12 min-h-[48px] px-5 sm:px-6 bg-[#081628]/85 hover:bg-[#059669]/20 border border-[#10B981] text-[#FFFFFF] rounded-full text-xs sm:text-sm font-semibold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-xs shadow-md whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{t.btnLearnSegregation}</span>
                <ArrowRight className="w-4 h-4 text-white shrink-0" />
              </button>

              {/* 3. Secondary Button — Track Complaint: bg #081628/85, border #10B981, text #FFFFFF, hover bg #059669/20 */}
              <button
                onClick={() => setCurrentTab('track')}
                className="h-12 min-h-[48px] px-5 sm:px-6 bg-[#081628]/85 hover:bg-[#059669]/20 border border-[#10B981] text-[#FFFFFF] rounded-full text-xs sm:text-sm font-semibold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-xs shadow-md whitespace-nowrap shrink-0"
              >
                <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{t.btnTrackComplaint}</span>
                <ArrowRight className="w-4 h-4 text-white shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Real Live Database Metrics Strip: Seamless Dark Navy (#081628) base */}
        <div className="relative z-10 w-full border-t border-[#123B5D] bg-[#081628]/95 backdrop-blur-md px-6 sm:px-10 lg:px-16 py-4 sm:py-5">
          <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#34D399] tabular-nums">
                {stats.totalComplaints}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t.statComplaints}</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#38BDF8] tabular-nums">
                {stats.resolvedComplaints}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t.statResolved}</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#FBBF24] tabular-nums">
                {stats.totalWasteKg} kg
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t.statWasteRecycled}</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#60A5FA] tabular-nums">
                {stats.activeWards}+
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t.statActiveWards}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOURCE SEGREGATION CATEGORIES SECTION (Smooth seamless transition to light background) */}
      <section className="w-full bg-linear-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#166534] bg-[#D1FAE5] px-3 py-1 rounded-full inline-block">
              {t.secSegregationBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              {t.secSegregationTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {t.secSegregationDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Green Bin: Wet Waste */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
                  <span className="text-xl">🍏</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {t.greenBinTitle}
                  </span>
                  <span className="text-[11px] text-slate-400">{t.greenBinTime}</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1.5">
                  {t.greenBinName}
                </h3>
                <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                  {t.greenBinDesc}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-[#059669] font-bold">✓ DO:</span>
                  <span className="text-slate-700">{t.greenBinDo}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✗ DON'T:</span>
                  <span className="text-slate-700">{t.greenBinDont}</span>
                </div>
              </div>
            </div>

            {/* Blue Bin: Dry Waste */}
            <div className="bg-white rounded-2xl border border-sky-200 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold mb-4">
                  <span className="text-xl">📦</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    {t.blueBinTitle}
                  </span>
                  <span className="text-[11px] text-slate-400">{t.blueBinTime}</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1.5">
                  {t.blueBinName}
                </h3>
                <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                  {t.blueBinDesc}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-[#0284c7] font-bold">✓ DO:</span>
                  <span className="text-slate-700">{t.blueBinDo}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✗ DON'T:</span>
                  <span className="text-slate-700">{t.blueBinDont}</span>
                </div>
              </div>
            </div>

            {/* Yellow Bin: Plastic Waste */}
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
                  <span className="text-xl">🧴</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {t.yellowBinTitle}
                  </span>
                  <span className="text-[11px] text-slate-400">{t.yellowBinTime}</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1.5">
                  {t.yellowBinName}
                </h3>
                <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                  {t.yellowBinDesc}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-[#ca8a04] font-bold">✓ DO:</span>
                  <span className="text-slate-700">{t.yellowBinDo}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✗ DON'T:</span>
                  <span className="text-slate-700">{t.yellowBinDont}</span>
                </div>
              </div>
            </div>

            {/* Red Bin: Hazardous & Sanitary Waste */}
            <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold mb-4">
                  <span className="text-xl">⚠️</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                    {t.redBinTitle}
                  </span>
                  <span className="text-[11px] text-slate-400">{t.redBinTime}</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1.5">
                  {t.redBinName}
                </h3>
                <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                  {t.redBinDesc}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✓ DO:</span>
                  <span className="text-slate-700">{t.redBinDo}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✗ DON'T:</span>
                  <span className="text-slate-700">{t.redBinDont}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentTab('segregation')}
              className="px-6 py-2.5 bg-white border border-[#E2E8F0] hover:border-[#166534] text-xs font-bold text-[#166534] rounded-full inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.exploreCategoriesBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. HOW SMARTWASTE WORKS (Civic Redressal Lifecycle) */}
      <section className="w-full bg-linear-to-b from-[#F8FAFC] via-[#EFF6FF]/60 to-[#F8FAFC] py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#166534] bg-[#D1FAE5] px-3 py-1 rounded-full inline-block">
              {t.howItWorksBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              {t.howItWorksTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">{t.step1Title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{t.step1Desc}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#0284c7] flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">{t.step2Title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{t.step2Desc}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#ca8a04] flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">{t.step3Title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{t.step3Desc}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] space-y-3 relative shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center font-black text-sm">
                04
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">{t.step4Title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{t.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CIVIC ACTIONS QUICK ACCESS (Report, Request Pickup, Track, Map) */}
      <section className="w-full bg-[#F8FAFC] py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#166534] bg-[#D1FAE5] px-3 py-1 rounded-full inline-block">
              {t.servicesBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              {t.servicesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              {t.servicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Report Waste */}
            <div
              onClick={() => setCurrentTab('report')}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md hover:border-[#059669] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">
                  {t.cardReportTitle}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {t.cardReportDesc}
                </p>
              </div>
              <span className="text-xs font-bold text-[#059669] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {t.cardReportAction} &rarr;
              </span>
            </div>

            {/* Card 2: Request Pickup */}
            <div
              onClick={() => setCurrentTab('pickup')}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md hover:border-[#123B5D] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">
                  {t.cardPickupTitle}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {t.cardPickupDesc}
                </p>
              </div>
              <span className="text-xs font-bold text-[#123B5D] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {t.cardPickupAction} &rarr;
              </span>
            </div>

            {/* Card 3: Track Complaint */}
            <div
              onClick={() => setCurrentTab('track')}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md hover:border-[#166534] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] group-hover:bg-[#166534] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">
                  {t.cardTrackTitle}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {t.cardTrackDesc}
                </p>
              </div>
              <span className="text-xs font-bold text-[#166534] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {t.cardTrackAction} &rarr;
              </span>
            </div>

            {/* Card 4: Collection Map */}
            <div
              onClick={() => setCurrentTab('map')}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md hover:border-[#6BAED0] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">
                  {t.cardMapTitle}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {t.cardMapDesc}
                </p>
              </div>
              <span className="text-xs font-bold text-[#0284c7] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {t.cardMapAction} &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUIZ & ECO-CERTIFICATION BANNER (Full width seamless container) */}
      <section className="w-full bg-linear-to-b from-[#F8FAFC] to-[#EFF6FF] py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-[#0B2545] via-[#123B5D] to-[#166534] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-[#1e3e63]">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#166534]/70 border border-[#34D399]/40 text-[#34D399] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.quizBannerBadge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {t.quizTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t.quizSubtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setCurrentTab('quiz')}
                className="px-6 py-3.5 bg-[#34D399] hover:bg-[#059669] text-[#0B1B32] hover:text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all whitespace-nowrap cursor-pointer"
              >
                {t.startQuiz}
              </button>
              <button
                onClick={() => setCurrentTab('segregation')}
                className="px-6 py-3.5 bg-[#0B2545]/80 hover:bg-[#0B2545] text-white border border-[#34D399]/50 font-semibold rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer"
              >
                {t.sortingGameBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (Full width seamless container) */}
      <section className="w-full bg-[#F8FAFC] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#166534] bg-[#D1FAE5] px-3 py-1 rounded-full inline-block">
              {t.faqBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              {t.faqTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              {t.faqSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden transition-colors shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#166534]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-[#64748B] leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
