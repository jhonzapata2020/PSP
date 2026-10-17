import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, ExternalLink, MapPin, Award, Users, Sparkles, Filter, ChevronRight, CheckCircle2, Percent, Tag, Briefcase, Handshake, MessageCircle, X, ShieldCheck, Check, HeartHandshake, Heart, ArrowRight, List, LayoutGrid } from 'lucide-react';
import companiesApi from '../services/companiesApi';
import { useAuth } from '../context/AuthContext';
import CompaniesCrudTable from '../components/admin/CompaniesCrudTable';

const EmpresasAliadasPage = () => {
  const { hasPermission, hasRole, user } = useAuth();
  const isAdmin =
    Boolean(user) &&
    (hasRole?.('admin') ||
      hasRole?.('superadmin') ||
      user?.role === 'admin' ||
      hasPermission?.('roles.manage'));

  const [allCompanies, setAllCompanies] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedAffiliateCat, setSelectedAffiliateCat] = useState('Todas');
  const [selectedEmpresaModal, setSelectedEmpresaModal] = useState(null);
  const [selectedAffiliateModal, setSelectedAffiliateModal] = useState(null);
  const [isAffiliationModalOpen, setIsAffiliationModalOpen] = useState(false);
  const [isSolidarityModalOpen, setIsSolidarityModalOpen] = useState(false);

  // Affiliation Form State
  const [affiliateName, setAffiliateName] = useState('');
  const [affiliateContact, setAffiliateContact] = useState('');
  const [affiliatePhone, setAffiliatePhone] = useState('');
  const [affiliateSector, setAffiliateSector] = useState('Tecnología & Comercio');
  const [affiliateSuccess, setAffiliateSuccess] = useState(false);

  const loadAllCompanies = useCallback(() => {
    companiesApi.list().then((list) => {
      setAllCompanies(list);
    });
  }, []);

  useEffect(() => {
    loadAllCompanies();
  }, [loadAllCompanies]);

  const categories = ['Todas', 'Privado', 'Público', 'Gremial', 'Fundación', 'Caja de Compensación'];
  const affiliateCategories = ['Todas', 'Agro & Campo', 'Educación & Cultura', 'Tecnología & Comercio', 'Salud & Bienestar', 'Impacto Social'];

  const empresasEstrategicas = allCompanies.filter((c) => c.tipo === 'estrategica');
  const entidadesAfiliadas = allCompanies.filter((c) => c.tipo !== 'estrategica');

  const filteredEmpresas = empresasEstrategicas.filter((e) => {
    const loc = e.ubicacion || e.ubicación || '';
    const matchesSearch =
      (e.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.sector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || e.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredAffiliates = entidadesAfiliadas.filter((ent) => {
    const matchesSearch =
      (ent.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ent.sector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ent.sigla || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedAffiliateCat === 'Todas' ||
      (selectedAffiliateCat === 'Impacto Social'
        ? ent.categoria === 'Fundaciones & Juventud' || ent.categoria === 'Impacto Social'
        : ent.categoria === selectedAffiliateCat);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-32 space-y-8 sm:space-y-10">
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
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.22em] text-[#0d5c4b] dark:text-teal-400">
                RED SOCIAL. EMPRESARIAL. CON PROPÓSITO.
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#0f1f2e] dark:text-white leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif" }}
              >
                Entidades Afiliadas a la Corporación.
              </h2>
              <div className="pt-0.5 max-w-xl">
                <div className="h-[1.5px] w-48 bg-slate-300/80 dark:bg-slate-700/80 mb-2" />
                <p
                  className="text-base sm:text-lg italic text-slate-700 dark:text-slate-200"
                  style={{ fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif" }}
                >
                  Alianzas que transforman{' '}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    nuestra región
                  </span>
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Organizaciones, empresas locales y fundaciones activas en la Plataforma Social con Propósito.
              </p>
            </div>

            {/* Botón exclusivo para el rol Admin: Alternar entre Tarjetas y Vista Lista CRUD */}
            {isAdmin && (
              <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-slate-900 text-[#0c4236] dark:text-psp-cyan shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Tarjetas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#0c4236] text-white dark:bg-psp-cyan dark:text-slate-950 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Vista Lista (CRUD)</span>
                </button>
              </div>
            )}
          </div>

          {/* Full-width Category Filter Pills without horizontal scrollbar (solo en modo tarjetas) */}
          {(!isAdmin || viewMode === 'cards') && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-psp-cyan" /> Filtrar por categoría:
              </span>
              {affiliateCategories.map((cat) => {
                const isImpactoSocial = cat === 'Impacto Social';
                const isSelected = selectedAffiliateCat === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedAffiliateCat(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? isImpactoSocial
                          ? 'bg-emerald-600 text-white font-black shadow-md scale-105 ring-2 ring-emerald-400/40'
                          : 'bg-psp-cyan text-slate-950 font-black shadow-md scale-105 ring-2 ring-psp-cyan/30'
                        : isImpactoSocial
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-400/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 font-extrabold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'
                    }`}
                  >
                    {isImpactoSocial && (
                      <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-white text-white' : 'fill-emerald-500 text-emerald-500 animate-pulse'}`} />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Si es Admin y seleccionó Vista Lista -> Muestra la Tabla CRUD estilo Referencia */}
        {isAdmin && viewMode === 'list' ? (
          <CompaniesCrudTable companies={allCompanies} onRefresh={loadAllCompanies} />
        ) : (
          <>
            {/* 34 Affiliates Grid Matrix (Tarjetas Limpias) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredAffiliates.map((entidad) => {
                const isFoundation = entidad.categoria === 'Fundaciones & Juventud' || 
                                     entidad.categoria === 'Impacto Social' ||
                                     (entidad.nombre || '').toLowerCase().includes('fundació') || 
                                     (entidad.nombre || '').toLowerCase().includes('fundacion');

                return (
                  <div
                    key={entidad.id}
                    onClick={() => setSelectedAffiliateModal(entidad)}
                    className={`cursor-pointer group relative bg-white dark:bg-psp-dark-card border rounded-2xl p-4 flex flex-col items-center justify-between text-center shadow-psp-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                      isFoundation
                        ? 'border-emerald-300/80 dark:border-emerald-700/60 hover:border-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-psp-cyan/50'
                    }`}
                  >
                    {/* Sello de Impacto únicamente para Fundaciones */}
                    {isFoundation && (
                      <div className="w-full mb-2 flex justify-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-[9px] font-extrabold flex items-center gap-1 shadow-xs">
                          <Heart className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600 dark:fill-emerald-300 dark:text-emerald-300 shrink-0" />
                          <span className="truncate">Receptor Fondo Social</span>
                        </span>
                      </div>
                    )}

                    {/* Real Image Logo Display con altura fija consistente */}
                    <div className="w-full h-24 sm:h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                      {entidad.logo ? (
                        <img
                          src={entidad.logo}
                          alt={entidad.nombre}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-lg bg-gradient-to-br ${entidad.color || 'from-teal-500 to-emerald-700'} text-white font-extrabold text-xs flex items-center justify-center`}>
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

                    {isFoundation ? (
                      <div className="mt-3 w-full pt-2 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-600">
                        <span className="flex items-center gap-1">
                          <HeartHandshake className="w-3 h-3 text-emerald-500" />
                          Labor Social
                        </span>
                        {entidad.rutaInterna || (entidad.sitioWeb && entidad.sitioWeb.startsWith('/')) ? (
                          <Link
                            to={entidad.rutaInterna || entidad.sitioWeb}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md text-emerald-500 hover:bg-emerald-500/15 transition-colors"
                            title="Ver Landing Page Oficial"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        ) : entidad.sitioWeb ? (
                          <a
                            href={entidad.sitioWeb}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md text-emerald-500 hover:bg-emerald-500/15 transition-colors"
                            title="Visitar sitio web oficial"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 w-full pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold truncate max-w-[80px]">
                          {(entidad.categoria || '').split(' ')[0]}
                        </span>
                        <div className="flex items-center gap-1">
                          {entidad.rutaInterna || (entidad.sitioWeb && entidad.sitioWeb.startsWith('/')) ? (
                            <Link
                              to={entidad.rutaInterna || entidad.sitioWeb}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-md text-psp-cyan hover:bg-psp-cyan/15 transition-colors"
                              title="Ver Landing Page Oficial"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          ) : entidad.sitioWeb ? (
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
                          ) : null}
                          <ChevronRight className="w-3.5 h-3.5 text-psp-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredAffiliates.length === 0 && (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No se encontraron entidades afiliadas con el criterio de búsqueda especificado.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 2. SECCIÓN SOCIOS Y EMPRESAS ESTRATÉGICAS */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.22em] text-[#0d5c4b] dark:text-teal-400">
              ALIANZAS DE GRAN ENVERGADURA.
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-[#0f1f2e] dark:text-white leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif" }}
            >
              Socios e Instituciones Estratégicas.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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

        {/* Strategic Companies Grid (Tarjetas Limpias) */}
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
                  {(empresa.ods || [8, 11]).map(num => (
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
                  <span className="truncate max-w-[140px]">{empresa.ubicacion || empresa.ubicación}</span>
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
                  <div className={`w-full h-full rounded-xl bg-gradient-to-br ${selectedAffiliateModal.color || 'from-teal-500 to-emerald-700'} text-white font-extrabold text-base flex items-center justify-center`}>
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

              {selectedAffiliateModal.ubicacion && (
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Ubicación / Sedes</h4>
                  <p className="text-xs font-semibold text-psp-cyan flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {selectedAffiliateModal.ubicacion}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Descripción & Propósito</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedAffiliateModal.descripcion}
                </p>
              </div>

              {/* Dynamic Discount Benefit Badge inside Modal */}
              {Number(selectedAffiliateModal.discountPercentage ?? 10) > 0 && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3">
                  <Tag className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-[11px] text-slate-700 dark:text-slate-200">
                    <strong className="text-slate-900 dark:text-white block">
                      Convenio Red PSP: {selectedAffiliateModal.discountPercentage ?? 10}% de Descuento
                    </strong>
                    <span>
                      Aplica {selectedAffiliateModal.discountPercentage ?? 10}% desc. en servicios/productos al identificarse como afiliado a la Red PSP Urabá.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedAffiliateModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cerrar
              </button>
              {selectedAffiliateModal.rutaInterna || (selectedAffiliateModal.sitioWeb && selectedAffiliateModal.sitioWeb.startsWith('/')) ? (
                <Link
                  to={selectedAffiliateModal.rutaInterna || selectedAffiliateModal.sitioWeb}
                  className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow hover:scale-105 transition-transform"
                >
                  Ver Landing Page Institucional <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              ) : selectedAffiliateModal.sitioWeb ? (
                <a
                  href={selectedAffiliateModal.sitioWeb}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow hover:scale-105 transition-transform"
                >
                  Visitar Sitio Web <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}
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

      {/* 🤝 SOLICITUD DE AFILIACIÓN A LA RED PSP MODAL */}
      {isAffiliationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-teal-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Solicitud de Afiliación Red PSP Urabá
                  </h3>
                  <span className="text-[11px] text-teal-400 font-bold">Convenio 10% Descuento Preferencial</span>
                </div>
              </div>
              <button
                onClick={() => setIsAffiliationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {affiliateSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-extrabold text-white">¡Solicitud Registrada con Éxito!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gracias por tu interés en integrar <strong>{affiliateName}</strong> a la Red Social Empresarial PSP Urabá. El equipo de coordinación institucional se comunicará contigo vía WhatsApp en menos de 24 horas.
                </p>
                <button
                  onClick={() => { setAffiliateSuccess(false); setIsAffiliationModalOpen(false); }}
                  className="px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Aceptar y Volver
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setAffiliateSuccess(true);
                  const msg = encodeURIComponent(`Hola, me interesa afiliar la entidad/empresa "${affiliateName}" (Contacto: ${affiliateContact}, Teléfono: ${affiliatePhone}, Sector: ${affiliateSector}) a la Red Social Empresarial PSP Urabá para ofrecer y recibir el 10% de descuento cruzado.`);
                  window.open(`https://wa.me/573124567890?text=${msg}`, '_blank');
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre de la Empresa, Fundación u Organización *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Comercializadora del Golfo S.A.S."
                    value={affiliateName}
                    onChange={(e) => setAffiliateName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre del Representante o Contacto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ana Lucía Gómez"
                      value={affiliateContact}
                      onChange={(e) => setAffiliateContact(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 312 456 7890"
                      value={affiliatePhone}
                      onChange={(e) => setAffiliatePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sector de Desempeño
                  </label>
                  <select
                    value={affiliateSector}
                    onChange={(e) => setAffiliateSector(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Tecnología & Comercio">Tecnología & Comercio</option>
                    <option value="Educación & Cultura">Educación & Cultura</option>
                    <option value="Agro & Campo">Agro & Campo</option>
                    <option value="Salud & Bienestar">Salud & Bienestar</option>
                    <option value="Fundaciones & Juventud">Fundaciones & Juventud</option>
                    <option value="Gastronomía & Servicios">Gastronomía & Servicios</option>
                  </select>
                </div>

                {/* Benefits Notice */}
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-300 space-y-1">
                  <span className="font-extrabold text-teal-300 block">✨ Beneficios incluidos con la afiliación:</span>
                  <p className="text-[11px] text-slate-400">
                    • Inclusión directa en la Red de 34+ entidades afiliadas de Urabá.<br />
                    • Acceso al 10% de descuento preferencial cruzado entre empresas de la red.<br />
                    • Publicación en la vitrina digital subregional y respaldo ODS.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-slate-950" />
                  <span>Enviar Solicitud de Afiliación por WhatsApp</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 💖 MODAL INFORMATIVO: FONDO SOLIDARIO Y PROYECTOS BENEFICIADOS */}
      {isSolidarityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-psp-dark-card border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Fondo Solidario PSP Urabá
                  </h3>
                  <span className="text-[11px] text-emerald-500 font-bold">Compras con Impacto Social Directo</span>
                </div>
              </div>
              <button
                onClick={() => setIsSolidarityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-emerald-50/60 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60">
                Cada transacción comercial realizada en la <strong>Plataforma Social con Propósito</strong> destina automáticamente un <strong>aporte corporativo</strong> para apalancar proyectos productivos, ludotecas infantiles y atención gerontológica en los 11 municipios de Urabá.
              </p>

              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Iniciativas y Fundaciones Receptoras:
              </h4>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <Heart className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white block font-bold">Jóvenes+ Organización & Juventud con Propósito</strong>
                    <span className="text-slate-500 dark:text-slate-400">Escuelas de liderazgo, talleres de robótica y capacitación en habilidades blandas para más de 450 jóvenes vulnerables.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <Heart className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white block font-bold">Fundación Casa de Reposo Renacer</strong>
                    <span className="text-slate-500 dark:text-slate-400">Suministro de alimentación balanceada, medicamentos y atención médica personalizada para adultos mayores en desamparo.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <Heart className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white block font-bold">Alma de Fénix Fundación & Corporación Niñez Diversa</strong>
                    <span className="text-slate-500 dark:text-slate-400">Ludotecas itinerantes y acompañamiento psicosocial para la infancia en zonas rurales de Turbo y Necoclí.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsSolidarityModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmpresasAliadasPage;

