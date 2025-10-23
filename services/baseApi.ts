import axios, { AxiosResponse } from "axios";
import Constants from "expo-constants";
import { RespuestaBase } from "~/lib/tiposApi";

const BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_ALERTAS_URL || "https://jupiter-guardian-api.policia.bo";

export const baseApi = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Función helper para manejar respuestas de API
export function handleApiResponse<T>(response: AxiosResponse<RespuestaBase<T>>): T {
  const respuesta = response.data;

  if (respuesta.exito && respuesta.datos !== undefined) {
    return respuesta.datos;
  } else {
    throw new Error(respuesta.mensaje || "Error en la respuesta");
  }
}
