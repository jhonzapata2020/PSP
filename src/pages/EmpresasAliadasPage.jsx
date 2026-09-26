import React, { useState } from 'react';
import { Search, Building2, ExternalLink, MapPin, Award, Users, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import { EMPRESAS_ALIADAS, ENTIDADES_AFILIADAS } from '../data/mockData';

const EmpresasAliadasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedAffiliateCat, setSelectedAffiliateCat] = useState('Todas');
  const [selectedEmpresaModal, setSelectedEmpresaModal] = useState(null);
  const [selectedAffiliateModal, setSelectedAffiliateModal] = useState(null);

  const categories = ['Todas', 'Privado', 'Público', 'Gremial', 'Fundación', 'Caja de Compensación'];
  const affiliateCategories = ['Todas', 'Agro & Campo', 'Educación & Cultura', 'Tecnología & Comercio', 'Salud & Bienestar', 'Fundaciones & Juventud'];

  const filteredEmpresas = EMPRESAS_ALIADAS.filter(e => {
    const matchesSearch = e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.ubicación.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || e.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredAffiliates = ENTIDADES_AFILIADAS.filter(ent => {
    const matchesSearch = ent.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ent.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ent.sigla.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedAffiliateCat === 'Todas' || ent.categoria === selectedAffiliateCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-psp-green via-[#0f5144] to-[#0c4236] p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-psp-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-psp-cyan text-xs font-extrabold border border-white/20">
            <Building2 className="w-3.5 h-3.5" />
            Red Institucional Corporativa PSP
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Empresas, Aliados y Entidades Afiliadas
          </h1>
          <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed">
            Plataforma Social con Propósito agrupa a más de 34 empresas, instituciones, colectivos gremiales y organizaciones sin ánimo de lucro dedicadas al desarrollo socioeconómico, ecoturístico y sostenible de Urabá y Colombia.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-psp-cyan" /> 34+ Aliados Registrados</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-psp-cyan" /> Cobertura Subregional</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-psp-cyan" /> Impacto ODS Directo</span>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-psp-dark-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, sector o sigla en aliados e instituciones (Ej. Puerto, ECO, Agro, CEPRODENT)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
          />
        </div>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* 1. SECCIÓN ENTIDADES Y ALIADOS AFILIADOS (34 LOGO MATRIX) */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-psp-cyan uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Red Social y Empresarial
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Entidades Afiliadas a la Corporación
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Organizaciones, empresas locales y fundaciones activas en la Plataforma Social con Propósito.
            </p>
          </div>

          {/* Full-width Category Filter Pills without horizontal scrollbar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-psp-cyan" /> Filtrar por categoría:
            </span>
            {affiliateCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedAffiliateCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedAffiliateCat === cat
                    ? 'bg-psp-cyan text-slate-950 shadow-md scale-105 ring-2 ring-psp-cyan/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 34 Affiliates Grid Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredAffiliates.map((entidad) => (
            <div
              key={entidad.id}
              onClick={() => setSelectedAffiliateModal(entidad)}
              className="cursor-pointer group relative bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center shadow-psp-soft hover:shadow-xl hover:border-psp-cyan/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Real Image Logo Display */}
              <div className="w-full h-20 sm:h-24 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                {entidad.logo ? (
                  <img
                    src={entidad.logo}
                    alt={entidad.nombre}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className={`w-full h-full rounded-lg bg-gradient-to-br ${entidad.color} text-white font-extrabold text-xs flex items-center justify-center`}>
                    {entidad.sigla}
                  </div>
                )}
              </div>

              <div className="space-y-1 w-full">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-psp-cyan transition-colors">
                  {entidad.nombre}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {entidad.sector}
                </p>
              </div>

              <div className="mt-3 w-full pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold truncate max-w-[80px]">
                  {entidad.categoria.split(' ')[0]}
                </span>
                <div className="flex items-center gap-1">
                  {entidad.sitioWeb && (
                    <a
                      href={entidad.sitioWeb}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-md text-psp-cyan hover:bg-psp-cyan/15 transition-colors"
                      title="Visitar sitio web oficial"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-psp-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAffiliates.length === 0 && (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No se encontraron entidades afiliadas con el criterio de búsqueda especificado.</p>
          </div>
        )}
      </div>

      {/* 2. SECCIÓN SOCIOS Y EMPRESAS ESTRATÉGICAS */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              Alianzas de Gran Envergadura
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Socios e Instituciones Estratégicas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Grandes proyectos de infraestructura, entes gubernamentales y gremios líderes en la región.
            </p>
          </div>

          {/* Full-width Category Filter Pills without horizontal scrollbar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-500" /> Filtrar por sector:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-psp-cyan text-slate-950 shadow-md scale-105 ring-2 ring-psp-cyan/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Strategic Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmpresas.map((empresa) => (
            <div
              key={empresa.id}
              className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-psp-soft hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <img
                    src={empresa.logo}
                    alt={empresa.nombre}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                  />
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-psp-cyan/15 text-psp-cyan border border-psp-cyan/30">
                    {empresa.categoria}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
                  {empresa.nombre}
                </h3>
                <p className="text-xs font-semibold text-psp-cyan mb-3">{empresa.sector}</p>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {empresa.descripcion}
                </p>

                {/* ODS Badges */}
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">ODS:</span>
                  {empresa.ods.map(num => (
                    <span
                      key={num}
                      className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold flex items-center justify-center"
                      title={`ODS ${num}`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-psp-cyan" />
                  <span className="truncate max-w-[140px]">{empresa.ubicación}</span>
                </div>

                <button
                  onClick={() => setSelectedEmpresaModal(empresa)}
                  className="text-xs font-bold text-psp-cyan hover:underline flex items-center gap-1"
                >
                  Ver Detalles <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Detail Modal */}
      {selectedAffiliateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-psp-dark-card max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                {selectedAffiliateModal.logo ? (
                  <img
                    src={selectedAffiliateModal.logo}
                    alt={selectedAffiliateModal.nombre}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className={`w-full h-full rounded-xl bg-gradient-to-br ${selectedAffiliateModal.color} text-white font-extrabold text-base flex items-center justify-center`}>
                    {selectedAffiliateModal.sigla}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{selectedAffiliateModal.nombre}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-psp-cyan/15 text-psp-cyan">
                  {selectedAffiliateModal.categoria}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Sector / Enfoque</h4>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{selectedAffiliateModal.sector}</p>
              </div>

              <div>
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Descripción & Propósito</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedAffiliateModal.descripcion}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedAffiliateModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cerrar
              </button>
              {selectedAffiliateModal.sitioWeb && (
                <a
                  href={selectedAffiliateModal.sitioWeb}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow hover:scale-105 transition-transform"
                >
                  Visitar Sitio Web <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Strategic Company Detail Modal */}
      {selectedEmpresaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-psp-dark-card max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <img src={selectedEmpresaModal.logo} alt={selectedEmpresaModal.nombre} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEmpresaModal.nombre}</h3>
                <p className="text-xs font-bold text-psp-cyan">{selectedEmpresaModal.sector}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Proyectos de Impacto en Urabá</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {selectedEmpresaModal.proyectos}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedEmpresaModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cerrar
              </button>
              <a
                href={selectedEmpresaModal.sitioWeb}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center gap-1.5"
              >
                Visitar Sitio Web <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmpresasAliadasPage;
