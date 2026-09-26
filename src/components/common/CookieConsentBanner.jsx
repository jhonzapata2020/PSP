import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('psp_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('psp_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('psp_cookie_consent', 'necessary_only');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="p-5 rounded-3xl bg-slate-900/95 dark:bg-psp-dark-card/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-white space-y-4">
        
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 flex-shrink-0">
            <Cookie className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Aviso de Cookies & Privacidad
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Utilizamos cookies necesarias y analíticas para optimizar tu experiencia en la plataforma. Puedes revisar nuestra{' '}
              <Link to="/politica-de-cookies" className="text-psp-cyan underline hover:text-white">
                Política de Cookies
              </Link>{' '}
              y{' '}
              <Link to="/politica-de-privacidad" className="text-psp-cyan underline hover:text-white">
                Política de Privacidad
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={acceptAll}
            className="flex-1 py-2 px-3 rounded-xl bg-psp-cyan text-slate-950 font-extrabold text-xs hover:bg-psp-cyan-hover transition-colors shadow-md text-center"
          >
            Aceptar Todas
          </button>
          <button
            onClick={acceptNecessary}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-colors"
          >
            Solo Necesarias
          </button>
        </div>

      </div>
    </div>
  );
};

export default CookieConsentBanner;
