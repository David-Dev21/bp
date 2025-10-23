import { useState } from "react";
import { toast } from "sonner-native";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { VictimaService } from "~/services/victimaService";

export function useActualizarContacto() {
  const { idVictima } = useAtenticacionStore();
  const { datosPersonales, setDatosPersonales } = usePerfilStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const actualizarContacto = async (contactoData: { celular?: string; correo?: string }) => {
    if (!idVictima) {
      toast.error("No se encontró ID de víctima");
      return false;
    }

    try {
      setIsUpdating(true);

      await VictimaService.actualizarContacto(idVictima, contactoData);
      // actualizarContacto now returns { victima: { id: string } } on success, throws on error

      // Actualizar el store local
      setDatosPersonales({
        ...datosPersonales,
        celular: contactoData.celular !== undefined ? contactoData.celular : datosPersonales.celular,
        correo: contactoData.correo !== undefined ? contactoData.correo : datosPersonales.correo,
      });
      toast.success("Contacto actualizado correctamente");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar contacto");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    actualizarContacto,
    isUpdating,
  };
}
