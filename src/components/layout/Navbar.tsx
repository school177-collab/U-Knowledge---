import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/LayoutComponents';
import { LogOut, Bell, Search, Hexagon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { profile, logout } = useAuth();

  return (
    <nav className="border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00f2ff]/20 flex items-center justify-center border border-[#00f2ff]/40">
              <Hexagon className="text-[#00f2ff] fill-[#00f2ff]/20" size={18} />
            </div>
            <span className="font-black text-xl tracking-tighter text-white">U-KNOWLEDGE</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink active>질문 광장</NavLink>
            <NavLink>데이터 분석</NavLink>
            <NavLink>질문 탐정단</NavLink>
            <NavLink>아카이브</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/40 group focus-within:border-[#00f2ff]/40 transition-all">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="질문 검색..." 
              className="bg-transparent border-none text-xs focus:outline-none focus:ring-0 w-32 focus:w-48 transition-all"
            />
          </div>

          <button className="p-2 text-white/40 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00f2ff] rounded-full border border-[#0a0b10]" />
          </button>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">{profile?.displayName}</div>
              <div className="text-[10px] text-[#00f2ff] uppercase font-mono leading-none">{profile?.role}</div>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-white/40 rounded-lg transition-all"
              title="로그아웃"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "text-sm font-medium transition-colors hover:text-white",
        active ? "text-[#00f2ff]" : "text-white/40"
      )}
    >
      {children}
    </a>
  );
}
