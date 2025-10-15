import { create } from "zustand";
import { LocationObject } from "expo-location";
import { useUbicacionDispositivo } from "~/hooks/ubicacion/useUbicacionDispositivo";

interface EstadoUbicacion {
  ubicacionActual: LocationObject | null;
  cargando: boolean;
  error: string | null;
  setUbicacion: (ubicacion: LocationObject | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  actualizarUbicacion: () => Promise<void>;
}

export const useUbicacionStore = create<EstadoUbicacion>((set, get) => ({
  ubicacionActual: null,
  cargando: false,
  error: null,

  setUbicacion: (ubicacion) => set({ ubicacionActual: ubicacion }),

  setCargando: (cargando) => set({ cargando }),

  setError: (error) => set({ error }),

  actualizarUbicacion: async () => {
    const { obtenerUbicacionActual } = useUbicacionDispositivo();

    set({ cargando: true, error: null });

    try {
      const ubicacion = await obtenerUbicacionActual();
      set({ ubicacionActual: ubicacion, cargando: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Error al obtener ubicación", cargando: false });
    }
  },
}));
