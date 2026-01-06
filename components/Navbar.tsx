import React from 'react';
import { ViewState, User } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user }) => {
  const navItems: { id: ViewState; label: string; icon: string }[] = [
    { id: 'HOME', label: 'Trang Chủ', icon: '🏠' },
    { id: 'MARKET', label: 'Chợ Tài Liệu', icon: '🛒' },
    { id: 'LIBRARY', label: 'Kho Của Tôi', icon: '📚' },
    { id: 'UPLOAD', label: 'Bán Tài Liệu', icon: '📤' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('HOME')}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:rotate-12 transition-transform">
            3D
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            StudyVerse
          </span>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2
                ${currentView === item.id 
                  ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
           <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-neon-blue/30 text-neon-blue text-sm font-bold shadow-[0_0_10px_rgba(0,243,255,0.2)]">
             {user.balance} Credits
           </div>
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20 overflow-hidden">
             <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover opacity-80" />
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;