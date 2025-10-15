import { useState, useRef } from "react";
import { toast } from "sonner-native";
import { Linking } from "react-native";
import { AlertaService, AlertaEmergencia } from "~/services/alertaService";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { useAlertaStore } from "~/stores/alertaStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { useUbicacionStore } from "~/stores/ubicacionStore";

export function useEmergencia() {
  const [enviandoAlerta, setEnviandoAlerta] = useState(false);
  const enviandoRef = useRef(false);
  const { idVictima, codigoDenuncia } = useAtenticacionStore();
  const { contactosEmergencia, datosPersonales } = usePerfilStore();
  const { idAlerta, estado, cancelacionSolicitada, setAlertaActiva, setCancelacionSolicitada } = useAlertaStore();
  const { ubicacionActual } = useUbicacionStore();

  // Si hay idAlerta, significa que hay alerta activa
  const alertaEstaActiva = Boolean(idAlerta);

  const enviarMensajeWhatsApp = async (telefono: string, mensaje: string) => {
    try {
      const url = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        toast.success("Mensaje de WhatsApp enviado al contacto de emergencia");
      } else {
        toast.error("WhatsApp no está instalado en este dispositivo");
      }
    } catch (error) {
      toast.error("Error al enviar mensaje de WhatsApp");
    }
  };

  const obtenerContactoPrincipal = () => {
    return contactosEmergencia.find((contacto) => contacto.esPrincipal);
  };

  const enviarAlertaEmergencia = async () => {
    // NO permitir enviar si ya hay una alerta activa o ya se está enviando
    if (enviandoRef.current || alertaEstaActiva) {
      return null;
    }

    if (!idVictima || !codigoDenuncia) {
      return null;
    }

    enviandoRef.current = true;
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

      // Enviar mensaje de WhatsApp al contacto principal
      const contactoPrincipal = obtenerContactoPrincipal();
      if (contactoPrincipal) {
        const mensaje = `🚨 ALERTA DE EMERGENCIA 🚨\n\n${datosPersonales.nombres} ${
          datosPersonales.apellidos
        } ha activado el botón de pánico.\n\nFecha y hora: ${new Date().toLocaleString(
          "es-ES"
        )}\n\nPor favor, contacta inmediatamente a las autoridades o al número de emergencia.\n\nMensaje automático del sistema de alertas.`;
        await enviarMensajeWhatsApp(contactoPrincipal.telefono, mensaje);
      } else {
        toast.warning("No se encontró contacto de emergencia principal para enviar mensaje de WhatsApp");
      }

      return respuesta;
    } catch (error) {
      return { exito: false, codigo: 500, mensaje: error instanceof Error ? error.message : "Error al enviar alerta" };
    } finally {
      setEnviandoAlerta(false);
      enviandoRef.current = false;
    }
  };

  const obtenerUbicacion = async () => {
    if (!ubicacionActual) return null;

    return {
      longitud: ubicacionActual.coords.longitude,
      latitud: ubicacionActual.coords.latitude,
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
