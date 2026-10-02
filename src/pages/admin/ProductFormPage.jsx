import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, UploadCloud, AlertCircle } from 'lucide-react';
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
  caracteristicas: [],
  especificaciones: [],
};

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { sku: editSku } = useParams();
  const isEdit = Boolean(editSku);

  const [form, setForm]             = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [images, setImages]         = useState([]);
  const [pendingFiles, setPending]  = useState([]);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [loadingProd, setLoadingProd] = useState(isEdit);

  // Cargar categorías reales de la API (devuelve { id, codigo, nombre, ... })
  useEffect(() => {
    let isMounted = true;
    productsApi.categories()
      .then(list => {
        if (!isMounted) return;
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
        }
      })
      .catch(err => {
        console.warn('No se pudieron cargar categorías dinámicas, usando fallback:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Si es edición, cargar los datos completos del producto
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoadingProd(true);
      try {
        const p = await productsApi.adminGet(editSku);
        
        // Convertir especificaciones (objeto clave-valor en backend) a lista para el formulario
        let specsList = [];
        if (p.especificaciones && typeof p.especificaciones === 'object') {
          if (Array.isArray(p.especificaciones)) {
            specsList = p.especificaciones;
          } else {
            specsList = Object.entries(p.especificaciones).map(([clave, valor]) => ({ clave, valor }));
          }
        }

        setForm({
          nombre:               p.nombre ?? '',
          categoriaId:          p.categoriaId ?? '',
          precio:               p.precio ?? '',
          precioAnterior:       p.precioAnterior ?? '',
          stock:                p.stock ?? '',
          sku:                  p.sku ?? '',
          municipio:            p.municipio ?? '',
          descripcion:          p.descripcion ?? '',
          descripcionDetallada: p.descripcionDetallada ?? '',
          caracteristicas:      Array.isArray(p.caracteristicas) ? p.caracteristicas : [],
          especificaciones:     specsList,
        });
        setImages(p.imagenes ?? []);
      } catch (e) {
        setError('No se pudo cargar el producto: ' + e.message);
      } finally {
        setLoadingProd(false);
      }
    })();
  }, [isEdit, editSku]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // ── Características (lista de strings) ──────────────────────────────────
  const addCaracteristica = () => set('caracteristicas', [...form.caracteristicas, '']);
  const setCaract = (i, v) => set('caracteristicas', form.caracteristicas.map((c, idx) => idx === i ? v : c));
  const removeCaract = (i) => set('caracteristicas', form.caracteristicas.filter((_, idx) => idx !== i));

  // ── Especificaciones (lista de { clave, valor }) ─────────────────────────
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

    // Convertir lista de especificaciones [{ clave, valor }] al diccionario que espera el backend
    const especificacionesObj = {};
    form.especificaciones.forEach(s => {
      const k = s.clave?.trim();
      const v = s.valor?.trim();
      if (k && v) {
        especificacionesObj[k] = v;
      }
    });

    const existingUrls = images.map(img => (typeof img === 'string' ? img : img.url)).filter(Boolean);

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

      // Subir imágenes pendientes si se seleccionaron
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

  // Combinar categorías de la BD con el agrupador
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
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                className="input-field"
                placeholder="Ej. Chocolates Artesanales de Urabá"
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
                <option value="">-- Selecciona una categoría --</option>
                {Object.entries(groups).map(([groupName, items]) => (
                  <optgroup key={groupName} label={groupName}>
                    {items.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SKU {isEdit ? '(inmutable)' : '(opcional)'}
              </label>
              <input
                value={form.sku}
                onChange={e => set('sku', e.target.value)}
                disabled={isEdit}
                placeholder="Ej. CHOC-001 (se genera si se deja vacío)"
                className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
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
                placeholder="Ej. 20000"
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
                placeholder="Ej. 25000 (para mostrar descuento)"
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
                placeholder="Ej. 10"
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
                placeholder="Ej. Apartadó, Turbo, Carepa"
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

        {/* ── Galería de imágenes ──────────────────────────────────────── */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide">
            Galería de imágenes
          </h2>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-2">
              {images.map((img, i) => {
                const url = typeof img === 'string' ? img : img.url;
                const isMain = i === 0 || (typeof img === 'object' && img.isMain);
                return (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 object-cover" />
                    {isMain && (
                      <span className="absolute top-1 left-1 bg-psp-cyan text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                        PORTADA
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 shadow transition-colors"
                      title="Quitar foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 cursor-pointer hover:border-psp-cyan transition-colors bg-slate-50/50 dark:bg-slate-900/20">
            <UploadCloud className="w-8 h-8 text-slate-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {pendingFiles.length > 0
                ? `${pendingFiles.length} imagen(es) seleccionada(s)`
                : 'Haz clic o arrastra fotos para la galería'}
            </span>
            <span className="text-xs text-slate-400">JPG, PNG o WebP · Máx. 5 MB por archivo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => setPending(Array.from(e.target.files || []))}
            />
          </label>

          {pendingFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {pendingFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full"
                >
                  <span className="truncate max-w-[140px] font-medium">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setPending(pf => pf.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-500 font-bold ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
          <p className="text-xs text-slate-400">Puntos clave del producto (ej. "Elaboración artesanal", "Orgánico 100%")</p>
          
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
          <p className="text-xs text-slate-400">Pares clave-valor (ej. Peso → 250g, Origen → Urabá, Presentación → Caja)</p>
          
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
