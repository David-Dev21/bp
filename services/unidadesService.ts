import { UnidadPolicial, RespuestaUnidadesPoliciales } from "~/lib/tiposApi";

// Datos de ejemplo de unidades - por ahora estáticos
const UNIDADES_EJEMPLO: UnidadPolicial[] = [
  {
    id: "1",
    nombre: "F.E.L.C.V. La Paz - Zona Sur",
    direccion: "Av. Costanera esquina Calle 10, Calacoto",
    latitud: -16.51,
    longitud: -68.1293,
  },
  {
    id: "2",
    nombre: "F.E.L.C.V. La Paz - Centro",
    direccion: "Calle Comercio #1234",
    latitud: -16.495,
    longitud: -68.1343,
  },
  {
    id: "3",
    nombre: "F.E.L.C.V. La Paz - Alto",
    direccion: "Av. Buenos Aires #5678",
    latitud: -16.48,
    longitud: -68.0993,
  },
];

export class UnidadesService {
  // Por ahora retorna datos estáticos
  // TODO: Implementar llamada a API cuando esté lista
  static async obtenerUnidadesCercanas(): Promise<RespuestaUnidadesPoliciales> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      exito: true,
      codigo: 200,
      mensaje: "Unidades obtenidas exitosamente",
      datos: {
        unidades: UNIDADES_EJEMPLO,
      },
    };
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
