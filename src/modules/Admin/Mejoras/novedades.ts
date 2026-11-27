// Novedades sin ver de la sección Mejoras: lógica pura (sin imports en tiempo
// de ejecución; la prueba test/novedades.test.mjs).
//
// Cada navegador guarda qué cambios ya vio. Lo que se publique DESPUÉS de
// NOVEDADES_DESDE y todavía no se vio cuenta como novedad: suma al número que
// aparece junto a "Mejoras" en el menú y se marca "Novedad" en la página.
// Entrar a Mejoras las da por vistas. Lo publicado hasta NOVEDADES_DESDE no
// cuenta: eso lo presenta la bienvenida (recorrido/), y si contara, el menú
// arrancaría con un número enorme.

/** Fecha del lanzamiento de la sección (AAAA-MM-DD). No cambiar. */
export const NOVEDADES_DESDE = "2026-11-27";

export const CLAVE_VISTAS = "uesevi-mejoras-vistas";

interface ConFechaYTitulo {
  fecha: string;
  titulo: string;
}

interface Almacen {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
}

/** Identifica un cambio: fecha + título (no hay ids). */
export const claveMejora = (m: ConFechaYTitulo) => `${m.fecha}|${m.titulo}`;

/** Los cambios publicados después del lanzamiento que todavía no se vieron. */
export function mejorasNuevas<T extends ConFechaYTitulo>(
  mejoras: T[],
  vistas: Set<string>
): T[] {
  return mejoras.filter(
    (m) => m.fecha > NOVEDADES_DESDE && !vistas.has(claveMejora(m))
  );
}

export function leerVistas(almacen: Almacen | null | undefined): Set<string> {
  try {
    const crudo = almacen?.getItem(CLAVE_VISTAS);
    const lista = crudo ? JSON.parse(crudo) : [];
    return new Set(Array.isArray(lista) ? lista.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

/** Guarda como vistos todos los cambios posteriores al lanzamiento. */
export function guardarVistas(
  almacen: Almacen | null | undefined,
  mejoras: ConFechaYTitulo[]
): Set<string> {
  const vistas = new Set(
    mejoras.filter((m) => m.fecha > NOVEDADES_DESDE).map(claveMejora)
  );
  try {
    almacen?.setItem(CLAVE_VISTAS, JSON.stringify(Array.from(vistas)));
  } catch {
    // Sin almacenamiento: el número vuelve a aparecer en la próxima carga.
  }
  return vistas;
}
