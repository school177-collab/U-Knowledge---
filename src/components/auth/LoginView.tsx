import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/LayoutComponents';
import { motion } from 'motion/react';
import { Search, Sparkles, BookOpen, Compass, Zap } from 'lucide-react';

export function LoginView() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden p-6 font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-50 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[3px] mb-12 shadow-sm">
          <Sparkles size={14} className="fill-brand-primary text-brand-primary" />
          The Future of Education
        </div>

        <div className="mb-8">
            <h1 className="text-7xl md:text-[140px] font-black text-slate-900 tracking-tighter leading-none mb-6">
                U KNOWLEDGE
            </h1>
            <div className="inline-block px-10 py-3 bg-brand-primary rounded-[20px] shadow-2xl shadow-brand-primary/30">
                <p className="text-xl md:text-3xl font-black text-white tracking-tight">
                    질문하는 학교 : Answer Own 則
                </p>
            </div>
        </div>
        
        <p className="text-slate-400 text-lg md:text-xl font-bold mb-16 max-w-2xl mx-auto leading-relaxed">
          학생의 호기심이 성장의 거름이 되는 곳,<br />
          유 노리지와 함께 질문의 즐거움을 발견하세요.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            variant="primary" 
            className="w-full sm:w-auto px-16 py-8 text-xl rounded-[32px] portal-shadow"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '연결 중...' : '구글 계정으로 시작하기'}
            <Zap size={24} className="ml-2" />
          </Button>
        </div>

        <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-slate-100 pt-12 opacity-40 group hover:opacity-100 transition-opacity">
            {[
              { icon: Search, label: '질문 탐구' },
              { icon: BookOpen, label: '데이터 아카이브' },
              { icon: Compass, label: '로컬 네트워크' },
              { icon: Sparkles, label: 'AI 피드백' }
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
                  <item.icon size={24} />
                </div>
                <span className="text-[11px] uppercase font-black tracking-widest text-slate-400">{item.label}</span>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
