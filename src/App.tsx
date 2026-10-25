/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { SegregationPage } from './pages/SegregationPage';
import { AwarenessPage } from './pages/AwarenessPage';
import { ReportWastePage } from './pages/ReportWastePage';
import { RequestPickupPage } from './pages/RequestPickupPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { CollectionMapPage } from './pages/CollectionMapPage';
import { QuizPage } from './pages/QuizPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { RoutePlanner } from './pages/RoutePlanner';
import { AboutPage } from './pages/AboutPage';
import { HelpSupportPage } from './pages/HelpSupportPage';

import { useAuth } from './context/AuthContext';

export const TAB_NAMES: Record<string, { en: string; kn: string; hi: string }> = {
  home: { en: 'Home', kn: 'ಮುಖಪುಟ', hi: 'होम' },
  report: { en: 'Report Waste', kn: 'ತ್ಯಾಜ್ಯ ದೂರು', hi: 'कचरा रिपोर्ट' },
  pickup: { en: 'Doorstep Pickup', kn: 'ಮನೆಬಾಗಿಲ ಪಿಕಪ್', hi: 'डोरस्टेप पिकअप' },
  track: { en: 'Track Grievance', kn: 'ದೂರು ಟ್ರ್ಯಾಕಿಂಗ್', hi: 'शिकायत ट्रैक' },
  segregation: { en: 'Segregation Guide', kn: 'ವಿಂಗಡಣೆ ಮಾರ್ಗದರ್ಶಿ', hi: 'अपशिष्ट पृथक्करण' },
  awareness: { en: 'Awareness', kn: 'ಪರಿಸರ ಜಾಗೃತಿ', hi: 'पर्यावरण जागरूकता' },
  map: { en: 'Collection Map', kn: 'ನಕ್ಷೆ ಮತ್ತು ಬಿನ್‌ಗಳು', hi: 'कचरा डिब्बा मानचित्र' },
  quiz: { en: 'Quiz & Certificate', kn: 'ರಸಪ್ರಶ್ನೆ', hi: 'प्रश्नोत्तरी' },
  'citizen-dashboard': { en: 'Citizen Dashboard', kn: 'ನಾಗರಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', hi: 'नागरिक डैशबोर्ड' },
  'staff-dashboard': { en: 'Staff Console', kn: 'ಸಿಬ್ಬಂದಿ ಕನ್ಸೋಲ್', hi: 'कर्मचारी कंसोल' },
  'route-planner': { en: 'Route Planner', kn: 'ಮಾರ್ಗ ಯೋಜಕ', hi: 'रूट प्लानर' },
  'admin-dashboard': { en: 'Admin Console', kn: 'ಆಡಳಿತ ಕನ್ಸೋಲ್', hi: 'व्यवस्थापक कंसोल' },
  about: { en: 'About Platform', kn: 'ವೇದಿಕೆಯ ಬಗ್ಗೆ', hi: 'हमारे बारे में' },
  help: { en: 'Helplines & Support', kn: 'ಸಹಾಯವಾಣಿ', hi: 'हेल्पलाइन और सहायता' }
};

