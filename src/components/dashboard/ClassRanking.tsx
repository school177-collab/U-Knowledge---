import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Card, Badge } from '../ui/LayoutComponents';
import { Users, TrendingUp, Award, ChevronRight } from 'lucide-react';
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
    <Card title="🏆 학급별 실시간 랭킹" subtitle="우리 반의 포인트가 쌓이면 특별한 혜택이!">
      <div className="p-6 space-y-6">
        {stats.slice(0, 6).map((stat, idx) => {
          const maxPoints = stats[0].points || 1;
          const percentage = (stat.points / maxPoints) * 100;
          
          return (
            <div key={`${stat.grade}-${stat.classNum}`} className="space-y-2 group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm border transition-all group-hover:scale-110",
                  idx === 0 ? "bg-amber-400 text-white border-amber-300 rotate-3" : 
                  idx === 1 ? "bg-slate-200 text-slate-600 border-slate-100 -rotate-3" : 
                  idx === 2 ? "bg-orange-300 text-white border-orange-200 rotate-2" : "bg-white text-slate-400 border-slate-100"
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">{stat.grade}학년 {stat.classNum}반</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Users size={10} className="inline mr-1" /> {stat.studentCount} Participants
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-brand-primary">{stat.points.toLocaleString()} XP</span>
                      {idx === 0 && <span className="block text-[8px] font-black text-amber-500 uppercase">🏆 Top Class</span>}
                    </div>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        idx === 0 ? "bg-gradient-to-r from-amber-400 to-orange-400" : 
                        idx === 1 ? "bg-slate-300" : 
                        idx === 2 ? "bg-orange-300" : "bg-indigo-400 opacity-60"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {stats.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-slate-50 rounded-3xl">
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={20} className="text-slate-200" />
             </div>
             <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">데이터 집계 중...</p>
          </div>
        )}

        <Button variant="secondary" className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary">
          View All Class Rankings <ChevronRight size={14} className="ml-1" />
        </Button>
      </div>
    </Card>
  );
}
