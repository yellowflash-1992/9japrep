// components/header/ProfileDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = user?.user_metadata?.full_name || user?.email || 'Guest';
  const email = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open profile"
        className="text-xs rounded-4xl border px-1 py-1 border-gray-200 text-slate-700 md:px-3 md:py-2 flex items-center gap-1"
      >
        <FaUserCircle className="text-xl md:text-2xl" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
          <div className="mb-3 border-b border-gray-100 pb-3">
            <p className="font-bold text-sm text-slate-800">{fullName}</p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block w-full text-left text-sm py-2 px-2 rounded-lg hover:bg-slate-100 text-slate-700"
          >
            My Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-sm py-2 px-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}