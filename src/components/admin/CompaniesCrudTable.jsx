import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Upload,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import companiesApi from '../../services/companiesApi';
import Modal from '../ui/Modal';

const CATEGORIES_AFILIADAS = [
  'Tecnología & Comercio',
  'Salud & Bienestar',
  'Educación & Cultura',
  'Agro & Campo',
  'Fundaciones & Juventud',
  'Impacto Social',
];

const CATEGORIES_ESTRATEGICAS = [
  'Privado',
  'Público',
  'Gremial',
  'Fundación',
  'Caja de Compensación',
];

const CATEGORY_BADGE_STYLES = {
  'Tecnología & Comercio': 'bg-teal-50 text-teal-700 border-teal-300',
  'Salud & Bienestar': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Educación & Cultura': 'bg-indigo-50 text-indigo-700 border-indigo-300',
  'Agro & Campo': 'bg-amber-50 text-amber-700 border-amber-300',
  'Fundaciones & Juventud': 'bg-rose-50 text-rose-700 border-rose-300',
  'Impacto Social': 'bg-rose-50 text-rose-700 border-rose-300',
  'Privado': 'bg-sky-50 text-sky-700 border-sky-300',
  'Público': 'bg-purple-50 text-purple-700 border-purple-300',
  'Gremial': 'bg-teal-50 text-teal-700 border-teal-300',
  'Fundación': 'bg-pink-50 text-pink-700 border-pink-300',
  'Caja de Compensación': 'bg-orange-50 text-orange-700 border-orange-300',
};

const CATEGORY_BADGE_STYLES_DARK = {
  'Tecnología & Comercio': 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
  'Salud & Bienestar': 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
  'Educación & Cultura': 'bg-indigo-950/70 text-indigo-300 border-indigo-500/40',
  'Agro & Campo': 'bg-amber-950/70 text-amber-300 border-amber-500/40',
  'Fundaciones & Juventud': 'bg-rose-950/70 text-rose-300 border-rose-500/40',
  'Impacto Social': 'bg-rose-950/70 text-rose-300 border-rose-500/40',
  'Privado': 'bg-sky-950/70 text-sky-300 border-sky-500/40',
  'Público': 'bg-purple-950/70 text-purple-300 border-purple-500/40',
  'Gremial': 'bg-teal-950/70 text-teal-300 border-teal-500/40',
  'Fundación': 'bg-pink-950/70 text-pink-300 border-pink-500/40',
  'Caja de Compensación': 'bg-orange-950/70 text-orange-300 border-orange-500/40',
};

const EMPTY_FORM = {
  nombre: '',
  sigla: '',
  tipo: 'afiliada',
  categoria: 'Tecnología & Comercio',
  sector: '',
  descripcion: '',
  ubicacion: 'Turbo, Urabá',
  logo: '',
  sitioWeb: '',
  discountPercentage: 10,
};

