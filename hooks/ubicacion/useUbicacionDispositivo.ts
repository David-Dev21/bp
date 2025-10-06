import * as Location from "expo-location";

export interface ResultadoPermiso {
  concedido: boolean;
  mensaje?: string;
}
export const useUbicacionDispositivo = () => {
  const solicitarPermisos = async (): Promise<ResultadoPermiso> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return {
          concedido: false,
          mensaje: "Permisos de ubicación no otorgados",
        };
      }

      return { concedido: true };
    } catch {
      return {
        concedido: false,
        mensaje: "Error al solicitar permisos de ubicación",
      };
    }
  };

  const verificarPermisos = async (): Promise<ResultadoPermiso> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        return {
          concedido: false,
          mensaje: "Permisos de ubicación no otorgados. Por favor, activa los permisos desde la configuración de tu dispositivo.",
        };
      }

      return { concedido: true };
    } catch {
      return {
        concedido: false,
        mensaje: "Error al verificar permisos de ubicación",
      };
    }
  };

  const obtenerUbicacionActual = async (accuracy: Location.Accuracy = Location.Accuracy.High): Promise<Location.LocationObject | null> => {
    const permiso = await verificarPermisos();
    if (!permiso.concedido) {
      return null;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy,
      });
      return location;
    } catch {
      return null;
    }
  };

  return {
    solicitarPermisos,
    verificarPermisos,
    obtenerUbicacionActual,
  };
};
