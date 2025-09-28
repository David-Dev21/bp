import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { codigoDenunciaSchema } from '~/lib/zodSchemas';

// Solo estado global, sin lógica de negocio
interface EstadoSesion {
  // Datos del usuario (se persisten)
  idVictima: string | null;
  apiKey: string | null;
  sesionActiva: boolean;
  codigoDenuncia?: string | null;

  // Acciones simples
  setUsuario: (idVictima: string, apiKey: string) => void;
  setCodigoDenuncia: (codigo: string) => void;
  cerrarSesion: () => void;
}

export const useAtenticacionStore = create<EstadoSesion>()(
  persist(
    (set) => ({
      idVictima: null,
      apiKey: null,
      sesionActiva: false,

      setUsuario: (idVictima: string, apiKey: string) =>
        set({
          idVictima,
          apiKey,
          sesionActiva: true,
        }),

      setCodigoDenuncia: (codigo: string) =>
        set({
          codigoDenuncia: codigo,
        }),

      cerrarSesion: () => {
        set({
          idVictima: null,
          apiKey: null,
          sesionActiva: false,
          codigoDenuncia: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persistir solo datos esenciales del usuario
      partialize: (state) => ({
        idVictima: state.idVictima,
        apiKey: state.apiKey,
        sesionActiva: state.sesionActiva,
        codigoDenuncia: state.codigoDenuncia,
      }),
    },
  ),
);
