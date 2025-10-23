import { useState, useRef } from "react";
import { toast } from "sonner-native";
import { useEmergencia } from "./useEmergencia";
import { AlertaEmergencia } from "~/services/alertaService";
import { useActualizacionUbicacion } from "./useActualizacionUbicacion";

interface EstadoBoton {
  primerToque: boolean;
  manteniendoPresionado: boolean;
  tiempoRestante: number;
}

interface ConfiguracionTiempos {
  tiempoEsperaDobleToque: number;
  tiempoMantenido: number;
}

export function useBotonPanico(
  datosAlertaPreparados?: AlertaEmergencia,
  configuracion: ConfiguracionTiempos = { tiempoEsperaDobleToque: 2000, tiempoMantenido: 3000 }
) {
  const { enviarAlertaEmergencia, solicitarCancelacionAlerta, alertaEstaActiva, cancelacionSolicitada } = useEmergencia();

  const { compartiendoUbicacion, tareaSegundoPlanoActiva } = useActualizacionUbicacion();

  const [estadoBoton, setEstadoBoton] = useState<EstadoBoton>({
    primerToque: false,
    manteniendoPresionado: false,
    tiempoRestante: 0,
  });

  const timers = useRef({
    dobleToque: null as ReturnType<typeof setTimeout> | null,
    mantenido: null as ReturnType<typeof setTimeout> | null,
    intervalo: null as ReturnType<typeof setInterval> | null,
  });

  const limpiarTimers = () => {
    Object.values(timers.current).forEach((timer) => timer && clearTimeout(timer));
    timers.current = { dobleToque: null, mantenido: null, intervalo: null };
  };

  const resetearEstado = () => {
    limpiarTimers();
    setEstadoBoton({ primerToque: false, manteniendoPresionado: false, tiempoRestante: 0 });
  };

  const iniciarCuentaRegresiva = (accion: () => Promise<any>) => {
    const tiempoTotal = configuracion.tiempoMantenido / 1000;
    setEstadoBoton((prev) => ({ ...prev, manteniendoPresionado: true, tiempoRestante: tiempoTotal }));

    timers.current.intervalo = setInterval(() => {
      setEstadoBoton((prev) => {
        if (prev.tiempoRestante <= 1) {
          accion();
          return { ...prev, tiempoRestante: 0 };
        }
        return { ...prev, tiempoRestante: prev.tiempoRestante - 1 };
      });
    }, 1000);

    timers.current.mantenido = setTimeout(accion, configuracion.tiempoMantenido);
  };

  const ejecutarAccion = async (accion: () => Promise<any>) => {
    resetearEstado();
    const resultado = await accion();

    if (resultado && !resultado.exito) {
      const mensajeError = resultado.error ? `${resultado.mensaje} - ${resultado.error}` : resultado.mensaje;
      toast.error(mensajeError);
    } else if (resultado?.exito) {
      const mensajeExito = resultado.error ? `${resultado.mensaje} - ${resultado.error}` : resultado.mensaje;
      toast.success(mensajeExito);
    }
  };

  const manejarToque = async () => {
    // Si está deshabilitado, no hacer nada
    if (botonDeshabilitado) return;

    if (alertaEstaActiva) {
      // Modo solicitar cancelación
      if (!estadoBoton.primerToque) {
        setEstadoBoton((prev) => ({ ...prev, primerToque: true }));
        timers.current.dobleToque = setTimeout(() => {
          setEstadoBoton((prev) => ({ ...prev, primerToque: false }));
        }, configuracion.tiempoEsperaDobleToque);
      } else {
        await ejecutarAccion(solicitarCancelacionAlerta);
      }
    } else {
      // Modo enviar alerta
      if (!estadoBoton.primerToque) {
        setEstadoBoton((prev) => ({ ...prev, primerToque: true }));
        timers.current.dobleToque = setTimeout(() => {
          setEstadoBoton((prev) => ({ ...prev, primerToque: false }));
        }, configuracion.tiempoEsperaDobleToque);
      } else {
        await ejecutarAccion(() => enviarAlertaEmergencia(datosAlertaPreparados));
      }
    }
  };

  const manejarPressIn = () => {
    // Si está deshabilitado, no hacer nada
    if (botonDeshabilitado) return;

    const accionMantenida = alertaEstaActiva ? solicitarCancelacionAlerta : () => enviarAlertaEmergencia(datosAlertaPreparados);
    iniciarCuentaRegresiva(accionMantenida);
  };

  const manejarPressOut = () => {
    setEstadoBoton((prev) => ({ ...prev, manteniendoPresionado: false, tiempoRestante: 0 }));
    if (timers.current.mantenido) {
      clearTimeout(timers.current.mantenido);
      timers.current.mantenido = null;
    }
    if (timers.current.intervalo) {
      clearInterval(timers.current.intervalo);
      timers.current.intervalo = null;
    }
  };

  const obtenerTextoEstado = (): string => {
    if (alertaEstaActiva) {
      if (cancelacionSolicitada) return "Solicitud de cancelación enviada, esperando aprobación";
      if (estadoBoton.manteniendoPresionado) return `Solicitando cancelación... ${estadoBoton.tiempoRestante}s`;
      if (estadoBoton.primerToque) return "Toca nuevamente para solicitar cancelación";
      return "Toca 2 veces o mantén presionado para solicitar cancelación";
    }

    if (estadoBoton.manteniendoPresionado) return `Mantén presionado... ${estadoBoton.tiempoRestante}s`;
    if (estadoBoton.primerToque) return "Toca nuevamente para confirmar";
    return "Toca 2 veces o mantén presionado 3s";
  };

  const obtenerEstilosBoton = () => {
    // SOLO estilos inline - no clases
    let backgroundColor = "#DC2626"; // rojo-600
    let borderColor = "#B91C1C"; // rojo-700

    if (cancelacionSolicitada) {
      backgroundColor = "#9CA3AF"; // gris-400
      borderColor = "#6B7280"; // gris-500
    } else if (alertaEstaActiva) {
      // Naranja para alerta activa
      backgroundColor = "#EA580C"; // naranja-600
      borderColor = "#C2410C"; // naranja-700

      if (estadoBoton.manteniendoPresionado) {
        backgroundColor = "#C2410C"; // naranja-700
        borderColor = "#9A3412"; // naranja-800
      } else if (estadoBoton.primerToque) {
        backgroundColor = "#F97316"; // naranja-500
        borderColor = "#EA580C"; // naranja-600
      }
    } else {
      // Rojo para estado normal
      if (estadoBoton.manteniendoPresionado) {
        backgroundColor = "#B91C1C"; // rojo-700
        borderColor = "#991B1B"; // rojo-800
      } else if (estadoBoton.primerToque) {
        backgroundColor = "#EF4444"; // rojo-500
        borderColor = "#DC2626"; // rojo-600
      }
    }

    return {
      backgroundColor,
      borderColor,
      opacity: cancelacionSolicitada ? 0.6 : 1,
    };
  };

  // Estado computado: el botón está deshabilitado cuando se solicitó cancelación
  const botonDeshabilitado = cancelacionSolicitada;

  return {
    alertaEstaActiva,
    cancelacionSolicitada,
    compartiendoUbicacion,
    tareaSegundoPlanoActiva,
    estadoBoton,
    botonDeshabilitado,
    manejarToque,
    manejarPressIn,
    manejarPressOut,
    obtenerTextoEstado,
    obtenerEstilosBoton,
  };
}
