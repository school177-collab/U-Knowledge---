import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/auth/LoginView';
import { HomePortal } from './components/dashboard/HomePortal';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { Navbar } from './components/layout/Navbar';
import { FloatingAI } from './components/dashboard/FloatingAI';
import { motion, AnimatePresence } from 'motion/react';

type ViewMode = 'portal' | 'student' | 'teacher';

function MainApp() {
  const { user, loading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('portal');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-brand-primary rounded-xl"
        />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 selection:bg-brand-primary/10">
      <Navbar viewMode={viewMode} setViewMode={setViewMode} />
      
      <main className="max-w-[1440px] mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'portal' && <HomePortal />}
            {viewMode === 'student' && <StudentDashboard />}
            {viewMode === 'teacher' && <TeacherDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingAI />

      {/* Atmospheric backgrounds */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
         <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-50/50 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-50/50 blur-[120px]" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
