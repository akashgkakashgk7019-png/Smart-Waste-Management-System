import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  MapPin,
  Leaf,
  Bell,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Phone,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  Route
} from 'lucide-react';
import { NotificationItem } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onBack, canGoBack }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch real notifications for the authenticated user
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem('smartwaste_token');
        if (!token) return;
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('smartwaste_token');
      if (!token) return;
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Desktop navigation links with Home arranged first in specific order
  const desktopNavLinks = [
    { id: 'home', label: t.home },
    { id: 'segregation', label: language === 'kn' ? 'ವಿಂಗಡಣೆ' : language === 'hi' ? 'पृथक्करण' : 'Segregation' },
    { id: 'awareness', label: t.awareness },
    { id: 'report', label: t.reportWaste },
    { id: 'pickup', label: t.requestPickup },
    { id: 'track', label: t.trackComplaint },
    { id: 'map', label: t.collectionMap },
    { id: 'about', label: t.aboutUs }
  ];

  // 2. Comprehensive navigation links for mobile drawer menu (Route Planner strictly restricted to ADMIN)
  const mobileNavLinks = [
    { id: 'home', label: t.home },
    ...(user?.role === 'ADMIN'
      ? [{ id: 'route-planner', label: language === 'kn' ? 'ಮಾರ್ಗ ಯೋಜಕ (Admin Dispatch)' : language === 'hi' ? 'रूट प्लानर (Admin Dispatch)' : 'Route Planner (Admin Dispatch)' }]
      : []),
    { id: 'segregation', label: t.wasteSegregation },
    { id: 'awareness', label: t.awareness },
    { id: 'report', label: t.reportWaste },
    { id: 'pickup', label: t.requestPickup },
    { id: 'track', label: t.trackComplaint },
    { id: 'map', label: t.collectionMap },
    { id: 'about', label: t.aboutUs },
    { id: 'help', label: t.helpSupport }
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    openAuthModal('login');
    setMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    openAuthModal('register');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-xs">
      {/* =========================================================================
          ROW 1: GOVERNMENT TOP BAR
          Background: #0B2545, Text: #FFFFFF, Highlighted helpline: #34D399
         ========================================================================= */}
      <div className="bg-[#0B2545] text-[#FFFFFF] border-b border-[#102A43] text-[11px] sm:text-xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          {/* Left: Karnataka state flag colors, official title, and department */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
            {/* Karnataka Yellow & Red State Flag Colors */}
            <div
              className="flex flex-col w-4 h-3 rounded-[2px] overflow-hidden border border-white/25 shrink-0 shadow-2xs"
              title="State of Karnataka Flag Colors"
              aria-label="Karnataka Flag"
            >
              <span className="h-1.5 w-full bg-[#FFD700]"></span>
              <span className="h-1.5 w-full bg-[#D60000]"></span>
            </div>

            <span className="font-bold tracking-wider uppercase text-[#FFFFFF] whitespace-nowrap text-[10px] sm:text-[11px]">
              {t.govHeader}
            </span>

            <span className="text-slate-400 hidden md:inline shrink-0" aria-hidden="true">|</span>

            <span className="text-slate-200 font-normal hidden lg:inline truncate text-[11px]">
              {language === 'kn' ? 'ಪೌರಾಡಳಿತ ಮತ್ತು ನಗರಾಭಿವೃದ್ಧಿ ಇಲಾಖೆ' : language === 'hi' ? 'नगर प्रशासन और नगर विकास विभाग' : 'Department of Municipal Administration & Urban Development'}
            </span>
          </div>

          {/* Right: Civic helpline & Language Selector (English | ಕನ್ನಡ | हिंदी) */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 text-[11px]">
            {/* Civic Helpline with #34D399 highlight */}
            <div className="flex items-center gap-1.5 text-[#34D399] font-mono text-[10px] sm:text-[11px] whitespace-nowrap">
              <Phone className="w-3 h-3 text-[#34D399] shrink-0 hidden xs:inline" />
              <span className="hidden sm:inline text-slate-200">{language === 'kn' ? 'ಸಹಾಯವಾಣಿ: ' : language === 'hi' ? 'हेल्पलाइन: ' : 'Civic Helpline: '}</span>
              <strong className="font-semibold text-[#34D399]">1533 / 1969</strong>
            </div>

            <span className="text-slate-500 hidden xs:inline" aria-hidden="true">|</span>

            {/* Language Selector in slightly lighter navy */}
            <div className="flex items-center gap-0.5 sm:gap-1 font-medium bg-[#102A43] px-1 sm:px-1.5 py-0.5 rounded border border-[#1e3e63]">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#059669] text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <span className="text-slate-400 text-[10px]">·</span>
              <button
                type="button"
                onClick={() => setLanguage('kn')}
                className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  language === 'kn'
                    ? 'bg-[#059669] text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <span className="text-slate-400 text-[10px]">·</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#059669] text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: MAIN NAVIGATION BAR (76–82px tall on Desktop)
          Clean 3-Section Flexbox Layout:
          - LEFT: Logo, Wordmark, Karnataka badge, Subtitle (truncated cleanly)
          - CENTER: All 7 Navigation Links (fully visible, evenly spaced, no cutoff)
          - RIGHT: [Notification Bell] [Login] [Register]
         ========================================================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:gap-4 xl:gap-6 h-[76px] sm:h-[82px]">
          
          {/* -------------------------------------------------------------------
              LEFT SECTION — LOGO & BRANDING (with step-by-step Back button)
             ------------------------------------------------------------------- */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {(currentTab !== 'home' || canGoBack) && onBack && (
              <button
                type="button"
                onClick={onBack}
                title={language === 'kn' ? 'ಹಿಂದಿನ ಪುಟಕ್ಕೆ ಹೋಗಿ' : language === 'hi' ? 'पिछले पृष्ठ पर जाएं' : 'Go back to previous page'}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">
                  {language === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : language === 'hi' ? 'वापस' : 'Back'}
                </span>
              </button>
            )}

            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none py-1"
            >
            {/* Logo Emblem */}
            <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-[#059669] via-[#166534] to-[#0B2545] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Recycle className="w-6 h-6 text-emerald-100" />
              <Leaf className="w-3.5 h-3.5 text-[#34D399] absolute -top-1 -right-1" />
              <MapPin className="w-3.5 h-3.5 text-emerald-300 absolute -bottom-1 -left-1" />
            </div>

            {/* Wordmark & Karnataka Label */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 leading-none">
                <span className="text-xl sm:text-[22px] font-black tracking-tight text-[#0F172A] leading-none">
                  SMART<span className="text-[#059669]">WASTE</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#D1FAE5] text-[#166534] border border-[#a7f3d0] leading-none shrink-0">
                  Karnataka
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#64748B] leading-tight mt-1.5 hidden sm:block max-w-[170px] xl:max-w-[195px] 2xl:max-w-[240px] truncate">
                {t.smartwasteSubtitle}
              </p>
            </div>
          </div>
        </div>

          {/* -------------------------------------------------------------------
              CENTER SECTION — NAVIGATION (Desktop >= 1280px)
              Specific Order: Home · Segregation · Awareness · Report Waste · Request Pickup · Track Complaint · Collection Map · About Us
             ------------------------------------------------------------------- */}
          <nav className="hidden xl:flex items-center justify-center gap-1 xl:gap-2 2xl:gap-3 flex-1 min-w-0 px-1 xl:px-2">
            {desktopNavLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-xs xl:text-[12.5px] 2xl:text-[13px] shrink-0 font-medium ${
                    isActive
                      ? 'text-[#166534] bg-[#D1FAE5] font-semibold shadow-2xs'
                      : 'text-[#334155] hover:text-[#0F172A] hover:bg-slate-100/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* -------------------------------------------------------------------
              RIGHT SECTION — USER CONTROLS: [Notification Bell] [Login] [Register]
              Dedicated container on the right side.
             ------------------------------------------------------------------- */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 xl:gap-3 shrink-0">
            {/* 1. Compact Notification Bell (approx 40-42px square) */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90 flex items-center justify-center relative transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-[#166534] focus:outline-none"
                aria-label={`Notifications: ${unreadCount} unread`}
              >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono leading-none shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Real Notifications Dropdown Menu */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {t.notificationsTitle}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                      >
                        {t.markAllAsRead}
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        <CheckCircle2 className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                        <span>{t.noNotifications}</span>
                      </div>
                    ) : (
                      notifications.slice(0, 8).map(n => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-xs transition-colors ${
                            n.read
                              ? 'bg-slate-50 text-slate-600'
                              : 'bg-emerald-50 text-slate-900 font-medium border border-emerald-100'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-slate-800 text-[12px]">{n.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated State vs Logged Out State */}
            {user ? (
              /* Authenticated User Menu on Desktop */
              <div className="hidden xl:flex items-center gap-2">
                <span className="text-slate-300 mx-0.5" aria-hidden="true">|</span>

                {user.role === 'ADMIN' && (
                  <button
                    type="button"
                    onClick={() => setCurrentTab('route-planner')}
                    className={`h-[40px] flex items-center gap-1.5 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      currentTab === 'route-planner'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
                    }`}
                    title="Open SMARTWASTE Route Planner (Admin Only)"
                  >
                    <Route className="w-3.5 h-3.5 text-blue-600" />
                    <span>Route Planner</span>
                  </button>
                )}

                {/* Profile Name & Dashboard Link styled as rounded pill matching screenshot */}
                <button
                  type="button"
                  onClick={() => {
                    if (user.role === 'ADMIN') setCurrentTab('admin-dashboard');
                    else if (user.role === 'STAFF') setCurrentTab('staff-dashboard');
                    else setCurrentTab('citizen-dashboard');
                  }}
                  className="h-[40px] flex items-center gap-2 px-3.5 rounded-full border border-emerald-600/70 text-slate-800 hover:bg-emerald-50/50 text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer"
                  title="Open dashboard"
                >
                  <User className="w-4 h-4 text-[#059669] shrink-0" />
                  <span className="max-w-[120px] truncate font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#059669]" />
                </button>

                {/* Logout Option */}
                <button
                  type="button"
                  onClick={logout}
                  className="h-[40px] w-[40px] text-slate-400 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Logged Out State: Desktop [Login] [Register] Buttons (with 10-12px gap) */
              <div className="hidden xl:flex items-center gap-[11px]">
                {/* 2. Login Button: White background, green border, green text, login icon, 42px tall */}
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="h-[42px] px-4 rounded-xl bg-white hover:bg-emerald-50/80 border-2 border-[#166534] text-[#166534] text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#166534] focus:outline-none"
                >
                  <LogIn className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{t.login}</span>
                </button>

                {/* 3. Register Button: Green background (#166534), white text, user-plus icon, 42px tall */}
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="h-[42px] px-4 rounded-xl bg-[#166534] hover:bg-[#14532d] border-2 border-[#166534] text-white text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#166534] focus:outline-none"
                >
                  <UserPlus className="w-4 h-4 text-white shrink-0" />
                  <span>{t.register}</span>
                </button>
              </div>
            )}

            {/* Mobile / Tablet Hamburger Menu Toggle Button (< 1280px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden h-[42px] w-[42px] flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/90 transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-[#166534] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: RESPONSIVE MOBILE & TABLET NAVIGATION DRAWER (< 1280px)
          Contains: Language options, all 9 navigation links, notifications, Login & Register
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 shadow-xl px-4 sm:px-6 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Top Bar for Mobile Menu: Language Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Language / ಭಾಷೆ
            </span>
            <div className="flex items-center gap-1 font-medium bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-[#166534] text-white font-bold' : 'text-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('kn')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  language === 'kn' ? 'bg-[#166534] text-white font-bold' : 'text-slate-700'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  language === 'hi' ? 'bg-[#166534] text-white font-bold' : 'text-slate-700'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* All 9 Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {mobileNavLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50 text-[#166534] border-l-3 border-[#166534] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#166534]"></span>}
                </button>
              );
            })}
          </div>

          {/* User Account Controls inside Mobile Drawer */}
          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#166534]">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">{user.name}</span>
                      <span className="text-[11px] text-slate-500">{user.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#166534] text-white font-mono font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (user.role === 'ADMIN') setCurrentTab('admin-dashboard');
                      else if (user.role === 'STAFF') setCurrentTab('staff-dashboard');
                      else setCurrentTab('citizen-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 h-[42px] bg-[#166534] hover:bg-[#14532d] text-white text-xs sm:text-sm font-bold rounded-xl text-center cursor-pointer shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Open {user.role} Dashboard</span>
                    <span>&rarr;</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="h-[42px] px-3.5 border border-slate-300 text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {(user.role === 'STAFF' || user.role === 'ADMIN') && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('route-planner');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full h-[40px] bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl text-center cursor-pointer shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Route className="w-4 h-4" />
                    <span>Open SMARTWASTE Route Planner</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {/* Mobile Login Button: White background, green border, green text, login icon */}
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="w-full sm:flex-1 h-[42px] px-4 rounded-xl bg-white hover:bg-emerald-50/80 border-2 border-[#166534] text-[#166534] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <LogIn className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{t.login}</span>
                </button>

                {/* Mobile Register Button: Green background (#166534), white text, user-plus icon */}
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="w-full sm:flex-1 h-[42px] px-4 rounded-xl bg-[#166534] hover:bg-[#14532d] border-2 border-[#166534] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <UserPlus className="w-4 h-4 text-white shrink-0" />
                  <span>{t.register}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
