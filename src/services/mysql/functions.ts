import { userStore } from "@/shared/stores/userStore";

// Revalidate para Next.js
export const revalidate = 1;

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Los logs de depuración solo se emiten en desarrollo: en producción la consola
// del navegador es visible para cualquiera que abra las DevTools.
const isDev = process.env.NODE_ENV !== "production";

// Campos que nunca deben imprimirse en la consola (contraseñas, tokens, etc.).
// Coincidencia por substring: cubre "password", "newPassword", "userToken", etc.
const SENSITIVE_PARTS = [
  "password",
  "contrasenia",
  "contraseña",
  "clave",
  "token",
  "authorization",
];

// Coincidencia exacta: "code" como substring afectaría a "statusCode", "codigoPostal", etc.
const SENSITIVE_EXACT = ["code", "codigo", "resetcode"];

const isSensitiveKey = (key: string) => {
  const k = key.toLowerCase();
  return SENSITIVE_PARTS.some((s) => k.includes(s)) || SENSITIVE_EXACT.includes(k);
};

// Reemplaza por "[oculto]" cualquier valor sensible antes de loguear.
const redact = (value: any, depth = 0): any => {
  if (depth > 4 || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [
      k,
      isSensitiveKey(k) ? "[oculto]" : redact(v, depth + 1),
    ])
  );
};

// Log seguro: solo en desarrollo y con los campos sensibles ocultos.
const debugLog = (message: string, payload?: any) => {
  if (!isDev) return;
  if (payload === undefined) console.log(message);
  else console.log(message, redact(payload));
};

// Describe el contenido de un FormData sin exponer valores sensibles.
const describeFormData = (formData: FormData) =>
  Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => {
      if (isSensitiveKey(key)) return [key, "[oculto]"];
      if (value instanceof File)
        return [key, `File: ${value.name} (${value.size} bytes, ${value.type})`];
      return [key, value];
    })
  );

// Agrega el JWT del usuario logueado (si existe) a los headers de la request
function authHeaders(extra: Record<string, string> = {}) {
  const token = userStore.getState().token;
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Las rutas de /login (login, login/company, recuperación de contraseña) devuelven
// 401 cuando las credenciales son incorrectas. Ahí el 401 NO significa "sesión
// expirada": hay que devolverle el mensaje al formulario, no expulsar al usuario.
const isAuthEndpoint = (requestUrl: string) => {
  try {
    return new URL(requestUrl).pathname.startsWith("/login");
  } catch {
    return false;
  }
};

const LOGIN_PATHS = ["/admin/login", "/loginempresa"];

// Función para manejar la respuesta de la API
const handleResponse = async (response: Response) => {
  // Sesión expirada o token inválido en una ruta protegida: cerrar sesión y
  // mandar al login correspondiente.
  if (response.status === 401 && !isAuthEndpoint(response.url)) {
    userStore.getState().logout();
    if (typeof window !== "undefined") {
      const { pathname } = window.location;
      // Si ya estamos en un login, no recargar: dejaría la pantalla en blanco
      // y se perdería el mensaje de error.
      if (!LOGIN_PATHS.some((path) => pathname.startsWith(path))) {
        const isAdminArea = pathname.startsWith("/admin");
        window.location.href = isAdminArea ? "/admin/login" : "/loginempresa";
      }
    }
  }

  if (!response.ok) {
    let errorDetails;
    const contentType = response.headers.get("content-type");
    
    try {
      if (contentType && contentType.includes("application/json")) {
        errorDetails = await response.json();
      } else {
        // Si no es JSON, probablemente sea HTML (página de error)
        const htmlText = await response.text();
        if (isDev) console.error("Server returned HTML instead of JSON:", htmlText);
        errorDetails = { 
          message: `Server error (${response.status}): ${response.statusText}`,
          details: htmlText.substring(0, 200) + "..." 
        };
      }
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      errorDetails = { 
        message: `Server error (${response.status}): ${response.statusText}`,
        details: "Could not parse server response"
      };
    }

    return {
      ok: false,
      status: errorDetails.status || "error",
      statusCode: response.status,
      message: errorDetails.message || "Error desconocido",
      // Detalle fila por fila que devuelve la API cuando falla la validación
      // de un Excel (importación / rectificación de declaraciones juradas).
      errors: errorDetails.errors || null,
      data: null,
    };
  }

  try {
    const responseData = await response.json();
    return responseData;
  } catch (parseError) {
    console.error("Error parsing successful response:", parseError);
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: "Error parsing server response",
      data: null,
    };
  }
};

// Función para obtener datos
export const fetchData = async (endpoint: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: "GET",
      headers: authHeaders({ "Content-Type": "application/json" }),
      cache: "no-store",
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error("Error al obtener datos:", error);
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: error.message || "Error desconocido",
    };
  }
};

