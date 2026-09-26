import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Store, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Globe2, 
  Users, 
  ChevronRight,
  Search,
  Sparkles,
  ShoppingBag,
  PlusCircle,
  LogIn
} from 'lucide-react';
import { EMPRESAS_ALIADAS, PRODUCTOS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedMunicipio, setSelectedMunicipio] = useState('Todos los municipios');
  const [selectedSector, setSelectedSector] = useState('Todos los sectores');

  const handleConsultar = (e) => {
    e.preventDefault();
    navigate('/comercio');
  };

  return (
    <div className="flex-grow w-full max-w-full overflow-hidden relative">
      
      {/* Ambient Light Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-mint/60 dark:bg-teal-500/10 rounded-full soft-blur-glow pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 right-0 w-[24rem] sm:w-[32rem] h-[24rem] sm:h-[32rem] bg-emerald-100/40 dark:bg-emerald-500/10 rounded-full soft-blur-glow pointer-events-none -z-10"></div>

      {/* MAIN HERO BANNER IMAGE SHOWCASE AT THE VERY BEGINNING */}
      <section className="pt-6 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-[#203330] shadow-xl dark:shadow-2xl dark:shadow-emerald-950/40 bg-white dark:bg-[#131c1a] group transition-all duration-300">
          <img
            src="/hero-banner-psp.jpg"
            alt="Plataforma Social con Propósito - Urabá & Colombia"
            className="w-full h-auto object-cover brightness-[1.02] contrast-[1.04] transition-transform duration-700 hover:scale-[1.01]"
          />
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="relative pt-4 pb-20 lg:pt-8 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Prominent E-Commerce Marketplace Hub Banner with High Contrast Buttons */}
          <div className="mb-10 p-6 rounded-3xl bg-white dark:bg-[#131c1a] border-2 border-emerald-500/30 dark:border-teal-500/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0c4236] text-white dark:bg-teal-400 dark:text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-[#0c4236]/20 shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0c4236] dark:text-teal-300">
                    Marketplace & Comercio Urabá
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-teal-950 text-[#0c4236] dark:text-teal-300 text-[10px] font-black border border-emerald-300 dark:border-teal-500/40">
                    Núcleo del Proyecto
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  Compra y Vende Productos Locales sin Intermediarios
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Plataforma directa para que emprendedores y agricultores suban sus productos y comercien en Urabá.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                to="/comercio"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              >
                <Store className="w-4 h-4 text-white dark:text-slate-950" />
                <span>Explorar Tienda</span>
              </Link>
              
              {/* Conditional Button: Active only when user is logged in */}
              {user ? (
                <Link
                  to="/mi-cuenta"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-[#182422] dark:hover:bg-teal-950 text-[#0c4236] dark:text-teal-300 text-xs font-extrabold border border-emerald-300 dark:border-[#203330] flex items-center justify-center gap-2 whitespace-nowrap transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  <span>Subir Producto</span>
                </Link>
              ) : (
                <Link
                  to="/ingresar"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-[#182422] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-[#203330] flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                  title="Inicia sesión para subir tus productos"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Inicia sesión para publicar</span>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Institutional Pitch & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-teal-950/70 border border-emerald-300 dark:border-teal-500/30 text-[#0c4236] dark:text-teal-300 text-xs font-extrabold tracking-wide max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#0c4236] dark:bg-teal-400 animate-pulse flex-shrink-0"></span>
                <span className="truncate">ECOSISTEMA SOCIAL & PRODUCTIVO DE URABÁ • ALIANZA PÚBLICO-PRIVADA</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
                Conectamos empresas <br className="hidden sm:inline" />
                público-privadas y la <br className="hidden sm:inline" />
                sociedad civil en{' '}
                <span className="text-[#0c4236] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-teal-300 dark:to-emerald-400 relative">
                  Urabá y Colombia.
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-emerald-100 dark:bg-teal-400/10 -z-10 rounded"></span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-700 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
                Una red colaborativa orientada a impulsar el comercio local, la sostenibilidad agroindustrial, el transporte subregional y el diálogo comunitario en la zona de mayor proyección portuaria del país.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/empresas-aliadas"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-[#0c4236]/25 dark:shadow-teal-500/20 hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
                >
                  <Building2 className="w-4 h-4 text-emerald-200 dark:text-slate-950" />
                  <span>Empresas Aliadas</span>
                </Link>

                <Link
                  to="/foro"
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-100 dark:bg-[#182422] hover:bg-slate-200 dark:hover:bg-teal-950/60 text-slate-800 dark:text-slate-300 font-extrabold text-sm rounded-xl border border-slate-300 dark:border-transparent dark:hover:border-teal-500/20 transition duration-200"
                >
                  <MessageSquare className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  <span>Foro Social</span>
                </Link>
              </div>

              {/* Trust Badge Bar */}
              <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-slate-200 dark:border-[#203330] text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  Gobernanza transparente
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  Certificación Agroexportadora
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  Integración Comunitaria
                </span>
              </div>

            </div>

            {/* Right Column: Regional Development Milestone Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-white dark:bg-[#131c1a] rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 dark:shadow-2xl dark:shadow-black/60 border border-slate-200 dark:border-[#203330] overflow-hidden">
                
                {/* Decorative accent */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-100 dark:bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

                {/* Card Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0c4236] dark:text-teal-300 bg-emerald-100 dark:bg-teal-950/80 dark:border dark:border-teal-500/20 px-3 py-1 rounded-full">
                    Hito de Desarrollo Regional
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#182422] border border-slate-200 dark:border-[#203330] px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-teal-400"></span>
                    Puerto Antioquia 2026
                  </span>
                </div>

                {/* Card Title & Body */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug mb-3">
                  Transformación Agroindustrial & Portuaria de Urabá
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                  Articulamos más de 120 empresas y comunidades locales en Turbo, Apartadó, Carepa y Necoclí para potenciar la exportación de banano, plátano y cacao hacia mercados globales con trazabilidad comunitaria.
                </p>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-3.5 mb-6">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-[#0c4236] dark:text-teal-400">1,800+</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Empleos Directos</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">11</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Municipios Urabá</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">+120</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Empresas Aliadas</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-[#0c4236] dark:text-emerald-400">94%</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Impacto Comunitario</span>
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#203330] flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Actualización mensual de métricas</span>
                  <Link to="/empresas-aliadas" className="text-[#0c4236] dark:text-teal-400 font-black hover:underline inline-flex items-center gap-1">
                    Ver reporte oficial <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STRATEGIC PILLARS SECTION */}
      <section className="py-16 bg-white dark:bg-[#0e1514] border-y border-slate-200 dark:border-[#203330] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0c4236] dark:text-teal-300 bg-emerald-100 dark:bg-teal-950/80 dark:border dark:border-teal-500/20 px-3 py-1 rounded-full">
              Ejes Estratégicos
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
              Pilares de Impacto Socioeconómico
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 font-medium">
              Articulación entre sector público, productores agrícolas, comercio local y sociedad civil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-teal-950 text-[#0c4236] dark:text-teal-300 flex items-center justify-center mb-4 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Agroindustria Sostenible</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Modelos de producción limpia para banano, plátano, cacao y frutales con acompañamiento técnico continuo.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-emerald-950 text-[#0c4236] dark:text-emerald-300 flex items-center justify-center mb-4 font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Comercio & Emprendimiento</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Visibilización digital y encadenamientos comerciales para micro, medianas y grandes empresas locales.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center mb-4 font-bold">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Conectividad Portuaria</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Preparación de capital humano e infraestructura logística de cara a la operación de Puerto Antioquia.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-4 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Diálogo Comunitario</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Mecanismos participativos y foros abiertos para escuchar las prioridades de los corregimientos y veredas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK DIRECTORY SECTION */}
      <section className="py-14 bg-slate-50 dark:bg-[#0c1312] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#131c1a] rounded-2xl border border-slate-200 dark:border-[#203330] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-xl">
            
            <div>
              <span className="text-xs font-black text-[#0c4236] dark:text-teal-400 tracking-wider uppercase">Directorio Productivo</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">Encuentra iniciativas y aliados por municipio</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Busca cooperativas bananeras, prestadores turísticos, puertos y servicios especializados.</p>
            </div>

            <form onSubmit={handleConsultar} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select 
                value={selectedMunicipio}
                onChange={(e) => setSelectedMunicipio(e.target.value)}
                className="rounded-xl border-slate-300 dark:border-[#203330] text-sm font-semibold focus:border-[#0c4236] dark:focus:border-teal-400 focus:ring-[#0c4236] dark:focus:ring-teal-400 bg-slate-50 dark:bg-[#0e1514] text-slate-800 dark:text-slate-200 py-2.5 px-3"
              >
                <option>Todos los municipios</option>
                <option>Apartadó</option>
                <option>Turbo</option>
                <option>Necoclí</option>
                <option>Carepa</option>
                <option>Chigorodó</option>
                <option>San Pedro de Urabá</option>
                <option>Arboletes</option>
                <option>San Juan de Urabá</option>
                <option>Mutatá</option>
                <option>Vigía del Fuerte</option>
                <option>Murindó</option>
              </select>

              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="rounded-xl border-slate-300 dark:border-[#203330] text-sm font-semibold focus:border-[#0c4236] dark:focus:border-teal-400 focus:ring-[#0c4236] dark:focus:ring-teal-400 bg-slate-50 dark:bg-[#0e1514] text-slate-800 dark:text-slate-200 py-2.5 px-3"
              >
                <option>Todos los sectores</option>
                <option>Agroindustria & Exportación</option>
                <option>Logística & Puertos</option>
                <option>Servicios Empresariales</option>
                <option>Turismo & Cultura</option>
                <option>Organizaciones Sociales</option>
              </select>

              <button 
                type="submit"
                className="px-5 py-2.5 bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 text-white dark:text-slate-950 rounded-xl text-sm font-extrabold transition whitespace-nowrap shadow-md"
              >
                Consultar
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Productos y Servicios de Urabá</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Apoya directamente el comercio de productores agrícolas y artesanos locales.</p>
          </div>
          <Link to="/comercio" className="text-xs font-black text-[#0c4236] dark:text-teal-400 hover:underline flex items-center gap-1">
            Ver tienda completa <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTOS.map(prod => (
            <div key={prod.id} className="group rounded-2xl bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold rounded-lg">
                  ★ {prod.calificacion}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between h-40">
                <div>
                  <span className="text-[10px] font-black text-[#0c4236] dark:text-teal-400 uppercase">{prod.categoria}</span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">{prod.nombre}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-medium">{prod.descripcion}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#203330]">
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                    ${prod.precio.toLocaleString()} COP
                  </span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 text-white dark:text-slate-950 text-xs font-black transition-colors"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
