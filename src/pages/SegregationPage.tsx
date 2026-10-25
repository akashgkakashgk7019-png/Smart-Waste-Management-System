import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { WASTE_CATEGORIES } from '../data/categories';
import { WasteCategoryDetail } from '../types';
import {
  Recycle,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackButton } from '../components/BackButton';

interface GameItem {
  id: string;
  name: string;
  targetBin: 'green' | 'blue' | 'red' | 'black';
  categoryLabel: string;
  explanation: string;
}

const GAME_ITEMS: GameItem[] = [
  {
    id: 'g1',
    name: '🍌 Banana Peel & Kitchen Scraps',
    targetBin: 'green',
    categoryLabel: 'Wet / Organic Waste',
    explanation: 'Organic vegetable/fruit peels decompose rapidly into rich nutrient compost.'
  },
  {
    id: 'g2',
    name: '🥤 Empty Plastic Soda Bottle (Rinsed)',
    targetBin: 'blue',
    categoryLabel: 'Dry Recyclable Waste',
    explanation: 'Clean PET bottles are shredded and recycled into textile polyester or industrial items.'
  },
  {
    id: 'g3',
    name: '💊 Expired Antibiotic Pills & Syrups',
    targetBin: 'red',
    categoryLabel: 'Domestic Hazardous Waste',
    explanation: 'Chemical medicines must never enter groundwater or regular compost piles.'
  },
  {
    id: 'g4',
    name: '📰 Daily Newspaper & Cardboard',
    targetBin: 'blue',
    categoryLabel: 'Dry Paper Recyclable',
    explanation: 'Clean paper is repulped in paper mills to make recycled boards and packaging.'
  },
  {
    id: 'g5',
    name: '🔋 Dead Lithium-ion Phone Battery',
    targetBin: 'black',
    categoryLabel: 'E-Waste / Specialized Drop-off',
    explanation: 'Batteries contain heavy toxic metals (lead, cadmium) and require specialized e-waste recycling.'
  },
  {
    id: 'g6',
    name: '🩹 Used Sanitary Napkin / Diaper',
    targetBin: 'red',
    categoryLabel: 'Sanitary Waste (Red Cross)',
    explanation: 'Wrap in newspaper marked with a Red Cross (X) for sanitary municipal incineration.'
  },
  {
    id: 'g7',
    name: '🥥 Coconut Shells & Garden Twigs',
    targetBin: 'green',
    categoryLabel: 'Garden & Green Waste',
    explanation: 'Biodegradable organic matter suitable for mulching or community composting.'
  },
  {
    id: 'g8',
    name: '🥫 Clean Aluminum Soda / Tuna Can',
    targetBin: 'blue',
    categoryLabel: 'Dry Metal Recyclable',
    explanation: 'Metals can be remelted infinitely, saving 95% energy over raw ore mining.'
  },
  {
    id: 'g9',
    name: '🔌 Frayed Phone Charger & USB Cable',
    targetBin: 'black',
    categoryLabel: 'E-Waste',
    explanation: 'Electronics and copper wiring belong in dedicated e-waste bins.'
  },
  {
    id: 'g10',
    name: '☕ Leftover Coffee Grounds & Tea Leaves',
    targetBin: 'green',
    categoryLabel: 'Wet Compostable',
    explanation: 'Coffee and tea grounds provide excellent nitrogen balance for home soil composting.'
  }
];

