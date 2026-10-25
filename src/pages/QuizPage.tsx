import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Trophy, Sparkles, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackButton } from '../components/BackButton';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

interface ReviewItem {
  id: number;
  question: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export const QuizPage: React.FC<{
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Results state
  const [result, setResult] = useState<{
    score: number;
    totalQuestions: number;
    percentage: number;
    pointsAwarded: number;
    badgeAwarded: string | null;
    review: ReviewItem[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/quiz/questions')
      .then(res => res.json())
      .then(data => {
        if (data.questions) {
          setQuestions(data.questions);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('smartwaste_token');
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      setResult(data);
      if (user) {
        refreshUser();
      }
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Failed to submit quiz', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mb-3"></div>
        <p className="text-xs text-slate-500 font-medium">Loading Karnataka Segregation Quiz Questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
          Interactive Waste Awareness
        </span>
      </div>

      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>Karnataka Environmental Certification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t.quizTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {t.quizSubtitle}
        </p>
      </div>

      {!result ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-800">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-mono">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = answers[currentQ.id] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, oIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex + 1 < questions.length ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting || !allAnswered}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating Answers...' : 'Submit Final Answers'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Certificate Screen */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-md space-y-8 animate-in fade-in">
          {/* Certificate Header */}
          <div className="text-center space-y-3 p-6 rounded-2xl bg-linear-to-b from-emerald-50 to-white border border-emerald-200">
            <Trophy className="w-14 h-14 text-amber-500 mx-auto" />
            <h2 className="text-2xl font-black text-slate-900">
              Quiz Evaluation Complete
            </h2>
            <div className="text-4xl font-extrabold text-emerald-700 font-mono">
              {result.percentage}%
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              You correctly answered <span className="font-bold text-slate-900">{result.score}</span> out of {result.totalQuestions} questions.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                +{result.pointsAwarded} Eco-Points Earned
              </span>
              {result.badgeAwarded && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                  🏅 Badge Unlocked: {result.badgeAwarded}
                </span>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Answers & Explanations Review
            </h3>

            <div className="space-y-3">
              {result.review.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    item.isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-red-50/50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. {item.question}
                    </span>
                    {item.isCorrect ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold shrink-0">
                        Correct (+5 pts)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-red-200 text-red-900 text-[10px] font-bold shrink-0">
                        Incorrect
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600">
                    <span className="font-bold text-slate-700">Correct Answer: </span>
                    {item.options[item.correctIndex]}
                  </p>

                  <div className="p-2 rounded bg-white/70 border border-slate-200 text-slate-700">
                    <span className="font-bold text-slate-800">Official Municipal Explanation: </span>
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={restartQuiz}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => setCurrentTab('citizen-dashboard')}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              View Points in Citizen Dashboard &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
