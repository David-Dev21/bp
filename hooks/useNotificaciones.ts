import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Configurar el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotificaciones = () => {
  useEffect(() => {
    // Configurar canal de notificaciones para Android
    const configurarCanalAndroid = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    configurarCanalAndroid();

    // Solicitar permisos
    const solicitarPermisos = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
      }
      // No mostrar advertencia, permisos se manejan en obtenerExpoPushToken si es necesario
    };

    solicitarPermisos();

    // Listener para notificaciones recibidas mientras la app está abierta
    const listenerRecibida = Notifications.addNotificationReceivedListener((notification) => {
      // Manejar notificación recibida (opcional: mostrar toast o algo)
    });

    // Listener para notificaciones respondidas (tocadas)
    const listenerRespondida = Notifications.addNotificationResponseReceivedListener((response) => {
      // Navegar o manejar la respuesta
    });

    // Limpiar listeners al desmontar
    return () => {
      listenerRecibida.remove();
      listenerRespondida.remove();
    };
  }, []);

  return {};
};
