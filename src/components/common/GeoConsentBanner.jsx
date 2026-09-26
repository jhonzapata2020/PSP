import React from 'react';
import { MapPin, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GeoConsentBanner = () => {
  const { showGeoBanner, dismissGeoBanner } = useAuth();

  if (!showGeoBanner) return null;

  return (
    <div className="bg-gradient-to-r from-psp-teal-dark via-psp-dark-card to-slate-900 border-b border-psp-cyan/20 px-4 py-3 text-white text-xs sm:text-sm animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-psp-cyan/20 text-psp-cyan flex-shrink-0">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="font-bold text-psp-cyan mr-1.5">Impacto Subregional:</span>
            <span>Conectando Urabá & Colombia. ¿Permitir ubicación para ver ofertas en Apartadó, Turbo, Necoclí, Carepa y Chigorodó?</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => dismissGeoBanner(true)}
            className="px-3 py-1.5 rounded-lg bg-psp-cyan text-slate-950 font-extrabold hover:bg-psp-cyan-hover transition-colors shadow-md text-xs"
          >
            Permitir Ubicación
          </button>
          <button
            onClick={() => dismissGeoBanner(false)}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors text-xs"
          >
            Ocultar por ahora
          </button>
          <button
            onClick={() => dismissGeoBanner(true)}
            className="text-slate-400 hover:text-white p-1"
            title="Ocultar hasta la próxima visita"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeoConsentBanner;
