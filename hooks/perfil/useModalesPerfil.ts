import { useState, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export function useModalesPerfil() {
  // Referencias para modales
  const bottomSheetContactoRef = useRef<BottomSheetModal>(null);
  const bottomSheetEmergenciaRef = useRef<BottomSheetModal>(null);

  // Estado para modales
  const [campoEditando, setCampoEditando] = useState<"celular" | "correo" | null>(null);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [modalOpcionesAbierto, setModalOpcionesAbierto] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<number | null>(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

  // Funciones para manejar modales de contacto
  const abrirEditarContacto = (campo: "celular" | "correo") => {
    setCampoEditando(campo);
    bottomSheetContactoRef.current?.present();
  };

  const cerrarBottomSheetContacto = () => {
    setCampoEditando(null);
    bottomSheetContactoRef.current?.dismiss();
  };

  // Funciones para manejar modales de emergencia
  const agregarContacto = () => {
    setEditandoIndex(null);
    bottomSheetEmergenciaRef.current?.present();
  };

  const editarContacto = (index: number) => {
    setEditandoIndex(index);
    bottomSheetEmergenciaRef.current?.present();
  };

  const cerrarBottomSheetEmergencia = () => {
    setEditandoIndex(null);
    bottomSheetEmergenciaRef.current?.dismiss();
  };

  // Funciones para modal de opciones
  const abrirModalOpciones = (index: number) => {
    setContactoSeleccionado(index);
    setModalOpcionesAbierto(true);
  };

  const cerrarModalOpciones = () => {
    setModalOpcionesAbierto(false);
    setContactoSeleccionado(null);
  };

  const mostrarConfirmacionEliminarContacto = () => {
    setMostrarConfirmacionEliminar(true);
    cerrarModalOpciones();
  };

  const cancelarEliminarContacto = () => {
    setMostrarConfirmacionEliminar(false);
    setContactoSeleccionado(null);
  };

  return {
    // Referencias
    bottomSheetContactoRef,
    bottomSheetEmergenciaRef,

    // Estado
    campoEditando,
    editandoIndex,
    modalOpcionesAbierto,
    contactoSeleccionado,
    mostrarConfirmacionEliminar,

    // Funciones
    abrirEditarContacto,
    cerrarBottomSheetContacto,
    agregarContacto,
    editarContacto,
    cerrarBottomSheetEmergencia,
    abrirModalOpciones,
    cerrarModalOpciones,
    mostrarConfirmacionEliminarContacto,
    cancelarEliminarContacto,
  };
}
