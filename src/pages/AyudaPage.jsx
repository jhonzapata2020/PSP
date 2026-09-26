import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, Send } from 'lucide-react';

const AyudaPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      q: '¿Qué es la Plataforma Social con Propósito (PSP)?',
      a: 'Es una red colaborativa digital que conecta empresas público-privadas, emprendimientos, gremios agroindustriales y la sociedad civil en Urabá y Colombia para impulsar proyectos de impacto social, empleo e intercambio comercial.'
    },
    {
      q: '¿Cómo puede mi empresa registrarse como Aliada?',
      a: 'Puedes crear una cuenta seleccionando "Persona Jurídica / Empresa" con tu NIT en el módulo de Registro, y luego enviar la solicitud de certificación en la sección de Empresas Aliadas.'
    },
    {
      q: '¿Qué servicios puedo encontrar en el Directorio Comercial?',
      a: 'Encontrarás productos agrícolas locales (banano, plátano, café, miel), artesanías, logística de transporte terrestre y marítimo hacia Puerto Antioquia, servicios de catering, hoteles y rutas ecológicas.'
    },
    {
      q: '¿El uso del Foro Social y el registro tiene algún costo?',
      a: 'No, el acceso a la plataforma, la participación en el foro comunitario y la consulta del directorio son 100% gratuitos para los habitantes y emprendedores de Urabá.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-psp-cyan/15 text-psp-cyan text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          Centro de Soporte & Orientación
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          ¿En qué podemos ayudarte?
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Encuentra respuestas rápidas o contáctate directamente con el equipo de soporte técnico de PSP Urabá.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Preguntas Frecuentes</h2>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-psp-soft"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-psp-cyan transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180 text-psp-cyan' : 'text-slate-400'}`} />
            </button>

            {openFaq === idx && (
              <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="p-8 rounded-3xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Envíanos un Mensaje Directo</h2>
        
        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-500/15 text-emerald-400 text-center font-bold text-sm">
            ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo en breve.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                <input required type="text" placeholder="Ej. Carlos Mendoza" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                <input required type="email" placeholder="carlos@ejemplo.com" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mensaje o Consulta</label>
              <textarea required rows={4} placeholder="Escribe aquí los detalles de tu requerimiento o consulta..." className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
            </div>

            <button type="submit" className="px-6 py-3 rounded-xl bg-psp-cyan text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:bg-psp-cyan-hover transition-colors shadow-md">
              <Send className="w-4 h-4" /> Enviar Mensaje
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default AyudaPage;
