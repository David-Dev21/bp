import { useState } from "react";
import { toast } from "sonner-native";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { VictimaService } from "~/services/victimaService";

export function useContactosEmergencia() {
  const { idVictima } = useAtenticacionStore();
  const { contactosEmergencia, setContactosEmergencia } = usePerfilStore();
  const [isLoading, setIsLoading] = useState(false);

  // Función para guardar contacto de emergencia (crear o editar)
  const guardarContacto = async (
    contacto: { nombre: string; telefono: string; parentesco: string; esPrincipal: boolean },
    esEditar: boolean,
    idContacto?: string
  ) => {
    if (!idVictima) return;

    try {
      setIsLoading(true);
      if (esEditar && idContacto) {
        await VictimaService.actualizarContactoEmergencia(idVictima, idContacto, {
          parentesco: contacto.parentesco,
          nombreCompleto: contacto.nombre,
          celular: contacto.telefono,
        });
        // Actualizar localmente después de éxito
        const nuevosContactos = contactosEmergencia.map((c) =>
          c.id === idContacto ? { ...c, nombre: contacto.nombre, telefono: contacto.telefono, parentesco: contacto.parentesco } : c
        );
        setContactosEmergencia(nuevosContactos);
        toast.success("Contacto guardado exitosamente");
      } else {
        await VictimaService.crearContactoEmergencia(idVictima, {
          parentesco: contacto.parentesco,
          nombreCompleto: contacto.nombre,
          celular: contacto.telefono,
          principal: contacto.esPrincipal,
        });
        toast.success("Contacto guardado exitosamente");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar contacto de emergencia
  const eliminarContacto = async (idContacto: string) => {
    if (!idVictima) return;

    try {
      setIsLoading(true);
      await VictimaService.eliminarContactoEmergencia(idVictima, idContacto);
      // Actualizar localmente removiendo el contacto
      const nuevosContactos = contactosEmergencia.filter((c) => c.id !== idContacto);
      setContactosEmergencia(nuevosContactos);
      toast.success("Contacto eliminado exitosamente");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para marcar contacto como principal
  const marcarPrincipal = async (idContacto: string) => {
    if (!idVictima) return;

    try {
      setIsLoading(true);
      await VictimaService.marcarContactoPrincipal(idVictima, idContacto);
      toast.success("Contacto marcado como principal");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contactosEmergencia,
    isLoading,
    guardarContacto,
    eliminarContacto,
    marcarPrincipal,
  };
}
