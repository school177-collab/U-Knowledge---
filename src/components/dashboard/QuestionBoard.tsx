import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Sparkles, Send, Tag, Plus, User as UserIcon } from 'lucide-react';
import { Question } from '../../types';
import { subscribeQuestions, createQuestion, likeQuestion } from '../../services/db';
import { getAIFeedback } from '../../services/gemini';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge } from '../ui/LayoutComponents';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '../../lib/utils';

const TAG_OPTIONS = ['Who', 'What', 'Where', 'When', 'Why', 'How'];

export function QuestionBoard() {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return subscribeQuestions(setQuestions);
  }, []);

  const handleSubmit = async () => {
    if (!newContent.trim() || !profile) return;
    setSubmitting(true);
    
    try {
      // 1. Get AI feedback first (optional, but requested as a feature)
      const feedback = await getAIFeedback(newContent);
      
      // 2. Create question in DB
      await createQuestion({
        content: newContent,
        authorId: profile.uid,
        authorName: profile.displayName,
        authorGrade: profile.grade,
        authorClass: profile.class,
        tags: selectedTags,
        category: '전체', // Default
        aiFeedback: feedback || ''
      });

      setNewContent('');
      setSelectedTags([]);
      setIsCreating(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">질문 광장</h2>
          <p className="text-white/40 text-sm">학생들이 만들어가는 지식의 생태계</p>
        </div>
        <Button 
          variant="neon" 
          onClick={() => setIsCreating(!isCreating)}
          className="rounded-full px-6"
        >
          {isCreating ? '닫기' : '질문하기'}
          <Plus className={cn("transition-transform duration-300", isCreating && "rotate-45")} size={18} />
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Card title="NEW QUESTION">
              <div className="space-y-4">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="당신의 궁금함을 들려주세요..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00f2ff]/50 min-h-[120px] transition-all"
                />
                
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                        selectedTags.includes(tag) 
                          ? "bg-[#00f2ff]/20 border-[#00f2ff] text-[#00f2ff]" 
                          : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    variant="neon" 
                    disabled={submitting || !newContent.trim()}
                    onClick={handleSubmit}
                  >
                    {submitting ? '제출 중...' : '발행하기'}
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {questions.map((q, idx) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="hover:border-[#00f2ff]/40 transition-colors group">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00f2ff]/10 flex items-center justify-center border border-[#00f2ff]/20">
                      <UserIcon className="text-[#00f2ff]" size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{q.authorName}</span>
                        {q.authorGrade && (
                          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-white/40">
                            {q.authorGrade}학년 {q.authorClass}반
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/30 truncate">
                        {q.createdAt?.seconds ? formatDistanceToNow(q.createdAt.toDate(), { addSuffix: true, locale: ko }) : '방금 전'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {q.tags.map(tag => (
                      <Badge key={tag} className="border-[#00f2ff]/30 text-[#00f2ff]/80">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <p className="text-white/80 leading-relaxed text-lg">
                  {q.content}
                </p>

                {q.aiFeedback && (
                  <div className="bg-[#00f2ff]/5 border border-[#00f2ff]/10 rounded-lg p-3 text-[11px] text-[#00f2ff]/80 italic overflow-hidden relative">
                    <Sparkles size={12} className="absolute top-2 right-2 opacity-50" />
                    <div className="line-clamp-2">{q.aiFeedback}</div>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                  <button 
                    onClick={() => likeQuestion(q.id)}
                    className="flex items-center gap-1.5 text-white/40 hover:text-[#00f2ff] transition-colors text-xs"
                  >
                    <Heart size={14} className={q.likesCount > 0 ? "fill-[#00f2ff]/20 text-[#00f2ff]" : ""} />
                    <span>좋아요 {q.likesCount}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-white/40 hover:text-[#00f2ff] transition-colors text-xs">
                    <MessageSquare size={14} />
                    <span>댓글 {q.commentsCount}</span>
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
