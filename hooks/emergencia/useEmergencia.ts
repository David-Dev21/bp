import { useState } from "react";
import { AlertaService, AlertaEmergencia } from "~/services/emergencia/alertaService";
import { useAtenticacionStore } from "~/stores/victimas/atenticacionStore";
import { useAlertaStore } from "~/stores/emergencia/alertaStore";
import * as Location from "expo-location";

export function useEmergencia() {
  const [enviandoAlerta, setEnviandoAlerta] = useState(false);
  const { idVictima, codigoDenuncia } = useAtenticacionStore();
  const { idAlerta, estado, cancelacionSolicitada, setAlertaActiva, setCancelacionSolicitada } = useAlertaStore();

  // Si hay idAlerta, significa que hay alerta activa
  const alertaEstaActiva = Boolean(idAlerta);

  const enviarAlertaEmergencia = async () => {
    // NO permitir enviar si ya hay una alerta activa
    if (enviandoAlerta || alertaEstaActiva) {
      throw new Error("Ya hay una alerta activa");
    }

    if (!idVictima || !codigoDenuncia) {
      throw new Error("Datos de usuario incompletos para enviar alerta");
    }

    setEnviandoAlerta(true);

    try {
      const ubicacion = await obtenerUbicacion();

      const datosAlerta: AlertaEmergencia = {
        idVictima,
        fechaHora: AlertaService.obtenerFechaHoraISO(),
        codigoDenuncia,
        codigoRegistro: `REG-${idVictima.slice(-8)}`,
        ...(ubicacion && { ubicacion }),
      };

      const respuesta = await AlertaService.enviarAlerta(datosAlerta);

      if (!respuesta.exito || !respuesta.datos) {
        throw new Error(respuesta.mensaje || "Error al enviar la alerta");
      }

      // Guardar SOLO idAlerta y estado en el store
      setAlertaActiva(respuesta.datos.alerta.id, respuesta.datos.alerta.estadoAlerta);

      return respuesta;
    } catch (error) {
      throw error;
    } finally {
      setEnviandoAlerta(false);
    }
  };

  const obtenerUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 8000,
      });
      return {
        longitud: location.coords.longitude,
        latitud: location.coords.latitude,
        precision: 10,
        marcaTiempo: AlertaService.obtenerFechaHoraISO(),
      };
    } catch {
      return null;
    }
  };

  const solicitarCancelacionAlerta = async () => {
    if (!idAlerta) {
      throw new Error("No hay alerta activa para solicitar cancelación");
    }

    if (cancelacionSolicitada) {
      throw new Error("Ya se solicitó la cancelación de esta alerta");
    }

    try {
      await AlertaService.solicitarCancelacionAlerta(idAlerta);
      setCancelacionSolicitada(true);
      return true;
    } catch (error) {
      // El servicio ya maneja y lanza errores específicos
      throw error;
    }
  };

  return {
    enviarAlertaEmergencia,
    solicitarCancelacionAlerta,
    enviandoAlerta,
    idAlerta,
    estado,
    cancelacionSolicitada,
    alertaEstaActiva,
  };
}
