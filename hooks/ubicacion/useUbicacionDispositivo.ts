import * as Location from "expo-location";
import { toast } from "sonner-native";

export interface ResultadoPermiso {
  concedido: boolean;
  permisoSegundoPlano?: boolean;
  estado?: Location.PermissionStatus;
}

export const useUbicacionDispositivo = () => {
  const solicitarPermisos = async (): Promise<ResultadoPermiso> => {
    try {
      // Primero solicitar permisos de primer plano
      const { status: statusPrimerPlano } = await Location.requestForegroundPermissionsAsync();

      if (statusPrimerPlano !== "granted") {
        toast("Permisos de ubicación no otorgados");
        return {
          concedido: false,
        };
      }

      // Luego solicitar permisos de segundo plano
      const { status: statusSegundoPlano } = await Location.requestBackgroundPermissionsAsync();

      if (statusSegundoPlano === "granted") {
        toast("Permisos de ubicación concedidos completamente");
      } else {
        toast("Permiso de segundo plano no concedido");
      }

      return {
        concedido: true,
        permisoSegundoPlano: statusSegundoPlano === "granted",
      };
    } catch {
      toast("Error al solicitar permisos de ubicación");
      return {
        concedido: false,
      };
    }
  };

  const verificarPermisos = async (): Promise<ResultadoPermiso> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        toast("Permisos de ubicación no otorgados. Por favor, activa los permisos desde la configuración de tu dispositivo.");
        return {
          concedido: false,
          estado: status,
        };
      }

      return { concedido: true, estado: status };
    } catch {
      toast("Error al verificar permisos de ubicación");
      return {
        concedido: false,
      };
    }
  };

  const obtenerUbicacionActual = async (accuracy: Location.Accuracy = Location.Accuracy.High): Promise<Location.LocationObject | null> => {
    const permiso = await verificarPermisos();
    if (permiso.concedido) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy,
        });
        return location;
      } catch {
        toast("Error al obtener la ubicación actual.");
        return null;
      }
    }

    // No concedidos
    if (permiso.estado === Location.PermissionStatus.UNDETERMINED) {
      const nuevoPermiso = await solicitarPermisos();
      if (nuevoPermiso.concedido) {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy,
          });
          return location;
        } catch {
          toast("Error al obtener la ubicación actual.");
          return null;
        }
      }
    }

    // No concedidos o solicitud fallida
    toast("Permisos de ubicación no otorgados. Por favor, activa los permisos desde la configuración de tu dispositivo.");
    return null;
  };

  return {
    obtenerUbicacionActual,
  };
};
