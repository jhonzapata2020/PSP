import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus, Pencil, Trash2, ShieldCheck, Users as UsersIcon, RefreshCw, KeyRound, Lock,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';

const EMPTY = { name: '', displayName: '', description: '' };

export default function AdminRolesPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('roles.manage');

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [permRole, setPermRole] = useState(null);
  const [permSel, setPermSel] = useState([]);
  const [savingPerm, setSavingPerm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [r, p] = await Promise.all([api.roles(), api.permissions()]);
      setRoles(r);
      setPermissions(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const grouped = useMemo(() => {
    const map = new Map();
    permissions.forEach((p) => {
      const key = p.group || 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return [...map.entries()];
  }, [permissions]);

  // ---------- CRUD ----------
  const openCreate = () => { setEditingId(null); setForm(EMPTY); setFormError(''); setFormOpen(true); };
  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({ name: r.name, displayName: r.displayName, description: r.description ?? '' });
    setFormError('');
    setFormOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) await api.updateRole(editingId, form);
      else await api.createRole(form);
      setFormOpen(false);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openPerms = (r) => {
    setPermRole(r);
    setPermSel(
      permissions.filter((p) => (r.permissions ?? []).includes(p.code)).map((p) => p.id)
    );
    setError('');
  };

  const submitPerms = async () => {
    setSavingPerm(true);
    setError('');
    try {
      await api.assignRolePermissions(permRole.id, permSel);
      setPermRole(null);
      setNotice(`Permisos actualizados para "${permRole.displayName}".`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPerm(false);
    }
  };

  const confirmDelete = async () => {
    setError('');
    try {
      await api.deleteRole(toDelete.id);
      setToDelete(null);
      setNotice('Rol eliminado.');
      await load();
    } catch (err) {
      setError(err.message);
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">Roles</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {roles.length} rol{roles.length === 1 ? '' : 'es'} · {permissions.length} permisos disponibles
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
          {canManage && (
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold hover:bg-psp-cyan-hover"
            >
              <Plus className="w-4 h-4" /> Nuevo rol
            </button>
          )}
        </div>
      </div>

      {notice && (
        <p className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
          ✓ {notice}
        </p>
      )}
      {error && (
        <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-400 text-xs">
          Cargando roles...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{r.displayName}</h3>
                    {r.isSystem && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-400 uppercase">
                        sistema
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">{r.name}</p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{r.description}</p>
                </div>

                {canManage && (
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setToDelete(r)}
                      disabled={r.isSystem}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 disabled:opacity-30"
                      title={r.isSystem ? 'Rol de sistema: no se puede eliminar' : 'Eliminar'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <UsersIcon className="w-3.5 h-3.5" /> {r.userCount} usuario{r.userCount === 1 ? '' : 's'}
                </span>
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> {r.permissions?.length ?? 0} permiso(s)
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {(r.permissions ?? []).slice(0, 8).map((code) => (
                  <span
                    key={code}
                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-300"
                  >
                    {code}
                  </span>
                ))}
                {(r.permissions?.length ?? 0) > 8 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                    +{r.permissions.length - 8}
                  </span>
                )}
                {(r.permissions?.length ?? 0) === 0 && (
                  <span className="text-[10px] text-slate-400 italic">Sin permisos asignados</span>
                )}
              </div>

              <button
                onClick={() => openPerms(r)}
                disabled={!canManage}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-psp-cyan/40 text-psp-teal dark:text-psp-cyan text-[11px] font-extrabold hover:bg-psp-cyan/10 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Lock className="w-3.5 h-3.5" />
                {canManage ? 'Editar permisos' : 'Ver permisos (solo lectura)'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Modal rol ---------- */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Editar rol' : 'Nuevo rol'}
        footer={
          <>
            <button onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Cancelar</button>
            <button onClick={submit} disabled={saving} className="px-4 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold disabled:opacity-60">
              {saving ? 'Guardando...' : editingId ? 'Guardar' : 'Crear rol'}
            </button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-3">
          {formError && (
            <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">{formError}</p>
          )}
          <Field label="Nombre técnico *">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="ej. coordinador"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
            />
          </Field>
          <Field label="Nombre para mostrar *">
            <input
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              placeholder="ej. Coordinador"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan"
            />
          </Field>
          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-psp-cyan resize-none"
            />
          </Field>
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      {/* ---------- Modal permisos ---------- */}
      <Modal
        open={Boolean(permRole)}
        onClose={() => setPermRole(null)}
        title={`Permisos · ${permRole?.displayName ?? ''}`}
        subtitle={
          canManage
            ? 'Marca los permisos que tendrá este rol.'
            : 'Sólo lectura: necesitas el permiso roles.manage para editar.'
        }
        width="max-w-2xl"
        footer={
          <>
            <button onClick={() => setPermRole(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Cerrar</button>
            {canManage && (
              <button onClick={submitPerms} disabled={savingPerm} className="px-4 py-2.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold disabled:opacity-60">
                {savingPerm ? 'Guardando...' : 'Guardar permisos'}
              </button>
            )}
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{permSel.length} de {permissions.length} seleccionados</span>
            {canManage && (
              <button
                type="button"
                onClick={() => setPermSel(permSel.length === permissions.length ? [] : permissions.map((p) => p.id))}
                className="font-bold text-psp-teal dark:text-psp-cyan hover:underline"
              >
                {permSel.length === permissions.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
            )}
          </div>

          {grouped.map(([group, list]) => (
            <div key={group}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">{group}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {list.map((p) => {
                  const on = permSel.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        on ? 'border-psp-cyan bg-psp-cyan/5' : 'border-slate-200 dark:border-slate-700'
                      } ${canManage ? '' : 'opacity-70 cursor-not-allowed'}`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={!canManage}
                        onChange={() => setPermSel((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))}
                        className="mt-0.5 accent-teal-500"
                      />
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold font-mono text-slate-700 dark:text-slate-200">{p.code}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">{p.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ---------- Modal eliminar ---------- */}
      <Modal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Eliminar rol"
        footer={
          <>
            <button onClick={() => setToDelete(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Cancelar</button>
            <button onClick={confirmDelete} className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-extrabold">Sí, eliminar</button>
          </>
        }
      >
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Se eliminará el rol <strong>{toDelete?.displayName}</strong>. Si tiene usuarios asignados,
          el backend rechazará la operación.
        </p>
      </Modal>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  );
}
