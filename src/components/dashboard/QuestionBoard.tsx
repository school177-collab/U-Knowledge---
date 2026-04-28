import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Sparkles, Send, Tag, Plus, User as UserIcon, X, ChevronDown, Trophy, Filter } from 'lucide-react';
import { Question, Comment } from '../../types';
import { subscribeQuestions, createQuestion, likeQuestion, addComment, subscribeComments } from '../../services/db';
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
  
  // Selection fields for the new requirement
  const [grade, setGrade] = useState(profile?.grade || 1);
  const [classNum, setClassNum] = useState(profile?.class || 1);
  const [studentNum, setStudentNum] = useState(profile?.number || 1);
  const [name, setName] = useState(profile?.displayName || '');

  useEffect(() => {
    return subscribeQuestions(setQuestions);
  }, []);

  const handleSubmit = async () => {
    if (!newContent.trim()) return;
    setSubmitting(true);
    
    try {
      const feedback = await getAIFeedback(newContent);
      
      await createQuestion({
        content: newContent,
        authorId: profile?.uid || 'anonymous',
        authorName: name || '익명 학생',
        authorGrade: grade,
        authorClass: classNum,
        tags: selectedTags,
        category: '전체',
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

  return (
    <div className="space-y-10">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             질문 광장
             <div className="flex items-center gap-1 px-3 py-1 bg-brand-primary/10 rounded-full">
                <Activity size={14} className="text-brand-primary" />
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Live Feed</span>
             </div>
          </h2>
          <p className="text-slate-400 font-bold mt-1">학생들이 만들어가는 지식의 생태계 - 총 {questions.length}개의 질문</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsCreating(!isCreating)}
          className="rounded-2xl px-8 py-4 shadow-xl shadow-brand-primary/20"
        >
          {isCreating ? '닫기' : '새 질문 작성하기'}
          <Plus className={cn("transition-transform duration-300", isCreating && "rotate-45")} size={20} />
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
          >
            <Card className="border-brand-primary/20 bg-indigo-50/30">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {/* Selectors */}
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade</label>
                     <select 
                       value={grade}
                       onChange={(e) => setGrade(Number(e.target.value))}
                       className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20"
                     >
                       {[1,2,3].map(g => <option key={g} value={g}>{g}학년</option>)}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
                     <select 
                       value={classNum}
                       onChange={(e) => setClassNum(Number(e.target.value))}
                       className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20"
                     >
                       {[1,2,3,4,5,6,7,8,9].map(c => <option key={c} value={c}>{c}반</option>)}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No.</label>
                     <input 
                       type="number"
                       value={studentNum}
                       onChange={(e) => setStudentNum(Number(e.target.value))}
                       className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20"
                       min="1"
                       max="40"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                     <input 
                       type="text"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="이름 입력"
                       className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20"
                     />
                  </div>
               </div>

              <div className="space-y-6">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="당신의 궁금함을 들려주세요..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-brand-primary/5 min-h-[160px] transition-all text-xl placeholder:text-slate-300"
                />
                
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 mr-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                     <Tag size={14} /> 5W1H tags:
                  </div>
                  {TAG_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-xs font-black border transition-all",
                        selectedTags.includes(tag) 
                          ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                          : "bg-white border-slate-200 text-slate-400 hover:border-brand-primary/30"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    variant="primary" 
                    disabled={submitting || !newContent.trim()}
                    onClick={handleSubmit}
                    className="px-10 py-5 rounded-2xl text-lg"
                  >
                    {submitting ? '제출 중...' : '발행하기'}
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8">
        {questions.map((q, idx) => (
          <QuestionCard key={q.id} question={q} index={idx} />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ question, index }: { question: Question; index: number }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (showComments) {
      return subscribeComments(question.id, setComments);
    }
  }, [showComments, question.id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !profile) return;
    setIsSubmitting(true);
    try {
      await addComment(question.id, profile.uid, profile.displayName, newComment);
      setNewComment('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:border-brand-primary/20 transition-all group overflow-visible relative">
        {/* Author Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-50 pb-6">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden shrink-0">
                <UserIcon className="text-slate-400" size={20} />
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <h4 className="font-black text-slate-800">{question.authorName}</h4>
                   <Badge variant="brand" className="text-[9px]">
                      {question.authorGrade}학년 {question.authorClass}반
                   </Badge>
                </div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">
                   {question.createdAt?.seconds ? formatDistanceToNow(question.createdAt.toDate(), { addSuffix: true, locale: ko }) : '방금 전'}
                </p>
             </div>
           </div>
           
           <div className="flex flex-wrap gap-2">
              {question.tags.map(tag => (
                <Badge key={tag} className="border-brand-primary/20 text-brand-primary/70">{tag}</Badge>
              ))}
           </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-slate-800 leading-relaxed">
             {question.content}
           </h3>

           {question.aiFeedback && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-brand-primary/[0.03] border-l-4 border-brand-primary rounded-r-2xl p-6 text-sm text-slate-600 relative overflow-hidden"
             >
               <Sparkles size={20} className="text-brand-primary absolute top-4 right-4 opacity-10" />
               <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-primary flex items-center justify-center">
                     <Sparkles size={12} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">AI Mentor U-Bot</span>
               </div>
               <div className="whitespace-pre-wrap leading-relaxed font-medium">
                  {question.aiFeedback}
               </div>
             </motion.div>
           )}

           {/* Actions */}
           <div className="flex items-center gap-8 pt-2">
             <button 
               onClick={() => likeQuestion(question.id)}
               className="flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-all text-xs font-black group"
             >
               <div className={cn(
                 "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                 question.likesCount > 0 ? "bg-red-50 text-red-500" : "bg-slate-50 group-hover:bg-brand-primary/5 group-hover:text-brand-primary"
               )}>
                 <Heart size={16} className={question.likesCount > 0 ? "fill-current" : ""} />
               </div>
               <span>좋아요 {question.likesCount}</span>
             </button>
             
             <button 
               onClick={() => setShowComments(!showComments)}
               className="flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-all text-xs font-black group"
             >
               <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-brand-primary/5 group-hover:text-brand-primary flex items-center justify-center transition-all">
                 <MessageSquare size={16} />
               </div>
               <span>댓글 {question.commentsCount}</span>
             </button>
           </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
           {showComments && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="mt-8 pt-8 border-t border-slate-50 space-y-6"
             >
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                   {comments.map((c) => (
                     <div key={c.id} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                        <div className="flex-1 bg-slate-50 rounded-2xl p-4">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-black text-slate-800">{c.authorName}</span>
                              <span className="text-[9px] text-slate-300 font-bold">
                                {c.createdAt?.seconds ? formatDistanceToNow(c.createdAt.toDate(), { locale: ko }) : '방금 전'}
                              </span>
                           </div>
                           <p className="text-sm text-slate-600 font-medium leading-relaxed">{c.content}</p>
                        </div>
                     </div>
                   ))}
                   {comments.length === 0 && (
                     <div className="text-center py-8 text-slate-300 text-xs font-bold uppercase tracking-widest">첫 번째 댓글을 달아보세요</div>
                   )}
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                   <input 
                     type="text"
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     placeholder="의견을 남겨주세요..."
                     className="flex-1 bg-transparent border-none text-sm px-4 focus:ring-0 font-medium"
                     onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                   />
                   <Button 
                     variant="primary" 
                     className="rounded-xl px-4 py-2"
                     onClick={handleAddComment}
                     disabled={isSubmitting || !newComment.trim()}
                   >
                     <Send size={16} />
                   </Button>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Missing icon used in QuestionBoard
function Activity({ size, className }: { size?: number, className?: string }) {
   return (
     <svg 
       width={size} 
       height={size} 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="currentColor" 
       strokeWidth="2" 
       strokeLinecap="round" 
       strokeLinejoin="round" 
       className={className}
     >
       <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
     </svg>
   );
}
