import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, UploadCloud, AlertCircle,
  ChevronLeft, ChevronRight, Star, CheckCircle, FileText, Eye
} from 'lucide-react';
import productsApi from '../../services/productsApi';

// Categorías del catálogo como fallback garantizado con sus slugs y grupos
const FALLBACK_CATEGORIES = [
  { codigo: 'alimentos-agro',         nombre: 'Alimentos & Agro',           group: 'Productos Físicos' },
  { codigo: 'artesanias-moda',        nombre: 'Artesanías & Moda',          group: 'Productos Físicos' },
  { codigo: 'hogar-decoracion',       nombre: 'Hogar & Decoración',         group: 'Productos Físicos' },
  { codigo: 'salud-bienestar',        nombre: 'Salud & Bienestar',          group: 'Productos Físicos' },
  { codigo: 'tecnologia-electronica', nombre: 'Tecnología & Electrónica',   group: 'Productos Físicos' },
  { codigo: 'educacion-libros',       nombre: 'Educación & Libros',         group: 'Productos Físicos' },
  { codigo: 'bebidas-gastronomia',    nombre: 'Restaurantes & Gastronomía', group: 'Servicios & Experiencias' },
  { codigo: 'servicios-empresariales', nombre: 'Servicios Empresariales',   group: 'Servicios & Experiencias' },
  { codigo: 'transporte-logistica',   nombre: 'Transporte & Logística',     group: 'Servicios & Experiencias' },
  { codigo: 'turismo-experiencias',   nombre: 'Turismo & Experiencias',     group: 'Servicios & Experiencias' },
];

const SERVICE_CODES = new Set([
  'bebidas-gastronomia',
  'servicios-empresariales',
  'transporte-logistica',
  'turismo-experiencias'
]);

const EMPTY = {
  nombre: '',
  categoriaId: '',
  precio: '',
  precioAnterior: '',
  stock: '',
  sku: '',
  municipio: '',
  descripcion: '',
  descripcionDetallada: '',
  estado: 'published',
  caracteristicas: [],
  especificaciones: [],
};

