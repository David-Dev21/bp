import React, { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { usePerfilStore, ContactoEmergencia } from "~/stores/perfilStore";
import { useSafeAreaInsetsWithFallback } from "~/hooks/useSafeAreaInsetsWithFallback";
import BottomSheetContactoEmergencia from "~/components/edicion/BottomSheetContactoEmergencia";
import CampoPerfil from "~/components/perfil/CampoPerfil";
import ModalOpcionesContacto from "~/components/edicion/ModalOpcionesContacto";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface DatosContactoEmergenciaProps {
  pasoActual: number;
  totalPasos: number;
  onNavigate: (action: "prev" | "next" | "complete") => void;
  isLoading: boolean;
}

const DatosContactoEmergencia = ({ pasoActual, totalPasos, onNavigate, isLoading }: DatosContactoEmergenciaProps) => {
  // Store global
  const { contactosEmergencia, setContactosEmergencia } = usePerfilStore();

  // Safe area insets con fallback
  const espaciosSeguro = useSafeAreaInsetsWithFallback();

  // Color scheme para modo oscuro
  const { colorScheme } = useColorScheme();
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

  // Estado para modales
  const bottomSheetEmergenciaRef = useRef<BottomSheetModal>(null);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [modalOpcionesAbierto, setModalOpcionesAbierto] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<number | null>(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

  // Funciones para manejar contactos
  const guardarContacto = (data: { nombre: string; telefono: string; parentesco: string }) => {
    let nuevosContactos = [...contactosEmergencia];

    if (editandoIndex !== null) {
      nuevosContactos[editandoIndex] = { ...nuevosContactos[editandoIndex], ...data };
    } else {
      // Si es el primer contacto, marcarlo como principal automáticamente
      const esPrimerContacto = nuevosContactos.length === 0;
      nuevosContactos.push({ ...data, esPrincipal: esPrimerContacto });
    }

    setContactosEmergencia(nuevosContactos);
    setEditandoIndex(null);
    bottomSheetEmergenciaRef.current?.dismiss();
  };

  const editarContacto = (index: number) => {
    setEditandoIndex(index);
    bottomSheetEmergenciaRef.current?.present();
  };

  const agregarContacto = () => {
    setEditandoIndex(null);
    bottomSheetEmergenciaRef.current?.present();
  };

  const cerrarBottomSheetEmergencia = () => {
    setEditandoIndex(null);
    bottomSheetEmergenciaRef.current?.dismiss();
  };

  const abrirModalOpciones = (index: number) => {
    setContactoSeleccionado(index);
    setModalOpcionesAbierto(true);
  };

  const cerrarModalOpciones = () => {
    setModalOpcionesAbierto(false);
  };

  const ejecutarEditar = () => {
    if (contactoSeleccionado === null) return;
    cerrarModalOpciones();
    editarContacto(contactoSeleccionado);
    setContactoSeleccionado(null);
  };

  const ejecutarEliminar = () => {
    if (contactoSeleccionado === null || contactosEmergencia.length <= 1) return;
    cerrarModalOpciones();
    setMostrarConfirmacionEliminar(true);
  };

  const ejecutarMarcarPrincipal = () => {
    if (contactoSeleccionado === null) return;

    const nuevosContactos = contactosEmergencia.map((contacto, i) => ({
      ...contacto,
      esPrincipal: i === contactoSeleccionado,
    }));
    setContactosEmergencia(nuevosContactos);
    cerrarModalOpciones();
    setContactoSeleccionado(null);
  };

  const confirmarEliminarContacto = () => {
    if (contactoSeleccionado === null) return;

    const nuevosContactos = contactosEmergencia.filter((_, i) => i !== contactoSeleccionado);
    setContactosEmergencia(nuevosContactos);
    setMostrarConfirmacionEliminar(false);
    setContactoSeleccionado(null);
  };

  const cancelarEliminarContacto = () => {
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
          <Text className="text-2xl font-bold text-center">Contactos de Emergencia</Text>
          <Text className="text-center text-muted-foreground mt-1 mb-2">
            Paso {pasoActual} de {totalPasos}
          </Text>
        </View>

        <View className="flex-col gap-4">
          <View className="mx-auto">
            <Button onPress={agregarContacto} variant={"secondary"} size={"sm"} disabled={contactosEmergencia.length >= 5}>
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
                <Text className="text-muted-foreground text-sm">Debe agregar al menos un contacto de emergencia</Text>
              </View>
            ) : (
              <View>
                {contactosEmergencia.map((contacto, index) => (
                  <CampoPerfil
                    key={index}
                    icono="person"
                    etiqueta={`${contacto.nombre}`}
                    valor={`${contacto.parentesco} - ${contacto.telefono}${contacto.esPrincipal ? " - Principal" : ""}`}
                    onPress={() => abrirModalOpciones(index)}
                  />
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

        <Button variant="default" onPress={() => onNavigate("next")} disabled={isLoading || contactosEmergencia.length === 0}>
          <View className="flex-row items-center gap-2">
            <Text>Siguiente</Text>
            <Ionicons name="arrow-forward" size={20} color={colorIcono} />
          </View>
        </Button>
      </View>

      {/* BottomSheet de edición */}
      <BottomSheetContactoEmergencia
        bottomSheetRef={bottomSheetEmergenciaRef}
        guardarContacto={guardarContacto}
        editandoIndex={editandoIndex}
        onClose={cerrarBottomSheetEmergencia}
        contactoActual={editandoIndex !== null ? contactosEmergencia[editandoIndex] : undefined}
      />

      {/* Modal de opciones de contacto */}
      <ModalOpcionesContacto
        visible={modalOpcionesAbierto}
        onClose={cerrarModalOpciones}
        onEditar={ejecutarEditar}
        onEliminar={ejecutarEliminar}
        onMarcarPrincipal={ejecutarMarcarPrincipal}
        esPrincipal={contactoSeleccionado !== null ? contactosEmergencia[contactoSeleccionado]?.esPrincipal || false : false}
        permiteEliminar={contactosEmergencia.length > 1}
        mostrarConfirmacionEliminar={mostrarConfirmacionEliminar}
        onConfirmarEliminar={confirmarEliminarContacto}
        onCancelarEliminar={cancelarEliminarContacto}
        deleteText="Quitar"
        confirmTitle="¿Quitar contacto?"
        confirmDescription="¿Está seguro que desea quitar este contacto de emergencia?"
        confirmActionText="Quitar"
      />
    </View>
  );
};

export default DatosContactoEmergencia;
