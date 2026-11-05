// components/header/LeaderboardButton.jsx
import { useEffect, useState } from 'react';
import { FaTrophy, FaTimes } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    let isActive = true;

    const fetchLeaders = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const { data, error } = await supabase
          .from('attempts')
          .select('score, total, user_id')
          .eq('status', 'submitted')
          .order('score', { ascending: false })
          .limit(5);

        if (!isActive) return;

        if (error) {
          console.error('Failed to load leaderboard:', error);
          setErrorMessage('Could not load the leaderboard. Please try again later.');
          return;
        }

        const attempts = data ?? [];
        const userIds = [...new Set(attempts.map((attempt) => attempt.user_id).filter(Boolean))];
        const { data: profiles, error: profilesError } = userIds.length
          ? await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', userIds)
          : { data: [], error: null };

        if (!isActive) return;

        if (profilesError) {
          console.error('Failed to load leaderboard profiles:', profilesError);
          setErrorMessage('Could not load the leaderboard. Please try again later.');
          return;
        }

        const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));
        setLeaders(attempts.map((attempt) => ({
          ...attempt,
          name: profilesById.get(attempt.user_id) || 'Unknown user',
        })));
      } catch (error) {
        if (!isActive) return;
        console.error('Failed to load leaderboard:', error);
        setErrorMessage('Could not load the leaderboard. Please try again later.');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchLeaders();

    return () => {
      isActive = false;
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex text-xs rounded-4xl border px-1 py-2 md:font-bold border-gray-200 items-center gap-1 text-red-800 md:px-5 md:py-3 md:text-sm"
      >
        <FaTrophy className="text-xl md:text-2xl" />
        <span className="hidden sm:inline">Leaderboard</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">🏆 Top Scorers</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-2">
              {isLoading ? (
                <p className="py-4 text-center text-sm text-slate-500">Loading leaderboard...</p>
              ) : errorMessage ? (
                <p role="alert" className="py-4 text-center text-sm text-red-600">{errorMessage}</p>
              ) : leaders.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">No submitted exam scores yet.</p>
              ) : leaders.map((leader, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-500">#{i+1}</span>
                    <span className="font-medium">{leader.name}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {leader.score ?? 0}/{leader.total ?? 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}