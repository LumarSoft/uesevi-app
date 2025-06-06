// Revalidate para Next.js
export const revalidate = 1;

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Función para manejar la respuesta de la API
const handleResponse = async (response: Response) => {
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
      status: "error",
      statusCode: response.status,
      message: errorDetails.message || "Error desconocido",
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
    console.log(`Enviando POST a: ${BASE_API_URL}/${endpoint}`);
    
    // Log FormData contents (excluding files for readability)
    const formDataEntries = Array.from(postData.entries());
    const logData = formDataEntries.map(([key, value]) => {
      if (value instanceof File) {
        return [key, `File: ${value.name} (${value.size} bytes, ${value.type})`];
      }
      return [key, value];
    });
    console.log("FormData contents:", Object.fromEntries(logData));

    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: "POST",
      body: postData, // No agregues el header 'Content-Type'
    });

    const result = await handleResponse(response);
    console.log("POST response:", result);
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

export const updateData = async (
  endpoint: string,
  id: number,
  updateData: FormData
) => {
  try {
    const url = endpoint.replace(":id", id.toString());
    console.log(`Enviando PUT a: ${BASE_API_URL}/${url}`);
    
    // Log FormData contents (excluding files for readability)
    const formDataEntries = Array.from(updateData.entries());
    const logData = formDataEntries.map(([key, value]) => {
      if (value instanceof File) {
        return [key, `File: ${value.name} (${value.size} bytes, ${value.type})`];
      }
      return [key, value];
    });
    console.log("FormData contents:", Object.fromEntries(logData));

    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: "PUT",
      body: updateData, // No agregues el header 'Content-Type'
    });

    const result = await handleResponse(response);
    console.log("PUT response:", result);
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
