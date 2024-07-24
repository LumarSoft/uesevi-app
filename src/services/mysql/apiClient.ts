import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3006",
  headers: {
    "Content-Type": "application/json",
  },
});

const httpMysqlClient = async ({
  method,
  url,
  data = null,
  params = null,
  headers = {},
}: {
  method: string;
  url: string;
  data?: any;
  params?: any;
  headers?: any;
}) => {
  try {
    const config: any = {
      method,
      url,
      headers,
    };

    if (data !== null) {
      config.data = data;
    }

    if (params !== null) {
      config.params = params;
    }

    const response = await apiClient(config);

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Respuesta vacía o no válida");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error; // Puedes personalizar el manejo de errores
  }
};

export default httpMysqlClient;
