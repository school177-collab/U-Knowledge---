import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, Button, Badge } from '../ui/LayoutComponents';
import { Search, User as UserIcon, Send, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

export function RecruitmentBoard() {
  const { profile } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'recruitment'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleApply = async () => {
    if (!reason.trim() || !profile) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'recruitment'), {
        userId: profile.uid,
        userName: profile.displayName,
        grade: profile.grade,
        class: profile.class,
        reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsApplying(false);
      setReason('');
      alert('신청이 완료되었습니다! 질문 탐정단의 활약을 기대해주세요.');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             <ShieldCheck className="text-indigo-600" size={32} /> 질문 탐정단 모집
          </h2>
          <p className="text-slate-400 font-bold mt-1">학교의 질문 문화를 수호하고 이끌어갈 학생 탐정단을 모집합니다.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsApplying(true)}
          className="rounded-2xl px-8 py-4"
        >
          신청하기 <Send size={18} className="ml-2" />
        </Button>
      </div>

      {isApplying && (
        <Card className="bg-indigo-50/50 border-indigo-200">
          <div className="flex justify-between items-start mb-6">
             <h3 className="text-xl font-black text-slate-800">탐정단 지원서 작성</h3>
             <button onClick={() => setIsApplying(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
          </div>
          <div className="space-y-6">
             <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                   <UserIcon size={20} className="text-slate-400" />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-800">{profile?.displayName}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">{profile?.grade}학년 {profile?.class}반</p>
                </div>
                <Badge variant="brand" className="ml-auto">지원자</Badge>
             </div>
             
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">지원 동기 및 각오</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="왜 질문 탐정단이 되고 싶으신가요? 여러분의 열정을 들려주세요!"
                  className="w-full h-40 bg-white border border-slate-200 rounded-2xl p-6 text-slate-800 font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
             </div>

             <Button 
               variant="primary" 
               className="w-full py-5 rounded-2xl text-lg font-black"
               onClick={handleApply}
               disabled={submitting || !reason.trim()}
             >
               {submitting ? '제출 중...' : '신청서 제출하기'}
             </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {applications.map((app) => (
           <Card key={app.id} className="relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs">
                    {app.grade}-{app.class}
                 </div>
                 <div>
                    <h4 className="font-black text-slate-800">{app.userName}</h4>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Applicant</p>
                 </div>
                 <Badge 
                   variant={app.status === 'pending' ? 'portal' : 'success'} 
                   className="ml-auto"
                 >
                   {app.status === 'pending' ? '심사중' : '승인됨'}
                 </Badge>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6 line-clamp-3">
                 {app.reason}
              </p>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                 <span className="text-[9px] font-bold text-slate-300 uppercase">Apply Date</span>
                 <span className="text-[9px] font-black text-slate-400">{app.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
              </div>
           </Card>
         ))}
         
         {applications.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
               <Search size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">신청 내역이 없습니다. 첫 번째 탐정이 되어보세요!</p>
            </div>
         )}
      </div>
    </div>
  );
}
