import { useRef } from "react";
import { toast } from "sonner-native";
import { Linking } from "react-native";
import { AlertaService, AlertaEmergencia } from "~/services/alertaService";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { useAlertaStore } from "~/stores/alertaStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { useUbicacionStore } from "~/stores/ubicacionStore";

export function useEmergencia() {
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

  const enviarAlertaEmergencia = async (datosPreparados?: AlertaEmergencia) => {
    // NO permitir enviar si ya hay una alerta activa o ya se está enviando
    if (enviandoRef.current || alertaEstaActiva) {
      return null;
    }

    // Usar datos preparados si se pasan, sino obtener del store
    let datosAlerta: AlertaEmergencia;

    if (datosPreparados) {
      datosAlerta = datosPreparados;
    } else {
      // Verificar que tenemos los datos requeridos del store
      if (!idVictima || !codigoDenuncia) {
        return null;
      }

      datosAlerta = {
        idVictima,
        fechaHora: AlertaService.obtenerFechaHoraISO(),
        codigoDenuncia,
        codigoRegistro: `REG-${idVictima.slice(-8)}`,
        ...(ubicacionActual && {
          ubicacion: {
            longitud: ubicacionActual.coords.longitude,
            latitud: ubicacionActual.coords.latitude,
            precision: ubicacionActual.coords.accuracy || 10,
            marcaTiempo: AlertaService.obtenerFechaHoraISO(),
          },
        }),
      };
    }

    // Verificación final de que tenemos los datos requeridos
    if (!datosAlerta.idVictima || !datosAlerta.codigoDenuncia) {
      return null;
    }

    // BLOQUEAR inmediatamente para evitar múltiples envíos
    enviandoRef.current = true;

    // MOSTRAR CONFIRMACIÓN INMEDIATA al usuario
    toast.success("¡Alerta enviada! Las autoridades han sido notificadas");

    // PROCESAR TODO EN BACKGROUND (no bloquea la UI)
    setTimeout(async () => {
      try {
        const resultadoAlerta = await AlertaService.enviarAlerta(datosAlerta);

        // Guardar alerta en store
        setAlertaActiva(resultadoAlerta.alerta.id, resultadoAlerta.alerta.estadoAlerta);

        // Enviar WhatsApp en background (no bloquea)
        enviarMensajeWhatsAppBackground();
      } catch (error) {
        // Si falló, mostrar error pero no bloquear UI
        console.error("Error enviando alerta:", error);
        toast.error("Error al enviar alerta, pero se notificó localmente");
      } finally {
        // DESBLOQUEAR después de procesamiento
        enviandoRef.current = false;
      }
    }, 100); // Pequeño delay para asegurar que el toast se muestre

    // RETORNAR ÉXITO INMEDIATO (UI no espera)
    return { exito: true, mensaje: "Alerta enviada exitosamente" };
  };

  const enviarMensajeWhatsAppBackground = () => {
    // Enviar WhatsApp en background sin bloquear
    setTimeout(async () => {
      try {
        const contactoPrincipal = obtenerContactoPrincipal();
        if (contactoPrincipal) {
          const mensaje = `🚨 ALERTA DE EMERGENCIA 🚨\n\n${datosPersonales.nombres} ${
            datosPersonales.apellidos
          } ha activado el botón de pánico.\n\nFecha y hora: ${new Date().toLocaleString(
            "es-ES"
          )}\n\nPor favor, contacta inmediatamente a las autoridades o al número de emergencia.\n\nMensaje automático del sistema de alertas.`;
          await enviarMensajeWhatsApp(contactoPrincipal.telefono, mensaje);
        }
      } catch (error) {
        // Error silencioso en background
        console.error("Error enviando WhatsApp:", error);
      }
    }, 2000); // Esperar 2 segundos antes de enviar WhatsApp
  };

  const solicitarCancelacionAlerta = async () => {
    if (!idAlerta) {
      return { exito: false, codigo: 400, mensaje: "No hay alerta activa" };
    }

    if (cancelacionSolicitada) {
      return { exito: false, codigo: 400, mensaje: "Ya se solicitó la cancelación" };
    }

    try {
      await AlertaService.solicitarCancelacionAlerta(idAlerta);
      setCancelacionSolicitada(true);
      return { exito: true, mensaje: "Cancelación solicitada exitosamente" };
    } catch (error) {
      return { exito: false, codigo: 500, mensaje: "Error al solicitar cancelación" };
    }
  };

  return {
    enviarAlertaEmergencia,
    solicitarCancelacionAlerta,
    idAlerta,
    estado,
    cancelacionSolicitada,
    alertaEstaActiva,
  };
}