export default function CompaniesCrudTable({ companies = [], onRefresh, isDark = false }) {
  const [activeTab, setActiveTab] = useState('afiliada'); // 'afiliada' | 'estrategica'
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [notice, setNotice] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const filteredList = useMemo(() => {
    return companies.filter((c) => {
      const tipo = c.tipo || 'afiliada';
      if (tipo !== activeTab) return false;
      if (categoryFilter !== 'Todas' && c.categoria !== categoryFilter) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        (c.nombre || '').toLowerCase().includes(q) ||
        (c.sector || '').toLowerCase().includes(q) ||
        (c.descripcion || '').toLowerCase().includes(q) ||
        (c.categoria || '').toLowerCase().includes(q)
      );
    });
  }, [companies, activeTab, categoryFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredList.slice((safePage - 1) * pageSize, safePage * pageSize);

  const notify = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // Subir logo directo desde una fila de la tabla explorando el computador
  const handleDirectLogoUpload = (company, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        await companiesApi.update(company.id, { ...company, logo: reader.result });
        notify(`Logo de "${company.nombre}" actualizado correctamente.`);
        onRefresh?.();
      }
    };
    reader.readAsDataURL(file);
  };

  // Cambiar categoría (Salud, Tecnología, Agro, etc.) directo desde el botoncito/pill de la tabla
  const handleDirectCategoryChange = async (company, newCategoria) => {
    await companiesApi.update(company.id, { ...company, categoria: newCategoria });
    notify(`Categoría de "${company.nombre}" actualizada a "${newCategoria}".`);
    onRefresh?.();
  };

  // Cambiar % de descuento directo desde la fila
  const handleDirectDiscountChange = async (company, newDiscount) => {
    const val = Math.max(0, Math.min(100, Number(newDiscount) || 0));
    await companiesApi.update(company.id, { ...company, discountPercentage: val });
    notify(`Descuento de "${company.nombre}" actualizado a ${val}%.`);
    onRefresh?.();
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      tipo: activeTab,
      categoria: activeTab === 'estrategica' ? CATEGORIES_ESTRATEGICAS[0] : CATEGORIES_AFILIADAS[0],
    });
    setModalOpen(true);
  };

  const openEdit = (company) => {
    setEditingId(company.id);
    setForm({
      nombre: company.nombre || '',
      sigla: company.sigla || '',
      tipo: company.tipo || 'afiliada',
      categoria: company.categoria || 'Tecnología & Comercio',
      sector: company.sector || '',
      descripcion: company.descripcion || '',
      ubicacion: company.ubicacion || company.ubicación || 'Turbo, Urabá',
      logo: company.logo || '',
      sitioWeb: company.sitioWeb || '',
      discountPercentage: Number(company.discountPercentage ?? 10),
    });
    setModalOpen(true);
  };

  const handleModalLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, logo: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await companiesApi.update(editingId, form);
        notify(`Información de "${form.nombre}" actualizada.`);
      } else {
        await companiesApi.create(form);
        notify(`Empresa "${form.nombre}" creada exitosamente.`);
      }
      setModalOpen(false);
      onRefresh?.();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const deletedName = toDelete.nombre;
    await companiesApi.remove(toDelete.id);
    setToDelete(null);
    notify(`Empresa "${deletedName}" eliminada de la lista.`);
    onRefresh?.();
  };

  const categoriesForTab =
    activeTab === 'estrategica' ? CATEGORIES_ESTRATEGICAS : CATEGORIES_AFILIADAS;

  const cardContainerClass = isDark
    ? 'bg-[#182638] border border-slate-700/60 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.35)] text-slate-100'
    : 'bg-[#f8fafc] border border-slate-300/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] text-slate-800';

  const innerContainerClass = isDark
    ? 'bg-[#0f1824] border border-slate-700/70 text-slate-100'
    : 'bg-white border border-slate-200/90 text-slate-800';

  return (
    <div className={`rounded-3xl p-5 sm:p-7 space-y-6 transition-colors duration-200 ${cardContainerClass}`}>
      {/* Barra Superior estilo Referencia (Tabs a la izquierda + Buscador, Filtro y Botón Crear a la derecha) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Selector de Pestañas (Entidades Afiliadas vs Socios Estratégicos) */}
        <div className={`inline-flex items-center p-1.5 rounded-2xl border self-start ${isDark ? 'bg-[#0f1824] border-slate-700/70' : 'bg-slate-100/90 border-slate-200/60'}`}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('afiliada');
              setCategoryFilter('Todas');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'afiliada'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'bg-emerald-50 text-[#0c4236] border border-emerald-200 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Entidades Afiliadas</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('estrategica');
              setCategoryFilter('Todas');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'estrategica'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'bg-emerald-50 text-[#0c4236] border border-emerald-200 shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Socios Estratégicos</span>
          </button>
        </div>

        {/* Buscador + Filtro de Categoría + Botón + Crear Empresa */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar empresa..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#0f1824] border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-teal-500'
              }`}
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className={`pl-8 pr-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none cursor-pointer transition-colors ${
                isDark
                  ? 'bg-[#0f1824] border-slate-700/80 text-slate-200 focus:border-cyan-400'
                  : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-teal-500'
              }`}
            >
              <option value="Todas" className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>
                Todas las categorías
              </option>
              {categoriesForTab.map((cat) => (
                <option key={cat} value={cat} className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold shadow-md transition-all cursor-pointer ${
              isDark
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                : 'bg-[#0c4236] hover:bg-[#0f5144] text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Crear Empresa</span>
          </button>
        </div>
      </div>

      {/* Notificación de confirmación */}
      {notice && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold ${
          isDark
            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabla CRUD Limpia estilo Referencia */}
      <div className={`overflow-x-auto rounded-2xl border transition-colors ${
        isDark ? 'border-slate-700/60 bg-[#111c2a]' : 'border-slate-200 bg-white'
      }`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-[11px] font-bold border-b transition-colors ${
              isDark
                ? 'bg-[#0f1824] text-slate-300 border-slate-700/70'
                : 'bg-slate-50/90 text-slate-500 border-slate-200'
            }`}>
              <th className="py-3.5 px-4">Empresa & Logo</th>
              <th className="py-3.5 px-4">A qué se dedica (Sector)</th>
              <th className="py-3.5 px-4">Objeto Social / Descripción</th>
              <th className="py-3.5 px-4 text-center">% Descuento</th>
              <th className="py-3.5 px-4 text-center">Categoría</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className={`divide-y text-xs transition-colors ${isDark ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
            {paginatedRows.map((comp) => {
              const badgeStyle = isDark
                ? CATEGORY_BADGE_STYLES_DARK[comp.categoria] || 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40'
                : CATEGORY_BADGE_STYLES[comp.categoria] || 'bg-teal-50 text-teal-700 border-teal-300';

              return (
                <tr
                  key={comp.id}
                  className={`transition-colors group ${
                    isDark ? 'hover:bg-[#1a293d]/70 text-slate-200' : 'hover:bg-slate-50/70 text-slate-700'
                  }`}
                >
                  {/* 1. Empresa & Logo + Botoncito de explorar PC para cambiar logo */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3.5 min-w-[220px]">
                      <div className={`relative w-11 h-11 rounded-full border p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs ${
                        isDark ? 'bg-[#0f1824] border-slate-700 text-cyan-300' : 'bg-white border-slate-200 text-[#0c4236]'
                      }`}>
                        {comp.logo ? (
                          <img
                            src={comp.logo}
                            alt={comp.nombre}
                            className="max-h-full max-w-full object-contain rounded-full"
                          />
                        ) : (
                          <span className={`text-[10px] font-extrabold ${isDark ? 'text-cyan-300' : 'text-[#0c4236]'}`}>
                            {comp.sigla || 'EMP'}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {comp.nombre}
                        </p>
                        <label
                          className={`inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold hover:underline cursor-pointer ${
                            isDark ? 'text-cyan-400' : 'text-teal-600'
                          }`}
                          title="Explorar el computador para subir o cambiar el logo"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Subir logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDirectLogoUpload(comp, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </td>

                  {/* 2. A qué se dedica / Sector */}
                  <td className={`py-3.5 px-4 font-semibold max-w-[200px] ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    <p className="line-clamp-2">{comp.sector || '—'}</p>
                  </td>

                  {/* 3. Objeto Social / Descripción */}
                  <td className={`py-3.5 px-4 max-w-[280px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <p className="line-clamp-2 leading-relaxed">{comp.descripcion || '—'}</p>
                  </td>

                  {/* 4. % Descuento ajustable */}
                  <td className="py-3.5 px-4 text-center">
                    <select
                      value={comp.discountPercentage ?? 10}
                      onChange={(e) => handleDirectDiscountChange(comp, e.target.value)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-extrabold focus:outline-none cursor-pointer transition-colors ${
                        isDark
                          ? 'bg-[#0f1824] text-cyan-300 border-slate-700 focus:border-cyan-400'
                          : 'bg-slate-100 text-slate-800 border-slate-200 focus:border-teal-500'
                      }`}
                    >
                      {[0, 2, 3, 5, 7, 8, 10, 12, 15, 20, 25].map((pct) => (
                        <option key={pct} value={pct} className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}>
                          {pct}%
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 5. Categoría (Salud, Tecnología, Educación, Agro...) editable tipo Pill como en la foto */}
                  <td className="py-3.5 px-4 text-center">
                    <select
                      value={comp.categoria}
                      onChange={(e) => handleDirectCategoryChange(comp, e.target.value)}
                      className={`px-3 py-1 rounded-full border text-[11px] font-bold focus:outline-none cursor-pointer ${badgeStyle}`}
                      title="Cambiar categoría de la empresa"
                    >
                      {categoriesForTab.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          className={isDark ? 'bg-[#0f1824] text-white' : 'bg-white text-slate-900'}
                        >
                          {cat.split(' ')[0]} ({cat})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 6. Columna de Acciones (Editar / Eliminar) */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(comp)}
                        className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#0f1824] hover:bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-[#0c4236]'
                        }`}
                        title="Editar información, logo, objeto social y categoría"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setToDelete(comp)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-rose-950/60 text-rose-400' : 'hover:bg-rose-50 text-rose-500'
                        }`}
                        title="Eliminar empresa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan={6} className={`py-10 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  No se encontraron empresas con ese criterio de búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación inferior estilo Referencia (< 1 2 3 4 >) */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        <span>
          Mostrando {paginatedRows.length} de {filteredList.length} empresas
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-40 cursor-pointer ${
              isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                safePage === pageNum
                  ? isDark
                    ? 'bg-cyan-500 text-slate-950 border border-cyan-400 font-black shadow-xs'
                    : 'bg-white text-slate-900 border border-slate-300 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:bg-slate-800 border border-transparent'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-40 cursor-pointer ${
              isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Completo para Crear / Editar Empresa */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Actualizar Información de la Empresa' : 'Crear Nueva Empresa'}
        subtitle="Sube el logo desde tu computador y actualiza el nombre, a qué se dedica, el objeto social y la categoría."
        width="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveModal}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#0c4236] text-white dark:bg-teal-400 dark:text-slate-950 text-xs font-extrabold disabled:opacity-60"
            >
              {saving ? 'Guardando...' : editingId ? 'Actualizar Empresa' : 'Crear Empresa'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveModal} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Subir Logo explorando el computador */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {form.logo ? (
                <img src={form.logo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <Building2 className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Logo de la Empresa
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0c4236] text-white dark:bg-teal-400 dark:text-slate-950 text-xs font-bold cursor-pointer hover:opacity-90 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Logo desde el Computador</span>
                  <input type="file" accept="image/*" onChange={handleModalLogoUpload} className="hidden" />
                </label>
                {form.logo && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, logo: '' }))}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej. Ecosistemas Urabá"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                % Descuento Empresa
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={form.discountPercentage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountPercentage: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Categoría (Botón inferior de la tarjeta) *
              </label>
              <select
                value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {(form.tipo === 'estrategica' ? CATEGORIES_ESTRATEGICAS : CATEGORIES_AFILIADAS).map(
                  (cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                A qué se dedica (Subtítulo de la tarjeta) *
              </label>
              <input
                type="text"
                required
                value={form.sector}
                onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                placeholder="Ej. Salud Oral y Odontología Especializada"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Objeto Social / Información de la Empresa *
            </label>
            <textarea
              rows={3}
              required
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              placeholder="Escribe el objeto social y lo que ofrece la empresa..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ubicación / Municipio
              </label>
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))}
                placeholder="Ej. Turbo, Antioquia"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sitio Web o Red Social (Opcional)
              </label>
              <input
                type="text"
                value={form.sitioWeb}
                onChange={(e) => setForm((f) => ({ ...f, sitioWeb: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Eliminar Empresa"
        footer={
          <>
            <button
              type="button"
              onClick={() => setToDelete(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-extrabold"
            >
              Sí, eliminar
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ¿Estás seguro de eliminar a <strong>{toDelete?.nombre}</strong>? Esta acción la quitará inmediatamente de las tarjetas de Empresas.
        </p>
      </Modal>
    </div>
  );
}
