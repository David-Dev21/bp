import axios, { AxiosResponse, AxiosError } from "axios";

// API base para servidor local
const BASE_URL = process.env.EXPO_PUBLIC_ALERTAS_URL;

// Configurar axios instance para servidor local
const alertaApi = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, // 8 segundos máximo
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Agregar interceptores para logging en desarrollo
alertaApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de responses exitosas en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log(`${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error: AxiosError) => {
    const mensaje = obtenerMensajeError(error);
    const codigo = error.response?.status || 500;
    const datos = error.response?.data;

    // Log del error
    console.error(`${codigo}:`, mensaje, {
      url: error.config?.url,
      method: error.config?.method,
      datos,
    });

    // Re-throw para que el código que llama lo maneje
    throw error;
  }
);

// Función helper para obtener mensaje de error
const obtenerMensajeError = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === "object" && "message" in error.response.data) {
    return (error.response.data as any).message;
  }
  return error.message || "Error desconocido";
};

export const alertasApi = {
  async post(endpoint: string, data: any, config?: any) {
    try {
      const response = await alertaApi.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async get(endpoint: string, config?: any) {
    try {
      const response = await alertaApi.get(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async patch(endpoint: string, data: any, config?: any) {
    try {
      const response = await alertaApi.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
