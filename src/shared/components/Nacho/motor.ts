/**
 * Motor de animación de Nacho.
 *
 * No sabe nada de React a propósito: recibe un <svg> ya montado y escribe
 * custom properties sobre él en cada cuadro. Toda la animación ocurre en CSS
 * (transform y opacity), así que no hay ni un render de React por frame ni
 * layout/paint: sólo composición.
 *
 * Un único requestAnimationFrame atiende a todas las instancias vivas — en el
 * hilo del chat puede haber una por burbuja, más la del encabezado y la del
 * sidebar. El bucle se corta solo cuando no queda ninguna instancia visible,
 * cuando la pestaña se oculta y cuando el sistema pide menos movimiento.
 *
 * Referencia de diseño: "El Capitán" de RedChat y el estudio de avatares
 * procedurales bible-strong-avatar-lab (AGPL-3.0). No se usó ni se derivó
 * código de ese proyecto: sólo la idea de separar el core del framework y la
 * de tratar cada expresión como un preset de valores, no como un frame.
 */

export type EstadoNacho =
  | "reposo"
  | "escuchando"
  | "pensando"
  | "leyendo"
  | "redactando"
  | "encontrado"
  | "falla";

interface Perfil {
  /** Rango en ms entre parpadeos. */
  parpadeo: [number, number];
  /** Rango en ms entre saccades. `null` cuando la mirada la maneja un barrido. */
  mirada: [number, number] | null;
  /** Barrido de renglones: cuánto recorre y cada cuánto. */
  barrido?: { ancho: number; ciclo: number };
  /** Amplitud de las saccades, en unidades del viewBox. */
  amplitud: number;
  /** Amplitud de la respiración. */
  respiro: number;
  /** Multiplicador del reloj: enlentece o acelera todo el estado. */
  velocidad: number;
  /** Vueltas por segundo del halo de actividad (0 = sin halo). */
  halo: number;
  /** Corrimiento vertical fijo de la mirada. */
  sesgoY: number;
  /** Inclinación de los ojos hacia adentro, en grados. */
  inclinacion: number;
}

const PERFILES: Record<EstadoNacho, Perfil> = {
  // Sin actividad. Es el estado que más se ve, así que es el que más tiene que
  // aguantar ser mirado: parpadeo y saccades bien espaciados e irregulares.
  reposo: {
    parpadeo: [3000, 7000],
    mirada: [2200, 5000],
    amplitud: 3.2,
    respiro: 1.6,
    velocidad: 1,
    halo: 0,
    sesgoY: 0,
    inclinacion: 0,
  },
  // El admin está escribiendo: Nacho baja la mirada al campo y parpadea más.
  escuchando: {
    parpadeo: [1600, 3200],
    mirada: [900, 2000],
    amplitud: 2.6,
    respiro: 1.8,
    velocidad: 1.35,
    halo: 0,
    sesgoY: 4.5,
    inclinacion: 0,
  },
  // El modelo está razonando, sin herramienta activa: mirada arriba sostenida,
  // casi sin parpadeo, respiración larga.
  pensando: {
    parpadeo: [6000, 11000],
    mirada: [2600, 5200],
    amplitud: 2,
    respiro: 2.3,
    velocidad: 0.62,
    halo: 26,
    sesgoY: -5.5,
    inclinacion: 0,
  },
  // Está consultando la base o leyendo un Excel: los ojos barren renglones.
  leyendo: {
    parpadeo: [2600, 5200],
    mirada: null,
    barrido: { ancho: 9, ciclo: 1500 },
    amplitud: 0,
    respiro: 1.2,
    velocidad: 1.5,
    halo: 62,
    sesgoY: 1.5,
    inclinacion: 0,
  },
  // Ya está escribiendo la respuesta: barrido más corto, más abajo y más lento.
  redactando: {
    parpadeo: [3000, 6000],
    mirada: null,
    barrido: { ancho: 5, ciclo: 2400 },
    amplitud: 0,
    respiro: 1.4,
    velocidad: 1.1,
    halo: 0,
    sesgoY: 3.5,
    inclinacion: 0,
  },
  // Terminó bien. Dura poco y vuelve solo a reposo.
  encontrado: {
    parpadeo: [3000, 7000],
    mirada: [2200, 5000],
    amplitud: 1.6,
    respiro: 1.6,
    velocidad: 1.1,
    halo: 0,
    sesgoY: -1.5,
    inclinacion: 0,
  },
  // Error de API, timeout o consulta sin resultados. Persiste: un error que se
  // borra solo es un error que nadie leyó.
  falla: {
    parpadeo: [4000, 8000],
    mirada: [3000, 6000],
    amplitud: 1.4,
    respiro: 1.3,
    velocidad: 0.8,
    halo: 0,
    sesgoY: 3,
    inclinacion: 15,
  },
};

