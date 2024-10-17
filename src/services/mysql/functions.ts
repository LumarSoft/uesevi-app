// Revalidate para Next.js
export const revalidate = 1;

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Función para manejar la respuesta de la API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorDetails = await response.json();
    return {
      ok: false,
      status: "error",
      statusCode: response.status,
      message: errorDetails.message || "Error desconocido",
      data: null, // Asegúrate de devolver 'data' incluso en caso de error
    };
  }

  const responseData = await response.json();
  return responseData;
};

// Función para obtener datos
export const fetchData = async (endpoint: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: "POST",
      body: postData, // No agregues el header 'Content-Type'
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error("Error al enviar datos:", error);

    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || "Error desconocido";

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

    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: "PUT",
      body: updateData, // No agregues el header 'Content-Type'
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
      headers: {
        "Content-Type": "application/json",
      },
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
