import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, BookOpen, Settings, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavbarProps {
  viewMode: 'portal' | 'student' | 'teacher';
  setViewMode: (mode: 'portal' | 'student' | 'teacher') => void;
}

export function Navbar({ viewMode, setViewMode }: NavbarProps) {
  const { profile, logout } = useAuth();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('portal')}>
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <BookOpen className="text-white" size={22} />
            </div>
            <div>
               <h1 className="font-black text-xl tracking-tighter text-slate-900 leading-none">문화고</h1>
               <span className="text-[11px] font-bold text-brand-primary uppercase tracking-widest leading-none">질문하는 학교</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode('student')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                viewMode === 'student' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              학생 모드
            </button>
            <button 
               onClick={() => setViewMode('teacher')}
               className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                viewMode === 'teacher' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              교사 모드
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <Settings size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">1-1</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl">
             <Zap size={16} className="text-brand-primary fill-brand-primary" />
             <span className="text-sm font-black text-brand-primary">{profile?.points || 250} XP</span>
          </div>

          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-slate-100 transition-all">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               {profile?.photoURL && <img src={profile.photoURL} alt="profile" className="w-full h-full object-cover" />}
            </div>
            <button 
              onClick={logout}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