export const SegregationPage: React.FC<{
  setCurrentTab?: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'guide' | 'game' | 'compost'>('guide');

  // Game State
  const [gameIndex, setGameIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const filteredCategories = WASTE_CATEGORIES.filter(cat => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.kannadaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.examples.some(ex => ex.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'wet') return matchesSearch && (cat.id === 'wet-waste' || cat.id === 'garden-waste');
    if (selectedCategory === 'dry') return matchesSearch && (cat.id === 'dry-recyclable' || cat.id === 'paper-cardboard' || cat.id === 'plastic-waste' || cat.id === 'glass-waste' || cat.id === 'metal-waste');
    if (selectedCategory === 'hazardous') return matchesSearch && (cat.id === 'sanitary-waste' || cat.id === 'domestic-hazardous' || cat.id === 'biomedical-waste');
    if (selectedCategory === 'special') return matchesSearch && (cat.id === 'e-waste' || cat.id === 'bulky-waste' || cat.id === 'construction-waste' || cat.id === 'mixed-waste');
    return matchesSearch;
  });

  const handleBinChoice = (bin: 'green' | 'blue' | 'red' | 'black') => {
    const currentItem = GAME_ITEMS[gameIndex];
    const isCorrect = currentItem.targetBin === bin;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setLastFeedback({
        isCorrect: true,
        text: `Correct! ${currentItem.explanation}`
      });
    } else {
      setLastFeedback({
        isCorrect: false,
        text: `Incorrect. ${currentItem.name} belongs to ${currentItem.categoryLabel}. ${currentItem.explanation}`
      });
    }

    if (gameIndex + 1 < GAME_ITEMS.length) {
      setTimeout(() => {
        setGameIndex(prev => prev + 1);
        setLastFeedback(null);
      }, 2000);
    } else {
      setTimeout(() => {
        setGameFinished(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }, 2000);
    }
  };

  const restartGame = () => {
    setGameIndex(0);
    setScore(0);
    setLastFeedback(null);
    setGameFinished(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Source Segregation & Circular Economy
        </span>
      </div>

      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
              {t.segGuideBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {t.segGuideTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.segGuideSubtitle}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📖 {t.tabGuide}
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'game'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎮 {t.tabGame}
          </button>
          <button
            onClick={() => setActiveTab('compost')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'compost'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌱 {t.tabCompost}
          </button>
        </div>
      </div>

      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchCategoryPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: t.filterAll },
                { id: 'wet', label: t.filterWet },
                { id: 'dry', label: t.filterDry },
                { id: 'hazardous', label: t.filterHazardous },
                { id: 'special', label: t.filterSpecial }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedCategory(f.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                    selectedCategory === f.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 14 Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(cat => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Top Bin Banner */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: cat.binHex }}
                    >
                      {cat.binColor}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {t.labelStandardRule}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {language === 'kn' ? cat.kannadaName : language === 'hi' ? cat.hindiName : cat.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700">
                      {language === 'en' ? `${cat.kannadaName} · ${cat.hindiName}` : cat.name}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Examples */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t.labelCommonExamples}
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                      {cat.examples.map((ex, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Method */}
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700">
                    <span className="font-bold text-emerald-900 block mb-0.5">{t.labelProtocol}</span>
                    {cat.segregationMethod}
                  </div>

                  {/* Do Not Mix */}
                  <div className="p-2.5 rounded-lg bg-red-50/60 border border-red-100 text-xs text-slate-700">
                    <span className="font-bold text-red-900 block mb-0.5">{t.labelDoNotMix}</span>
                    {cat.doNotMix.join(', ')}
                  </div>
                </div>

                {/* Bottom Disclaimer */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">{language === 'kn' ? 'ಪುರಸಭೆಯ ಮಾರ್ಗದರ್ಶಿ: ' : language === 'hi' ? 'नगरपालिका दिशानिर्देश: ' : 'Municipal Guidance: '}</span>
                  {cat.municipalDisclaimer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Sorting Game Tab */}
      {activeTab === 'game' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
              Interactive Educational Simulation
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {t.gameTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.gameSubtitle}
            </p>
          </div>

          {!gameFinished ? (
            <div className="space-y-8">
              {/* Progress and Score */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-2">
                <span>Item {gameIndex + 1} of {GAME_ITEMS.length}</span>
                <span className="font-mono text-emerald-700 text-sm">Score: {score} pts</span>
              </div>

              {/* Current Item Card */}
              <div className="p-8 rounded-2xl bg-linear-to-b from-slate-50 to-slate-100 border border-slate-200 text-center space-y-3 shadow-inner">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Which bin does this item belong to?
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {GAME_ITEMS[gameIndex].name}
                </h3>
              </div>

              {/* 4 Interactive Bins */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleBinChoice('green')}
                  className="p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center transition-all transform hover:scale-105 shadow-md flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-2xl">🍏</span>
                  <span className="text-xs">Green Bin</span>
                  <span className="text-[10px] font-normal text-emerald-100">Wet / Organic</span>
                </button>

                <button
                  onClick={() => handleBinChoice('blue')}
                  className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center transition-all transform hover:scale-105 shadow-md flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-2xl">📦</span>
                  <span className="text-xs">Blue Bin</span>
                  <span className="text-[10px] font-normal text-blue-100">Dry Recyclable</span>
                </button>

                <button
                  onClick={() => handleBinChoice('red')}
                  className="p-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-center transition-all transform hover:scale-105 shadow-md flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-2xl">🩹</span>
                  <span className="text-xs">Red Bin</span>
                  <span className="text-[10px] font-normal text-red-100">Sanitary / Haz</span>
                </button>

                <button
                  onClick={() => handleBinChoice('black')}
                  className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-center transition-all transform hover:scale-105 shadow-md flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-2xl">🔋</span>
                  <span className="text-xs">Black Bin</span>
                  <span className="text-[10px] font-normal text-slate-300">E-Waste / Reject</span>
                </button>
              </div>

              {/* Feedback Alert */}
              {lastFeedback && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-center gap-3 animate-in fade-in ${
                    lastFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {lastFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{lastFeedback.text}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-slate-900">
                Sorting Challenge Completed!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                You scored <span className="font-bold text-emerald-700">{score}</span> out of 100 points.
                {score >= 80
                  ? ' Outstanding! You have mastered Karnataka municipal waste segregation!'
                  : ' Great effort! Review the 14 category rules above to master source segregation.'}
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Home Composting & 3R Guide Tab */}
      {activeTab === 'compost' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
              Decentralized Waste Processing
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Home & Apartment Composting Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Composting at home converts kitchen food scraps into nutrient-rich black gold for gardens and eliminates city transport emissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Step 1: Greens (Nitrogen)</span>
              <h4 className="text-sm font-bold text-slate-900">Kitchen Food Scraps</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fruit skins, vegetable cuttings, tea bags, and crushed eggshells provide essential moisture and nitrogen for micro-organisms.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Step 2: Browns (Carbon)</span>
              <h4 className="text-sm font-bold text-slate-900">Dry Carbon Layers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add dry brown leaves, sawdust, or shredded plain cardboard in a 2:1 ratio over wet food to absorb odor and prevent excessive moisture.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-sky-200 bg-sky-50/40 space-y-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Step 3: Aeration & Harvest</span>
              <h4 className="text-sm font-bold text-slate-900">Turn Weekly</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aerate the bin once a week using a trowel. In 4 to 6 weeks, harvest sweet-smelling, dark organic compost for your potted plants!
              </p>
            </div>
          </div>

          {/* Plastic Reduction Tips */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Karnataka Plastic Reduction Directives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Carry Reusable Cloth Bags</span>
                <p className="text-slate-600">Carry cotton or jute bags when shopping for groceries. Say NO to single-use carry bags.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Rinse & Dry Milk Pouches</span>
                <p className="text-slate-600">Snip corner pouches without cutting off tiny tabs. Rinse with leftover water and deposit into dry recyclables.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
