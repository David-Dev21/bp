import { alertasApi } from "./baseApi";
import { RespuestaUbicacionGPS } from "../lib/tiposApi";

export interface PosicionGPS {
  latitud: number;
  longitud: number;
}

export class departamentoService {
  static async obtenerUbicacionPorCoordenadas(posicion: PosicionGPS): Promise<RespuestaUbicacionGPS> {
    return await alertasApi.get(`/departamentos/encontrar?latitud=${posicion.latitud}&longitud=${posicion.longitud}`);
  }
}
