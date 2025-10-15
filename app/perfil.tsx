import React, { useState, useRef, useMemo } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { usePerfil } from "~/hooks/victima/usePerfil";
import BottomSheetContactoEmergencia from "~/components/edicion/BottomSheetContactoEmergencia";
import BottomSheetEditarContacto from "~/components/edicion/BottomSheetEditarContacto";
import ModalOpcionesContacto from "~/components/edicion/ModalOpcionesContacto";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsetsWithFallback } from "~/hooks/useSafeAreaInsetsWithFallback";
import { Loading } from "~/components/ui/loading";
import { useModalesPerfil } from "~/hooks/perfil/useModalesPerfil";
import { useAccionesContactos } from "~/hooks/perfil/useAccionesContactos";
import { useDatosFormateados } from "~/hooks/perfil/useDatosFormateados";
import HeaderPerfil from "~/components/perfil/HeaderPerfil";
import InformacionPersonal from "~/components/perfil/InformacionPersonal";
import SeccionUbicacion from "~/components/perfil/SeccionUbicacion";
import SeccionContactosEmergencia from "~/components/perfil/SeccionContactosEmergencia";

// Pantalla de perfil del usuario (solo lectura)
export default function PantallaPerfil() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsetsWithFallback();

  // Hooks principales
  const { datosPersonales, datosUbicacion, contactosEmergencia, isRefreshing, refrescarDatos } = usePerfil();

  // Hook para manejar modales
  const {
    bottomSheetContactoRef,
    bottomSheetEmergenciaRef,
    campoEditando,
    editandoIndex,
    modalOpcionesAbierto,
    contactoSeleccionado,
    mostrarConfirmacionEliminar,
    abrirEditarContacto,
    cerrarBottomSheetContacto,
    agregarContacto,
    editarContacto,
    cerrarBottomSheetEmergencia,
    abrirModalOpciones,
    cerrarModalOpciones,
    mostrarConfirmacionEliminarContacto,
    cancelarEliminarContacto,
  } = useModalesPerfil();

  // Hook para acciones de contactos
  const { guardarContacto, ejecutarMarcarPrincipal, confirmarEliminarContacto } = useAccionesContactos(contactosEmergencia, refrescarDatos);

  // Hook para datos formateados
  const { fechaNacimientoFormateada, edadCalculada, ubicacionCompleta, direccionCompleta, nombreCompleto } = useDatosFormateados(
    datosPersonales,
    datosUbicacion
  );

  // Funciones para manejar acciones
  const manejarGuardarContacto = (data: { nombre: string; telefono: string; parentesco: string }) => {
    guardarContacto(data, editandoIndex, cerrarBottomSheetEmergencia);
  };

  const ejecutarEditar = () => {
    if (contactoSeleccionado === null) return;
    cerrarModalOpciones();
    editarContacto(contactoSeleccionado);
  };

  const ejecutarEliminar = () => {
    if (contactoSeleccionado === null || contactosEmergencia.length <= 1) return;
    mostrarConfirmacionEliminarContacto();
  };

  const manejarMarcarPrincipal = () => {
    ejecutarMarcarPrincipal(contactoSeleccionado, cerrarModalOpciones);
  };

  const manejarConfirmarEliminar = () => {
    confirmarEliminarContacto(contactoSeleccionado, cancelarEliminarContacto);
  };

  return (
    <>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom, paddingLeft: 15, paddingRight: 15 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refrescarDatos} colors={[tema.primary]} />}
      >
        {isRefreshing ? (
          <View></View>
        ) : !datosPersonales.nombres ? (
          <View className="flex-1 justify-center items-center py-8 px-4">
            <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
            <Text className="text-center text-muted-foreground mt-2 text-sm">No se pudieron cargar los datos del perfil</Text>
          </View>
        ) : (
          <>
            <HeaderPerfil nombreCompleto={nombreCompleto} />

            <InformacionPersonal
              datosPersonales={datosPersonales}
              fechaNacimientoFormateada={fechaNacimientoFormateada}
              edadCalculada={edadCalculada}
              onEditarContacto={abrirEditarContacto}
            />

            <SeccionUbicacion datosUbicacion={datosUbicacion} ubicacionCompleta={ubicacionCompleta} direccionCompleta={direccionCompleta} />

            <SeccionContactosEmergencia
              contactosEmergencia={contactosEmergencia}
              onAgregarContacto={agregarContacto}
              onAbrirModalOpciones={abrirModalOpciones}
            />
          </>
        )}
      </ScrollView>

      {/* Modales */}
      <BottomSheetContactoEmergencia
        bottomSheetRef={bottomSheetEmergenciaRef}
        guardarContacto={manejarGuardarContacto}
        editandoIndex={editandoIndex}
        onClose={cerrarBottomSheetEmergencia}
        contactoActual={editandoIndex !== null ? contactosEmergencia[editandoIndex] : undefined}
      />

      <BottomSheetEditarContacto
        bottomSheetRef={bottomSheetContactoRef}
        campo={campoEditando || "celular"}
        valorActual={campoEditando === "celular" ? datosPersonales.celular || "" : datosPersonales.correo || ""}
        onClose={cerrarBottomSheetContacto}
      />

      <ModalOpcionesContacto
        visible={modalOpcionesAbierto}
        onClose={cerrarModalOpciones}
        onEditar={ejecutarEditar}
        onEliminar={ejecutarEliminar}
        onMarcarPrincipal={manejarMarcarPrincipal}
        esPrincipal={contactoSeleccionado !== null ? contactosEmergencia[contactoSeleccionado]?.esPrincipal || false : false}
        permiteEliminar={contactosEmergencia.length > 1}
        mostrarConfirmacionEliminar={mostrarConfirmacionEliminar}
        onConfirmarEliminar={manejarConfirmarEliminar}
        onCancelarEliminar={cancelarEliminarContacto}
        deleteText="Eliminar"
        confirmTitle="¿Eliminar contacto?"
        confirmDescription="¿Está seguro que desea eliminar este contacto de emergencia?"
        confirmActionText="Eliminar"
      />
    </>
  );
}
