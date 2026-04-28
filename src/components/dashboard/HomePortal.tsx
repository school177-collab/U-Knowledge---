import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, Button, Badge } from '../ui/LayoutComponents';
import { Calendar, ChevronRight, Trophy, BookOpen, Users, Settings, Database, Lightbulb, MessageCircle, Info, Bell, Zap, Search, Sparkles, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RankingList } from './RankingList';

export function HomePortal({ onNavigate }: { onNavigate: (mode: any) => void }) {
  const [timeLeft, setTimeLeft] = useState({ d: 18, h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Basic countdown simulation
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59, h: prev.h - (prev.m === 0 ? 1 : 0) };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-16 pb-20 font-sans">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full mb-4">
             <Zap size={12} className="text-brand-primary fill-brand-primary" />
             <span className="text-[10px] font-black text-brand-primary uppercase tracking-[2px]">Core Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
             U KNOWLEDGE<br />
             <span className="text-brand-primary">질문하는 학교</span>
          </h1>
          <p className="mt-6 text-slate-400 font-bold text-lg max-w-2xl leading-relaxed">
            "침묵에서 축제로, 호기심이 문화가 되는 학교"를 실현하는 통합 질문 교육 플랫폼입니다.
            우리의 궁금함이 배움의 시작이 됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
           <Button variant="primary" className="px-8 py-5 rounded-[24px] text-lg" onClick={() => alert('질문 페스티벌 일정과 장소를 확인합니다.')}>
              <MessageCircle size={20} /> 질문 페스티벌 안내
           </Button>
           <Button variant="portal" className="px-8 py-5 rounded-[24px] text-lg text-slate-600" onClick={() => alert('운영 가이드 문서를 불러옵니다.')}>
              <Info size={20} className="text-slate-400" /> 운영 가이드
           </Button>
        </div>
      </div>

      {/* Hero Event Banner - Real Countdown */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[50px] bg-gradient-to-br from-[#4338ca] via-[#3730a3] to-[#1e1b4b] p-12 text-white overflow-hidden shadow-[0_40px_100px_-20px_rgba(67,56,202,0.4)] min-h-[440px] flex flex-col justify-between"
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center h-full">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Badge className="bg-white/10 border-white/20 text-white font-black text-[10px]">UPCOMING EVENT</Badge>
                 <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-6">
                 <div className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter drop-shadow-2xl">
                    D-{timeLeft.d}
                 </div>
                 <div className="flex gap-4 text-white/40 uppercase font-black tracking-widest text-sm">
                    <div className="flex flex-col items-center"><span>{String(timeLeft.h).padStart(2, '0')}</span><span className="text-[10px]">Hr</span></div>
                    <div className="flex flex-col items-center"><span>{String(timeLeft.m).padStart(2, '0')}</span><span className="text-[10px]">Min</span></div>
                    <div className="flex flex-col items-center"><span>{String(timeLeft.s).padStart(2, '0')}</span><span className="text-[10px]">Sec</span></div>
                 </div>
              </div>
              <div>
                <h2 className="text-3xl font-black mb-2">전교생 질문 설문조사</h2>
                <div className="flex items-center gap-2 text-white/50">
                    <Calendar size={20} />
                    <span className="font-bold text-lg">2026. 05. 12. 화요일 전체 학생 대상</span>
                </div>
              </div>
              <Button 
                onClick={() => onNavigate('student')}
                className="bg-brand-secondary text-white border-none w-fit px-10 py-5 rounded-2xl md:text-xl transform hover:scale-105 transition-all"
              >
                사전 질문 남기기
              </Button>
           </div>

           <div className="hidden xl:flex flex-col gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] w-96 transform hover:rotate-1 transition-transform">
              <h3 className="text-xs font-black uppercase tracking-[3px] text-white/30 mb-4 border-b border-white/10 pb-4">질문 로드맵 2026</h3>
              {[
                { month: '4월', label: '질문 문화 기반 조성', done: true },
                { month: '5월', label: '전체 학생 질문 설문', active: true },
                { month: '매월', label: '우수질문 선정 & 시상' },
                { month: '학기말', label: '탐구 한마당 예선' },
                { month: '11월', label: '질문 페스티벌 본선' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer" onClick={() => alert(`${step.label} 일정을 확인합니다.`)}>
                   <div className={cn(
                     "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all",
                     step.active ? "bg-brand-secondary text-white scale-110 shadow-lg shadow-brand-secondary/30" : 
                     step.done ? "bg-white/20 text-white/60" : "bg-white/5 text-white/20"
                   )}>
                     {idx + 1}
                   </div>
                   <div className="flex flex-col">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", step.active ? "text-brand-secondary" : "text-white/20")}>{step.month}</span>
                      <span className={cn("text-xs font-bold", step.active ? "text-white" : "text-white/40 group-hover:text-white/60")}>{step.label}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-brand-secondary/20 rounded-full blur-[100px] pointer-events-none" />
      </motion.div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
         {/* Left Column: Sections 1 & 2 */}
         <div className="space-y-16">
            {/* Section 1: 학생 활동 */}
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center"><Users className="text-brand-primary" /></div>
                     #1 학생 활동 마당
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate('student')}>
                     <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-brand-primary flex items-center justify-center mb-6">
                        <BookOpen size={32} />
                     </div>
                     <h3 className="text-xl font-black text-slate-800 mb-3">질문 공책 & 게시판</h3>
                     <p className="text-sm text-slate-400 font-bold mb-8 leading-relaxed">매월 교실 내 질문 공책 작성 및 학년별 게시판 공유 활동</p>
                     <div className="flex items-center gap-3">
                        <Badge variant="brand">Monthly</Badge>
                        <Badge variant="success">Reward Link</Badge>
                     </div>
                  </Card>

                  <Card className="p-8 hover:scale-[1.02] transition-all cursor-pointer" onClick={() => alert('학년별 시상 내역 게시판으로 이동합니다.')}>
                     <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
                        <Trophy size={32} />
                     </div>
                     <h3 className="text-xl font-black text-slate-800 mb-3">이달의 우수 질문</h3>
                     <p className="text-sm text-slate-400 font-bold mb-8 leading-relaxed">학년별 우수 질문자 각 3명 선정 및 특별 베네핏 증정</p>
                     <Button 
                       variant="secondary" 
                       className="w-full rounded-2xl py-4 font-black"
                       onClick={(e) => { e.stopPropagation(); alert('시상 내역 게시판 준비 중입니다.'); }}
                     >
                       시상 내역 확인
                     </Button>
                  </Card>
               </div>

               <Card className="bg-slate-50/50 border-none relative overflow-hidden p-10 cursor-pointer group" onClick={() => onNavigate('recruitment')}>
                  <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                     <div className="w-48 h-48 rounded-[40px] bg-white portal-shadow flex items-center justify-center shrink-0 border border-slate-100 transform -rotate-3 group-hover:rotate-0 transition-transform">
                        <div className="relative">
                           <Search size={64} className="text-brand-primary opacity-10" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles size={48} className="text-brand-primary" />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <TypographyH3>질문 탐정단 <span className="text-brand-primary text-sm font-black ml-2 uppercase tracking-widest">Student Council</span></TypographyH3>
                        <ul className="space-y-4">
                           <li className="flex gap-3 text-slate-600 font-medium leading-relaxed">
                              <span className="text-brand-primary font-black mt-1 text-sm">01</span>
                              학생회 주관 홈페이지 관리 및 실시간 질의 응답 시스템 운영
                           </li>
                           <li className="flex gap-3 text-slate-600 font-medium leading-relaxed">
                              <span className="text-brand-primary font-black mt-1 text-sm">02</span>
                              학년별 게시판 모니터링 및 좋은 질문 정기 업데이트/필터링
                           </li>
                        </ul>
                        <div className="flex gap-3">
                           <Badge>#학생주도</Badge>
                           <Badge>#디지털소통</Badge>
                           <Badge>#에듀테크</Badge>
                        </div>
                     </div>
                  </div>
                  <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" />
               </Card>
            </div>
         </div>

         {/* Right Column: Other sections */}
         <div className="space-y-12">
            <RankingList title="베스트 질문 랭킹 (전체)" limit={10} />

            <Card title="#2 교사 활동" subtitle="교사 LAB & 아카이브">
               <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer" onClick={() => alert('질문 아카이브 데이터베이스를 확인합니다.')}>
                     <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database size={24} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-800">질문 아카이브 구축</h4>
                        <p className="text-[10px] font-bold text-slate-400 capitalize">12개 교과군 데이터 통합</p>
                     </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-slate-100 transition-all" onClick={() => alert('교사 연구 공동체 정보를 확인합니다.')}>
                     <p className="text-xs font-black text-slate-700 mb-2">교원 공동체 활동 (교사 LAB)</p>
                     <div className="flex justify-between items-end">
                        <Badge variant="brand">2개 팀 구성 완료</Badge>
                        <ChevronRight className="text-slate-300" size={18} />
                     </div>
                  </div>
               </div>
            </Card>

            <Card title="#3 시스템 & 공모전" className="bg-brand-secondary/[0.03] border-brand-secondary/20">
               <div className="space-y-6">
                  <div className="p-6 bg-white rounded-3xl border border-brand-secondary/10 shadow-sm relative overflow-hidden group cursor-pointer" onClick={() => alert('공모전 가이드라인을 확인합니다.')}>
                     <div className="relative z-10">
                        <h4 className="text-sm font-black text-slate-800 mb-2">2026 수업 공모전</h4>
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">제1차 질문 중심 수업 공모전 준비 중 (성적 상승 학생 베네핏 연계)</p>
                     </div>
                     <Star className="absolute bottom-[-10px] right-[-10px] text-brand-secondary/10 group-hover:scale-150 transition-transform" size={64} />
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group cursor-pointer" onClick={() => alert('데이터 통계 시스템을 호출합니다.')}>
                     <div className="flex justify-between mb-4">
                        <Badge variant="success">Support App</Badge>
                        <Settings size={16} className="text-slate-300 group-hover:rotate-90 transition-transform" />
                     </div>
                     <h4 className="text-sm font-black text-slate-800 mb-2">질문 관리 프로그램</h4>
                     <p className="text-[10px] text-slate-400 font-bold">흐름 분석 및 정량적 데이터 통계 시스템</p>
                  </div>
               </div>
            </Card>
            
            {/* CTA Banner */}
            <div className="rounded-[40px] bg-brand-primary p-10 text-white portal-shadow relative overflow-hidden shadow-[0_20px_50px_rgba(67,56,202,0.3)]">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-3 leading-tight text-white">질문 탐정단 모집</h3>
                  <p className="text-sm text-white/50 mb-10 font-medium">우리 학교 질문 문화를 바꿀 주인공, 학생 탐정단에 지금 합류하세요!</p>
                  <Button 
                    onClick={() => onNavigate('recruitment')}
                    className="w-full bg-white text-brand-primary font-black py-5 rounded-2xl text-lg hover:bg-white/90 transition-all"
                  >
                    지금 바로 신청하기
                  </Button>
               </div>
               <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </div>
         </div>
      </div>
    </div>
  );
}

function TypographyH3({ children }: { children: React.ReactNode }) {
   return <h3 className="text-2xl font-black text-slate-800 tracking-tight">{children}</h3>;
}

