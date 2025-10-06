import { useState, useEffect, useRef } from "react";
import { toast } from "sonner-native";
import { useAlertaStore } from "~/stores/alertaStore";
import { UbicacionService } from "~/services/ubicacionService";
import { useUbicacionDispositivo } from "~/hooks/ubicacion/useUbicacionDispositivo";

interface EstadoActualizacion {
  compartiendoUbicacion: boolean;
  error: string | null;
}

export function useActualizacionUbicacion() {
  const { idAlerta, estado } = useAlertaStore();
  const { obtenerUbicacionActual } = useUbicacionDispositivo();

  const [estadoLocal, setEstadoLocal] = useState<EstadoActualizacion>({
    compartiendoUbicacion: false,
    error: null,
  });

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debeEnviarRef = useRef<boolean>(false);

  const enviarUbicacionActual = async () => {
    // Verificar si debe enviar usando la referencia
    if (!debeEnviarRef.current) {
      return;
    }

    // Obtener estado actual del store
    const estadoActual = useAlertaStore.getState();

    if (!estadoActual.idAlerta) {
      return;
    }

    // Verificar estado actual antes de enviar
    if (estadoActual.estado === "EN_ATENCION") {
      return;
    }

    try {
      // Obtener ubicación actual
      const ubicacion = await obtenerUbicacionActual();
      if (!ubicacion) {
        setEstadoLocal((prev) => ({ ...prev, error: "No se pudo obtener ubicación" }));
        return;
      }

      // Formatear datos para el servicio
      const datosUbicacion = {
        idAlerta: estadoActual.idAlerta,
        coordenadas: {
          longitud: ubicacion.coords.longitude,
          latitud: ubicacion.coords.latitude,
        },
      };

      // Enviar al servidor
      const resultado = await UbicacionService.enviarUbicacion(datosUbicacion);

      if (!resultado.exito) {
        const mensajeError = resultado.error ? `${resultado.mensaje} - ${resultado.error}` : resultado.mensaje;
        setEstadoLocal((prev) => ({ ...prev, error: mensajeError }));
      } else {
        setEstadoLocal((prev) => ({ ...prev, error: null }));
      }
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : "Error al enviar ubicación";
      setEstadoLocal((prev) => ({ ...prev, error: mensajeError }));
    }
  };

  const iniciarCompartirUbicacion = () => {
    if (!idAlerta) return;

    debeEnviarRef.current = true;
    setEstadoLocal((prev) => ({ ...prev, compartiendoUbicacion: true }));

    // Enviar ubicación inmediatamente
    enviarUbicacionActual();

    // Configurar intervalo de 30 segundos
    intervaloRef.current = setInterval(() => {
      enviarUbicacionActual();
    }, 30000); // 30 segundos
  };

  const detenerCompartirUbicacion = () => {
    // PRIMERO: Deshabilitar el envío
    debeEnviarRef.current = false;

    // SEGUNDO: Limpiar el intervalo
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    setEstadoLocal((prev) => ({ ...prev, compartiendoUbicacion: false, error: null }));
  };

  // Effect para manejar el estado de la alerta
  useEffect(() => {
    // Solo compartir ubicación si hay alerta activa y NO está en atención
    const debeCompartir = idAlerta && estado !== "EN_ATENCION";

    if (debeCompartir) {
      // Solo iniciar si no está ya compartiendo
      if (!estadoLocal.compartiendoUbicacion) {
        iniciarCompartirUbicacion();
      }
    } else {
      detenerCompartirUbicacion();
    }

    // Cleanup al desmontar
    return () => {
      detenerCompartirUbicacion();
    };
  }, [idAlerta, estado]);

  return {
    compartiendoUbicacion: estadoLocal.compartiendoUbicacion,
    error: estadoLocal.error,
    enviarUbicacionActual,
    iniciarCompartirUbicacion,
    detenerCompartirUbicacion,
  };
}
