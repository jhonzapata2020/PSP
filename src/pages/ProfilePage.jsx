import React, { useEffect, useRef, useState } from 'react';
import { User, Camera, ShieldCheck, MapPin, Mail, Phone, Edit3, Save, ZoomIn, Check, Building, Upload, ImagePlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/** Formatos que admite el backend (se verifica la firma binaria, no la extensión). */
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
/** Tope también en el cliente para fallar rápido y sin subir nada. */
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

/**
 * Pasa un error de la API por el filtro de la experiencia de usuario: aquí no
 * llegan ni nombres de endpoint ni de campo, sólo frases que se puedan leer.
 * Lo que ya viene redactado para la persona (tamaño, formato) se respeta.
 */
function friendlyError(err, generic) {
  const status = err?.status;
  const msg = String(err?.message || '').trim();

  if (!msg || status === 0) return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
  if (status === 401) return 'Tu sesión ha expirado. Cierra sesión y vuelve a entrar.';
  if (status === 403) return 'No tienes permiso para hacer este cambio.';
  if (status === 429) return 'Demasiados intentos. Espera un momento y vuelve a probar.';
  if (status === 503 || status >= 500) return 'El servicio no está disponible ahora mismo. Inténtalo de nuevo en unos minutos.';

  // Jerga de API (endpoints, nombres de campo, variables): no debe llegar al UI.
  if (/GET |POST |PUT |DELETE |PATCH |\/api\/|'file'|R2_|\.jpg|\.png/i.test(msg)) {
    return 'Elige una de las fotos predeterminadas o sube una imagen desde tu dispositivo.';
  }

  return generic || msg;
}

const ProfilePage = () => {
  const { user, updateProfile, uploadAvatar, avatarDefaults, loading, error, setError, hasPermission } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [municipio, setMunicipio] = useState(user?.municipio || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedOk, setSavedOk] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoZoom, setPhotoZoom] = useState(100);

  // Modal de foto: errores y subida propios del modal (antes el error del
  // selector salía pintado dentro del formulario de edición, que es otro sitio).
  const [modalError, setModalError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [defaults, setDefaults] = useState(() => avatarDefaults || []);
  const [defaultsLoading, setDefaultsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Al abrir el modal se vuelven a pedir las fotos de fábrica: así refleja
  // siempre lo que hay en el bucket y hay dónde recargar si la API falló.
  useEffect(() => {
    if (!showPhotoModal) return undefined;

    let alive = true;
    setModalError('');
    setDefaultsLoading(true);

    api.avatarDefaults()
      .then((list) => { if (alive) setDefaults(Array.isArray(list) ? list : []); })
      .catch(() => { if (alive) setDefaults([]); })
      .finally(() => { if (alive) setDefaultsLoading(false); });

    return () => { alive = false; };
  }, [showPhotoModal]);


  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Debes iniciar sesión para ver tu perfil</h2>
        <a href="/ingresar" className="mt-4 px-6 py-2.5 rounded-xl bg-psp-cyan text-slate-950 font-bold text-xs">
          Ir a Iniciar Sesión
        </a>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSavedOk(false);
    try {
      // PUT /api/auth/profile → el rol NUNCA se edita desde aquí (sólo el admin).
      await updateProfile({ name, municipio });
      setSavedOk(true);
      setEditing(false);
    } catch (err) {
      setSaveError(friendlyError(err, 'No se pudieron guardar los cambios.'));
    } finally {
      setSaving(false);
    }
  };

  /** Elige una de las fotos de fábrica (R2) y la guarda en el perfil. */
  const handlePhotoSelect = async (newAvatar) => {
    setModalError('');
    setSaveError('');
    try {
      await updateProfile({ avatar: newAvatar });
      setShowPhotoModal(false);
      setSavedOk(true);
    } catch (err) {
      setModalError(friendlyError(err, 'No se pudo cambiar la foto.'));
    }
  };

  /**
   * Sube una imagen del dispositivo (PC o móvil) por POST /api/auth/avatar.
   * El navegador sólo habla con la API; el bucket queda fuera del cliente.
   */
  const handleFilePick = async (e) => {
    const file = e.target.files?.[0];
    // Se limpia siempre: si no, elegir el mismo fichero otra vez no dispara onChange.
    e.target.value = '';
    if (!file) return;

    setModalError('');
    setSaveError('');

    if (!AVATAR_TYPES.includes(file.type)) {
      setModalError('Ese formato no está admitido. Elige una imagen JPG, PNG o WebP.');
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setModalError(`La imagen pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB. El máximo son 2 MB.`);
      return;
    }

    setUploading(true);
    try {
      await uploadAvatar(file);
      setShowPhotoModal(false);
      setSavedOk(true);
    } catch (err) {
      setModalError(friendlyError(err, 'No se pudo subir la imagen.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8">
      
      {/* Profile Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-psp-teal-dark via-slate-900 to-psp-dark-card p-8 text-white border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          
          {/* Avatar with Camera Button */}
          <div className="relative group">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-psp-cyan/50 shadow-xl"
            />
            <button
              onClick={() => { setShowPhotoModal(true); setSaveError(''); setSavedOk(false); }}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-psp-cyan text-slate-950 shadow-lg hover:scale-110 transition-transform"
              title="Cambiar foto de perfil"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold">{user.name}</h1>
              {(user.roleDisplayNames?.length ? user.roleDisplayNames : [user.role]).map((rol) => (
                <span
                  key={rol}
                  className="px-3 py-1 rounded-full bg-psp-cyan/20 text-psp-cyan text-xs font-bold border border-psp-cyan/30"
                >
                  {rol}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-psp-cyan" /> {user.municipio}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          <button
            onClick={() => { setEditing(!editing); setSaveError(''); setSavedOk(false); }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            {editing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>
      </div>

      {/* Edit Form or Account Info */}
      {editing ? (
        <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Editar Información Personal</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tu rol lo gestiona el administrador
            </span>
          </div>

          {saveError && (
            <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
              {saveError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo / Razón Social</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Municipio / Región</label>
              <input
                type="text"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait"
            >
              <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      ) : (
        <>
          {savedOk && (
            <p className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
              ✓ Perfil actualizado correctamente.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Detalles de la Cuenta</h3>
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <p><strong>Tipo de Persona:</strong> {user.personType === 'juridica' ? 'Persona Jurídica (Empresa)' : 'Persona Natural'}</p>
                {user.gender && <p><strong>Género:</strong> {user.gender === 'femenino' ? 'Femenino' : user.gender === 'masculino' ? 'Masculino' : 'Otro'}</p>}
                <p><strong>Documento / NIT:</strong> {user.documentType} - {user.documentNumber}</p>
                <p><strong>Teléfono:</strong> {user.phone || '—'}</p>
                <p>
                  <strong>Estado del Perfil:</strong>{' '}
                  {user.completedProfile >= 100 ? (
                    <span className="text-emerald-400 font-bold">✓ 100% Completado</span>
                  ) : (
                    <span className="text-amber-400 font-bold">{user.completedProfile}% Completado</span>
                  )}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Accesos Rápidos</h3>
              <div className="space-y-2 text-xs">
                <a href="/comercio" className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-psp-cyan/10 font-medium">
                  🛍 Mis Compras & Listas Guardadas
                </a>
                <a href="/foro" className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-psp-cyan/10 font-medium">
                  💬 Mis Temas Publicados en el Foro
                </a>
                {['users.read', 'roles.read', 'products.manage', 'audit.read'].some((code) => hasPermission(code)) && (
                  <a href="/admin" className="block p-3 rounded-xl bg-psp-cyan/10 border border-psp-cyan/30 hover:bg-psp-cyan/20 font-bold text-psp-cyan">
                    🛡 Panel de Administración (Gestor de Identidades)
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Profile Photo Crop / Selector Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-psp-dark-card max-w-md w-full rounded-3xl p-6 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Editar foto de perfil</h3>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="relative overflow-hidden rounded-full ring-4 ring-psp-cyan w-36 h-36 flex items-center justify-center bg-slate-900 shadow-lg">
                <img
                  src={user.avatar}
                  alt="Vista previa foto de perfil"
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{ transform: `scale(${photoZoom / 100})` }}
                />
              </div>

              {/* Zoom slider */}
              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-bold">
                  <span>Zoom de la imagen</span>
                  <span>{photoZoom}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="160"
                  value={photoZoom}
                  onChange={(e) => setPhotoZoom(Number(e.target.value))}
                  className="w-full accent-psp-cyan cursor-pointer"
                />
              </div>

              {/* Subida desde el dispositivo (PC o móvil) */}
              <div className="w-full space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 block">Sube una foto tuya:</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={AVATAR_TYPES.join(',')}
                  onChange={handleFilePick}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:brightness-95 disabled:opacity-60 disabled:cursor-wait"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Subiendo tu foto…' : 'Elegir imagen del dispositivo'}
                </button>
                <p className="text-[10px] text-slate-400">
                  JPG, PNG o WebP · máximo 2 MB. Se muestra recortada en círculo y la foto anterior se borra sola.
                </p>
              </div>

              {/* Fotos de fábrica: las sirve la API desde el bucket */}
              <div className="w-full space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 block">O elige una foto predeterminada:</span>

                {defaultsLoading ? (
                  <p className="text-[11px] text-slate-400">Cargando fotos…</p>
                ) : defaults.length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    Ahora mismo no hay fotos predeterminadas disponibles. Puedes subir una desde tu dispositivo.
                  </p>
                ) : (
                  <div className="grid grid-cols-6 gap-2">
                    {defaults.map((url, idx) => {
                      const activa = url === user.avatar;
                      return (
                        <button
                          key={url}
                          type="button"
                          onClick={() => handlePhotoSelect(url)}
                          title={`Foto predeterminada ${idx + 1}`}
                          className={`rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                            activa ? 'border-psp-cyan ring-2 ring-psp-cyan/40' : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Foto predeterminada ${idx + 1}`}
                            loading="lazy"
                            className="w-full aspect-square object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {modalError && (
              <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                {modalError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
