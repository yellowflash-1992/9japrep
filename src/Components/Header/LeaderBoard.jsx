// components/header/LeaderboardButton.jsx
import { useState } from 'react';
import { FaTrophy, FaTimes } from 'react-icons/fa';

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);

  // Dummy leaderboard data
  const leaders = [
    { name: 'Adebayo C.', score: 1250, exam: 'JAMB' },
    { name: 'Chidinma O.', score: 1180, exam: 'WAEC' },
    { name: 'Tunde B.', score: 1120, exam: 'JAMB' },
  ];

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
              {leaders.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-500">#{i+1}</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {user.score} pts <span className="text-xs text-rose-500">({user.exam})</span>
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