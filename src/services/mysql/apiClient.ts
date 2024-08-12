import { BASE_API_URL } from "@/shared/providers/envProvider";
import axios from "axios";

const apiClient = axios.create({
  baseURL: BASE_API_URL,
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
    if (axios.isAxiosError(error)) {
      // Errores específicos de Axios
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error("Error en la respuesta de la API:", error.response.data);
        return {
          error: "Error en la respuesta de la API",
          details: error.response.data,
        };
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        console.error("No se recibió respuesta de la API:", error.request);
        return { error: "No se recibió respuesta de la API" };
      } else {
        // Error al configurar la solicitud
        console.error("Error al configurar la solicitud:", error.message);
        return { error: "Error al configurar la solicitud" };
      }
    } else {
      // Errores no específicos de Axios
      console.error("Error desconocido:", error);
      return { error: "Error desconocido" };
    }
  }
};

export default httpMysqlClient;
