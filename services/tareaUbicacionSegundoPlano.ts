import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { UbicacionService } from "./ubicacionService";
import { useAlertaStore } from "~/stores/alertaStore";

const NOMBRE_TAREA_UBICACION = "ENVIO_UBICACION_SEGUNDO_PLANO";

/**
 * Define la tarea de segundo plano que envía la ubicación
 */
TaskManager.defineTask(NOMBRE_TAREA_UBICACION, async ({ data, error }: any) => {
  if (error) {
    console.error("Error en tarea de ubicación:", error);
    return;
  }

  if (!data) {
    console.warn("No hay datos de ubicación");
    return;
  }

  try {
    // Obtener estado actual de la alerta
    const estado = useAlertaStore.getState();

    // Verificar si hay alerta activa y no está en atención
    if (!estado.idAlerta || estado.estado === "EN_ATENCION") {
      console.log("No hay alerta activa o está en atención, omitiendo envío");
      return;
    }

    // Obtener la última ubicación de los datos recibidos
    const { locations } = data;
    if (!locations || locations.length === 0) {
      console.warn("No hay ubicaciones en los datos");
      return;
    }

    const ultimaUbicacion = locations[locations.length - 1];

    // Enviar ubicación al servidor
    const datosUbicacion = {
      idAlerta: estado.idAlerta,
      coordenadas: {
        longitud: ultimaUbicacion.coords.longitude,
        latitud: ultimaUbicacion.coords.latitude,
      },
    };

    const resultado = await UbicacionService.enviarUbicacion(datosUbicacion);

    if (resultado.exito) {
      console.log("Ubicación enviada exitosamente en segundo plano");
    } else {
      console.error("Error al enviar ubicación:", resultado.mensaje);
    }
  } catch (error) {
    console.error("Error en tarea de segundo plano:", error);
  }
});

export class TareaUbicacionSegundoPlano {
  /**
   * Registra la tarea de segundo plano usando Location updates
   */
  static async registrarTarea(): Promise<boolean> {
    try {
      // Verificar si la tarea ya está registrada
      const estaRegistrada = await TaskManager.isTaskRegisteredAsync(NOMBRE_TAREA_UBICACION);

      if (estaRegistrada) {
        console.log("Tarea ya registrada");
        return true;
      }

      // Registrar actualizaciones de ubicación en segundo plano
      await Location.startLocationUpdatesAsync(NOMBRE_TAREA_UBICACION, {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000, // 30 segundos
        distanceInterval: 0, // Enviar siempre, sin importar distancia
        foregroundService: {
          notificationTitle: "Linterna",
          notificationBody: "Aplicación en segundo plano",
          notificationColor: "#009688",
        },
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
      });

      console.log("Tarea de ubicación en segundo plano registrada");
      return true;
    } catch (error) {
      console.error("Error al registrar tarea de segundo plano:", error);
      return false;
    }
  }

  /**
   * Desregistra la tarea de segundo plano
   */
  static async desregistrarTarea(): Promise<boolean> {
    try {
      const estaRegistrada = await TaskManager.isTaskRegisteredAsync(NOMBRE_TAREA_UBICACION);

      if (!estaRegistrada) {
        return true;
      }

      await Location.stopLocationUpdatesAsync(NOMBRE_TAREA_UBICACION);
      console.log("Tarea de ubicación en segundo plano desregistrada");
      return true;
    } catch (error) {
      console.error("Error al desregistrar tarea de segundo plano:", error);
      return false;
    }
  }

  /**
   * Verifica si la tarea está registrada
   */
  static async estaRegistrada(): Promise<boolean> {
    try {
      return await TaskManager.isTaskRegisteredAsync(NOMBRE_TAREA_UBICACION);
    } catch (error) {
      console.error("Error al verificar tarea de segundo plano:", error);
      return false;
    }
  }
}
