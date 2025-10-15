import { UnidadPolicial, RespuestaUnidadesPoliciales } from "~/lib/tiposApi";
import { alertasApi } from "./baseApi";

export class UnidadesService {
  static async obtenerUnidadesCercanas(latitud: number, longitud: number): Promise<RespuestaUnidadesPoliciales> {
    try {
      const respuesta = await alertasApi.get(`/unidades/cercanas?latitud=${latitud}&longitud=${longitud}`);

      if (respuesta.exito && respuesta.datos) {
        // Los datos ya vienen en el formato correcto
        return {
          exito: true,
          codigo: respuesta.codigo,
          mensaje: respuesta.mensaje,
          datos: { unidades: respuesta.datos },
        };
      } else {
        return {
          exito: false,
          codigo: respuesta.codigo || 500,
          mensaje: respuesta.mensaje || "Error al obtener unidades cercanas",
        };
      }
    } catch (error) {
      return {
        exito: false,
        codigo: 500,
        mensaje: "Error de conexión al obtener unidades cercanas",
      };
    }
  }

  // Método para calcular distancia entre dos puntos (fórmula de Haversine)
  static calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;

    return Math.round(distancia * 10) / 10; // Redondear a 1 decimal
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
