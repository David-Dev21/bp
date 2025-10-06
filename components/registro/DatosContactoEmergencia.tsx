import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform, Pressable, ScrollView, Modal } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { usePerfilStore, ContactoEmergencia } from "~/stores/perfilStore";
import { Badge } from "~/components/ui/badge";
import { useSafeAreaInsetsWithFallback } from "~/hooks/useSafeAreaInsetsWithFallback";
import ModalContactoEmergencia from "./ModalContactoEmergencia";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface DatosContactoEmergenciaProps {
  pasoActual: number;
  totalPasos: number;
  esEdicion?: boolean;
  onNavigate: (action: "prev" | "next" | "complete") => void;
  isLoading: boolean;
}

const DatosContactoEmergencia = ({ pasoActual, totalPasos, esEdicion, onNavigate, isLoading }: DatosContactoEmergenciaProps) => {
  // Store global
  const { contactosEmergencia, setContactosEmergencia } = usePerfilStore();

  // Safe area insets con fallback
  const espaciosSeguro = useSafeAreaInsetsWithFallback();

  // Color scheme para modo oscuro
  const { colorScheme } = useColorScheme();
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

  const obtenerTituloPaso = () => {
    const prefijo = esEdicion ? "Editar" : "";
    return `${prefijo} Contactos de Emergencia`.trim();
  };

  // Estado local del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [contactoTemporal, setContactoTemporal] = useState<ContactoEmergencia>({
    parentesco: "",
    nombre: "",
    telefono: "",
    esPrincipal: false,
  });
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [modalOpcionesAbierto, setModalOpcionesAbierto] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<number | null>(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

  const validarDatos = () => {
    return (
      contactosEmergencia.length > 0 &&
      contactosEmergencia.every(
        (contacto) => contacto.parentesco !== "" && contacto.nombre.trim() !== "" && contacto.telefono.trim() !== "" && contacto.telefono.length >= 8
      )
    );
  };

  const validarContactoTemporal = () => {
    return (
      contactoTemporal.parentesco !== "" &&
      contactoTemporal.nombre.trim() !== "" &&
      contactoTemporal.telefono.trim() !== "" &&
      contactoTemporal.telefono.length >= 8
    );
  };

  const abrirModal = (index?: number) => {
    if (index !== undefined) {
      setContactoTemporal({ ...contactosEmergencia[index] });
      setEditandoIndex(index);
    } else {
      setContactoTemporal({ parentesco: "", nombre: "", telefono: "", esPrincipal: false });
      setEditandoIndex(null);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setContactoTemporal({ parentesco: "", nombre: "", telefono: "", esPrincipal: false });
    setEditandoIndex(null);
  };

  const guardarContacto = () => {
    if (!validarContactoTemporal()) return;

    let nuevosContactos = [...contactosEmergencia];

    if (editandoIndex !== null) {
      nuevosContactos[editandoIndex] = { ...contactoTemporal };
    } else {
      // Si es el primer contacto, marcarlo como principal automáticamente
      const esPrimerContacto = nuevosContactos.length === 0;
      nuevosContactos.push({ ...contactoTemporal, esPrincipal: esPrimerContacto });
    }

    setContactosEmergencia(nuevosContactos);
    cerrarModal();
  };

  const eliminarContacto = (index: number) => {
    const contactoEliminadoEraPrincipal = contactosEmergencia[index].esPrincipal;
    const nuevosContactos = contactosEmergencia.filter((_, i) => i !== index);

    // Si el contacto eliminado era principal y quedan contactos, marcar el primero como principal
    if (contactoEliminadoEraPrincipal && nuevosContactos.length > 0) {
      nuevosContactos[0].esPrincipal = true;
    }

    setContactosEmergencia(nuevosContactos);
  };

  const marcarComoPrincipal = (index: number) => {
    const nuevosContactos = contactosEmergencia.map((contacto, i) => ({
      ...contacto,
      esPrincipal: i === index,
    }));
    setContactosEmergencia(nuevosContactos);
  };

  const actualizarContactoTemporal = (campo: keyof ContactoEmergencia, valor: string | boolean) => {
    setContactoTemporal((prev) => ({ ...prev, [campo]: valor }));
  };

  const abrirModalOpciones = (index: number) => {
    setContactoSeleccionado(index);
    setModalOpcionesAbierto(true);
  };

  const cerrarModalOpciones = () => {
    setModalOpcionesAbierto(false);
    // No limpiar contactoSeleccionado aquí porque puede estar en proceso de eliminación
  };

  const ejecutarAccion = (accion: "editar" | "eliminar" | "principal") => {
    if (contactoSeleccionado === null) return;

    switch (accion) {
      case "editar":
        cerrarModalOpciones();
        abrirModal(contactoSeleccionado);
        setContactoSeleccionado(null);
        break;
      case "eliminar":
        // No permitir quitar si solo hay un contacto
        if (contactosEmergencia.length <= 1) {
          cerrarModalOpciones();
          setContactoSeleccionado(null);
          return;
        }
        cerrarModalOpciones();
        // No limpiar contactoSeleccionado aquí, se limpia después de confirmar
        setMostrarConfirmacionEliminar(true);
        break;
      case "principal":
        marcarComoPrincipal(contactoSeleccionado);
        cerrarModalOpciones();
        setContactoSeleccionado(null);
        break;
    }
  };

  const confirmarEliminarContacto = () => {
    if (contactoSeleccionado !== null && contactosEmergencia.length > 1) {
      eliminarContacto(contactoSeleccionado);
    }
    setMostrarConfirmacionEliminar(false);
    setContactoSeleccionado(null);
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Título */}
        <View>
          <Text className="text-2xl font-bold text-center">{obtenerTituloPaso()}</Text>
          <Text className="text-center text-muted-foreground mt-1 mb-2">
            Paso {pasoActual} de {totalPasos}
          </Text>
        </View>

        <View className="flex-col gap-4">
          <View className="mx-auto">
            <Button onPress={() => abrirModal()} variant={"secondary"} size={"sm"} disabled={contactosEmergencia.length >= 5}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-add" size={16} color="#5a6a2f" />
                <Text>Contacto</Text>
              </View>
            </Button>
          </View>

          {/* Lista de contactos agregados */}
          <View>
            <Text className="font-medium mb-2">Contactos agregados ({contactosEmergencia.length})</Text>
            {contactosEmergencia.length === 0 ? (
              <View className="border border-dashed border-muted-foreground/30 rounded-2xl p-4 bg-muted/20">
                <View className="flex-row items-center gap-2">
                  <Text className="text-muted-foreground text-sm">Debe agregar al menos un contacto de emergencia</Text>
                  <Ionicons name="person-outline" size={16} color="#9CA3AF" />
                </View>
              </View>
            ) : (
              <View>
                {contactosEmergencia.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => abrirModalOpciones(index)}
                    className="rounded-2xl p-4 my-1 bg-secondary/30 active:bg-primary/20"
                  >
                    <View className="flex-1">
                      <Text className="font-bold text-lg mb-2" numberOfLines={2}>
                        {item.nombre}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-muted-foreground capitalize">{item.parentesco}</Text>
                        <Text className="text-muted-foreground">|</Text>
                        <Text className="text-sm text-muted-foreground">{item.telefono}</Text>
                        <Text className="text-muted-foreground">|</Text>
                        {item.esPrincipal && (
                          <Badge variant="default">
                            <Text className="text-xs font-semibold">Principal</Text>
                          </Badge>
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Botones de navegación - Fuera del ScrollView */}
      <View className="flex-row justify-between items-center px-6 py-2" style={{ paddingBottom: espaciosSeguro.bottom + 16 }}>
        {pasoActual > 1 ? (
          <Button variant="default" onPress={() => onNavigate("prev")}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="arrow-back" size={20} color={colorIcono} />
              <Text>Anterior</Text>
            </View>
          </Button>
        ) : (
          <View style={{ width: 100 }} />
        )}

        <Button variant="default" onPress={() => onNavigate("complete")} disabled={isLoading}>
          <View className="flex-row items-center gap-2">
            <Text>{isLoading ? "Guardando..." : "Guardar"}</Text>
            <Ionicons name="save" size={20} color={colorIcono} />
          </View>
        </Button>
      </View>

      {/* Modal para agregar/editar contacto */}
      <ModalContactoEmergencia
        modalAbierto={modalAbierto}
        setModalAbierto={setModalAbierto}
        contactoTemporal={contactoTemporal}
        actualizarContactoTemporal={actualizarContactoTemporal}
        guardarContacto={guardarContacto}
        validarContactoTemporal={validarContactoTemporal}
        editandoIndex={editandoIndex}
      />

      {/* Modal de opciones del contacto */}
      <Modal visible={modalOpcionesAbierto} transparent animationType="fade" onRequestClose={cerrarModalOpciones}>
        <Pressable className="flex-1 justify-center items-center bg-black/50" onPress={cerrarModalOpciones}>
          <Pressable className="bg-background rounded-3xl w-[80%] shadow-2xl" onPress={(e) => e.stopPropagation()}>
            {contactoSeleccionado !== null && !contactosEmergencia[contactoSeleccionado]?.esPrincipal && (
              <Pressable
                onPress={() => ejecutarAccion("principal")}
                className="flex-row items-center gap-3 px-6 py-3 border-b border-border/50 active:bg-primary/10"
              >
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text className="text-base font-medium">Marcar como Principal</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => ejecutarAccion("editar")}
              className="flex-row items-center gap-3 px-6 py-3 border-b border-border/50 active:bg-primary/10"
            >
              <Ionicons name="create" size={24} color="#6B7280" />
              <Text className="text-base font-medium">Editar</Text>
            </Pressable>
            <Pressable
              onPress={() => ejecutarAccion("eliminar")}
              className="flex-row items-center gap-3 px-6 py-3 active:bg-destructive/10"
              disabled={contactosEmergencia.length <= 1}
            >
              <Ionicons name="close-circle" size={24} color={contactosEmergencia.length <= 1 ? "#9CA3AF" : "#DC2626"} />
              <Text className={`text-base font-medium ${contactosEmergencia.length <= 1 ? "text-muted-foreground" : "text-destructive"}`}>
                Quitar
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* AlertDialog de confirmación para eliminar */}
      <AlertDialog open={mostrarConfirmacionEliminar} onOpenChange={setMostrarConfirmacionEliminar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar contacto?</AlertDialogTitle>
            <AlertDialogDescription>¿Está seguro que desea quitar este contacto de emergencia?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmarEliminarContacto} className="bg-destructive active:bg-destructive/80">
              <Text className="text-destructive-foreground">Quitar</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
};

export default DatosContactoEmergencia;
