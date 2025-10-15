import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import { VictimaService } from "~/services/victimaService";
import { PerfilVictima } from "~/lib/tiposApi";
import { usePerfilStore } from "~/stores/perfilStore";

export function useRegistro() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { datosPersonales } = usePerfilStore();

  const handleRegistro = useCallback(
    async (datos: Partial<PerfilVictima>) => {
      if (!datosPersonales.cedulaIdentidad || !datosPersonales.codigoDenuncia) {
        toast.error("Datos incompletos.");
        return;
      }
      setIsLoading(true);
      try {
        const result = await VictimaService.registrarVictima(datos as PerfilVictima);
        if (result.exito && result.datos?.victima.id) {
          const mensajeExito = result.error ? `${result.mensaje} - ${result.error}` : result.mensaje;
          toast.success(mensajeExito);
          // Navegar después de un pequeño delay
          setTimeout(() => {
            router.push("/verificar-codigo" as any);
          }, 500);
          return result;
        } else {
          const mensajeError = result.error ? `${result.mensaje} - ${result.error}` : result.mensaje;
          toast.error(mensajeError);
          return result;
        }
      } catch (error) {
        const mensajeError = error instanceof Error ? error.message : "Algo salió mal.";
        toast.error(mensajeError);
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [datosPersonales, router]
  );

  return {
    isLoading,
    handleRegistro,
  };
}
