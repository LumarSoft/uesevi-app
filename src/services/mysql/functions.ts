import httpMysqlClient from "./apiClient";

export const fetchData = async (endpoint: string): Promise<any> => {
  const data = await httpMysqlClient({ method: "GET", url: `/${endpoint}` });
  if (data.error) {
    console.error("Error al obtener datos:", data.error);
    return null; // o un valor predeterminado adecuado
  }
  return data;
};

export const fetchOneRow = async (endpoint: string, id: number) => {
  const data = await httpMysqlClient({
    method: "GET",
    url: `/${endpoint}/${id}`,
  });
  if (data.error) {
    console.error("Error al obtener datos:", data.error);
    return null; // o un valor predeterminado adecuado
  }
  return data;
};

export const postData = async (
  endpoint: string,
  postData: Record<string, unknown>
) => {
  const response = await httpMysqlClient({
    method: "POST",
    url: `/${endpoint}`,
    data: postData,
  });
  if (response.error) {
    console.error("Error al enviar datos:", response.error);
    return null; // o un valor predeterminado adecuado
  }
  return response;
};

export const updateData = async (
  endpoint: string,
  id: number,
  updateData: Record<string, unknown>
) => {
  const response = await httpMysqlClient({
    method: "PUT",
    url: `/${endpoint}/${id}`,
    data: updateData,
  });
  if (response.error) {
    console.error("Error al actualizar datos:", response.error);
    return null; // o un valor predeterminado adecuado
  }
  return response;
};

export const deleteData = async (endpoint: string, id: number) => {
  const response = await httpMysqlClient({
    method: "DELETE",
    url: `/${endpoint}/${id}`,
  });
  if (response.error) {
    console.error("Error al eliminar datos:", response.error);
    return null; // o un valor predeterminado adecuado
  }
  return response;
};
