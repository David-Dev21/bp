import { useState } from "react";
import { toast } from "sonner-native";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { VictimaService } from "~/services/victimaService";

export function useActualizarUbicacion() {
  const { idVictima } = useAtenticacionStore();
  const { datosUbicacion, setDatosUbicacion } = usePerfilStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const actualizarUbicacion = async (
    direccion: {
      zona: string;
      calle: string;
      numero: string;
      referencia: string;
    },
    idMunicipio: number
  ) => {
    if (!idVictima) {
      toast.error("No se encontró ID de víctima");
      return false;
    }

    try {
      setIsUpdating(true);

      const datosParaAPI = {
        direccion,
        idMunicipio,
      };

      await VictimaService.actualizarUbicacion(idVictima, datosParaAPI);
      // actualizarUbicacion now returns { victima: { id: string } } on success, throws on error

      // Actualizar solo la dirección en el store local
      setDatosUbicacion({
        ...datosUbicacion,
        direccion,
      });
      toast.success("Ubicación actualizada correctamente");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar ubicación");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    actualizarUbicacion,
    isUpdating,
  };
}
