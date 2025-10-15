import { useContactosEmergencia } from "~/hooks/victima/useContactosEmergencia";
import { ContactoEmergencia } from "~/stores/perfilStore";

export function useAccionesContactos(contactosEmergencia: ContactoEmergencia[], refrescarDatos: () => Promise<void>) {
  const {
    guardarContacto: guardarContactoHook,
    eliminarContacto: eliminarContactoHook,
    marcarPrincipal: marcarPrincipalHook,
  } = useContactosEmergencia();

  const guardarContacto = async (
    data: { nombre: string; telefono: string; parentesco: string },
    editandoIndex: number | null,
    cerrarModal: () => void
  ) => {
    const esEditar = editandoIndex !== null;
    const idContacto = esEditar ? contactosEmergencia[editandoIndex!].id : undefined;

    await guardarContactoHook({ ...data, esPrincipal: false }, esEditar, idContacto);

    if (!esEditar) {
      await refrescarDatos();
    }

    cerrarModal();
  };

  const ejecutarMarcarPrincipal = async (contactoSeleccionado: number | null, cerrarModal: () => void) => {
    if (contactoSeleccionado === null) return;

    const contacto = contactosEmergencia[contactoSeleccionado];
    if (!contacto.id) return;

    try {
      await marcarPrincipalHook(contacto.id);
      await refrescarDatos();
      cerrarModal();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const confirmarEliminarContacto = async (contactoSeleccionado: number | null, cerrarConfirmacion: () => void) => {
    if (contactoSeleccionado === null) return;

    const contacto = contactosEmergencia[contactoSeleccionado];
    if (!contacto.id) return;

    try {
      await eliminarContactoHook(contacto.id);
      cerrarConfirmacion();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  return {
    guardarContacto,
    ejecutarMarcarPrincipal,
    confirmarEliminarContacto,
  };
}