// Función para obtener un único registro
export const fetchOneRow = async (endpoint: string, id: number) => {
  try {
    const url = endpoint.replace(":id", id.toString());

    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: "GET",
      headers: authHeaders({ "Content-Type": "application/json" }),
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error("Error al obtener datos:", error);
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: error.message || "Error desconocido",
      data: null,
    };
  }
};

// Función para enviar datos (POST)
export const postData = async (endpoint: string, postData: FormData) => {
  try {
    debugLog(`Enviando POST a: ${BASE_API_URL}/${endpoint}`);
    debugLog("FormData contents:", describeFormData(postData));

    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: "POST",
      headers: authHeaders(), // No agregues el header 'Content-Type'
      body: postData,
    });

    const result = await handleResponse(response);
    debugLog("POST response:", result);
    return result;
  } catch (error: any) {
    console.error("Error al enviar datos:", error);

    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || "Error desconocido";

    return {
      ok: false,
      status: "error",
      statusCode,
      message,
      data: null,
    };
  }
};

/**
 * POST con respuesta en stream (Server-Sent Events). La API manda una línea
 * `data: {json}` por evento y el último es `{tipo: "final"}`. Se usa para el
 * asistente Nacho, que va contando qué hace mientras arma la respuesta.
 *
 * Devuelve el mismo envelope que postData: `{ ok, data }` con el `data` del
 * evento final, o `{ ok: false, message }` si hubo error o se canceló.
 */
export const postStream = async (
  endpoint: string,
  postData: FormData,
  onEvento: (evento: any) => void,
  signal?: AbortSignal
): Promise<any> => {
  try {
    debugLog(`Enviando POST (stream) a: ${BASE_API_URL}/${endpoint}`);
    debugLog("FormData contents:", describeFormData(postData));

    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: "POST",
      headers: authHeaders({ Accept: "text/event-stream" }),
      body: postData,
      signal,
    });

    // Errores de auth, validación o rate limit llegan como JSON normal antes
    // de que arranque el stream: se procesan igual que cualquier POST.
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("text/event-stream")) {
      return await handleResponse(response);
    }
    if (!response.body) {
      return { ok: false, status: "error", statusCode: 500, message: "El servidor no devolvió datos", data: null };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pendiente = "";
    let final: any = null;
    let error: any = null;

    const procesarBloque = (bloque: string) => {
      const datos = bloque
        .split("\n")
        .filter((linea) => linea.startsWith("data:"))
        .map((linea) => linea.slice(5).trim())
        .join("");
      if (!datos) return; // comentarios ": ping" y líneas vacías
      let evento: any;
      try {
        evento = JSON.parse(datos);
      } catch {
        return;
      }
      if (evento.tipo === "final") final = evento.data;
      else if (evento.tipo === "error") error = evento;
      onEvento(evento);
    };

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      pendiente += decoder.decode(value, { stream: true });
      let corte = pendiente.indexOf("\n\n");
      while (corte !== -1) {
        procesarBloque(pendiente.slice(0, corte));
        pendiente = pendiente.slice(corte + 2);
        corte = pendiente.indexOf("\n\n");
      }
    }
    if (pendiente.trim()) procesarBloque(pendiente);

    if (final) {
      return { ok: true, status: "success", statusCode: 200, message: "Consulta procesada con éxito", data: final };
    }
    return {
      ok: false,
      status: "error",
      statusCode: error?.statusCode || 500,
      message: error?.message || "La conexión se cortó antes de terminar la respuesta",
      data: null,
    };
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return { ok: false, status: "error", statusCode: 0, message: "Consulta cancelada", cancelada: true, data: null };
    }
    console.error("Error en el stream:", err);
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: err?.message || "Error desconocido",
      data: null,
    };
  }
};

export const updateData = async (
  endpoint: string,
  id: number,
  updateData: FormData
) => {
  try {
    const url = endpoint.replace(":id", id.toString());
    debugLog(`Enviando PUT a: ${BASE_API_URL}/${url}`);
    debugLog("FormData contents:", describeFormData(updateData));

    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: "PUT",
      headers: authHeaders(), // No agregues el header 'Content-Type'
      body: updateData,
    });

    const result = await handleResponse(response);
    debugLog("PUT response:", result);
    return result;
  } catch (error: any) {
    console.error("Error al actualizar datos:", error);
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: error.message || "Error desconocido",
    };
  }
};

// Función para eliminar datos (DELETE)
export const deleteData = async (endpoint: string, id: number) => {
  try {
    const url = endpoint.replace(":id", id.toString());

    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: "DELETE",
      headers: authHeaders({ "Content-Type": "application/json" }),
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error("Error al eliminar datos:", error);
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: error.message || "Error desconocido",
    };
  }
};
