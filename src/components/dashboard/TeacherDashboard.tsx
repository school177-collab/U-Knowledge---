import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Badge } from '../ui/LayoutComponents';
import { LayoutDashboard, Users, FileText, Bell, Search, Database, TrendingUp, Upload, Activity, Star, Filter, FolderKanban, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RankingList } from './RankingList';
import { QuestionBoard } from './QuestionBoard';

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'archive' | 'monitoring' | 'ranking'>('dashboard');

  return (
    <div className="space-y-12 pb-20">
      <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 w-fit">
         {[
           { id: 'dashboard', label: '교사 데스크', icon: LayoutDashboard },
           { id: 'archive', label: '질문 아카이브', icon: FolderKanban },
           { id: 'monitoring', label: '질문 모니터닝', icon: Activity },
           { id: 'ranking', label: '통계 및 시상', icon: TrendingUp },
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

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && <TeacherMain key="main" />}
        {activeTab === 'archive' && <TeacherArchive key="archive" />}
        {activeTab === 'monitoring' && <QuestionBoard key="monitor" />}
        {activeTab === 'ranking' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <RankingList title="MVP 학생 선정" limit={10} />
             <RankingList title="학급 활동량 시상 데이터" limit={10} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeacherMain() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8">
         {/* Welcome Area */}
         <Card className="p-0 border-none portal-shadow bg-transparent overflow-visible">
           <div className="relative rounded-[40px] bg-white p-12 overflow-hidden border border-slate-100">
             <div className="relative z-10 max-w-lg">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-primary/10">TEACHER DASHBOARD</span>
                <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
                  데이터로 <span className="text-brand-primary">지원</span>하는<br />질문 중심 수업 모델
                </h2>
                <div className="flex gap-4">
                   <Button variant="primary" className="rounded-2xl px-8 py-5 text-base shadow-xl shadow-brand-primary/20">자료 관리 <Database size={18} className="ml-2" /></Button>
                   <Button variant="secondary" className="rounded-2xl px-8 py-5 text-base">활동 게시판</Button>
                </div>
             </div>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.03] rotate-12 text-brand-primary">
                <Users fill="currentColor" className="w-full h-full" />
             </div>
           </div>
        </Card>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { icon: Upload, title: '자료 업로드', sub: '학습지 및 과제', color: 'bg-indigo-50 text-brand-primary' },
             { icon: Activity, title: '학급 분석', sub: '활동 데이터 통계', color: 'bg-purple-50 text-purple-500' },
             { icon: FileText, title: '학생 평가', sub: '활동 기록부 작성', color: 'bg-blue-50 text-blue-500' },
             { icon: Bell, title: '전체 공지', sub: '알림 메시지 전송', color: 'bg-red-50 text-red-500' },
           ].map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
             >
               <Card className="hover:border-brand-primary/30 transition-all cursor-pointer group">
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

      <div className="space-y-8">
         <RankingList title="전교 질문 기여도" />
         
         <Card title="데이터 연동" className="bg-slate-50/50">
            <div className="space-y-4">
               <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xs">R</div>
                  <div>
                     <p className="text-xs font-black text-slate-800">리로스쿨 연동</p>
                     <p className="text-[9px] text-slate-400 font-bold">자료 호환 및 성적 연동</p>
                  </div>
                  <Badge variant="success" className="ml-auto">Active</Badge>
               </div>
               <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                     <Database size={16} />
                  </div>
                  <div>
                     <p className="text-xs font-black text-slate-800">학교 홈페이지</p>
                     <p className="text-[9px] text-slate-400 font-bold">메인 게시판 자동 업로드</p>
                  </div>
                  <Badge className="ml-auto">Ready</Badge>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}

function TeacherArchive() {
   const subjects = ['국어', '영어', '수학', '사회', '과학', '일본어', '한문', '교양', '예체능', '동아리', '창체', '기타'];
   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subjects.map((sub, idx) => (
               <Card key={idx} className="flex flex-col items-center justify-center gap-4 hover:border-brand-primary/40 cursor-pointer text-center group">
                  <div className="w-14 h-14 rounded-3xl bg-slate-50 group-hover:bg-brand-primary/5 group-hover:text-brand-primary flex items-center justify-center transition-all">
                     <FolderKanban size={24} className="text-slate-400 transition-colors group-hover:text-brand-primary" />
                  </div>
                  <div>
                     <span className="text-sm font-black text-slate-800 block">{sub}</span>
                     <span className="text-[10px] font-bold text-slate-400 group-hover:text-brand-primary/60 transition-colors uppercase">Archive</span>
                  </div>
               </Card>
            ))}
         </div>
      </div>
   );
}
