import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, Badge } from '../ui/LayoutComponents';
import { Trophy, TrendingUp, Medal, Star } from 'lucide-react';
import { subscribeRankings } from '../../services/db';
import { cn } from '../../lib/utils';

export function RankingList({ title, limit = 5 }: { title?: string, limit?: number }) {
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    return subscribeRankings(setRankings);
  }, []);

  return (
    <Card title={title || "실시간 랭킹"}>
      <div className="space-y-6">
        {rankings.slice(0, limit).map((rank, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className={cn(
               "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all group-hover:scale-110",
               idx === 0 ? "bg-amber-100 text-amber-600 shadow-lg shadow-amber-200/50" : 
               idx === 1 ? "bg-slate-100 text-slate-500" :
               idx === 2 ? "bg-orange-50 text-orange-400" : "bg-slate-50 text-slate-300"
            )}>
               {idx === 0 ? <Trophy size={18} /> : idx + 1}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-800 truncate">{rank.authorName}</h4>
                  <Badge className="text-[8px] py-0 px-1 border-slate-100">{rank.authorGrade}-{rank.authorClass}</Badge>
               </div>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-brand-primary/40 rounded-full" 
                       style={{ width: `${Math.min(100, (rank.totalScore / (rankings[0]?.totalScore || 1)) * 100)}%` }}
                     />
                  </div>
               </div>
            </div>
            <div className="text-right">
               <span className="text-xs font-black text-brand-primary">{rank.totalScore}</span>
               <p className="text-[8px] font-bold text-slate-300 uppercase">Points</p>
            </div>
          </motion.div>
        ))}

        {rankings.length === 0 && (
           <div className="text-center py-10">
              <Star className="mx-auto text-slate-100 mb-2" size={32} />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No data yet</p>
           </div>
        )}
      </div>
    </Card>
  );
}
