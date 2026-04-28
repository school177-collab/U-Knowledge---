import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../ui/LayoutComponents';
import { Trophy, Calendar, Users, Star, Award, TrendingUp } from 'lucide-react';
import { subscribeEvents } from '../../services/db';
import { SchoolEvent } from '../../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);

  useEffect(() => {
    return subscribeEvents(setEvents);
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Profile Stat */}
      <Card title="MY STATUS">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00f2ff] to-[#006aff] p-0.5">
              <div className="w-full h-full rounded-full bg-[#151619] flex items-center justify-center">
                <Star className="text-[#00f2ff]" size={20} />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#00f2ff] text-black text-[8px] font-bold px-1 rounded-full border border-[#151619]">
              LV.4
            </div>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">나의 질문 포인트</div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              1,240 <TrendingUp size={14} className="text-[#00f2ff]" />
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card title="UPCOMING EVENTS">
        <div className="space-y-4">
          {events.length > 0 ? events.map(event => (
            <div key={event.id} className="flex gap-3 group cursor-pointer">
              <div className="flex flex-col items-center justify-center min-w-[40px] h-[40px] bg-white/5 border border-white/10 rounded group-hover:border-[#00f2ff]/30 transition-colors">
                <span className="text-[10px] text-white/40 leading-none">MAY</span>
                <span className="text-lg font-bold text-white leading-none">12</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/90 line-clamp-1">{event.title}</h4>
                <p className="text-[10px] text-white/40">{event.description}</p>
              </div>
            </div>
          )) : (
            <div className="space-y-4">
              <div className="flex gap-3 opacity-60">
                <div className="flex flex-col items-center justify-center min-w-[40px] h-[40px] bg-white/5 border border-white/10 rounded">
                  <span className="text-[10px] text-white/40 leading-none uppercase">APR</span>
                  <span className="text-lg font-bold text-white leading-none">28</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white/90">전교 질문 설문조사</h4>
                  <Badge className="mt-1">D-3</Badge>
                </div>
              </div>
              <div className="flex gap-3 opacity-40">
                <div className="flex flex-col items-center justify-center min-w-[40px] h-[40px] bg-white/5 border border-white/10 rounded">
                  <span className="text-[10px] text-white/40 leading-none uppercase">MAY</span>
                  <span className="text-lg font-bold text-white leading-none">05</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white/80">질문 공책 활성화 주간</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Leaderboard Small */}
      <Card title="TOP EXPLORERS">
        <div className="space-y-3">
          {[
            { name: '김지우', class: '3-1', score: 850, rank: 1 },
            { name: '이민호', class: '2-4', score: 720, rank: 2 },
            { name: '박서연', class: '3-2', score: 680, rank: 3 },
          ].map((user) => (
            <div key={user.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold",
                  user.rank === 1 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                  user.rank === 2 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30" :
                  "bg-amber-700/20 text-amber-700 border border-amber-700/30"
                )}>
                  {user.rank}
                </div>
                <div>
                  <div className="text-xs text-white/90 font-medium">{user.name}</div>
                  <div className="text-[9px] text-white/30">{user.class}</div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#00f2ff]">{user.score} pts</div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 border-t border-white/5 text-[10px] text-white/30 hover:text-[#00f2ff] transition-all uppercase tracking-widest text-center">
          리더보드 전체보기
        </button>
      </Card>

      {/* Stats Widget */}
      <Card title="SCHOOL ANALYTICS">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <Users className="text-[#00f2ff] mb-2" size={16} />
            <div className="text-lg font-bold text-white">84%</div>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">주간 참여율</div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <Award className="text-purple-400 mb-2" size={16} />
            <div className="text-lg font-bold text-white">128</div>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">우수 질문</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
