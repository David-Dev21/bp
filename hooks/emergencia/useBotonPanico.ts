import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { useEmergencia } from './useEmergencia';
import { useAlertaStore } from '~/stores/emergencia/alertaStore';
import { useActualizacionUbicacion } from './useActualizacionUbicacion';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface EstadoBoton {
  primerToque: boolean;
  manteniendoPresionado: boolean;
  tiempoRestante: number;
}

interface ConfiguracionTiempos {
  tiempoEsperaDobleToque: number;
  tiempoMantenido: number;
}

export function useBotonPanico(configuracion: ConfiguracionTiempos = { tiempoEsperaDobleToque: 2000, tiempoMantenido: 3000 }) {
  const { enviarAlertaEmergencia, solicitarCancelacionAlerta, enviandoAlerta, alertaEstaActiva, cancelacionSolicitada } = useEmergencia();

  const { verificarEstadoAlerta, limpiarAlerta } = useAlertaStore();
  const { compartiendoUbicacion } = useActualizacionUbicacion();

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

  // Verificar estado CADA VEZ que se entra a la pantalla alerta.tsx
  useFocusEffect(
    useCallback(() => {
      if (alertaEstaActiva) {
        verificarEstadoAlerta()
          .then((resultado) => {
            if (!resultado.success) {
              // Mostrar error
              Alert.alert('Error', resultado.error || 'Error al verificar el estado de la alerta');
            } else if (resultado.estadoFinalizado) {
              // Mostrar estado final y limpiar
              const mensajes: Record<string, string> = {
                RESUELTA: 'Tu alerta ha sido resuelta por las autoridades',
                CANCELADA: 'Tu alerta ha sido cancelada',
                FALSA_ALERTA: 'Tu alerta ha sido marcada como falsa alerta',
              };

              Alert.alert('Estado de Alerta', mensajes[resultado.estadoFinalizado] || 'La alerta ha finalizado', [
                {
                  text: 'OK',
                  onPress: () => limpiarAlerta(),
                },
              ]);
            }
          })
          .catch(() => {
            Alert.alert('Error', 'Error al verificar el estado de la alerta');
          });
      }
    }, [alertaEstaActiva, verificarEstadoAlerta, limpiarAlerta]),
  );

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
    try {
      await accion();
    } catch (error) {
      console.error('Error al ejecutar acción:', error);
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
        await ejecutarAccion(enviarAlertaEmergencia);
      }
    }
  };

  const manejarPressIn = () => {
    // Si está deshabilitado, no hacer nada
    if (botonDeshabilitado) return;

    const accionMantenida = alertaEstaActiva ? solicitarCancelacionAlerta : enviarAlertaEmergencia;
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
      if (cancelacionSolicitada) return 'Solicitud de cancelación enviada, esperando aprobación';
      if (estadoBoton.manteniendoPresionado) return `Solicitando cancelación... ${estadoBoton.tiempoRestante}s`;
      if (estadoBoton.primerToque) return 'Toca nuevamente para solicitar cancelación';
      return 'Toca 2 veces o mantén presionado para solicitar cancelación';
    }

    if (enviandoAlerta) return 'Enviando alerta...';
    if (estadoBoton.manteniendoPresionado) return `Mantén presionado... ${estadoBoton.tiempoRestante}s`;
    if (estadoBoton.primerToque) return 'Toca nuevamente para confirmar';
    return 'Toca 2 veces o mantén presionado 3s';
  };

  const obtenerEstilosBoton = () => {
    // SOLO estilos inline - no clases
    let backgroundColor = '#DC2626'; // rojo-600
    let borderColor = '#B91C1C'; // rojo-700

    if (cancelacionSolicitada) {
      backgroundColor = '#9CA3AF'; // gris-400
      borderColor = '#6B7280'; // gris-500
    } else if (enviandoAlerta) {
      backgroundColor = '#F87171'; // rojo-400
      borderColor = '#DC2626'; // rojo-600
    } else if (alertaEstaActiva) {
      // Naranja para alerta activa
      backgroundColor = '#EA580C'; // naranja-600
      borderColor = '#C2410C'; // naranja-700

      if (estadoBoton.manteniendoPresionado) {
        backgroundColor = '#C2410C'; // naranja-700
        borderColor = '#9A3412'; // naranja-800
      } else if (estadoBoton.primerToque) {
        backgroundColor = '#F97316'; // naranja-500
        borderColor = '#EA580C'; // naranja-600
      }
    } else {
      // Rojo para estado normal
      if (estadoBoton.manteniendoPresionado) {
        backgroundColor = '#B91C1C'; // rojo-700
        borderColor = '#991B1B'; // rojo-800
      } else if (estadoBoton.primerToque) {
        backgroundColor = '#EF4444'; // rojo-500
        borderColor = '#DC2626'; // rojo-600
      }
    }

    return {
      backgroundColor,
      borderColor,
      opacity: cancelacionSolicitada ? 0.6 : 1,
    };
  };

  // Estado computado: el botón está deshabilitado cuando:
  // 1. Se está enviando una alerta
  // 2. Ya se solicitó cancelación
  const botonDeshabilitado = enviandoAlerta || cancelacionSolicitada;

  return {
    // Estado
    enviandoAlerta,
    alertaEstaActiva,
    cancelacionSolicitada,
    compartiendoUbicacion,
    estadoBoton,
    botonDeshabilitado,

    // Handlers
    manejarToque,
    manejarPressIn,
    manejarPressOut,

    // Utilidades
    obtenerTextoEstado,
    obtenerEstilosBoton,
  };
}
