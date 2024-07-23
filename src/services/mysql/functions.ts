import httpMysqlClient from "./apiClient";

export const fetchData = async (endpoint: string) => {
  try {
    const data = await httpMysqlClient({ method: "GET", url: endpoint });
    return data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

export const fetchOneRow = async (endpoint: string, id: number) => {
  try {
    const data = await httpMysqlClient({
      method: "GET",
      url: `/${endpoint}/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

export const postData = async (
  endpoint: string,
  postData: Record<string, unknown>
) => {
  try {
    const response = await httpMysqlClient({
      method: "POST",
      url: `/${endpoint}`,
      data: postData,
    });
    console.log(response);
  } catch (error) {
    console.error("Error al enviar datos:", error);
  }
};

export const updateData = async (
  endpoint: string,
  id: number,
  updateData: Record<string, unknown>
) => {
  try {
    const response = await httpMysqlClient({
      method: "PUT",
      url: `/${endpoint}/${id}`,
      data: updateData,
    });
    return response;
  } catch (error) {
    console.error("Error al actualizar datos:", error);
  }
};

export const deleteData = async (endpoint: string, id: number) => {
  try {
    const response = await httpMysqlClient({
      method: "DELETE",
      url: `/${endpoint}/${id}`,
    });
    console.log(response);
  } catch (error) {
    console.error("Error al eliminar datos:", error);
  }
};
