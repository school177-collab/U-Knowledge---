import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, Button, Badge } from '../ui/LayoutComponents';
import { Sparkles, MessageCircle, Database, BookOpen, Star, HelpCircle, Zap, TrendingUp, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { QuestionBoard } from './QuestionBoard';
import { RankingList } from './RankingList';

export function StudentDashboard({ onNavigate }: { onNavigate: (mode: any) => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'questions' | 'ranking'>('dashboard');

  return (
    <div className="space-y-12 pb-20">
      <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 w-fit">
         {[
           { id: 'dashboard', label: '내 워크스페이스', icon: LayoutDashboard },
           { id: 'questions', label: '질문 광장', icon: MessageCircle },
           { id: 'ranking', label: '명예의 전당', icon: Trophy },
         ].map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={cn(
               "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
               activeTab === tab.id ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-slate-400 hover:text-slate-600"
             )}
           >
             <tab.icon size={16} />
             {tab.label}
           </button>
         ))}
      </div>

      {activeTab === 'dashboard' && <DashboardContent onNavigate={onNavigate} />}
      {activeTab === 'questions' && <QuestionBoard />}
      {activeTab === 'ranking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <RankingList title="누적 질문 랭킹 (Top 10)" limit={10} />
           <RankingList title="베스트 피드백 랭킹 (Top 10)" limit={10} />
        </div>
      )}
    </div>
  );
}

function DashboardContent({ onNavigate }: { onNavigate: (mode: any) => void }) {
  return (
     <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8">
        {/* Welcome Area */}
        <Card className="p-0 border-none portal-shadow bg-transparent overflow-visible">
           <div className="relative rounded-[40px] bg-white p-12 overflow-hidden border border-slate-100">
             <div className="relative z-10 max-w-lg">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-primary/10">STUDENT WORKSPACE</span>
                <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
                   질문이 <span className="text-brand-primary">성장</span>이 되는<br />새로운 학습 경험
                </h2>
                <div className="flex gap-4">
                   <Button variant="primary" className="rounded-2xl px-8 py-5 text-base shadow-xl shadow-brand-primary/10" onClick={() => alert('학습 기록을 분석합니다.')}>기록 확인 <Zap size={18} className="ml-2" /></Button>
                   <Button variant="secondary" className="rounded-2xl px-8 py-5 text-base" onClick={() => alert('전체 활동 게시판으로 이동합니다.')}>활동 게시판</Button>
                </div>
             </div>
             
             {/* Large Decorative Star */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.03] rotate-12">
                <Star fill="currentColor" className="w-full h-full text-slate-900" />
             </div>
           </div>
        </Card>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { icon: BookOpen, title: '질문 공책', sub: '내 질문 아카이브', color: 'bg-indigo-50 text-brand-primary', action: () => alert('질문 공책을 엽니다.') },
             { icon: Star, title: '포인트 샵', sub: '활동 보상 확인', color: 'bg-amber-50 text-amber-500', action: () => alert('포인트 샵으로 이동합니다.') },
             { icon: Database, title: '학습 자료실', sub: '수업 보조 자료', color: 'bg-blue-50 text-blue-500', action: () => alert('학습 자료실을 불러옵니다.') },
             { icon: HelpCircle, title: '아이디어함', sub: '학교에 제안하기', color: 'bg-emerald-50 text-emerald-500', action: () => alert('학교 제안함을 엽니다.') },
           ].map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
             >
               <Card className="hover:border-brand-primary/30 transition-all cursor-pointer group" onClick={item.action}>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", item.color)}>
                     <item.icon size={22} />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{item.sub}</p>
               </Card>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Class Rankings Sidebar */}
      <div className="space-y-8">
        <RankingList title="학급별 질문 순위" />
        
        {/* Recruitment Micro-banner */}
        <div 
          onClick={() => onNavigate('recruitment')}
          className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer"
        >
           <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">질문 탐정단 모집</h3>
              <p className="text-[10px] font-bold text-white/50 mb-6 leading-relaxed">우리 학교 질문 문화를 이끌어갈 "학생 탐정"을 찾습니다.</p>
              <Button variant="portal" className="w-full py-4 rounded-xl">신청 하러가기</Button>
           </div>
           <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl transition-transform duration-1000 group-hover:scale-150" />
        </div>
      </div>
    </div>
  );
}
// Missing icons
function LayoutDashboard({ size, className }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
function Trophy({ size, className }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
