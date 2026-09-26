import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0e1514] border-t border-slate-200 dark:border-[#203330] text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0c4236] dark:bg-gradient-to-br dark:from-teal-400 dark:to-emerald-600 flex items-center justify-center text-white dark:text-slate-950 font-black text-sm">
                PSP
              </div>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Plataforma Social Urabá</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Iniciativa de integración productiva y desarrollo armónico entre empresas, instituciones y comunidades de la región de Urabá y Colombia.
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-3">Plataforma</h5>
            <ul className="space-y-2 text-xs">
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/empresas-aliadas">Empresas Vinculadas</Link></li>
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/comercio">Directorio de Servicios</Link></li>
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/foro">Foro Ciudadano & Social</Link></li>
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/comercio">Mapa de Oportunidades 2026</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-3">Gobernanza & Alianzas</h5>
            <ul className="space-y-2 text-xs">
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/empresas-aliadas">Consejo Directivo Mixto</Link></li>
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/politica-de-privacidad">Criterios de Sostenibilidad</Link></li>
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/ayuda">Reportes de Transparencia</Link></li>
              <li><Link className="hover:text-[#0c4236] dark:hover:text-teal-300 transition" to="/empresas-aliadas">Puerto Antioquia: Avances</Link></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-3">Sede & Contacto</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
              Centro Regional de Conectividad Empresarial<br/>
              Apartadó, Urabá Antioqueño - Colombia
            </p>
            <a href="mailto:contacto@plataformasocialuraba.org" className="inline-block text-xs font-bold text-[#0c4236] dark:text-teal-400">
              contacto@plataformasocialuraba.org
            </a>
          </div>

        </div>

        {/* Bottom legal line */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-[#203330] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Plataforma Social con Propósito Urabá & Colombia.</p>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <a
              href="https://www.corplexsolutions.co/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold hover:text-psp-cyan transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Visitar sitio oficial del desarrollador"
            >
              <span>Desarrollado por</span>
              <span className="text-psp-cyan">CORPLEX SOLUTIONS S.A.S.</span>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link className="hover:text-slate-600 dark:hover:text-slate-300 transition" to="/terminos-y-condiciones">Términos de Uso</Link>
            <Link className="hover:text-slate-600 dark:hover:text-slate-300 transition" to="/politica-de-privacidad">Política de Datos</Link>
            <Link className="hover:text-slate-600 dark:hover:text-slate-300 transition" to="/politica-de-cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
