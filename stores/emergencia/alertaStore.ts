import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlertaService, type EstadoAlerta } from "~/services/emergencia/alertaService";

interface AlertaEstado {
  idAlerta: string | null;
  estado: EstadoAlerta | null;
  cancelacionSolicitada: boolean;

  setAlertaActiva: (id: string, estado: EstadoAlerta) => void;
  limpiarAlerta: () => void;
  setCancelacionSolicitada: (solicitada: boolean) => void;
  verificarEstadoAlerta: () => Promise<{ success: boolean; estadoFinalizado?: EstadoAlerta; error?: string }>;
}

export const useAlertaStore = create<AlertaEstado>()(
  persist(
    (set, get) => ({
      idAlerta: null,
      estado: null,
      cancelacionSolicitada: false,

      setAlertaActiva: (id: string, estado: EstadoAlerta) => {
        set({
          idAlerta: id,
          estado: estado,
          cancelacionSolicitada: false,
        });
      },

      limpiarAlerta: () => {
        set({
          idAlerta: null,
          estado: null,
          cancelacionSolicitada: false,
        });
      },

      setCancelacionSolicitada: (solicitada: boolean) => {
        set({ cancelacionSolicitada: solicitada });
      },

      verificarEstadoAlerta: async () => {
        const { idAlerta } = get();
        if (!idAlerta) {
          return { success: false, error: "No hay alerta activa" };
        }

        try {
          const respuesta = await AlertaService.consultarEstadoAlerta(idAlerta);

          if (!respuesta.datos) {
            return { success: false, error: "No se recibieron datos del servidor" };
          }

          const estadoActual = respuesta.datos.estadoAlerta as EstadoAlerta;

          // Actualizar el estado en el store
          set({ estado: estadoActual });

          // Verificar si el estado es final (alerta terminada)
          const estadosFinales: EstadoAlerta[] = ["RESUELTA", "CANCELADA", "FALSA_ALERTA"];
          if (estadosFinales.includes(estadoActual)) {
            return { success: true, estadoFinalizado: estadoActual };
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: "Error al consultar el estado de la alerta" };
        }
      },
    }),
    {
      name: "alerta-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
