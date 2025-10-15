import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner-native";
import { obtenerExpoPushToken } from "~/lib/utils";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { VictimaService } from "~/services/victimaService";

export const useFcmToken = () => {
  // Función para guardar el token en AsyncStorage
  const guardarTokenEnStorage = async (token: string) => {
    try {
      await AsyncStorage.setItem("fcm_token", token);
    } catch {
      // Error silencioso
    }
  };

  // Función para obtener el token almacenado
  const obtenerTokenAlmacenado = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem("fcm_token");
    } catch {
      return null;
    }
  };

  // Función para obtener el token actual y actualizar si cambió
  const obtenerTokenActual = async (): Promise<string | null> => {
    try {
      const nuevoToken = await obtenerExpoPushToken();
      if (!nuevoToken) return null;

      const tokenAlmacenado = await obtenerTokenAlmacenado();

      if (nuevoToken !== tokenAlmacenado) {
        await guardarTokenEnStorage(nuevoToken);

        // Si el usuario está autenticado, actualizar en el servidor
        const idVictima = useAtenticacionStore.getState().idVictima;
        if (idVictima) {
          try {
            await VictimaService.actualizarCuenta(idVictima, {
              fcmToken: nuevoToken,
            });
          } catch {
            // Error silencioso
          }
        }
      }

      return nuevoToken;
    } catch {
      toast.error("Error al obtener el token de notificaciones");
      return null;
    }
  };

  return {
    obtenerTokenActual,
  };
};
