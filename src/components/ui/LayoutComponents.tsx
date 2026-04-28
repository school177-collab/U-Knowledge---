import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={cn(
      "bg-[#151619]/80 backdrop-blur-xl border border-[#00f2ff]/20 rounded-xl overflow-hidden shadow-2xl shadow-[#00f2ff]/5",
      className
    )}>
      {title && (
        <div className="px-4 py-3 border-bottom border-[#00f2ff]/10 flex items-center justify-between">
          <h3 className="text-[10px] font-mono uppercase tracking-[2px] text-[#00f2ff]/60">{title}</h3>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]/40" />
          </div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'neon' }) {
  const variants = {
    primary: "bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/30",
    secondary: "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10",
    ghost: "bg-transparent hover:bg-white/5 text-white/50",
    neon: "bg-[#00f2ff] text-black font-bold shadow-[0_0_15px_rgba(0,242,255,0.4)] hover:shadow-[0_0_25px_rgba(0,242,255,0.6)]"
  };

  return (
    <button 
      className={cn(
        "px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-white/60",
      className
    )}>
      {children}
    </span>
  );
}