/** Cuánto dura el estado "encontrado" antes de volver solo a reposo. */
const MS_ENCONTRADO = 1200;

export interface InstanciaNacho {
  setEstado: (estado: EstadoNacho) => void;
  /** Saludo corto: cabeceo + doble parpadeo. Se usa en el hover del sidebar. */
  saludar: () => void;
  /** Mirada manual, en coordenadas normalizadas (-1..1). */
  apuntar: (x: number, y: number) => void;
  /** Devuelve la mirada al modo autónomo. */
  soltar: () => void;
  destruir: () => void;
}

interface Estado {
  el: SVGSVGElement;
  estado: EstadoNacho;
  visible: boolean;
  t: number;
  parpadeo: number;
  proxParpadeo: number;
  cierre: number;
  pendientes: number;
  mx: number;
  my: number;
  destinoX: number;
  destinoY: number;
  proxMirada: number;
  manual: { x: number; y: number } | null;
  sacudida: number;
  rebote: number;
  cabeceo: number;
  halo: number;
  /** Vuelta automática de "encontrado" a reposo. */
  temporizador: ReturnType<typeof setTimeout> | null;
}

const instancias = new Set<Estado>();

let raf = 0;
let previo = 0;
let observador: IntersectionObserver | null = null;
let escuchando = false;
let menosMovimiento: MediaQueryList | null = null;

const entre = ([a, b]: [number, number]) => a + Math.random() * (b - a);

const quieto = () =>
  typeof window === "undefined" ||
  document.hidden ||
  Boolean(menosMovimiento?.matches);

function escribir(n: Estado, v: Record<string, number>) {
  const s = n.el.style;
  for (const clave in v) s.setProperty(`--${clave}`, v[clave].toFixed(3));
}

/**
 * Pose fija: lo único que ve alguien con `prefers-reduced-motion`, y donde
 * queda Nacho cuando la pestaña se oculta. Cada estado sigue siendo legible
 * sin un solo cuadro de animación — los ojos inclinados dicen "falla" igual.
 */
function posar(n: Estado) {
  const p = PERFILES[n.estado];
  escribir(n, {
    "nacho-respiro": 0,
    "nacho-ancho": 1,
    "nacho-alto": 1,
    "nacho-sesgo": 0,
    "nacho-parpadeo": 1,
    "nacho-mx": 0,
    "nacho-my": p.sesgoY * 0.5,
    "nacho-incl": p.inclinacion,
    "nacho-sacudida": 0,
    "nacho-halo": 0,
  });
}

