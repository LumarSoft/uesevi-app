export const revalidate = 1;

import httpMysqlClient from "./apiClient";

// Función genérica para manejar la respuesta de la API
const handleResponse = (response: any) => {
  if (response.error) {
    console.error("Error en la respuesta de la API:", response.error);
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: response.error.message || "Error desconocido",
    };
  }

  // Estructura estándar para una respuesta exitosa
  return {
    ok: true,
    status: "success",
    statusCode: 200,
    message: "Datos obtenidos con éxito",
    data: response.data,
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
    return {
      ok: false,
      status: "error",
      statusCode: 500,
      message: error.response?.data || error.message || "Error desconocido",
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
