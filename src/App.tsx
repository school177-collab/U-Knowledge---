import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/auth/LoginView';
import { QuestionBoard } from './components/dashboard/QuestionBoard';
import { Sidebar } from './components/dashboard/Sidebar';
import { Navbar } from './components/layout/Navbar';

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00f2ff]/20 border-t-[#00f2ff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white selection:bg-[#00f2ff]/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <QuestionBoard />
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
        </div>
      </main>

      {/* Atmospheric backgrounds for main app */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
         <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00f2ff]/5 blur-[100px]" />
         <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[100px]" />
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
