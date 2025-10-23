import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useAlertaStore } from "~/stores/alertaStore";
import { TareaUbicacionSegundoPlano } from "~/services/tareaUbicacionSegundoPlano";

// Configurar el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
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
          name: "Notificaciones de Emergencia",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
          showBadge: true,
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
      // Manejar notificación de alerta finalizada
      manejarNotificacionAlerta(notification);
    });

    // Listener para notificaciones respondidas (tocadas)
    const listenerRespondida = Notifications.addNotificationResponseReceivedListener((response) => {
      // Manejar notificación de alerta finalizada cuando se toca
      manejarNotificacionAlerta(response.notification);
    });

    // Limpiar listeners al desmontar
    return () => {
      listenerRecibida.remove();
      listenerRespondida.remove();
    };
  }, []);

  return {};
};

// Función para manejar notificaciones relacionadas con alertas
const manejarNotificacionAlerta = (notification: Notifications.Notification) => {
  const { data } = notification.request.content;

  // Verificar si es una notificación de alerta finalizada
  if (data?.tipo === "alerta_finalizada") {
    const { idAlerta, estadoFinal } = data;

    // Verificar que coincida con la alerta activa actual
    const alertaActual = useAlertaStore.getState();
    if (alertaActual.idAlerta === idAlerta) {
      console.log(`Alerta ${idAlerta} finalizada con estado: ${estadoFinal}`);

      // Detener la tarea en segundo plano
      TareaUbicacionSegundoPlano.desregistrarTarea();

      // Limpiar la alerta del store
      alertaActual.limpiarAlerta();

      // La notificación ya se mostrará automáticamente por el sistema
    }
  }
};
