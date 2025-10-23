import { UnidadPolicial } from "~/lib/tiposApi";
import { baseApi, handleApiResponse } from "./baseApi";

export class UnidadesService {
  static async obtenerUnidadesCercanas(latitud: number, longitud: number): Promise<{ unidades: UnidadPolicial[] }> {
    const response = await baseApi.get(`/unidades/cercanas?latitud=${latitud}&longitud=${longitud}`);
    return handleApiResponse<{ unidades: UnidadPolicial[] }>(response);
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
