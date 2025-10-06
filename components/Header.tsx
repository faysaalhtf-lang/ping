import React from 'react';
import type { View } from '../types';
import { UserIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NavLink: React.FC<{ children: React.ReactNode; isActive: boolean; onClick: () => void }> = ({ children, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 relative ${
      isActive ? 'text-neon-blue' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    {children}
    {isActive && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-neon-blue rounded-full" />
    )}
  </button>
);

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, theme, toggleTheme }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="container mx-auto flex justify-between items-center bg-light-card/80 dark:bg-dark-card/50 backdrop-blur-sm p-3 rounded-xl border border-gray-200 dark:border-white/10 shadow-md dark:shadow-glow-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-magenta rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl italic">P</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">PingPanic</h1>
        </div>
        <nav className="hidden md:flex items-center bg-black/5 dark:bg-black/20 rounded-lg">
          <NavLink isActive={activeView === 'speedtest'} onClick={() => setActiveView('speedtest')}>Speed Test</NavLink>
          <NavLink isActive={activeView === 'history'} onClick={() => setActiveView('history')}>History</NavLink>
          <NavLink isActive={activeView === 'tools'} onClick={() => setActiveView('tools')}>Tools</NavLink>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            aria-label="User profile"
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <UserIcon className="w-6 h-6" />
          </button>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;