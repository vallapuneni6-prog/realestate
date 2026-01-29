
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onRoleSwitch }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Portfolio Overview', roles: ['admin', 'marketing'], icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'pipeline', label: 'Elite Pipeline', roles: ['admin'], icon: 'M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zM12 7l4 4-4 4M8 11h8' },
    { id: 'leads', label: 'HNI Leads', roles: ['admin', 'marketing'], icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'properties', label: 'Curated Assets', roles: ['admin', 'marketing'], icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'sales', label: 'Sales Ledger', roles: ['admin'], icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l10 5 10-5M2 12l10 5 10-5M12 2l10 5-10 5L2 7l10-5z' },
    { id: 'ai', label: 'AI Strategy', roles: ['admin'], icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ];

  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="w-72 bg-[#1a1c2c] text-white min-h-screen flex flex-col border-r border-gray-800 shrink-0">
      <div className="p-10">
        <h1 className="text-2xl font-bold tracking-[0.2em] text-[#d4af37] uppercase mb-1 serif">Elysian</h1>
        <p className="text-[10px] tracking-widest text-gray-500 uppercase">Privé Real Estate CRM</p>
      </div>
      
      <nav className="flex-1 px-6 space-y-1">
        {filteredMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-500 ${
              activeTab === item.id 
                ? 'bg-[#d4af37]/10 text-[#d4af37] border-l-2 border-[#d4af37]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 mt-auto space-y-6">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <p className="text-[10px] text-[#d4af37] uppercase tracking-widest mb-3 font-bold opacity-60">Session Identity</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-[#1a1c2c] font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{currentUser.name}</p>
              <div className="flex gap-2 mt-1">
                 <button onClick={() => onRoleSwitch('admin')} className={`text-[9px] uppercase font-bold tracking-tighter ${currentUser.role === 'admin' ? 'text-[#d4af37]' : 'text-gray-500'}`}>Admin</button>
                 <span className="text-gray-700">|</span>
                 <button onClick={() => onRoleSwitch('marketing')} className={`text-[9px] uppercase font-bold tracking-tighter ${currentUser.role === 'marketing' ? 'text-[#d4af37]' : 'text-gray-500'}`}>Staff</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
