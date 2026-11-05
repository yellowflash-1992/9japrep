// components/header/SystemUsersDisplay.jsx
import { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

export default function SystemUsersDisplay() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let isActive = true;

    const fetchUserCount = async () => {
      const { count: userCount, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (!isActive) return;

      if (error) {
        console.error('Failed to load system user count:', error);
        return;
      }

      setCount(userCount);
    };

    fetchUserCount();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex text-xs rounded-4xl border px-1 py-2 border-gray-200 items-center gap-1 text-red-800 md:text-sm md:font-bold md:px-2 md:py-1.5">
      <FaUsers className="text-lg md:text-xl" />
      <span className="hidden lg:inline-block">System Users ({count ?? '...'})</span>
    </div>
  );
}