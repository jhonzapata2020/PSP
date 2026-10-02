/**
 * Avatares de fábrica: viven en el bucket (R2) y se leen con
 * GET /api/auth/avatar/defaults. El backend lista el prefijo
 * {R2_FOLDER}/por-defecto/ en orden alfabético, así que el orden es estable.
 *
 * Aquí sólo hay dos cosas: la llamada (con caché por sesión) y la selección
 * inicial según el tipo de persona, que es lo que documenta el README
 * ("avatar empresarial con NIT" / retrato por género).
 */
import api from './api';

let cached = null;

/** Devuelve la lista de URLs de fábrica. Si la API falla, devuelve [] y deja
 *  la caché vacía para que el siguiente intento vuelva a pedirla. */
export async function loadAvatarDefaults() {
  if (cached) return cached;
  try {
    const list = await api.avatarDefaults();
    cached = Array.isArray(list) ? list : [];
  } catch {
    cached = null;
    return [];
  }
  return cached;
}

/** "…/avatar-03b.jpg?v=1" → "avatar-03b" */
function stem(url) {
  const file = String(url).split('?')[0].split('/').pop();
  return file.replace(/\.[a-z0-9]+$/i, '');
}

// Los nombres los decide el backend al subir las fotos. Si algún día se
// renombran las imágenes de por-defecto, hay que actualizar esta lista.
const GRUPO = ['avatar-04'];        // foto de varias personas → persona jurídica
const FEMENINO = ['avatar-01', 'avatar-03b'];
const MASCULINO = ['avatar-02', 'avatar-05', 'avatar-06'];

function pickFrom(list, names) {
  return list.find((url) => names.includes(stem(url))) || null;
}

/**
 * Elige la foto de fábrica para el alta de una cuenta.
 * Sin opciones (o sin coincidencia) se queda con la primera de la lista.
 */
export function pickDefaultAvatar(list = [], { personType, gender } = {}) {
  if (!list.length) return '';

  if (personType === 'juridica') return pickFrom(list, GRUPO) || list[0];
  if (gender === 'femenino') return pickFrom(list, FEMENINO) || list[0];
  if (gender === 'masculino') return pickFrom(list, MASCULINO) || list[0];
  return list[0];
}
