import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, RefreshCw, CheckCircle, XCircle, Archive, Star, StarOff, Trash2, Pencil, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import productsApi from '../../services/productsApi';

const STATUS_LABELS = {
  pending:   { label: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  published: { label: 'Publicado',  cls: 'bg-green-100  text-green-800  border-green-200'  },
  rejected:  { label: 'Rechazado', cls: 'bg-red-100    text-red-800    border-red-200'    },
  archived:  { label: 'Archivado', cls: 'bg-slate-100  text-slate-600  border-slate-200'  },
};

const CATEGORY_TABS = [
  { code: '',                      label: 'Todos'         },
  { code: 'alimentos-agro',        label: 'Alimentos'     },
  { code: 'artesanias-moda',       label: 'Artesanías'    },
  { code: 'bebidas-gastronomia',   label: 'Restaurantes'  },
  { code: 'servicios-empresariales', label: 'Servicios'   },
  { code: 'transporte-logistica',  label: 'Transporte'    },
  { code: 'turismo-experiencias',  label: 'Turismo'       },
  { code: 'hogar-decoracion',      label: 'Hogar'         },
  { code: 'salud-bienestar',       label: 'Salud'         },
  { code: 'tecnologia-electronica', label: 'Tecnología'   },
];

export default function AdminCatalogoPage() {
  const navigate = useNavigate();
  const [products, setProducts]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [q, setQ]                 = useState('');
  const [statusFilter, setStatus] = useState('');
  const [actionMsg, setActionMsg] = useState(null);

  const pageSize = 24;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.adminList({ q, status: statusFilter, page, pageSize });
      setProducts(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

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

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Catálogo de Productos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {total} productos en total · incluye todos los estados y categorías
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/catalogo/nuevo')}
          className="flex items-center gap-2 bg-psp-cyan text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-cyan-700 transition-colors shrink-0"
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU..."
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-psp-cyan"
          />
        </div>
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
        <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
          <RefreshCw className="w-4 h-4" /> Recargar
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-8 w-8 border-4 border-psp-cyan border-t-transparent rounded-full" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-slate-400 dark:text-slate-500">
          <p className="text-lg font-medium mb-1">No hay productos</p>
          <p className="text-sm">Prueba con otro filtro o crea el primero.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                <tr>
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
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              <span>Página {page} de {totalPages} · {total} productos</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg border disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg border disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
