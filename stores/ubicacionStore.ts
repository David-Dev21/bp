import { create } from "zustand";
import { LocationObject } from "expo-location";
import { useUbicacionDispositivo } from "~/hooks/ubicacion/useUbicacionDispositivo";
import { toast } from "sonner-native";

interface EstadoUbicacion {
  ubicacionActual: LocationObject | null;
  error: string | null;
  setUbicacion: (ubicacion: LocationObject | null) => void;
  setError: (error: string | null) => void;
  actualizarUbicacion: () => Promise<void>;
}

export const useUbicacionStore = create<EstadoUbicacion>((set, get) => ({
  ubicacionActual: null,
  error: null,
  setUbicacion: (ubicacion) => set({ ubicacionActual: ubicacion }),
  setError: (error) => set({ error }),
  actualizarUbicacion: async () => {
    const { obtenerUbicacionActual } = useUbicacionDispositivo();

    try {
      const ubicacion = await obtenerUbicacionActual();
      set({ ubicacionActual: ubicacion });
      toast.success("Ubicación obtenida correctamente");
    } catch (error) {
      // No mostrar error en carga silenciosa
      toast.error("Error obteniendo ubicación");
    }
  },
}));
