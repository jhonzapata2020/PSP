/**
 * Servicio de gestión de Empresas Aliadas y Entidades Afiliadas (CRUD).
 * - Intenta primero los endpoints reales del backend (/api/companies).
 * - Mientras el programador backend habilita la tabla `companies`, sincroniza y persiste
 *   todos los cambios (Crear, Editar, Eliminar, % de descuento y Logo) en localStorage
 *   usando como semilla inicial los datos de mockData.js para que funcione 100% en vivo.
 */

import { getToken } from './api';
import { ENTIDADES_AFILIADAS, EMPRESAS_ALIADAS } from '../data/mockData';

const BASE_API_URL = (import.meta.env.VITE_API_URL || 'https://identity-hub-psp.onrender.com').replace(/\/$/, '');
const API_URL = BASE_API_URL.endsWith('/api') ? BASE_API_URL : `${BASE_API_URL}/api`;

const STORAGE_KEY = 'psp_companies_store_v4';

/**
 * Normaliza las empresas iniciales desde mockData.js.
 */
function buildInitialSeed() {
  const afiliadas = ENTIDADES_AFILIADAS.map((item) => {
    return {
      id: String(item.id),
      nombre: item.nombre || '',
      sigla: item.sigla || (item.nombre || 'PSP').slice(0, 3).toUpperCase(),
      tipo: 'afiliada', // 'afiliada' (tarjetas del directorio principal) | 'estrategica' (socios estratégicos)
      categoria: item.categoria || 'Tecnología & Comercio',
      sector: item.sector || '',
      descripcion: item.descripcion || '',
      proyectos: item.proyectos || '',
      ubicacion: item.ubicacion || 'Urabá, Antioquia',
      logo: item.logo || '',
      color: item.color || 'from-teal-500 to-emerald-700',
      sitioWeb: item.sitioWeb || '',
      rutaInterna: item.rutaInterna || '',
      ods: item.ods || [8, 11],
      activa: true,
    };
  });

  const estrategicas = EMPRESAS_ALIADAS.map((item) => ({
    id: `est-${item.id}`,
    nombre: item.nombre || '',
    sigla: (item.nombre || 'PSP')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase(),
    tipo: 'estrategica',
    categoria: item.categoria || 'Privado',
    sector: item.sector || '',
    descripcion: item.descripcion || '',
    proyectos: item.proyectos || '',
    ubicacion: item.ubicación || item.ubicacion || 'Urabá, Antioquia',
    logo: item.logo || '',
    color: 'from-emerald-600 to-teal-800',
    sitioWeb: item.sitioWeb || '',
    rutaInterna: '',
    ods: Array.isArray(item.ods) ? item.ods : [8, 9, 11],
    activa: true,
  }));

  return [...afiliadas, ...estrategicas];
}

function readLocalCompanies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildInitialSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const seed = buildInitialSeed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return buildInitialSeed();
  }
}

function writeLocalCompanies(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage quota errors
  }
}

function normalizeCompanyPayload(payload, existing = {}) {
  const nombre = (payload.nombre ?? payload.name ?? existing.nombre ?? '').trim();
  const sigla =
    (payload.sigla ?? payload.acronym ?? existing.sigla ?? '').trim().toUpperCase() ||
    nombre
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 4)
      .toUpperCase() ||
    'EMP';

  return {
    id: existing.id || payload.id || `emp-${Date.now()}`,
    nombre,
    sigla,
    tipo: payload.tipo || payload.type || existing.tipo || 'afiliada',
    categoria: payload.categoria || payload.category || existing.categoria || 'Tecnología & Comercio',
    sector: (payload.sector ?? existing.sector ?? '').trim(),
    descripcion: (payload.descripcion ?? payload.description ?? existing.descripcion ?? '').trim(),
    proyectos: (payload.proyectos ?? payload.projects_info ?? existing.proyectos ?? '').trim(),
    ubicacion: (payload.ubicacion ?? payload.ubicación ?? payload.location ?? existing.ubicacion ?? 'Turbo, Urabá').trim(),
    logo: payload.logo ?? payload.logo_url ?? existing.logo ?? '',
    color: payload.color || existing.color || 'from-teal-500 to-emerald-700',
    sitioWeb: (payload.sitioWeb ?? payload.website_url ?? existing.sitioWeb ?? '').trim(),
    rutaInterna: payload.rutaInterna ?? existing.rutaInterna ?? '',
    ods: Array.isArray(payload.ods) ? payload.ods : existing.ods || [8, 11],
    activa: payload.activa !== undefined ? Boolean(payload.activa) : existing.activa ?? true,
  };
}

async function tryBackendRequest(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const companiesApi = {
  /** Lista todas las empresas (intenta backend /api/companies; si no existe aún, usa store local). */
  async list() {
    try {
      const data = await tryBackendRequest('/companies');
      const items = Array.isArray(data) ? data : data?.items;
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map((it) => normalizeCompanyPayload(it, it));
        writeLocalCompanies(normalized);
        return normalized;
      }
    } catch {
      // Fallback limpio mientras el backend habilita /api/companies
    }
    return readLocalCompanies();
  },

  /** Crea una nueva empresa aliada o afiliada. */
  async create(payload) {
    const newCompany = normalizeCompanyPayload(payload);
    try {
      const created = await tryBackendRequest('/companies', {
        method: 'POST',
        body: {
          ...newCompany,
          name: newCompany.nombre,
          acronym: newCompany.sigla,
          category: newCompany.categoria,
          description: newCompany.descripcion,
          location: newCompany.ubicacion,
          logo_url: newCompany.logo,
          website_url: newCompany.sitioWeb,
        },
      });
      if (created) {
        const norm = normalizeCompanyPayload(created, newCompany);
        const list = readLocalCompanies();
        writeLocalCompanies([norm, ...list]);
        return norm;
      }
    } catch {
      // Fallback local inmediato
    }
    const list = readLocalCompanies();
    const updated = [newCompany, ...list];
    writeLocalCompanies(updated);
    return newCompany;
  },

  /** Actualiza una empresa existente (logo, nombre, sector, categoría, etc.). */
  async update(id, payload) {
    const list = readLocalCompanies();
    const current = list.find((c) => String(c.id) === String(id)) || { id };
    let updatedItem = normalizeCompanyPayload(payload, current);

    try {
      const updatedFromBackend = await tryBackendRequest(`/companies/${id}`, {
        method: 'PUT',
        body: {
          ...updatedItem,
          name: updatedItem.nombre,
          acronym: updatedItem.sigla,
          category: updatedItem.categoria,
          description: updatedItem.descripcion,
          location: updatedItem.ubicacion,
          logo_url: updatedItem.logo,
          website_url: updatedItem.sitioWeb,
        },
      });
      if (updatedFromBackend) {
        updatedItem = normalizeCompanyPayload(updatedFromBackend, updatedItem);
      }
    } catch {
      // Fallback local inmediato
    }

    const nextList = list.map((c) => (String(c.id) === String(id) ? updatedItem : c));
    writeLocalCompanies(nextList);
    return updatedItem;
  },

  /** Elimina una empresa por ID. */
  async remove(id) {
    try {
      await tryBackendRequest(`/companies/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback local inmediato
    }
    const list = readLocalCompanies();
    const nextList = list.filter((c) => String(c.id) !== String(id));
    writeLocalCompanies(nextList);
    return true;
  },

  /** Restaura el catálogo original por defecto si el Admin desea reiniciar las pruebas. */
  resetToDefaults() {
    const seed = buildInitialSeed();
    writeLocalCompanies(seed);
    return seed;
  },
};

export default companiesApi;
