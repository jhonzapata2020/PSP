import React from 'react';
import { Cookie, ShieldCheck, CheckCircle2, Settings } from 'lucide-react';

const PoliticaCookiesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold">
          <Cookie className="w-3.5 h-3.5" />
          Uso de Tecnologías de Almacenamiento
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Política de Cookies & Almacenamiento Local
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Explicación detallada sobre cómo la Plataforma Social con Propósito (PSP) utiliza cookies y almacenamiento local (`localStorage`) para mejorar tu experiencia.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. ¿Qué son las Cookies y el Almacenamiento Local?</h2>
          <p>
            Las cookies y el almacenamiento local (HTML5 `localStorage`) son pequeños archivos o fragmentos de datos que se guardan de forma segura en tu navegador cuando visitas nuestra plataforma.
          </p>
        </section>

        <section className="space-y-4 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Tipos de Cookies y Tecnologías Utilizadas</h2>
          
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4" /> Cookies Técnicas y Necesarias (Obligatorias)
              </h4>
              <p className="text-xs text-slate-400">
                Permiten la navegación fluida, mantener la sesión iniciada del usuario, gestionar los productos dentro del Carrito de Compras y la persistencia de preferencias de seguridad.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-psp-cyan flex items-center gap-2 mb-1">
                <Settings className="w-4 h-4" /> Cookies de Preferencia y Personalización
              </h4>
              <p className="text-xs text-slate-400">
                Almacenan tu preferencia de **Modo Claro / Modo Oscuro** (`psp_theme`) y tu consentimiento sobre la geolocalización regional en Urabá (`psp_hide_geo`).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-1">
                <Cookie className="w-4 h-4" /> Cookies Analíticas y de Rendimiento
              </h4>
              <p className="text-xs text-slate-400">
                Miden de forma anónima el tráfico de la web, las secciones más visitadas (Ej. Puerto Antioquia o Foro Social) para optimizar el rendimiento del servidor.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. ¿Cómo configurar o eliminar tus cookies?</h2>
          <p>
            Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador web (Chrome, Firefox, Safari, Edge).
          </p>
        </section>

      </div>

    </div>
  );
};

export default PoliticaCookiesPage;
