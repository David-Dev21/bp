import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type EstadoAlerta } from "~/services/alertaService";

interface AlertaEstado {
  idAlerta: string | null;
  estado: EstadoAlerta | null;
  cancelacionSolicitada: boolean;

  setAlertaActiva: (id: string, estado: EstadoAlerta) => void;
  limpiarAlerta: () => void;
  setCancelacionSolicitada: (solicitada: boolean) => void;
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
    }),
    {
      name: "alerta-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
