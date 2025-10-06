import { useState } from "react";
import { toast } from "sonner-native";
import { AlertaService, AlertaEmergencia } from "~/services/alertaService";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { useAlertaStore } from "~/stores/alertaStore";
import { useUbicacionDispositivo } from "~/hooks/ubicacion/useUbicacionDispositivo";

export function useEmergencia() {
  const [enviandoAlerta, setEnviandoAlerta] = useState(false);
  const { idVictima, codigoDenuncia } = useAtenticacionStore();
  const { idAlerta, estado, cancelacionSolicitada, setAlertaActiva, setCancelacionSolicitada } = useAlertaStore();
  const { obtenerUbicacionActual } = useUbicacionDispositivo();

  // Si hay idAlerta, significa que hay alerta activa
  const alertaEstaActiva = Boolean(idAlerta);

  const enviarAlertaEmergencia = async () => {
    // NO permitir enviar si ya hay una alerta activa
    if (enviandoAlerta || alertaEstaActiva) {
      return null;
    }

    if (!idVictima || !codigoDenuncia) {
      return null;
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
        return respuesta;
      }

      // Guardar SOLO idAlerta y estado en el store
      setAlertaActiva(respuesta.datos.alerta.id, respuesta.datos.alerta.estadoAlerta);

      return respuesta;
    } catch (error) {
      return { exito: false, codigo: 500, mensaje: error instanceof Error ? error.message : "Error al enviar alerta" };
    } finally {
      setEnviandoAlerta(false);
    }
  };

  const obtenerUbicacion = async () => {
    const location = await obtenerUbicacionActual();
    if (!location) return null;

    return {
      longitud: location.coords.longitude,
      latitud: location.coords.latitude,
      precision: 10,
      marcaTiempo: AlertaService.obtenerFechaHoraISO(),
    };
  };

  const solicitarCancelacionAlerta = async () => {
    if (!idAlerta) {
      return { exito: false, codigo: 400, mensaje: "No hay alerta activa" };
    }

    if (cancelacionSolicitada) {
      return { exito: false, codigo: 400, mensaje: "Ya se solicitó la cancelación" };
    }

    const resultado = await AlertaService.solicitarCancelacionAlerta(idAlerta);
    if (resultado.exito) {
      setCancelacionSolicitada(true);
    }
    return resultado;
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