function paso(n: Estado, dt: number, ahora: number) {
  const p = PERFILES[n.estado];
  n.t += dt * p.velocidad;

  // — Respiración. El transform-origin está en la base del cuerpo, así que al
  //   inhalar se estira y al exhalar se hunde y ensancha: queda apoyado, no
  //   flotando. Es la diferencia entre "vivo" y "globo".
  const fase = (n.t / 2600) * Math.PI * 2;
  const onda = Math.sin(fase);
  n.rebote *= Math.exp(-dt / 130);
  const pop = n.rebote * 0.07;
  const respiro = onda * p.respiro;
  const ancho = 1 - onda * 0.014 - pop * 0.5;
  const alto = 1 + onda * 0.016 + pop;

  // — Parpadeo. El cierre es una campana de 130 ms; los intervalos entre
  //   parpadeos son irregulares a propósito: un período fijo se lee como reloj
  //   a los diez segundos de mirarlo.
  if (n.cierre >= 0) {
    n.cierre += dt;
    const k = n.cierre / 130;
    n.parpadeo = k >= 1 ? 1 : 1 - Math.sin(Math.min(k, 1) * Math.PI) * 0.95;
    if (k >= 1) {
      n.cierre = -1;
      n.parpadeo = 1;
      if (n.pendientes > 0) {
        n.pendientes -= 1;
        n.proxParpadeo = 90;
      } else {
        n.proxParpadeo = entre(p.parpadeo);
      }
    }
  } else {
    n.proxParpadeo -= dt;
    if (n.proxParpadeo <= 0) n.cierre = 0;
  }

  // — Mirada: puntero > barrido de renglones > saccades autónomas.
  if (n.manual) {
    n.destinoX = n.manual.x * 4.5;
    n.destinoY = n.manual.y * 3.5;
  } else if (p.barrido) {
    const { ancho: recorrido, ciclo } = p.barrido;
    const avance = (n.t % ciclo) / ciclo;
    // 78 % del ciclo leyendo hacia la derecha, 22 % volviendo al margen.
    n.destinoX =
      -recorrido / 2 +
      (avance < 0.78
        ? (avance / 0.78) * recorrido
        : (1 - (avance - 0.78) / 0.22) * recorrido);
    n.destinoY = p.sesgoY;
  } else if (p.mirada) {
    n.proxMirada -= dt;
    if (n.proxMirada <= 0) {
      n.destinoX = (Math.random() * 2 - 1) * p.amplitud;
      n.destinoY = p.sesgoY + (Math.random() * 2 - 1) * p.amplitud * 0.5;
      n.proxMirada = entre(p.mirada);
    }
  }

  // Suavizado exponencial: da el mismo movimiento a 60 Hz que a 120 Hz, cosa
  // que un lerp de factor fijo no hace.
  const k = 1 - Math.exp(-dt / 90);
  n.mx += (n.destinoX - n.mx) * k;
  n.my += (n.destinoY - n.my) * k;

  // El cuerpo se inclina un poco detrás de la mirada. Esto solo aporta más
  // vida que todo lo demás junto.
  n.cabeceo *= Math.exp(-dt / 180);
  const sesgo = n.mx * 0.5 + n.cabeceo * 7;

  // — Sacudida de la falla: una oscilación amortiguada que se apaga sola.
  if (Math.abs(n.sacudida) > 0.05) {
    n.sacudida =
      Math.cos(ahora / 26) * Math.abs(n.sacudida) * Math.exp(-dt / 150);
  } else {
    n.sacudida = 0;
  }

  if (p.halo) n.halo = (n.halo + (dt / 1000) * p.halo) % 100;

  escribir(n, {
    "nacho-respiro": respiro,
    "nacho-ancho": ancho,
    "nacho-alto": alto,
    "nacho-sesgo": sesgo,
    "nacho-parpadeo": n.parpadeo,
    "nacho-mx": n.mx,
    "nacho-my": n.my,
    "nacho-incl": p.inclinacion,
    "nacho-sacudida": n.sacudida,
    "nacho-halo": n.halo,
  });
}

function bucle(ahora: number) {
  // Se recorta el delta: al volver de una pestaña oculta o de un stall del
  // main thread llega un salto enorme y los temporizadores se disparan todos.
  const dt = Math.min(previo ? ahora - previo : 16, 48);
  previo = ahora;

  let activas = 0;
  instancias.forEach((n) => {
    if (!n.visible) return;
    activas += 1;
    paso(n, dt, ahora);
  });

  // Nadie a la vista: no tiene sentido seguir pidiendo cuadros.
  if (!activas) {
    raf = 0;
    return;
  }
  raf = requestAnimationFrame(bucle);
}

function arrancar() {
  if (raf || quieto()) return;
  let alguna = false;
  instancias.forEach((n) => {
    if (n.visible) alguna = true;
  });
  if (!alguna) return;
  previo = 0;
  raf = requestAnimationFrame(bucle);
}

function frenar() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

