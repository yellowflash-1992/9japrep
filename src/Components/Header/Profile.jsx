// components/header/ProfileDropdown.jsx
import { useState, useContext } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { ExamStateContext } from '../../Helpers/Contexts';
import { useUserRegistry } from '../../Hooks/useUserRegistry';

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', exam: 'jamb' });
  const { userName, waecUserName, activeExam } = useContext(ExamStateContext);
  const { addUser } = useUserRegistry();

  const displayName = activeExam === 'waec' ? waecUserName : userName;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      addUser({ name: formData.name, exam: formData.exam });
      setIsOpen(false);
      setFormData({ name: '', exam: 'jamb' });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs rounded-4xl border px-1 py-1 border-gray-200 text-red-800 md:px-5 md:py-3 flex items-center gap-1"
      >
        <FaUserCircle size={18} />
        <span className="hidden md:inline">{displayName || 'Guest'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Register New User</h3>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded-lg p-2 text-sm"
              required
            />
            <select
              value={formData.exam}
              onChange={(e) => setFormData({...formData, exam: e.target.value})}
              className="w-full border rounded-lg p-2 text-sm"
            >
              <option value="jamb">JAMB</option>
              <option value="waec">WAEC/NECO</option>
            </select>
            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-rose-700"
            >
              Register
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Registered users persist across sessions
          </p>
        </div>
      )}
    </div>
  );
}