const resolveCategoryCode = (prod, categoryList) => {
  if (!prod) return '';
  const allCats = Array.isArray(categoryList) && categoryList.length > 0 
    ? categoryList 
    : FALLBACK_CATEGORIES;

  const candidateCode = prod.categoriaCodigo || prod.categoryCode;
  if (candidateCode) {
    const found = allCats.find(c => (c.codigo || c.code)?.toLowerCase() === candidateCode.toLowerCase());
    if (found) return found.codigo || found.code;
  }

  const raw = prod.categoriaId || prod.categoria || prod.category;
  if (raw) {
    const found = allCats.find(c => 
      c.id?.toString().toLowerCase() === raw.toString().toLowerCase() ||
      c.codigo?.toLowerCase() === raw.toString().toLowerCase() ||
      c.code?.toLowerCase() === raw.toString().toLowerCase() ||
      c.nombre?.toLowerCase() === raw.toString().toLowerCase() ||
      c.name?.toLowerCase() === raw.toString().toLowerCase()
    );
    if (found) return found.codigo || found.code;
  }

  return candidateCode || prod.categoriaId || '';
};

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { sku: editSku } = useParams();
  const isEdit = Boolean(editSku);

  const [form, setForm]             = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [rawProduct, setRawProduct] = useState(null);
  const [galleryItems, setGallery]  = useState([]); // Unificado: { id, url, file, isPending }
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [loadingProd, setLoadingProd] = useState(isEdit);
  const [draggedIdx, setDraggedIdx] = useState(null);

  // Cargar categorías reales de la API
  useEffect(() => {
    let isMounted = true;
    productsApi.categories()
      .then(list => {
        if (!isMounted) return;
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
          if (rawProduct) {
            const matchedCode = resolveCategoryCode(rawProduct, list);
            if (matchedCode) {
              setForm(f => ({ ...f, categoriaId: matchedCode }));
            }
          }
        }
      })
      .catch(err => {
        console.warn('No se pudieron cargar categorías dinámicas, usando fallback:', err);
      });
    return () => { isMounted = false; };
  }, [rawProduct]);

  // Si es edición, cargar los datos completos del producto
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoadingProd(true);
      try {
        const p = await productsApi.adminGet(editSku);
        setRawProduct(p);
        
        let specsList = [];
        if (p.especificaciones && typeof p.especificaciones === 'object') {
          if (Array.isArray(p.especificaciones)) {
            specsList = p.especificaciones;
          } else {
            specsList = Object.entries(p.especificaciones).map(([clave, valor]) => ({ clave, valor }));
          }
        }

        const selectedCat = resolveCategoryCode(p, categories);

        setForm({
          nombre:               p.nombre ?? '',
          categoriaId:          selectedCat,
          precio:               p.precio ?? '',
          precioAnterior:       p.precioAnterior ?? '',
          stock:                p.stock ?? '',
          sku:                  p.sku ?? '',
          municipio:            p.municipio ?? '',
          descripcion:          p.descripcion ?? '',
          descripcionDetallada: p.descripcionDetallada ?? '',
          estado:               p.estado ?? 'published',
          caracteristicas:      Array.isArray(p.caracteristicas) ? p.caracteristicas : [],
          especificaciones:     specsList,
        });

        const initialGallery = (p.imagenes ?? []).map((imgUrl, i) => ({
          id: `existing-${i}-${Date.now()}`,
          url: imgUrl,
          isPending: false
        }));
        setGallery(initialGallery);
      } catch (e) {
        setError('No se pudo cargar el producto: ' + e.message);
      } finally {
        setLoadingProd(false);
      }
    })();
  }, [isEdit, editSku]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // ── Gestión de imágenes de galería (Reordenamiento y Portada) ───────────

  const handleAddFiles = (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const newItems = Array.from(filesList).map((file, i) => ({
      id: `pending-${i}-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      isPending: true
    }));
    setGallery(prev => [...prev, ...newItems]);
  };

  const moveImage = (fromIdx, direction) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= galleryItems.length) return;
    setGallery(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated;
    });
  };

  const makeCover = (idx) => {
    if (idx === 0) return;
    setGallery(prev => {
      const updated = [...prev];
      const [cover] = updated.splice(idx, 1);
      updated.unshift(cover);
      return updated;
    });
  };

  const removeImage = (idx) => {
    const item = galleryItems[idx];
    if (item?.isPending && item.url) {
      URL.revokeObjectURL(item.url);
    }
    setGallery(prev => prev.filter((_, i) => i !== idx));
  };

  // Drag & Drop reordering
  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    setGallery(prev => {
      const updated = [...prev];
      const [item] = updated.splice(draggedIdx, 1);
      updated.splice(idx, 0, item);
      return updated;
    });
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  // ── Características y Especificaciones ─────────────────────────────────

  const addCaracteristica = () => set('caracteristicas', [...form.caracteristicas, '']);
  const setCaract = (i, v) => set('caracteristicas', form.caracteristicas.map((c, idx) => idx === i ? v : c));
  const removeCaract = (i) => set('caracteristicas', form.caracteristicas.filter((_, idx) => idx !== i));

  const addSpec = () => set('especificaciones', [...form.especificaciones, { clave: '', valor: '' }]);
  const setSpec = (i, key, v) => set('especificaciones', form.especificaciones.map((s, idx) => idx === i ? { ...s, [key]: v } : s));
  const removeSpec = (i) => set('especificaciones', form.especificaciones.filter((_, idx) => idx !== i));

  // ── Guardar ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.categoriaId) {
      setError('Debes seleccionar una categoría válida.');
      return;
    }

    setSaving(true);

    const especificacionesObj = {};
    form.especificaciones.forEach(s => {
      const k = s.clave?.trim();
      const v = s.valor?.trim();
      if (k && v) {
        especificacionesObj[k] = v;
      }
    });

    const existingUrls = galleryItems.filter(item => !item.isPending).map(item => item.url);
    const pendingFiles = galleryItems.filter(item => item.isPending).map(item => item.file);

    const payload = {
      nombre:               form.nombre.trim(),
      categoriaId:          form.categoriaId,
      precio:               Number(form.precio) || 0,
      precioAnterior:       form.precioAnterior ? Number(form.precioAnterior) : null,
      stock:                parseInt(form.stock, 10) || 0,
      descripcion:          form.descripcion?.trim() || null,
      descripcionDetallada: form.descripcionDetallada?.trim() || null,
      municipio:            form.municipio?.trim() || null,
      sku:                  form.sku?.trim() || null,
      estado:               form.estado || 'published',
      imagenes:             existingUrls,
      caracteristicas:      form.caracteristicas.map(c => c.trim()).filter(Boolean),
      especificaciones:     Object.keys(especificacionesObj).length > 0 ? especificacionesObj : null,
    };

    try {
      let saved;
      if (isEdit) {
        saved = await productsApi.update(editSku, payload);
      } else {
        saved = await productsApi.create(payload);
      }

      // Subir imágenes pendientes manteniendo el orden
      const targetSku = editSku || saved?.sku || form.sku;
      if (pendingFiles.length > 0 && targetSku) {
        for (const file of pendingFiles) {
          await productsApi.uploadImage(targetSku, file);
        }
      }

      navigate('/admin/catalogo');
    } catch (err) {
      setError(err.message || 'Error al guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProd) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-psp-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  const finalCategories = categories.length > 0
    ? categories.map(c => ({
        id: c.id,
        codigo: c.codigo || c.code,
        nombre: c.nombre || c.name,
        group: SERVICE_CODES.has(c.codigo || c.code) ? 'Servicios & Experiencias' : 'Productos Físicos'
      }))
    : FALLBACK_CATEGORIES.map(c => ({
        id: c.codigo,
        codigo: c.codigo,
        nombre: c.nombre,
        group: c.group
      }));

  const groups = {};
  finalCategories.forEach(c => {
    const g = c.group || 'General';
    if (!groups[g]) groups[g] = [];
    groups[g].push(c);
  });

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/catalogo')}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          {isEdit && <p className="text-xs font-mono text-slate-400 mt-0.5">SKU: {editSku}</p>}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ── Estado de publicación ────────────────────────────────────── */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide">
            Estado de publicación
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
              form.estado === 'published'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="estado"
                  value="published"
                  checked={form.estado === 'published'}
                  onChange={() => set('estado', 'published')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Publicado
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                El producto aparecerá de inmediato en el catálogo público para los compradores.
              </p>
            </label>

            <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
              form.estado === 'pending'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="estado"
                  value="pending"
                  checked={form.estado === 'pending'}
                  onChange={() => set('estado', 'pending')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" /> En Moderación
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                Quedará guardado en la cola de revisión antes de ser publicado comercialmente.
              </p>
            </label>

            <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
              form.estado === 'archived'
                ? 'border-slate-500 bg-slate-100 dark:bg-slate-700/40'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="estado"
                  value="archived"
                  checked={form.estado === 'archived'}
                  onChange={() => set('estado', 'archived')}
                  className="text-slate-600 focus:ring-slate-500"
                />
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-500" /> Archivado / Oculto
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                El producto se guardará en inventario pero no estará visible públicamente.
              </p>
            </label>
          </div>
        </section>

        {/* ── Información básica ─────────────────────────────────────── */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide">
            Información básica
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nombre del producto *
              </label>
              <input
                required
                type="text"
                maxLength={160}
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                className="input-field"
                placeholder="Ej. Bolso Canasto Artesanal en Fibra Natural"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Categoría *
              </label>
              <select
                required
                value={form.categoriaId}
                onChange={e => set('categoriaId', e.target.value)}
                className="input-field"
              >
                <option value="">Selecciona una categoría</option>
                {Object.entries(groups).map(([groupName, items]) => (
                  <optgroup key={groupName} label={groupName}>
                    {items.map(c => (
                      <option key={c.id || c.codigo} value={c.codigo}>
                        {c.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SKU (Código único) (opcional)
              </label>
              <input
                type="text"
                disabled={isEdit}
                value={form.sku}
                onChange={e => set('sku', e.target.value.toUpperCase())}
                className="input-field font-mono uppercase disabled:bg-slate-100 dark:disabled:bg-slate-900"
                placeholder="Ej. ART-CAN-01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Precio (COP) *
              </label>
              <input
                required
                type="number"
                min="0"
                step="100"
                value={form.precio}
                onChange={e => set('precio', e.target.value)}
                className="input-field"
                placeholder="Ej. 65000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Precio anterior (COP) (opcional)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={form.precioAnterior}
                onChange={e => set('precioAnterior', e.target.value)}
                className="input-field"
                placeholder="Ej. 75000 (para mostrar descuento)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Stock disponible *
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={e => set('stock', e.target.value)}
                className="input-field"
                placeholder="Ej. 30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Municipio de origen (opcional)
              </label>
              <input
                value={form.municipio}
                onChange={e => set('municipio', e.target.value)}
                className="input-field"
                placeholder="Ej. Turbo, Apartadó, Carepa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción corta *
            </label>
            <textarea
              required
              rows={2}
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              className="input-field resize-none"
              placeholder="Descripción breve para la tarjeta de catálogo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción detallada
            </label>
            <textarea
              rows={4}
              value={form.descripcionDetallada}
              onChange={e => set('descripcionDetallada', e.target.value)}
              className="input-field resize-none"
              placeholder="Texto completo que describe el producto en la vista de detalle..."
            />
          </div>
        </section>

        {/* ── Galería de imágenes (Reordenamiento interactivo) ───────────── */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide">
              Galería de imágenes
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Arrastra o usa los botones para ordenar. La <strong>#1</strong> será la portada.
            </span>
          </div>

          {galleryItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {galleryItems.map((item, i) => {
                const isCover = i === 0;
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragEnd={handleDragEnd}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all bg-slate-50 dark:bg-slate-900 ${
                      isCover
                        ? 'border-psp-cyan ring-2 ring-psp-cyan/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {/* Badge de Posición / Portada */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      {isCover ? (
                        <span className="bg-psp-cyan text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> PORTADA
                        </span>
                      ) : (
                        <span className="bg-slate-900/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-full shadow">
                          #{i + 1}
                        </span>
                      )}
                    </div>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 z-10 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1.5 shadow transition-colors"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Previsualización de Imagen */}
                    <div className="w-full h-36 overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <img
                        src={item.url}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Barra de Acciones de Reordenamiento */}
                    <div className="p-2 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors"
                          title="Mover a la izquierda"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, 1)}
                          disabled={i === galleryItems.length - 1}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors"
                          title="Mover a la derecha"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                        </button>
                      </div>

                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => makeCover(i)}
                          className="text-[10px] font-bold text-psp-cyan hover:underline flex items-center gap-0.5"
                          title="Establecer como Portada principal"
                        >
                          <Star className="w-3 h-3" /> Hacer Portada
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Zona Dropzone para subir o agregar fotos */}
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 cursor-pointer hover:border-psp-cyan transition-colors bg-slate-50/50 dark:bg-slate-900/20">
            <UploadCloud className="w-8 h-8 text-slate-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Haz clic o arrastra fotos para la galería
            </span>
            <span className="text-xs text-slate-400">JPG, PNG o WebP · Máx. 5 MB por archivo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => {
                handleAddFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
        </section>

        {/* ── Características ─────────────────────────────────────────── */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide">
              Características destacadas
            </h2>
            <button
              type="button"
              onClick={addCaracteristica}
              className="flex items-center gap-1 text-xs font-semibold text-psp-cyan hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar
            </button>
          </div>
          <p className="text-xs text-slate-400">Puntos clave del producto (ej. "Elaboración artesanal 100%", "Material ecológico")</p>
          
          <div className="space-y-2">
            {form.caracteristicas.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={c}
                  onChange={e => setCaract(i, e.target.value)}
                  placeholder={`Característica ${i + 1}`}
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeCaract(i)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {form.caracteristicas.length === 0 && (
            <p className="text-sm text-slate-400 italic">No has agregado características aún.</p>
          )}
        </section>

        {/* ── Especificaciones técnicas ────────────────────────────────── */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide">
              Especificaciones técnicas
            </h2>
            <button
              type="button"
              onClick={addSpec}
              className="flex items-center gap-1 text-xs font-semibold text-psp-cyan hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar
            </button>
          </div>
          <p className="text-xs text-slate-400">Pares clave-valor (ej. Peso → 250g, Origen → Turbo, Presentación → Pieza única)</p>
          
          <div className="space-y-2">
            {form.especificaciones.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={s.clave}
                  onChange={e => setSpec(i, 'clave', e.target.value)}
                  placeholder="Propiedad (ej. Peso)"
                  className="input-field w-1/3"
                />
                <input
                  value={s.valor}
                  onChange={e => setSpec(i, 'valor', e.target.value)}
                  placeholder="Valor (ej. 250g)"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {form.especificaciones.length === 0 && (
            <p className="text-sm text-slate-400 italic">No has agregado especificaciones técnicas aún.</p>
          )}
        </section>

        {/* ── Acciones ─────────────────────────────────────────────────── */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => navigate('/admin/catalogo')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-psp-cyan text-white font-semibold text-sm hover:bg-cyan-600 disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Guardar cambios' : 'Crear producto'}
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.625rem;
          border: 1px solid #cbd5e1;
          background: white;
          color: #0f172a;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dark .input-field {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .input-field:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
        }
      `}</style>
    </div>
  );
}
