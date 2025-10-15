import { useState, useEffect } from "react";
import { useAlertaStore } from "~/stores/alertaStore";
import { TareaUbicacionSegundoPlano } from "~/services/tareaUbicacionSegundoPlano";

interface EstadoActualizacion {
  compartiendoUbicacion: boolean;
  error: string | null;
  tareaSegundoPlanoActiva: boolean;
}

export function useActualizacionUbicacion() {
  const { idAlerta, estado } = useAlertaStore();

  const [estadoLocal, setEstadoLocal] = useState<EstadoActualizacion>({
    compartiendoUbicacion: false,
    error: null,
    tareaSegundoPlanoActiva: false,
  });

  const iniciarCompartirUbicacion = async () => {
    if (!idAlerta) return;

    setEstadoLocal((prev) => ({ ...prev, compartiendoUbicacion: true }));

    // Registrar tarea de segundo plano (funciona en primer y segundo plano)
    const registrada = await TareaUbicacionSegundoPlano.registrarTarea();
    setEstadoLocal((prev) => ({ ...prev, tareaSegundoPlanoActiva: registrada }));

    if (!registrada) {
      setEstadoLocal((prev) => ({ ...prev, error: "No se pudo iniciar el envío de ubicación" }));
    }
  };

  const detenerCompartirUbicacion = async () => {
    // Desregistrar tarea de segundo plano
    await TareaUbicacionSegundoPlano.desregistrarTarea();

    setEstadoLocal((prev) => ({
      ...prev,
      compartiendoUbicacion: false,
      error: null,
      tareaSegundoPlanoActiva: false,
    }));
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

    // NO limpiar al desmontar - la tarea debe seguir activa aunque cambies de pantalla
    // Solo se detiene cuando la alerta se finaliza o pasa a EN_ATENCION
  }, [idAlerta, estado]);

  return {
    compartiendoUbicacion: estadoLocal.compartiendoUbicacion,
    tareaSegundoPlanoActiva: estadoLocal.tareaSegundoPlanoActiva,
    error: estadoLocal.error,
    iniciarCompartirUbicacion,
    detenerCompartirUbicacion,
  };
}
