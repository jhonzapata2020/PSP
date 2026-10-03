import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, RefreshCw, CheckCircle, XCircle, Archive, Star, StarOff, Trash2, Pencil, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import productsApi from '../../services/productsApi';

const STATUS_LABELS = {
  pending:   { label: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  published: { label: 'Publicado',  cls: 'bg-green-100  text-green-800  border-green-200'  },
  rejected:  { label: 'Rechazado', cls: 'bg-red-100    text-red-800    border-red-200'    },
  archived:  { label: 'Archivado', cls: 'bg-slate-100  text-slate-600  border-slate-200'  },
};

export default function AdminCatalogoPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Leer estado inicial desde la URL para sincronización y persistencia con F5
  const initialPage     = Number(searchParams.get('page')) || 1;
  const initialPageSize = Number(searchParams.get('pageSize')) || 25;
  const initialQ        = searchParams.get('q') || '';
  const initialStatus   = searchParams.get('status') || '';
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts]       = useState([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(initialPage);
  const [pageSize, setPageSize]       = useState(initialPageSize);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchInput, setSearchInput] = useState(initialQ);
  const [q, setQ]                     = useState(initialQ);
  const [statusFilter, setStatus]     = useState(initialStatus);
  const [categoryFilter, setCategory] = useState(initialCategory);
  const [categoriesList, setCategories] = useState([]);
  const [actionMsg, setActionMsg]     = useState(null);
  const [selectedSkus, setSelectedSkus] = useState([]);

  // Limpiar selección cuando cambien los filtros o la página
  useEffect(() => {
    setSelectedSkus([]);
  }, [page, pageSize, q, statusFilter, categoryFilter]);

  const isAllSelected = products.length > 0 && products.every(p => selectedSkus.includes(p.sku));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSkus([]);
    } else {
      setSelectedSkus(products.map(p => p.sku));
    }
  };

  const toggleSelectSku = (sku) => {
    setSelectedSkus(prev =>
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    );
  };

  const handleBulkStatus = async (estado) => {
    if (selectedSkus.length === 0) return;
    try {
      const res = await productsApi.setBulkStatus(selectedSkus, estado);
      notify(`Se actualizaron ${res.updated ?? selectedSkus.length} producto(s) a "${estado}"`);
      setSelectedSkus([]);
      load();
    } catch (e) { notify(e.message, 'error'); }
  };

  // Cargar lista de categorías activas para el filtro
  useEffect(() => {
    let active = true;
    productsApi.categories()
      .then(res => { if (active) setCategories(res || []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Debounce para actualizar la consulta q sólo 1500ms después de que el usuario deja de escribir
  useEffect(() => {
    const handler = setTimeout(() => {
      setQ(searchInput.trim());
      setPage(1);
    }, 1500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sincronizar parámetros de estado con la URL del navegador
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (pageSize !== 25) params.pageSize = pageSize;
    if (q) params.q = q;
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;

    setSearchParams(params, { replace: true });
  }, [page, pageSize, q, statusFilter, categoryFilter, setSearchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.adminList({
        q,
        status: statusFilter,
        categoryCode: categoryFilter,
        page,
        pageSize
      });
      setProducts(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter, categoryFilter, page, pageSize]);

  useEffect(() => { load(); }, [load]);

  // Corrección automática: si la página actual excede el número total de páginas (ej. tras un borrado)
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [total, totalPages, page]);

  const notify = (msg, type = 'success') => {
    setActionMsg({ msg, type });
    setTimeout(() => setActionMsg(null), 3000);
  };

  const handleStatus = async (sku, estado) => {
    try {
      await productsApi.setStatus(sku, estado);
      notify(`Estado cambiado a "${estado}"`);
      load();
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleFeatured = async (sku, current) => {
    try {
      await productsApi.setFeatured(sku, !current);
      notify(!current ? 'Marcado como destacado ⭐' : 'Quitado de destacados');
      load();
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleDelete = async (sku, nombre) => {
    if (!window.confirm(`¿Borrar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await productsApi.remove(sku);
      notify(`"${nombre}" eliminado correctamente`);
      load();
    } catch (e) { notify(e.message, 'error'); }
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setQ('');
    setStatus('');
    setCategory('');
    setPage(1);
  };

  // Cálculo del rango de registros mostrados
  const fromIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const toIndex   = Math.min(page * pageSize, total);

  // Generador de números de página numéricos inteligentes
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const hasActiveFilters = Boolean(searchInput || statusFilter || categoryFilter);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Catálogo de Productos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {total} producto(s) en total · Administración de inventario y moderación
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/catalogo/nuevo')}
          className="flex items-center gap-2 bg-psp-cyan text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-cyan-700 transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </button>
      </div>

      {/* Mensaje de acción flotante */}
      {actionMsg && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${
          actionMsg.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {actionMsg.msg}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Caja de Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por SKU (ej. CHO-001), nombre o descripción... (presiona Enter para buscar)"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setQ(searchInput.trim());
                setPage(1);
              }
            }}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-psp-cyan"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setQ(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Selector de Categorías */}
        <select
          value={categoryFilter}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-psp-cyan"
        >
          <option value="">Todas las categorías</option>
          {categoriesList.map(c => (
            <option key={c.id} value={c.codigo}>{c.nombre} ({c.totalProductos})</option>
          ))}
        </select>

        {/* Selector de Estado */}
        <select
          value={statusFilter}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-psp-cyan"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="published">Publicado</option>
          <option value="rejected">Rechazado</option>
          <option value="archived">Archivado</option>
        </select>

        {/* Botón Recargar / Limpiar */}
        <button onClick={load} title="Recargar tabla" className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
          <RefreshCw className="w-4 h-4" />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Barra de Acciones Masivas */}
      {selectedSkus.length > 0 && (
        <div className="mb-4 p-3 bg-slate-900 text-white dark:bg-slate-700 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg border border-slate-700">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="bg-psp-cyan px-2.5 py-1 rounded-lg text-xs font-mono text-white">
              {selectedSkus.length} seleccionado(s)
            </span>
            <span>Acciones en lote:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('published')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" /> Aprobar Selección
            </button>
            <button
              onClick={() => handleBulkStatus('rejected')}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <XCircle className="w-4 h-4" /> Rechazar Selección
            </button>
            <button
              onClick={() => setSelectedSkus([])}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
            >
              Desmarcar todos
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="animate-spin h-8 w-8 border-4 border-psp-cyan border-t-transparent rounded-full" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 space-y-2">
          <p className="text-lg font-medium">No se encontraron productos</p>
          <p className="text-sm">Prueba ajustando los filtros de búsqueda o crea uno nuevo.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                <tr>
                  <th className="w-10 px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded text-psp-cyan focus:ring-psp-cyan h-4 w-4 cursor-pointer"
                      title="Seleccionar / desmarcar todos en esta página"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Imagen</th>
                  <th className="px-4 py-3 text-left">Nombre / SKU</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {products.map(p => (
                  <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${selectedSkus.includes(p.sku) ? 'bg-cyan-50/50 dark:bg-cyan-950/20' : ''}`}>
                    {/* Checkbox */}
                    <td className="w-10 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedSkus.includes(p.sku)}
                        onChange={() => toggleSelectSku(p.sku)}
                        className="rounded text-psp-cyan focus:ring-psp-cyan h-4 w-4 cursor-pointer"
                      />
                    </td>
                    {/* Imagen */}
                    <td className="px-4 py-3">
                      {p.imagen ? (
                        <img src={p.imagen} alt={p.nombre} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                          Sin foto
                        </div>
                      )}
                    </td>
                    {/* Nombre */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">{p.nombre}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{p.sku}</p>
                    </td>
                    {/* Categoría */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {p.categoria ?? '—'}
                    </td>
                    {/* Precio */}
                    <td className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                      ${Number(p.precio).toLocaleString('es-CO')}
                    </td>
                    {/* Stock */}
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                        {p.stock}
                      </span>
                    </td>
                    {/* Estado */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_LABELS[p.estado]?.cls ?? ''}`}>
                        {STATUS_LABELS[p.estado]?.label ?? p.estado}
                      </span>
                    </td>
                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* Editar */}
                        <button
                          onClick={() => navigate(`/admin/catalogo/editar/${p.sku}`)}
                          title="Editar"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-psp-cyan transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Aprobar */}
                        {p.estado !== 'published' && (
                          <button
                            onClick={() => handleStatus(p.sku, 'published')}
                            title="Aprobar y publicar"
                            className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-500 hover:text-green-600 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {/* Rechazar */}
                        {p.estado === 'pending' && (
                          <button
                            onClick={() => handleStatus(p.sku, 'rejected')}
                            title="Rechazar"
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {/* Archivar */}
                        {p.estado === 'published' && (
                          <button
                            onClick={() => handleStatus(p.sku, 'archived')}
                            title="Archivar"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        {/* Destacar */}
                        <button
                          onClick={() => handleFeatured(p.sku, p.destacado)}
                          title={p.destacado ? 'Quitar destacado' : 'Marcar destacado'}
                          className={`p-1.5 rounded-lg transition-colors ${p.destacado ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-yellow-500'}`}
                        >
                          {p.destacado ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => handleDelete(p.sku, p.nombre)}
                          title="Eliminar"
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Control de Paginación Profesional de Administración */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
            {/* Resumen de Rango Visible */}
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Mostrando <strong className="text-slate-800 dark:text-slate-100">{fromIndex}</strong> a <strong className="text-slate-800 dark:text-slate-100">{toIndex}</strong> de <strong className="text-slate-800 dark:text-slate-100">{total}</strong> productos
            </div>

            {/* Selector de Tamaño de Página y Navegación Numérica */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Selector de Tamaño de Página */}
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-slate-500 dark:text-slate-400">Por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-psp-cyan"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Botones de Navegación Numérica Directa */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Página Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((pNum, idx) => (
                  pNum === '...' ? (
                    <span key={`dots-${idx}`} className="px-2 text-xs text-slate-400">...</span>
                  ) : (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        page === pNum
                          ? 'bg-psp-cyan text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {pNum}
                    </button>
                  )
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Página Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
