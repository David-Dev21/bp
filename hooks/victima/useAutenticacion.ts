import { useState } from "react";
import { toast } from "sonner-native";
import { DenunciasService } from "~/services/denunciasService";
import { VictimaService } from "~/services/victimaService";

export const useAutenticacion = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (numero_documento: string, cud: string) => {
    setIsLoading(true);

    try {
      const result = await DenunciasService.verificarDenuncia(numero_documento, cud);

      if (result.exito) {
        const verificacion = await VictimaService.verificarVictimaPorCI(numero_documento);

        if (verificacion.exito && verificacion.datos?.existe && verificacion.datos.idVictima) {
          return { success: true, idVictima: verificacion.datos.idVictima };
        } else {
          const mensajeError = verificacion.error ? `${verificacion.mensaje} - ${verificacion.error}` : verificacion.mensaje;
          toast.error(mensajeError);
          return { success: false, message: verificacion.mensaje };
        }
      } else {
        const mensajeError = result.error ? `${result.mensaje} - ${result.error}` : result.mensaje;
        toast.error(mensajeError);
        return { success: false, message: result.mensaje };
      }
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : "Error al autenticar";
      toast.error(mensajeError);
      return { success: false, message: mensajeError };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
  };
};