function cambiar(n: Estado, estado: EstadoNacho) {
  n.estado = estado;
  n.el.dataset.estado = estado;
  const p = PERFILES[estado];
  // Se acorta el primer parpadeo del estado nuevo para que el cambio se note.
  n.proxParpadeo = entre(p.parpadeo) * 0.35;
  n.proxMirada = 400;

  if (n.temporizador) {
    clearTimeout(n.temporizador);
    n.temporizador = null;
  }

  if (estado === "encontrado") {
    n.pendientes = 2; // doble parpadeo de reconocimiento
    n.proxParpadeo = 60;
    n.rebote = 1;
    // La vuelta a reposo va por temporizador y no por el bucle: si no, con la
    // pestaña oculta o con `prefers-reduced-motion` el bucle nunca corre y
    // Nacho se queda verde para siempre.
    n.temporizador = setTimeout(() => {
      n.temporizador = null;
      cambiar(n, "reposo");
    }, MS_ENCONTRADO);
  }
  if (estado === "falla") n.sacudida = 5.5;
  if (p.barrido) {
    n.mx = -p.barrido.ancho / 2;
    n.destinoX = n.mx;
  }

  if (quieto()) posar(n);
  else arrancar();
}

/** Listeners globales: se enganchan con la primera instancia y no se sueltan. */
function prepararEntorno() {
  if (escuchando || typeof window === "undefined") return;
  escuchando = true;

  menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) frenar();
    else arrancar();
  });

  const alCambiarMovimiento = () => {
    if (menosMovimiento?.matches) {
      frenar();
      instancias.forEach(posar);
    } else {
      arrancar();
    }
  };
  // Safari < 14 no tiene addEventListener sobre MediaQueryList.
  if (menosMovimiento.addEventListener) {
    menosMovimiento.addEventListener("change", alCambiarMovimiento);
  } else {
    menosMovimiento.addListener(alCambiarMovimiento);
  }

  // En un hilo largo puede haber decenas de Nachos; sólo animan los que están
  // realmente en pantalla.
  if ("IntersectionObserver" in window) {
    observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          instancias.forEach((n) => {
            if (n.el === entrada.target) n.visible = entrada.isIntersecting;
          });
        });
        arrancar();
      },
      { rootMargin: "120px" }
    );
  }
}

export function crearNacho(
  el: SVGSVGElement,
  estadoInicial: EstadoNacho = "reposo"
): InstanciaNacho {
  prepararEntorno();

  const n: Estado = {
    el,
    estado: estadoInicial,
    // Arranca asumiendo que se ve, y el observador corrige si no. Al revés
    // —esperando la primera entrada del IO— cualquier demora o falta de
    // callback deja a Nacho congelado, que es el peor modo de fallar.
    visible: true,
    // Fase inicial al azar: si no, todos los Nachos del hilo respiran y
    // parpadean al unísono y el efecto se rompe.
    t: Math.random() * 4000,
    parpadeo: 1,
    proxParpadeo: 1200 + Math.random() * 2500,
    cierre: -1,
    pendientes: 0,
    mx: 0,
    my: 0,
    destinoX: 0,
    destinoY: 0,
    proxMirada: 1500 + Math.random() * 2500,
    manual: null,
    sacudida: 0,
    rebote: 0,
    cabeceo: 0,
    halo: Math.random() * 100,
    temporizador: null,
  };

  instancias.add(n);
  observador?.observe(el);
  el.dataset.estado = estadoInicial;
  posar(n);
  arrancar();

  return {
    setEstado: (estado) => {
      if (estado !== n.estado) cambiar(n, estado);
    },
    saludar: () => {
      n.cabeceo = 1;
      n.rebote = 0.7;
      n.pendientes = 1;
      n.proxParpadeo = 40;
      arrancar();
    },
    apuntar: (x, y) => {
      n.manual = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
      arrancar();
    },
    soltar: () => {
      n.manual = null;
      n.proxMirada = 300;
    },
    destruir: () => {
      if (n.temporizador) clearTimeout(n.temporizador);
      observador?.unobserve(el);
      instancias.delete(n);
      if (!instancias.size) frenar();
    },
  };
}
