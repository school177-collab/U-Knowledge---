import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, BookOpen, Settings, Zap, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { updateUserProfile } from '../../services/db';

interface NavbarProps {
  viewMode: 'portal' | 'student' | 'teacher' | 'recruitment';
  setViewMode: (mode: 'portal' | 'student' | 'teacher' | 'recruitment') => void;
}

export function Navbar({ viewMode, setViewMode }: NavbarProps) {
  const { profile, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const handleUpdateGradeClass = async (grade: number, classNum: number) => {
    if (profile?.uid) {
      await updateUserProfile(profile.uid, { grade, class: classNum });
      setShowSettings(false);
    }
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('portal')}>
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
              <BookOpen className="text-white" size={22} />
            </div>
            <div>
               <h1 className="font-black text-xl tracking-tighter text-slate-900 leading-none">문화고</h1>
               <span className="text-[11px] font-bold text-brand-primary uppercase tracking-widest leading-none text-nowrap">질문하는 학교</span>
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
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all"
            >
              <Settings size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-600">
                {profile?.grade || 1}-{profile?.class || 1}
              </span>
              <ChevronDown size={14} className="text-slate-300" />
            </button>

            {showSettings && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-6 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[3px]">Workspace settings</p>
                    <h4 className="text-sm font-black text-slate-800">나의 학습 환경 설정</h4>
                  </div>
                  <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-primary transition-colors">
                    <Check size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <p className="text-[10px] font-black uppercase text-brand-primary tracking-widest mb-3 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Grade (학년)
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(g => (
                        <button 
                          key={g}
                          onClick={() => handleUpdateGradeClass(g, profile?.class || 1)}
                          className={cn(
                            "py-2.5 rounded-xl text-xs font-black transition-all",
                            profile?.grade === g 
                              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                              : "bg-white text-slate-400 border border-slate-100 hover:border-brand-primary/30"
                          )}
                        >
                          {g}학년
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-3 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Class (반: 1~9반)
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                       {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(c => (
                         <button 
                           key={c}
                           onClick={() => handleUpdateGradeClass(profile?.grade || 1, c)}
                           className={cn(
                             "py-2 rounded-lg text-[10px] font-black transition-all",
                             profile?.class === c 
                               ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                               : "bg-white text-slate-400 border border-slate-100 hover:border-emerald-500/30"
                           )}
                         >
                           {c}반
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => {
                      if(window.confirm('로그아웃 하시겠습니까?')) {
                        logout();
                        setShowSettings(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-xs font-black text-red-500 bg-red-50/30 hover:bg-red-50 transition-all border border-red-100/50"
                  >
                    <LogOut size={16} /> 안전하게 로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl group cursor-help">
             <Zap size={16} className="text-brand-primary fill-brand-primary group-hover:animate-bounce" />
             <span className="text-sm font-black text-brand-primary">{profile?.points || 0} XP</span>
          </div>

          <button 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-slate-100 transition-all"
            onClick={() => alert('새로운 알림이 없습니다.')}
          >
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden transform hover:scale-110 transition-transform cursor-pointer">
               {profile?.photoURL && <img src={profile.photoURL} alt="profile" className="w-full h-full object-cover" />}
            </div>
            <button 
              onClick={logout}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
