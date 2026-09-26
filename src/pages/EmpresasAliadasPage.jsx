import React, { useState } from 'react';
import { Search, Building2, ExternalLink, MapPin, Target, Filter } from 'lucide-react';
import { EMPRESAS_ALIADAS } from '../data/mockData';

const EmpresasAliadasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedEmpresaModal, setSelectedEmpresaModal] = useState(null);

  const categories = ['Todas', 'Privado', 'Público', 'Gremial', 'Fundación', 'Caja de Compensación'];

  const filteredEmpresas = EMPRESAS_ALIADAS.filter(e => {
    const matchesSearch = e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.ubicación.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || e.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8">
      
      {/* Header section */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-psp-cyan/15 text-psp-cyan text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          Directorio Institucional
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Empresas e Instituciones Aliadas
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Conoce a los actores público-privados, gremios y fundaciones que impulsan el crecimiento socioeconómico, la infraestructura portuaria y la sostenibilidad en la región de Urabá y Colombia.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-psp-dark-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-psp-soft">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, sector o municipio (Ej. Puerto, Turbo, Augura)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-psp-cyan text-slate-950 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Companies Grid */}
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
                Ver Proyectos <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal detail */}
      {selectedEmpresaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-psp-dark-card max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <img src={selectedEmpresaModal.logo} alt={selectedEmpresaModal.nombre} className="w-16 h-16 rounded-2xl object-cover" />
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
