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
        const respuesta = await VictimaService.actualizarContactoEmergencia(idVictima, idContacto, {
          parentesco: contacto.parentesco,
          nombreCompleto: contacto.nombre,
          celular: contacto.telefono,
        });
        if (!respuesta.exito) {
          toast.error(respuesta.mensaje || "Error al actualizar contacto");
          throw new Error(respuesta.mensaje);
        }
        // Actualizar localmente después de éxito
        const nuevosContactos = contactosEmergencia.map((c) =>
          c.id === idContacto ? { ...c, nombre: contacto.nombre, telefono: contacto.telefono, parentesco: contacto.parentesco } : c
        );
        setContactosEmergencia(nuevosContactos);
        toast.success(respuesta.mensaje || "Contacto guardado exitosamente");
      } else {
        const respuesta = await VictimaService.crearContactoEmergencia(idVictima, {
          parentesco: contacto.parentesco,
          nombreCompleto: contacto.nombre,
          celular: contacto.telefono,
          principal: contacto.esPrincipal,
        });
        if (!respuesta.exito) {
          toast.error(respuesta.mensaje || "Error al crear contacto");
          throw new Error(respuesta.mensaje);
        }
        toast.success(respuesta.mensaje || "Contacto guardado exitosamente");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar contacto");
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
      const respuesta = await VictimaService.eliminarContactoEmergencia(idVictima, idContacto);
      if (!respuesta.exito) {
        toast.error(respuesta.mensaje || "Error al eliminar contacto");
        throw new Error(respuesta.mensaje);
      }
      // Actualizar localmente removiendo el contacto
      const nuevosContactos = contactosEmergencia.filter((c) => c.id !== idContacto);
      setContactosEmergencia(nuevosContactos);
      toast.success(respuesta.mensaje || "Contacto eliminado exitosamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar contacto");
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
      const respuesta = await VictimaService.marcarContactoPrincipal(idVictima, idContacto);
      if (!respuesta.exito) {
        toast.error(respuesta.mensaje || "Error al marcar principal");
        throw new Error(respuesta.mensaje);
      }
      toast.success(respuesta.mensaje || "Contacto marcado como principal");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al marcar principal");
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
