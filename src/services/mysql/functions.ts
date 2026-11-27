import { userStore } from "@/shared/stores/userStore";
import {
  esPedidoDeLogin,
  marcarSesionVencida,
} from "@/shared/utils/sesionVencida";

// Revalidate para Next.js
export const revalidate = 1;

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Agrega el JWT del usuario logueado (si existe) a los headers de la request
function authHeaders(extra: Record<string, string> = {}) {
  const token = userStore.getState().token;
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Función para manejar la respuesta de la API.
// `esLogin`: el pedido es un intento de ingreso. Ahí un 401 es "contraseña
// incorrecta": no se cierra ninguna sesión ni se redirige (antes la página de
// login se recargaba, se borraba el email y el aviso no llegaba a verse).
const handleResponse = async (response: Response, esLogin = false) => {
  if (response.status === 401 && !esLogin) {
    const habiaSesion = Boolean(userStore.getState().token);
    userStore.getState().logout();
    if (typeof window !== "undefined") {
      if (habiaSesion) marcarSesionVencida();
      const isAdminArea = window.location.pathname.startsWith("/admin");
      window.location.href = isAdminArea ? "/admin/login" : "/loginempresa";
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
        console.error("Server returned HTML instead of JSON:", htmlText);
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
// Sin console.log del FormData ni de la respuesta: imprimían en la consola del
// navegador contraseñas (login, alta, cambio de clave), el token de sesión y
// DDJJ completas con CUIL. No volver a agregarlos.
export const postData = async (endpoint: string, postData: FormData) => {
  try {
    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: "POST",
      headers: authHeaders(), // No agregues el header 'Content-Type'
      body: postData,
    });

    return await handleResponse(response, esPedidoDeLogin(endpoint));
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

export const updateData = async (
  endpoint: string,
  id: number,
  updateData: FormData
) => {
  try {
    const url = endpoint.replace(":id", id.toString());
    // Sin logs del FormData ni de la respuesta (ver postData).
    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: "PUT",
      headers: authHeaders(), // No agregues el header 'Content-Type'
      body: updateData,
    });

    return await handleResponse(response);
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
