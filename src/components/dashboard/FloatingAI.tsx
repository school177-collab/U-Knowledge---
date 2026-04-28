import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, Send, X, Bot, Zap } from 'lucide-react';
import { getAIFeedback } from '../../services/gemini';
import { Button } from '../ui/LayoutComponents';
import { cn } from '../../lib/utils';

export function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '안녕하세요! 저는 여러분의 질문 멘토 U-Bot입니다. 무엇이든 물어보세요!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await getAIFeedback(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: '죄송해요, 잠시 문제가 발생했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[380px] bg-white rounded-[32px] portal-shadow border border-slate-100 overflow-hidden flex flex-col h-[520px]"
          >
             {/* Chat Header */}
             <div className="bg-brand-primary p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Bot size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-sm">U-Bot Chat</h4>
                      <div className="flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Online</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                   <X size={20} />
                </button>
             </div>

             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {messages.map((m, idx) => (
                  <div key={idx} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                     <div className={cn(
                       "max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed",
                       m.role === 'user' ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-700"
                     )}>
                        {m.text}
                     </div>
                  </div>
                ))}
                {loading && (
                   <div className="flex justify-start italic text-slate-400 text-xs">
                      답변을 생성 중입니다...
                   </div>
                )}
             </div>

             {/* Input Area */}
             <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <Button variant="primary" className="p-3 rounded-xl" onClick={handleSend}>
                   <Send size={18} />
                </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all",
          isOpen ? "bg-slate-900 text-white" : "bg-brand-primary text-white shadow-brand-primary/40"
        )}
      >
        {isOpen ? <X size={28} /> : <Zap size={28} className="fill-current" />}
      </motion.button>
    </div>
  );
}
