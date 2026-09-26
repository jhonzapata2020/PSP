import React from 'react';
import { ShieldCheck, FileText, Lock, AlertCircle, CheckCircle2, Scale } from 'lucide-react';

const TerminosCondicionesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-psp-cyan/15 text-psp-cyan text-xs font-bold">
          <Scale className="w-3.5 h-3.5" />
          Marco Legal & Términos del Servicio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Última actualización: 25 de septiembre de 2026. Plataforma Social con Propósito (PSP) — Urabá, Colombia.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-psp-cyan/20 text-psp-cyan flex items-center justify-center text-xs">1</span>
            Qué ofrece la aplicación
          </h2>
          <p>
            La <strong>Plataforma Social con Propósito (PSP)</strong> es una plataforma digital de articulación socioeconómica diseñada para conectar empresas público-privadas, emprendedores, productores agroindustriales, transportadores y ciudadanos de la región de Urabá y Colombia.
          </p>
          <p>
            Ofrecemos visibilización de empresas aliadas, directorio comercial de productos y servicios locales, sistema de consulta de transporte subregional y espacios de diálogo e intercambio comunitarios en el Foro Social.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-psp-cyan/20 text-psp-cyan flex items-center justify-center text-xs">2</span>
            Derechos y Responsabilidades del Usuario
          </h2>
          <p>
            Al registrarse y utilizar la plataforma, el usuario se compromete a:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>Suministrar información veraz y actualizada (Nombre completo, Documento de Identidad o NIT de Empresa).</li>
            <li>Usar la plataforma exclusivamente para fines lícitos, de emprendimiento, comerciales o de desarrollo comunitario.</li>
            <li>No publicar contenidos difamatorios, ofensivos, racistas, engañosos o que vulneren los derechos de propiedad de terceros en el Foro Social o directorio.</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso (correo y contraseña).</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-psp-cyan/20 text-psp-cyan flex items-center justify-center text-xs">3</span>
            Propiedad Intelectual
          </h2>
          <p>
            Todos los logotipos, diseños, isotipos, marcas registradas, código fuente y contenidos estructurados en la **Plataforma Social con Propósito** son propiedad exclusiva de PSP o se utilizan bajo licencia. Queda prohibida la reproducción total o parcial sin autorización previa y por escrito.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-psp-cyan/20 text-psp-cyan flex items-center justify-center text-xs">4</span>
            Limitaciones del Servicio y Responsabilidades
          </h2>
          <p>
            PSP actúa como un canal de conexión entre compradores, proveedores y la comunidad. No asumimos responsabilidad directa por las transacciones comerciales, acuerdos de entrega de productos o calidad de servicios pactados entre partes independientes en el directorio comercial o de transporte.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-psp-cyan/20 text-psp-cyan flex items-center justify-center text-xs">5</span>
            Condiciones para Cancelación de Cuentas y Modificaciones
          </h2>
          <p>
            El usuario puede solicitar la eliminación de su cuenta en cualquier momento a través del centro de ayuda. Nos reservamos el derecho de suspender o cancelar cuentas que incumplan las normas comunitarias o realicen publicaciones fraudulentas.
          </p>
          <p>
            Cualquier modificación a estos términos será notificada mediante la plataforma y estará disponible en este mismo apartado.
          </p>
        </section>

      </div>

    </div>
  );
};

export default TerminosCondicionesPage;
