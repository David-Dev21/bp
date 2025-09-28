import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useAlertaStore } from '~/stores/emergencia/alertaStore';
import { UbicacionService } from '~/services/emergencia/ubicacionService';

interface EstadoActualizacion {
  compartiendoUbicacion: boolean;
  error: string | null;
}

export function useActualizacionUbicacion() {
  const { idAlerta, estado } = useAlertaStore();

  const [estadoLocal, setEstadoLocal] = useState<EstadoActualizacion>({
    compartiendoUbicacion: false,
    error: null,
  });

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debeEnviarRef = useRef<boolean>(false);

  const enviarUbicacionActual = async () => {
    // Verificar si debe enviar usando la referencia
    if (!debeEnviarRef.current) {
      console.log('🚫 No enviar: Compartición detenida');
      return;
    }

    // Obtener estado actual del store
    const estadoActual = useAlertaStore.getState();

    if (!estadoActual.idAlerta) {
      console.log('❌ No hay idAlerta para enviar ubicación');
      return;
    }

    // Verificar estado actual antes de enviar
    if (estadoActual.estado === 'EN_ATENCION') {
      console.log('🚫 No enviar: La alerta está EN_ATENCION');
      return;
    }

    try {
      // Obtener permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setEstadoLocal((prev) => ({ ...prev, error: 'Permisos de ubicación denegados' }));
        return;
      }

      // Obtener ubicación actual
      const ubicacion = await Location.getCurrentPositionAsync();

      // Formatear datos para el servicio
      const datosUbicacion = {
        idAlerta: estadoActual.idAlerta,
        coordenadas: {
          longitud: ubicacion.coords.longitude,
          latitud: ubicacion.coords.latitude,
        },
      };

      // Enviar al servidor
      await UbicacionService.enviarUbicacion(datosUbicacion);
      console.log('✅ Ubicación enviada correctamente');

      setEstadoLocal((prev) => ({ ...prev, error: null }));
    } catch (error) {
      console.error('❌ Error enviando ubicación:', error);
      setEstadoLocal((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  };

  const iniciarCompartirUbicacion = () => {
    if (!idAlerta) return;

    console.log('🟢 Iniciando compartición de ubicación cada 30 segundos');
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
    console.log('🔴 Deteniendo compartición de ubicación');

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
    const debeCompartir = idAlerta && estado !== 'EN_ATENCION';

    console.log(`📍 Estado alerta: ${estado}, idAlerta: ${idAlerta}, debe compartir: ${debeCompartir}`);

    if (debeCompartir) {
      // Solo iniciar si no está ya compartiendo
      if (!estadoLocal.compartiendoUbicacion) {
        iniciarCompartirUbicacion();
      }
    } else {
      detenerCompartirUbicacion();

      // Log específico para EN_ATENCION
      if (estado === 'EN_ATENCION') {
        console.log('🚫 Ubicación detenida: La alerta está EN_ATENCION');
      }
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