export function resolveTabFromUrl(): string {
  if (typeof window === 'undefined') return 'home';

  // 1. Check pathname (e.g., /route-planner, /routeplanner, /staff-dashboard, /track)
  const cleanPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (cleanPath === 'route-planner' || cleanPath === 'routeplanner' || cleanPath === 'planner') {
    return 'route-planner';
  }
  if (cleanPath === 'staff-dashboard' || cleanPath === 'staff' || cleanPath === 'staff-console') {
    return 'staff-dashboard';
  }
  if (cleanPath === 'admin-dashboard' || cleanPath === 'admin' || cleanPath === 'admin-console') {
    return 'admin-dashboard';
  }
  if (cleanPath === 'citizen-dashboard' || cleanPath === 'citizen') {
    return 'citizen-dashboard';
  }
  if (cleanPath && cleanPath in TAB_NAMES) {
    return cleanPath;
  }

  // 2. Check query parameter ?tab=...
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab')?.toLowerCase();
  if (tabParam === 'route-planner' || tabParam === 'routeplanner' || tabParam === 'planner') {
    return 'route-planner';
  }
  if (tabParam && tabParam in TAB_NAMES) {
    return tabParam;
  }

  return 'home';
}

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>(() => resolveTabFromUrl());
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [initialTrackId, setInitialTrackId] = useState<string>('');
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const { openAuthModal } = useAuth();

  // Navigate to a new tab: record currentTab in historyStack so back goes step-by-step
  const navigateToTab = (tab: string) => {
    if (tab !== currentTab) {
      setHistoryStack(prev => [...prev, currentTab]);
      setCurrentTab(tab);
      if (typeof window !== 'undefined') {
        const cleanPath = tab === 'home' ? '/' : `/${tab}`;
        window.history.pushState({ tab }, '', cleanPath);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Step-by-step back navigation
  const goBack = () => {
    setHistoryStack(prevStack => {
      if (prevStack.length > 0) {
        const targetTab = prevStack[prevStack.length - 1];
        const nextStack = prevStack.slice(0, -1);
        setCurrentTab(targetTab);
        if (typeof window !== 'undefined') {
          const cleanPath = targetTab === 'home' ? '/' : `/${targetTab}`;
          window.history.pushState({ tab: targetTab }, '', cleanPath);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return nextStack;
      } else {
        if (currentTab !== 'home') {
          setCurrentTab('home');
          if (typeof window !== 'undefined') {
            window.history.pushState({ tab: 'home' }, '', '/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
        return [];
      }
    });
  };

  const previousTab = historyStack.length > 0 ? historyStack[historyStack.length - 1] : undefined;

  // Listen for browser popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const stateTab = event.state?.tab;
      const target = stateTab || resolveTabFromUrl();

      setCurrentTab(target);
      setHistoryStack(prev => {
        if (prev.length > 0 && prev[prev.length - 1] === target) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for Google Maps Platform quota event
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Handle URL parameters if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id') || params.get('pickupId');
    const authParam = params.get('auth');
    const tabFromUrl = resolveTabFromUrl();

    if (idParam) {
      setInitialTrackId(idParam);
      navigateToTab('track');
    } else if (authParam === 'login' || authParam === 'register') {
      openAuthModal(authParam);
    } else if (tabFromUrl !== currentTab && tabFromUrl !== 'home') {
      setCurrentTab(tabFromUrl);
    }
  }, [openAuthModal]);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage setCurrentTab={navigateToTab} />;
      case 'segregation':
        return <SegregationPage setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'awareness':
        return <AwarenessPage setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'report':
        return <ReportWastePage setCurrentTab={navigateToTab} onBack={goBack} previousTab={previousTab} />;
      case 'pickup':
        return <RequestPickupPage setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'track':
        return <TrackComplaintPage initialId={initialTrackId} setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'map':
        return <CollectionMapPage setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'quiz':
        return <QuizPage setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'citizen-dashboard':
        return <CitizenDashboard setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'staff-dashboard':
        return <StaffDashboard setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'route-planner':
        return <RoutePlanner setCurrentTab={navigateToTab} onBack={() => navigateToTab('staff-dashboard')} />;
      case 'admin-dashboard':
        return <AdminDashboard setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'about':
        return <AboutPage setCurrentTab={navigateToTab} onBack={goBack} />;
      case 'help':
        return <HelpSupportPage setCurrentTab={navigateToTab} onBack={goBack} />;
      default:
        return <HomePage setCurrentTab={navigateToTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#D1FAE5] selection:text-[#166534]">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Header
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        onBack={goBack}
        canGoBack={historyStack.length > 0 || currentTab !== 'home'}
      />

      <main className="flex-1">
        {renderActiveView()}
      </main>

      <Footer setCurrentTab={navigateToTab} />
      <AuthModal
        onAuthSuccess={(role) => {
          if (role === 'ADMIN') navigateToTab('admin-dashboard');
          else if (role === 'STAFF') navigateToTab('staff-dashboard');
          else navigateToTab('citizen-dashboard');
        }}
      />
    </div>
  );
}

export default function App() {
  const mapsApiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <APIProvider apiKey={mapsApiKey}>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </APIProvider>
  );
}
