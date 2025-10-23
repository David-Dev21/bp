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

      // verificarDenuncia now returns { codigoValido: boolean }
      if (result.codigoValido) {
        const verificacion = await VictimaService.verificarVictimaPorCI(numero_documento);

        // verificarVictimaPorCI now returns { existe: boolean; idVictima?: string; ... }
        if (verificacion.existe && verificacion.idVictima) {
          return { success: true, idVictima: verificacion.idVictima };
        } else {
          toast.error("Usuario no encontrado en el sistema");
          return { success: false, message: "Usuario no encontrado en el sistema" };
        }
      } else {
        toast.error("Código de denuncia inválido");
        return { success: false, message: "Código de denuncia inválido" };
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
