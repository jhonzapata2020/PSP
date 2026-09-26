import React, { useState } from 'react';
import { User, Camera, ShieldCheck, MapPin, Mail, Phone, Edit3, Save, ZoomIn, Check, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, loading, error, setError } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [municipio, setMunicipio] = useState(user?.municipio || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedOk, setSavedOk] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoZoom, setPhotoZoom] = useState(100);

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
      setSaveError(err?.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = async (newAvatar) => {
    setSaveError('');
    try {
      await updateProfile({ avatar: newAvatar });
      setShowPhotoModal(false);
    } catch (err) {
      setSaveError(err?.message || 'No se pudo actualizar la foto.');
    }
  };

  const presetAvatars = [
    { label: 'Femenino', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
    { label: 'Masculino', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
    { label: 'Neutral', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' },
    { label: 'Empresarial', url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80' },
  ];

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
              onClick={() => setShowPhotoModal(true)}
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
            onClick={() => setEditing(!editing)}
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
                {user.permissions?.includes('roles.manage') && (
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

              {/* Preset options */}
              <div className="w-full space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 block">Elegir un avatar predeterminado:</span>
                <div className="grid grid-cols-4 gap-2">
                  {presetAvatars.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePhotoSelect(item.url)}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-14 h-14 rounded-full object-cover border border-slate-300 dark:border-slate-700 group-hover:ring-2 group-hover:ring-psp-cyan transition-all"
                      />
                      <span className="text-[10px] text-slate-400 group-hover:text-white font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
