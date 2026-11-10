// components/Header.jsx
import { FaBars, FaUserCircle, FaBolt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Leaderboard from "../Components/Header/LeaderBoard";
import SystemUsersDisplay from "../Components/Header/SystemUsersDisplay";
// import CartButton from '../Components/Header/CartButton';
// import NotificationBell from '../Components/Header/NotificationBell';
import Profile from "../Components/Header/Profile";
import { useAuth } from "../Hooks/useAuth";

const Header = ({ setIsOpen }) => {
  const { user } = useAuth();

  return (
    <header className="flex w-full items-center justify-between gap-2 px-4 py-1.5 md:py-2 lg:py-3 shadow-sm border border-gray-200 bg-[#fafaf9] rounded-t-lg h-14 md:h-16 md:gap-4 md:px-6">
      <button
        onClick={() => setIsOpen(true)}
        className="shrink-0 p-4 lg:hidden hover:bg-gray-100 rounded focus:outline-none"
        aria-label="Open Menu"
      >
        <FaBars />
      </button>
      <Link to="/" className="ml-4 flex items-center gap-1.5 group">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
          <FaBolt className="text-white text-sm md:text-base" />
        </div>
        <span className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-600 tracking-tight">
          9jaPrep
        </span>
      </Link>

      <div className="flex shrink-0 items-center justify-end gap-3 md:gap-4 lg:gap-6 text-lg md:text-xl">
        <div className="shrink-0">
          <SystemUsersDisplay />
        </div>
        <div className="shrink-0">
          <Leaderboard />
        </div>
        {user ? (
          <>
            {/* <div className="hidden lg:flex items-center">
              <CartButton />
            </div> */}
            <div className="hidden shrink-0 lg:block">
              {/* <NotificationBell /> */}
            </div>
            <div className="shrink-0">
              <Profile />
            </div>
          </>
        ) : (
          <Link to="/login" aria-label="Login or sign up" className="shrink-0">
            <FaUserCircle className="text-xl md:text-2xl text-slate-400 hover:text-white transition-colors" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
