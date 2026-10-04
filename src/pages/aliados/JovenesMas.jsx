import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MapPin, 
  Sparkles, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Heart, 
  ExternalLink,
  ShieldCheck,
  Star,
  Zap,
  Calendar,
  X,
  Maximize2
} from 'lucide-react';

const JovenesMas = () => {
  const [activeTab, setActiveTab] = useState('identidad');
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const galleryImages = [
    {
      src: '/aliados/jovenes-mas/semana-juventud.jpg',
      title: 'Semana de la Juventud - Desafío Joven',
      subtitle: 'Encuentro masivo de integración, liderazgo y deporte en Turbo, Urabá.'
    },
    {
      src: '/aliados/jovenes-mas/banner-10anios.png',
      title: 'Celebración 10 Años - El Legado Continúa',
      subtitle: 'Una década construyendo oportunidades y tejido social con la juventud.'
    },
    {
      src: '/aliados/jovenes-mas/mi-sangre.png',
      title: 'Formación Líderes de Cambio - Fundación Mi Sangre',
      subtitle: 'Alianza estratégica para la paz, convivencia y liderazgo comunitario.'
    },
    {
      src: '/aliados/jovenes-mas/janier-lloreda.png',
      title: 'Janier Lloreda - Fundador & Director',
      subtitle: 'Compromiso directo con la transformación social de Urabá.'
    }
  ];

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-300">
      
      {/* TOP HEADER / BAR */}
      <header className="shrink-0 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link 
            to="/empresas-aliadas"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-sky-400" />
            <span>Volver a Entidades Afiliadas</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Organización Aliada Verificada</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:jovenesmasorg@gmail.com"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Contactar a Jóvenes+</span>
            <span className="sm:hidden">Contacto</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION / ENTITY IDENTIFIER */}
      <div className="shrink-0 bg-gradient-to-r from-slate-950 via-slate-900 to-[#0b1728] border-b border-slate-800/80 px-4 sm:px-8 py-5 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-5 relative z-10">
          
          {/* Interactive Logo Container */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-yellow-400/80 p-1.5 bg-slate-900 shadow-xl shadow-sky-500/20 hover:shadow-yellow-400/30 hover:scale-110 hover:rotate-3 transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden">
              <img 
                src="/aliados/jovenes-mas/logo.png" 
                alt="Jóvenes+ Organización" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 bg-yellow-400 text-slate-950 rounded-full text-[10px] font-extrabold shadow-md">
              <Star className="w-3.5 h-3.5 fill-slate-950" />
            </span>
          </div>

          {/* Main Info */}
          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Jóvenes+ Organización
              </h1>
              
              {/* Insignia #10Años */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-xs font-black shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
                #10Años El Legado Continúa
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Plataforma social de empoderamiento, formación en liderazgo y transformación comunitaria para la juventud de Turbo y toda la subregión de Urabá.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Turbo, Urabá, Antioquia
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Red Social & Empresarial PSP
              </span>
              <span className="flex items-center gap-1.5 text-yellow-300 font-semibold">
                <Heart className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/30" /> Receptor del Fondo Social PSP
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* DYNAMIC TABS BAR */}
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2">
          
          <button
            onClick={() => setActiveTab('identidad')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'identidad'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Identidad & Legado</span>
          </button>

          <button
            onClick={() => setActiveTab('programas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'programas'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Programas Bandera</span>
          </button>

          <button
            onClick={() => setActiveTab('incidencia')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'incidencia'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Incidencia & Logros</span>
          </button>

          <button
            onClick={() => setActiveTab('galeria')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'galeria'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Galería en Territorio</span>
          </button>

        </div>
      </div>

      {/* CONTENT VIEW AREA (SCROLLABLE INSIDE FIXED SCREEN) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 sm:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          
          {/* TAB 1: IDENTIDAD & LEGADO */}
          {activeTab === 'identidad' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Banner 10 Años Feature Card */}
              <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0e1d33] p-6 sm:p-8 border border-yellow-400/30 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-black border border-yellow-400/30">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      Hito Histórico 2016 - 2026
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                      #10Años El Legado Continúa
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Durante una década, <strong>Jóvenes+ Organización</strong> ha sido el motor de liderazgo social, deportivo y ciudadano para miles de jóvenes en el municipio de Turbo y la subregión de Urabá. Un proceso continuo de construcción comunitaria y generación de oportunidades reales.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-yellow-300 font-bold">
                      <span className="px-3 py-1 rounded-xl bg-yellow-400/10 border border-yellow-400/20">+10 Años de Impacto</span>
                      <span className="px-3 py-1 rounded-xl bg-yellow-400/10 border border-yellow-400/20">Liderazgo Comunitario</span>
                      <span className="px-3 py-1 rounded-xl bg-yellow-400/10 border border-yellow-400/20">Deporte & Paz</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative group">
                    <div 
                      onClick={() => setSelectedImageModal(galleryImages[1])}
                      className="rounded-2xl overflow-hidden border border-yellow-400/40 shadow-xl cursor-pointer hover:scale-[1.02] transition-transform relative"
                    >
                      <img 
                        src="/aliados/jovenes-mas/banner-10anios.png" 
                        alt="10 Años El Legado Continúa" 
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs text-yellow-300 font-bold flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" /> Ampliar gráfica oficial
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Misión y Visión Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-sky-500/30 space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">Misión Institucional</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Impulsar el empoderamiento juvenil, la formación en valores, el acceso a oportunidades formativas y laborales, y la sana convivencia mediante proyectos deportivos, culturales y de debate ciudadano en Turbo y Urabá.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">Enfoque Subregional</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Consolidar una red sólida de jóvenes líderes capaces de incidir en las políticas públicas, la educación superior y el desarrollo socioeconómico de la subregión, articulando con el ecosistema de empresas e instituciones aliadas de PSP.
                  </p>
                </div>

              </div>

              {/* Founder Profile - Janier Lloreda */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                  <Users className="w-4 h-4" /> Liderazgo & Fundador
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div 
                    onClick={() => setSelectedImageModal(galleryImages[3])}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-sky-500/50 shadow-lg shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img 
                      src="/aliados/jovenes-mas/janier-lloreda.png" 
                      alt="Janier Lloreda" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 text-center md:text-left">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">Janier Lloreda</h3>
                      <p className="text-xs font-bold text-sky-400">Fundador & Director de Jóvenes+ Organización</p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Líder social y comunitario de la subregión de Urabá, referente en procesos de participación juvenil, prevención social a través del deporte y gestor de alianzas estratégicas para la educación de las nuevas generaciones en Turbo.
                    </p>
                    <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold">
                        Gestor Social
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold">
                        Promotor Deportivo
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold">
                        Líder Juvenil Urabá
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROGRAMAS BANDERA */}
          {activeTab === 'programas' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Programas Bandera</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Iniciativas permanentes diseñadas para potenciar el talento, la educación y el bienestar de los jóvenes de Urabá.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Program 1 */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                      <GraduationCap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 font-extrabold text-[11px] border border-sky-500/20">
                      Educación Superior
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white group-hover:text-sky-400 transition-colors">
                      Jóvenes en la U
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Programa de orientación vocacional, preparación académica y acompañamiento técnico para gestionar el acceso a becas y cupos universitarios para egresados de colegios públicos de Turbo y sectores rurales.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>• Becas & Orientación Vocacional</span>
                    <span className="text-sky-400 font-bold">Activo 2026</span>
                  </div>
                </div>

                {/* Program 2 */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Briefcase className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/20">
                      Inserción Laboral
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                      Empleabilidad & Talento
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Talleres prácticos de elaboración de hoja de vida, preparación de entrevistas laborales, desarrollo de competencias blandas y articulación directa con las empresas aliadas de la red PSP Urabá.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>• Habilidades Blandas & Empleo</span>
                    <span className="text-emerald-400 font-bold">Red PSP</span>
                  </div>
                </div>

                {/* Program 3 */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-yellow-500/50 transition-all space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
                      <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 font-extrabold text-[11px] border border-yellow-500/20">
                      Deporte & Convivencia
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors">
                      Muévete con Jóvenes+
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Torneos nocturnos comunitarios de voleibol y fútbol de salón en barrios vulnerables de Turbo, aprovechamiento del tiempo libre y construcción de entornos seguros para la juventud.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>• Torneos Nocturnos Voleibol</span>
                    <span className="text-yellow-400 font-bold">Turbo Comunal</span>
                  </div>
                </div>

                {/* Program 4 */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 font-extrabold text-[11px] border border-purple-500/20">
                      Participación Democrática
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">
                      Debates Ciudadanos & Juventud
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Espacios de concertación, foros comunales y asambleas juveniles para formular propuestas al plan de desarrollo municipal y promover el liderazgo político y social responsable.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>• Incidencia Comunitaria</span>
                    <span className="text-purple-400 font-bold">Control Social</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: INCIDENCIA & LOGROS */}
          {activeTab === 'incidencia' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Formative Alliance Fundación Mi Sangre Feature Card */}
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#19152b] p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden space-y-6">
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-500/30">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      Alianza Estratégica Formativa
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      Líderes de Cambio - Fundación Mi Sangre
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      En convenio formativo con la <strong>Fundación Mi Sangre</strong>, Jóvenes+ Organización ha impulsado semilleros de transformación social, cultura de paz y desarrollo de capacidades creativas en los jóvenes de Turbo.
                    </p>
                  </div>

                  <div 
                    onClick={() => setSelectedImageModal(galleryImages[2])}
                    className="w-full lg:w-72 h-44 rounded-2xl overflow-hidden border border-purple-500/40 shadow-xl shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img 
                      src="/aliados/jovenes-mas/mi-sangre.png" 
                      alt="Líderes de Cambio Fundación Mi Sangre" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Featured Youth Leaders List */}
                <div className="pt-4 border-t border-purple-500/20 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider">
                    Líderes de Cambio Destacados (Proceso Mi Sangre):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                      <p className="text-xs font-bold text-white">Aldin David Perea</p>
                      <span className="text-[10px] text-purple-300">Líder Juvenil</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                      <p className="text-xs font-bold text-white">Karen Mena</p>
                      <span className="text-[10px] text-purple-300">Líder de Cambio</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                      <p className="text-xs font-bold text-white">Jana Romaña</p>
                      <span className="text-[10px] text-purple-300">Formadora Social</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                      <p className="text-xs font-bold text-white">Jhon Eric Mena</p>
                      <span className="text-[10px] text-purple-300">Gestor Deportivo</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="p-6 rounded-2xl bg-slate-900 border border-sky-500/30 text-center space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-sky-400">+5.3K</div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Seguidores & Comunidad</h4>
                  <p className="text-[11px] text-slate-400">Jóvenes conectados en redes sociales y procesos comunitarios de Turbo.</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-yellow-500/30 text-center space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-yellow-400">100%</div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Respaldo Social</h4>
                  <p className="text-[11px] text-slate-400">Reconocimiento e impacto comprobado en los barrios de la subregión.</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">10+ Años</div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Trayectoria Ininterrumpida</h4>
                  <p className="text-[11px] text-slate-400">Construyendo tejido social y liderazgo continuo desde 2016.</p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: GALERÍA EN TERRITORIO */}
          {activeTab === 'galeria' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Galería en Territorio</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Registros fotográficos de jornadas comunitarias, torneos nocturnos de voleibol y encuentros juveniles en Turbo.
                </p>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryImages.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImageModal(item)}
                    className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-sky-500/50 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-48 w-full overflow-hidden">
                      <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* LIGHTBOX MODAL FOR GALLERY IMAGES */}
      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6 relative"
          >
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img 
                src={selectedImageModal.src} 
                alt={selectedImageModal.title} 
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>

            <div className="space-y-1 pt-2">
              <h3 className="text-base font-black text-white">{selectedImageModal.title}</h3>
              <p className="text-xs text-slate-300">{selectedImageModal.subtitle}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JovenesMas;
