// components/Header.jsx
import React from "react";
import { FaBars } from 'react-icons/fa';
import SystemUsersDisplay from '../Components/Header/SystemUsersDisplay';
import Leaderboard from '../Components/Header/LeaderBoard';
import CartButton from '../Components/Header/CartButton';
import NotificationBell from '../Components/Header/NotificationBell';
import Profile from '../Components/Header/Profile';

const Header = ({ setIsOpen }) => {
  return (
    <header className='h-16 p-2 rounded-t-lg items-center md:h-20 shadow-sm flex px-1 border border-gray-200 bg-[#fafaf9]'>
      <button 
        onClick={() => setIsOpen(true)} 
        className='p-4 lg:hidden hover:bg-gray-100 rounded focus:outline-none'
        aria-label='Open Menu'
      >
        <FaBars />
      </button>
      <span className='font-bold'></span>
      
      <div className='flex gap-1 items-center justify-end w-full md:gap-4 lg:px-6 lg:mt-4'>
        <SystemUsersDisplay />
        <Leaderboard />
        <CartButton />
        <NotificationBell />
        <Profile />
      </div>
    </header>
  );
};

export default Header;