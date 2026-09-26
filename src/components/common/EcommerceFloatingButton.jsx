import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store } from 'lucide-react';

const EcommerceFloatingButton = () => {
  const location = useLocation();

  // If already on /comercio page, keep it subtle
  const isComercio = location.pathname.startsWith('/comercio');

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 group animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link
        to="/comercio"
        className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-br dark:from-teal-400 dark:to-emerald-500 text-white dark:text-slate-950 shadow-lg shadow-[#0c4236]/25 dark:shadow-teal-500/25 transition-all duration-200 hover:scale-105 border border-emerald-400/40 shrink-0 ${
          isComercio ? 'ring-2 ring-emerald-500/40' : ''
        }`}
        title="Comercio & Servicios (E-Commerce)"
      >
        <Store className="w-5 h-5" />
        
        {/* Subtle pulsing indicator dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 dark:bg-teal-300 rounded-full animate-ping"></span>
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 dark:bg-teal-400 rounded-full border border-white dark:border-slate-900"></span>
      </Link>

      {/* Sleek, non-invasive hover label */}
      <Link
        to="/comercio"
        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto bg-white/95 dark:bg-[#131c1a]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#203330] shadow-xl text-xs flex items-center gap-1.5 whitespace-nowrap"
      >
        <span className="w-2 h-2 rounded-full bg-[#0c4236] dark:bg-teal-400"></span>
        <span className="font-extrabold text-slate-900 dark:text-slate-100">E-Commerce</span>
        <span className="text-[11px] font-bold text-[#0c4236] dark:text-teal-400">Urabá</span>
      </Link>
    </div>
  );
};

export default EcommerceFloatingButton;
