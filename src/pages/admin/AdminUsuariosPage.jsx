import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search, Plus, Pencil, Trash2, ShieldCheck, Ban, CheckCircle2,
  ChevronLeft, ChevronRight, RefreshCw, MapPin,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';

const STATUSES = [
  { value: '', label: 'Todos los estados' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'blocked', label: 'Bloqueado' },
];

const STATUS_META = {
  active:   { label: 'Activo',   cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  inactive: { label: 'Inactivo', cls: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  blocked:  { label: 'Bloqueado',cls: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
};

const EMPTY_FORM = {
  email: '', password: '', name: '', personType: 'natural',
  documentType: 'CC', documentNumber: '', gender: '',
  municipio: '', phone: '', avatar: '', status: 'active',
};

export default function AdminUsuariosPage() {
  const { user: me, hasPermission } = useAuth();

  const canWrite  = hasPermission('users.write');
  const canDelete = hasPermission('users.delete');
  const canAssign = hasPermission('roles.manage');

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 10 });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [rolesUser, setRolesUser] = useState(null);   // usuario p/ asignar roles
  const [rolesSel, setRolesSel] = useState([]);
  const [savingRoles, setSavingRoles] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  // ---------- carga ----------
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.users({ q, status, page, pageSize });
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [q, status, page, pageSize]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.roles().then(setRoles).catch(() => setRoles([]));
  }, []);

  // debounce del buscador
  const [term, setTerm] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setQ(term); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [term]);

  // ---------- formulario ----------
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = async (u) => {
    setFormError('');
    setEditingId(u.id);
    try {
      const full = await api.user(u.id);
      setForm({
        email: full.email,
        password: '',
        name: full.name,
        personType: full.personType,
        documentType: full.documentType,
        documentNumber: full.documentNumber,
        gender: full.gender ?? '',
        municipio: full.municipio ?? '',
        phone: full.phone ?? '',
        avatar: full.avatar ?? '',
        status: full.status,
      });
      setRolesSel(
        (roles.filter((r) => (full.roles ?? []).includes(r.name)) || []).map((r) => r.id)
      );
    } catch (err) {
      setFormError(err.message);
    }
    setFormOpen(true);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        gender: form.personType === 'natural' ? form.gender || null : null,
        roleIds: canAssign ? rolesSel : undefined,
      };
      if (!editingId) {
        await api.createUser(payload);
      } else {
        if (!payload.password) delete payload.password;
        await api.updateUser(editingId, payload);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- acciones rápidas ----------
  const toggleStatus = async (u) => {
    const next = u.status === 'active' ? 'inactive' : 'active';
    setBusyId(u.id);
    setError('');
    try {
      await api.changeUserStatus(u.id, next);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const submitRoles = async () => {
    setSavingRoles(true);
    setError('');
    try {
      await api.assignUserRoles(rolesUser.id, rolesSel);
      setRolesUser(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingRoles(false);
    }
  };

  const confirmDelete = async () => {
    setBusyId(toDelete.id);
    setError('');
    try {
      await api.deleteUser(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(err.message);
      setToDelete(null);
    } finally {
      setBusyId(null);
    }
  };

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const initials = (name) =>
    name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

  return (
    <div className="space-y-4">
      {/* ---------- Cabecera ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">Usuarios</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {data.total} registro{data.total === 1 ? '' : 's'} en la plataforma
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            title="Recargar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {canWrite && (
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold hover:bg-psp-cyan-hover"
            >
              <Plus className="w-4 h-4" /> Nuevo usuario
            </button>
          )}
        </div>
      </div>

      {/* ---------- Filtros ---------- */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o documento..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
        >
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {error && (
        <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          {error}
        </p>
      )}

      {/* ---------- Tabla ---------- */}
      <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="text-left font-extrabold px-4 py-3">Usuario</th>
                <th className="text-left font-extrabold px-4 py-3">Roles</th>
                <th className="text-left font-extrabold px-4 py-3">Estado</th>
                <th className="text-left font-extrabold px-4 py-3 hidden md:table-cell">Registro</th>
                <th className="text-left font-extrabold px-4 py-3 hidden md:table-cell">Último acceso</th>
                <th className="text-right font-extrabold px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Cargando...</td></tr>
              ) : data.items.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Sin resultados.</td></tr>
              ) : (
                data.items.map((u) => {
                  const st = STATUS_META[u.status] ?? STATUS_META.active;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-psp-teal text-psp-cyan flex items-center justify-center font-extrabold text-[11px]">
                            {initials(u.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                              {u.name}
                              {u.id === me?.id && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-psp-cyan/15 text-psp-teal dark:text-psp-cyan font-bold">tú</span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 md:hidden">
                              <MapPin className="w-3 h-3" /> {u.municipio || '—'} · {u.documentType} {u.documentNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles?.length ? u.roles.map((r) => (
                            <span key={r} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                              {r}
                            </span>
                          )) : <span className="text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-500 dark:text-slate-400">{fmtDate(u.createdAt)}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-500 dark:text-slate-400">{fmtDate(u.lastLoginAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {canAssign && (
                            <button
                              onClick={() => { setRolesUser(u); setRolesSel(roles.filter((r) => u.roles?.includes(r.displayName)).map((r) => r.id)); }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                              title="Asignar roles"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}
                          {canWrite && (
                            <button
                              onClick={() => toggleStatus(u)}
                              disabled={busyId === u.id || u.id === me?.id}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-40"
                              title={u.status === 'active' ? 'Desactivar' : 'Activar'}
                            >
                              {u.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </button>
                          )}
                          {canWrite && (
                            <button
                              onClick={() => openEdit(u)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setToDelete(u)}
                              disabled={u.id === me?.id}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 disabled:opacity-40"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-500">
            Página {data.page} de {totalPages}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Modal: crear / editar ---------- */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Editar usuario' : 'Nuevo usuario'}
        subtitle={editingId ? 'Deja la contraseña vacía para no cambiarla.' : 'Se enviará la contraseña temporal indicada.'}
        width="max-w-xl"
        footer={
          <>
            <button onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
              Cancelar
            </button>
            <button
              onClick={submitForm}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold disabled:opacity-60"
            >
              {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </>
        }
      >
        <form onSubmit={submitForm} className="space-y-3">
          {formError && (
            <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Nombre / Razón social *" value={form.name} onChange={set('name')} required />
            <Input label="Correo *" type="email" value={form.email} onChange={set('email')} required />
            <Input
              label={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
              type="password"
              value={form.password}
              onChange={set('password')}
              required={!editingId}
              minLength={8}
            />
            <Sel label="Tipo de persona *" value={form.personType} onChange={set('personType')}>
              <option value="natural">Persona natural</option>
              <option value="juridica">Persona jurídica</option>
            </Sel>
            <Sel label="Tipo de documento *" value={form.documentType} onChange={set('documentType')}>
              <option value="CC">Cédula (CC)</option>
              <option value="CE">Cédula extranjera (CE)</option>
              <option value="NIT">NIT</option>
              <option value="PASSPORT">Pasaporte</option>
            </Sel>
            <Input label="Nro. documento *" value={form.documentNumber} onChange={set('documentNumber')} required />
            {form.personType === 'natural' && (
              <Sel label="Género" value={form.gender} onChange={set('gender')}>
                <option value="">—</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
              </Sel>
            )}
            <Input label="Municipio" value={form.municipio} onChange={set('municipio')} />
            <Input label="Teléfono" value={form.phone} onChange={set('phone')} />
            <Sel label="Estado" value={form.status} onChange={set('status')}>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="blocked">Bloqueado</option>
            </Sel>
          </div>

          {canAssign && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                <ShieldCheck className="w-3 h-3 inline -mt-0.5 mr-1" />Roles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((r) => {
                  const on = rolesSel.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRolesSel((s) => (on ? s.filter((x) => x !== r.id) : [...s, r.id]))}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                        on
                          ? 'bg-psp-cyan text-slate-950 border-psp-cyan'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-psp-cyan'
                      }`}
                    >
                      {r.displayName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* evita el submit con Enter */}
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      {/* ---------- Modal: asignar roles ---------- */}
      <Modal
        open={Boolean(rolesUser)}
        onClose={() => setRolesUser(null)}
        title="Asignar roles"
        subtitle={rolesUser ? `${rolesUser.name} · ${rolesUser.email}` : ''}
        footer={
          <>
            <button onClick={() => setRolesUser(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
              Cancelar
            </button>
            <button
              onClick={submitRoles}
              disabled={savingRoles}
              className="px-4 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold disabled:opacity-60"
            >
              {savingRoles ? 'Guardando...' : 'Guardar roles'}
            </button>
          </>
        }
      >
        <div className="space-y-2">
          {roles.map((r) => {
            const on = rolesSel.includes(r.id);
            return (
              <label
                key={r.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  on ? 'border-psp-cyan bg-psp-cyan/5' : 'border-slate-200 dark:border-slate-700 hover:border-psp-cyan/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => setRolesSel((s) => (on ? s.filter((x) => x !== r.id) : [...s, r.id]))}
                  className="mt-0.5 accent-teal-500"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-extrabold text-slate-900 dark:text-white">
                    {r.displayName}
                    {r.isSystem && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">sistema</span>}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">{r.description}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {r.userCount} usuario{r.userCount === 1 ? '' : 's'} · {r.permissions?.length ?? 0} permiso(s)
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </Modal>

      {/* ---------- Modal: eliminar ---------- */}
      <Modal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Eliminar usuario"
        footer={
          <>
            <button onClick={() => setToDelete(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={busyId === toDelete?.id}
              className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-extrabold disabled:opacity-60"
            >
              {busyId === toDelete?.id ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Se eliminará permanentemente la cuenta de{' '}
          <strong className="text-slate-900 dark:text-white">{toDelete?.name}</strong> (
          {toDelete?.email}). Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}

/* ---------- subcomponentes de formulario ---------- */
function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
      />
    </label>
  );
}

function Sel({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
      <select
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
      >
        {children}
      </select>
    </label>
  );
}
