import { UnidadPolicial } from "~/lib/tiposApi";

export interface RutaNavegacion {
  type: "Feature";
  properties: {
    distance: number;
    duration: number;
  };
  geometry: any;
}

export class NavegacionService {
  async obtenerRutaOSRM(origen: [number, number], destino: [number, number]): Promise<RutaNavegacion | null> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origen[0]},${origen[1]};${destino[0]},${destino[1]}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          type: "Feature",
          properties: {
            distance: route.distance,
            duration: route.duration,
          },
          geometry: route.geometry,
        };
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo ruta OSRM:", error);
      return null;
    }
  }
}

export const navegacionService = new NavegacionService();
