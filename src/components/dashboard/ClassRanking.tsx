import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Card, Badge } from '../ui/LayoutComponents';
import { Users, TrendingUp, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ClassStat {
  grade: number;
  classNum: number;
  points: number;
  studentCount: number;
}

export function ClassRanking() {
  const [stats, setStats] = useState<ClassStat[]>([]);

  useEffect(() => {
    // In a real app, we might have a 'classes' collection or aggregate from 'users'
    // For now, let's aggregate from 'users' in real-time (demo purposes)
    const q = query(collection(db, 'users'));
    return onSnapshot(q, (snapshot) => {
      const classMap: Record<string, ClassStat> = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const grade = data.grade || 1;
        const classNum = data.class || 1;
        const points = data.points || 0;
        const key = `${grade}-${classNum}`;
        
        if (!classMap[key]) {
          classMap[key] = { grade, classNum, points: 0, studentCount: 0 };
        }
        classMap[key].points += points;
        classMap[key].studentCount += 1;
      });
      
      const sortedStats = Object.values(classMap).sort((a, b) => b.points - a.points);
      setStats(sortedStats);
    });
  }, []);

  return (
    <Card title="학급별 포인트 랭킹" subtitle="우리 반의 활약을 확인하세요!">
      <div className="p-6 space-y-4">
        {stats.slice(0, 5).map((stat, idx) => (
          <div key={`${stat.grade}-${stat.classNum}`} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-brand-primary/20 transition-all">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0",
              idx === 0 ? "bg-amber-100 text-amber-600" : 
              idx === 1 ? "bg-slate-200 text-slate-600" : 
              idx === 2 ? "bg-orange-100 text-orange-600" : "bg-white text-slate-400"
            )}>
              {idx + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-800 text-sm">{stat.grade}학년 {stat.classNum}반</h4>
              <div className="flex items-center gap-3 mt-1">
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Users size={12} /> {stat.studentCount}명
                 </div>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                    <TrendingUp size={12} /> {stat.points} XP
                 </div>
              </div>
            </div>
            {idx === 0 && <Award className="text-amber-500" size={24} />}
          </div>
        ))}
        
        {stats.length === 0 && (
          <div className="py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            데이터를 집계 중입니다...
          </div>
        )}
      </div>
    </Card>
  );
}
