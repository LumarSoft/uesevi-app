// Aviso de "sesión vencida" entre el redirect al login y la pantalla de login.
//
// Cuando el token vence, el sitio manda al login con un redirect completo y la
// persona aparecía en la pantalla de ingreso sin saber por qué. Antes de
// redirigir se deja esta marca en sessionStorage (sólo esa pestaña, se borra
// al leerla) y el login muestra el aviso una vez.
//
// Sin imports en tiempo de ejecución: lo prueba test/login.test.mjs.

const CLAVE = "uesevi-sesion-vencida";

export const MENSAJE_SESION_VENCIDA =
  "Tu sesión venció. Ingresá de nuevo para seguir.";

export function marcarSesionVencida(): void {
  try {
    sessionStorage.setItem(CLAVE, "1");
  } catch {
    // Sin sessionStorage (modo privado, SSR): el login simplemente no avisa.
  }
}

/** Devuelve true una sola vez por vencimiento. */
export function tomarAvisoSesionVencida(): boolean {
  try {
    const marcada = sessionStorage.getItem(CLAVE) === "1";
    sessionStorage.removeItem(CLAVE);
    return marcada;
  } catch {
    return false;
  }
}

/**
 * Los pedidos de login (`login`, `login/company`, `login/password/...`) no
 * llevan sesión: un 401 ahí es "contraseña incorrecta", no "sesión vencida".
 * No tienen que cerrar la sesión ni redirigir: el formulario muestra el error.
 */
export function esPedidoDeLogin(endpoint: string): boolean {
  const ruta = endpoint.replace(/^\/+/, "");
  return ruta === "login" || ruta.startsWith("login/") || ruta.startsWith("login?");
}

/**
 * Texto para la persona que intenta ingresar, a partir de la respuesta
 * normalizada de postData. Los 4xx de la API ya traen un mensaje claro
 * ("Contraseña incorrecta", "Demasiados intentos…"); lo demás (sin conexión,
 * 5xx, "Failed to fetch") se cambia por uno en castellano.
 */
export function mensajeDeErrorDeLogin(resultado: {
  statusCode?: number;
  message?: string;
}): string {
  const codigo = Number(resultado?.statusCode);
  if (codigo >= 400 && codigo < 500 && resultado?.message) {
    return resultado.message;
  }
  return "No pudimos conectarnos con el sistema. Probá de nuevo en unos minutos.";
}
