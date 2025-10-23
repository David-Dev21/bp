import { baseApi, handleApiResponse } from "./baseApi";
import { RespuestaBase } from "../lib/tiposApi";

export interface Coordenadas {
  longitud: number;
  latitud: number;
}

export interface EnvioUbicacion {
  idAlerta: string;
  coordenadas: Coordenadas;
}

export class UbicacionService {
  /**
   * Envía la ubicación actual a la API
   */
  static async enviarUbicacion(datos: EnvioUbicacion): Promise<void> {
    const response = await baseApi.post("/ruta-alerta/punto", datos);
    handleApiResponse(response);
  }
}
