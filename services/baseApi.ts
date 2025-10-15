import axios, { AxiosResponse, AxiosError } from "axios";
import Constants from "expo-constants"; // ← AGREGAR
// const BASE_URL = process.env.EXPO_PUBLIC_ALERTAS_URL;
const BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_ALERTAS_URL || "https://jupiter-guardian-api.policia.bo";

const baseApi = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Agregar interceptores para logging en desarrollo
baseApi.interceptors.response.use(
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
      const response = await baseApi.post(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      // Retornar el error en formato RespuestaBase
      if (error.response?.data) {
        return error.response.data; // Ya viene con formato { exito: false, codigo, mensaje, error }
      }
      // Error de red u otro
      return {
        exito: false,
        codigo: 500,
        mensaje: "Error de conexión",
        error: error.message || "Error desconocido",
      };
    }
  },

  async get(endpoint: string, config?: any) {
    try {
      const response = await baseApi.get(endpoint, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        codigo: 500,
        mensaje: "Error de conexión",
        error: error.message || "Error desconocido",
      };
    }
  },

  async patch(endpoint: string, data: any, config?: any) {
    try {
      const response = await baseApi.patch(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        codigo: 500,
        mensaje: "Error de conexión",
        error: error.message || "Error desconocido",
      };
    }
  },

  async delete(endpoint: string, config?: any) {
    try {
      const response = await baseApi.delete(endpoint, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        codigo: 500,
        mensaje: "Error de conexión",
        error: error.message || "Error desconocido",
      };
    }
  },
};
