import React from 'react';
import { Lock, ShieldCheck, FileText, CheckCircle2, UserCheck, Eye } from 'lucide-react';

const PoliticaPrivacidadPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Protección de Datos • Ley 1581 de 2012 (Colombia)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Política de Privacidad & Tratamiento de Datos
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Cumplimiento normativo de Habeas Data y protección de la información personal en la Plataforma Social con Propósito (PSP).
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        {/* Intro Habeas Data */}
        <section id="habeas-data" className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-extrabold text-emerald-400 flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Aviso de Tratamiento de Datos Personales (Habeas Data Colombia)
          </h2>
          <p className="text-slate-300">
            En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto Reglamentario 1377 de 2013 de la República de Colombia, la <strong>Plataforma Social con Propósito (PSP)</strong> informa a sus usuarios que la información personal proporcionada será tratada de manera confidencial, transparente y segura.
          </p>
        </section>

        {/* Section 1: Data Collected */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Datos Personales que Recopilamos</h2>
          <p>Para la prestación de los servicios recopilamos los siguientes datos según la modalidad de registro:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-psp-cyan mb-1">Persona Natural</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                <li>Nombre completo</li>
                <li>Tipo y número de documento (CC/CE/PAS)</li>
                <li>Correo electrónico</li>
                <li>Teléfono de contacto</li>
                <li>Municipio de residencia en Urabá / Colombia</li>
                <li>Foto de perfil elegida</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-psp-cyan mb-1">Persona Jurídica / Empresa</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                <li>Razón social y Nombre comercial</li>
                <li>Número de Identificación Tributaria (NIT)</li>
                <li>Nombre del Representante Legal</li>
                <li>Correo empresarial y Teléfono</li>
                <li>Sector productivo y ubicación geográfica</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Purpose */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Finalidad del Tratamiento de Datos</h2>
          <p>Los datos suministrados serán utilizados exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>Creación y administración de la cuenta de usuario en PSP.</li>
            <li>Publicación de productos y servicios en el Directorio Comercial y perfil público de la plataforma.</li>
            <li>Facilitar el contacto entre compradores, proveedores y cooperativas de transporte en Urabá.</li>
            <li>Gestión de propuestas e interacciones dentro del Foro Social.</li>
            <li>Envío de notificaciones operativas, actualizaciones de servicios y convocatorias agroindustriales.</li>
          </ul>
        </section>

        {/* Section 3: Data Protection & Retention */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Protección, Conservación y Compartición de Datos</h2>
          <p>
            PSP aplica medidas de seguridad técnicas y organizativas para impedir la alteración, pérdida, consulta o acceso no autorizado a sus datos.
          </p>
          <p>
            <strong>No vendemos ni comercializamos tus datos personales a terceros.</strong> La información de contacto comercial (como teléfono de la empresa o correo de contacto) solo se visibilizará públicamente si el usuario decide publicar un producto o servicio en el directorio.
          </p>
          <p>
            Los datos se conservarán durante el tiempo que la cuenta permanezca activa o mientras sea necesario para cumplir las obligaciones legales aplicables en Colombia.
          </p>
        </section>

        {/* Section 4: ARCO Rights */}
        <section className="space-y-3 bg-white dark:bg-psp-dark-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Derechos del Titular (Derechos ARCO)</h2>
          <p>Como titular de los datos personales, tienes derecho a:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Conocer, actualizar y rectificar</strong> tus datos personales frente a PSP.</li>
            <li><strong>Solicitar prueba</strong> de la autorización otorgada para el tratamiento de tus datos.</li>
            <li><strong>Revocar la autorización</strong> o solicitar la supresión de los datos cuando no se respeten los principios constitucionales.</li>
            <li><strong>Acceder gratuitamente</strong> a tus datos personales que hayan sido objeto de tratamiento.</li>
          </ul>
          <p className="pt-2 text-xs font-semibold text-psp-cyan">
            Para ejercer estos derechos, puedes escribir a nuestro correo de Protección de Datos: <a href="mailto:privacidad@plataformasocial.co" className="underline">privacidad@plataformasocial.co</a>.
          </p>
        </section>

      </div>

    </div>
  );
};

export default PoliticaPrivacidadPage;
