import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your exam records.')) {
      return;
    }

    const { error } = await supabase
      .from('attempts')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      alert('Failed to clear history. Please try again.');
      console.error(error);
      return;
    }

    setHistory([]);
    alert('History cleared successfully!');
  };

  useEffect(() => {
    let isActive = true;

    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('attempts')
        .select('id, exam_type, score, total, completed_at')
        .eq('user_id', user.id)
        .eq('status', 'submitted')
        .order('completed_at', { ascending: false });

      if (!isActive) return;

      if (error) {
        console.error('Failed to load exam history:', error);
        setErrorMessage('Could not load your exam history. Please try again later.');
      } else {
        setHistory(data ?? []);
      }

      setIsLoading(false);
    };

    fetchHistory();

    return () => {
      isActive = false;
    };
  }, [user]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
        >
          <span aria-hidden="true" className="mr-2">←</span>
          Back to Dashboard
        </button>

        <header className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Your Exam History
            </h1>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Clear History
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Review your completed practice exams and scores.
          </p>
        </header>

        {isLoading ? (
          <div
            aria-busy="true"
            className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm"
          >
            Loading your exam history...
          </div>
        ) : errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700 shadow-sm"
          >
            {errorMessage}
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              You haven&apos;t taken any exams yet.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Start practicing and your completed exams will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((attempt) => {
              const score = Number(attempt.score) || 0;
              const total = Number(attempt.total) || 0;
              const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
              const isHighScore = percentage >= 50;
              const scoreClass = isHighScore
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                : 'bg-red-50 text-red-700 ring-red-600/20';
              const examType = String(attempt.exam_type ?? '').toUpperCase();
              const completedDate = attempt.completed_at
                ? new Date(attempt.completed_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Date unavailable';

              return (
                <article
                  key={attempt.id}
                  className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:items-center md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:p-5"
                >
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                      Exam type
                    </p>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-wide text-slate-700">
                      {examType}
                    </span>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                      Date
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {completedDate}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                      Score
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {score}/{total}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                      Percentage
                    </p>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-sm font-bold ring-1 ring-inset ${scoreClass}`}>
                      {percentage}%
                    </span>
                  </div>

                  <button
                    type="button"
                    className="justify-self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 md:justify-self-auto"
                  >
                    View Details
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
