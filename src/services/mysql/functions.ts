export const revalidate = 1;

import httpMysqlClient from "./apiClient";

// Función genérica para manejar la respuesta de la API
const handleResponse = (response: any) => {
  if (response.error) {
    return {
      ok: false,
      status: "error",
      statusCode: response.details.code || 500,
      message: response.details.message || "Error desconocido",
      data: null, // Asegúrate de devolver 'data' incluso en caso de error
    };
  }

  // Estructura estándar para una respuesta exitosa
  return {
    ok: true,
    status: "success",
    statusCode: 200,
    message: "Datos obtenidos con éxito",
    data: response.data, // Devuelves la data correctamente aquí
  };
};

export const fetchData = async (endpoint: string): Promise<any> => {
  try {
    const response = await httpMysqlClient({
      method: "GET",
      url: `/${endpoint}`,
    });
    return handleResponse(response);
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

export const fetchOneRow = async (endpoint: string, id: number) => {
  try {
    const url = endpoint.replace(":id", id.toString());

    const response = await httpMysqlClient({
      method: "GET",
      url,
    });
    return handleResponse(response);
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

export const postData = async (endpoint: string, postData: FormData) => {
  try {
    const response = await httpMysqlClient({
      method: "POST",
      url: `/${endpoint}`,
      data: postData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error: any) {
    console.error("Error al enviar datos:", error);

    // Si la respuesta tiene un código de error específico (como 401)
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || "Error desconocido";

    return {
      ok: false,
      status: "error",
      statusCode: statusCode || 500,
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

    const response = await httpMysqlClient({
      method: "PUT",
      url,
      data: updateData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
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

export const deleteData = async (endpoint: string, id: number) => {
  try {
    const url = endpoint.replace(":id", id.toString());

    const response = await httpMysqlClient({
      method: "DELETE",
      url,
    });
    return handleResponse(response);
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
