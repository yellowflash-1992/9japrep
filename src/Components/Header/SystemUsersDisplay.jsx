// components/header/SystemUsersDisplay.jsx
import { FaUsers } from 'react-icons/fa';
import { useUserRegistry } from '../../Hooks/useUserRegistry';

export default function SystemUsersDisplay() {
  const { getUserCount } = useUserRegistry();
  const count = getUserCount();

  return (
    <div className="flex text-xs rounded-4xl border px-1 py-2 border-gray-200 items-center gap-1 text-red-800 md:text-sm md:font-bold md:px-5 md:py-3">
      <FaUsers className="text-xl md:text-2xl" />
      <span className="hidden md:inline-block">System Users ({count})</span>
    </div>
  );
}