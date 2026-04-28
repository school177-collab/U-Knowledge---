import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, title, subtitle }: { children: React.ReactNode; className?: string; title?: string; subtitle?: string }) {
  return (
    <div className={cn(
      "bg-white border border-slate-200 rounded-3xl overflow-hidden portal-shadow",
      className
    )}>
      {title && (
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
          </div>
        </div>
      )}
      <div className="p-6">
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
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'neon' | 'portal' }) {
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    ghost: "bg-transparent hover:bg-slate-50 text-slate-400 font-bold",
    neon: "bg-brand-secondary text-white font-black hover:bg-brand-secondary/90 shadow-lg shadow-brand-secondary/20",
    portal: "bg-white text-brand-primary font-black hover:bg-slate-50 transition-all border border-slate-200"
  };

  return (
    <button 
      className={cn(
        "px-5 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'brand' | 'success' }) {
  const variants = {
    default: "bg-slate-100 text-slate-500",
    brand: "bg-indigo-50 text-brand-primary border-indigo-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };
  
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
