import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/LayoutComponents';
import { motion } from 'motion/react';
import { Search, Sparkles, Box, Compass } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#00f2ff]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full text-[#00f2ff] text-xs font-mono uppercase tracking-[2px] mb-8">
          <Sparkles size={14} />
          Tomorrow's Education
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
          U KNOWLEDGE
        </h1>
        <p className="text-2xl font-medium text-[#00f2ff] mb-8 tracking-tight">
          질문하는 학교 : Answer Own 則
        </p>
        
        <p className="text-white/40 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          학생, 교사, 학부모가 함께 참여하는 미래형 질문 생태계 플랫폼입니다. 
          당신의 궁금함이 배움의 시작이 되는 곳, 유 노리지와 함께하세요.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="neon" 
            className="w-full sm:w-auto px-12 py-6 text-lg rounded-2xl"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '연결 중...' : '구글 계정으로 시작하기'}
          </Button>
        </div>

        <div className="mt-24 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
            {[
              { icon: Search, label: '질문 탐구' },
              { icon: Box, label: '데이터 분석' },
              { icon: Compass, label: '성장 가이드' }
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/30">{item.label}</span>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
