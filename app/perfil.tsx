import React, { useState } from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formateadorFecha } from "~/lib/formato/formateadorFecha";
import { usePerfil } from "~/hooks/victima/usePerfil";
import { ContactoEmergencia } from "~/stores/perfilStore";
import ModalContactoEmergencia from "~/components/registro/ModalContactoEmergencia";
import EditarPerfil from "~/components/edicion/editar-perfil";
import EditarUbicacion from "~/components/edicion/editar-ubicacion";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

// Pantalla de perfil del usuario (solo lectura)
export default function PantallaPerfil() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  const { datosPersonales, datosUbicacion, contactosEmergencia, isRefreshing, refrescarDatos } = usePerfil();

  // Estado para modales
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);
  const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
  const [modalContactoAbierto, setModalContactoAbierto] = useState(false);
  const [contactoTemporal, setContactoTemporal] = useState<ContactoEmergencia>({
    nombre: "",
    telefono: "",
    parentesco: "",
    esPrincipal: false,
  });
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  // Funciones para manejar contactos
  const actualizarContactoTemporal = (campo: keyof ContactoEmergencia, valor: string | boolean) => {
    setContactoTemporal((prev) => ({ ...prev, [campo]: valor }));
  };

  const validarContactoTemporal = () => {
    return contactoTemporal.nombre.trim() !== "" && contactoTemporal.telefono.trim() !== "" && contactoTemporal.parentesco !== "";
  };

  const guardarContacto = () => {
    if (!validarContactoTemporal()) return;

    // Aquí irá la lógica para guardar el contacto
    console.log("Guardar contacto:", contactoTemporal);

    // Resetear estado
    setContactoTemporal({
      nombre: "",
      telefono: "",
      parentesco: "",
      esPrincipal: false,
    });
    setEditandoIndex(null);
    setModalContactoAbierto(false);
  };

  const editarContacto = (index: number) => {
    const contacto = contactosEmergencia[index];
    setContactoTemporal({
      nombre: contacto.nombre,
      telefono: contacto.telefono,
      parentesco: contacto.parentesco,
      esPrincipal: contacto.esPrincipal,
    });
    setEditandoIndex(index);
    setModalContactoAbierto(true);
  };

  const agregarContacto = () => {
    setContactoTemporal({
      nombre: "",
      telefono: "",
      parentesco: "",
      esPrincipal: false,
    });
    setEditandoIndex(null);
    setModalContactoAbierto(true);
  };

  const CampoPerfil = ({ icono, etiqueta, valor }: { icono: string; etiqueta: string; valor: string }) => (
    <View className="flex-row items-center py-2 px-3 rounded-lg flex-1 mr-2 mb-0">
      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-2">
        <Ionicons name={icono as any} size={16} color={tema.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{etiqueta}</Text>
        <Text className="text-sm text-foreground font-medium">{valor}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-br from-background to-accent/20">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refrescarDatos} colors={[tema.primary]} />}
      >
        {/* Header del perfil - más compacto */}
        <View className="flex-row items-center justify-start p-4">
          <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
            <Ionicons name="person" size={24} color={tema.primary} />
          </View>
          <View>
            <Text className="ml-2 text-xl px-4 font-bold text-foreground">
              {datosPersonales.nombres && datosPersonales.apellidos ? `${datosPersonales.nombres} ${datosPersonales.apellidos}` : "Mi Perfil"}
            </Text>
          </View>
        </View>

        <View className="px-4">
          {isRefreshing ? (
            <View className="flex-1 justify-center items-center py-8">
              <Ionicons name="hourglass-outline" size={32} color={tema.primary} />
              <Text className="text-center text-muted-foreground mt-2 text-sm">Actualizando información del perfil...</Text>
            </View>
          ) : !datosPersonales.nombres ? (
            <View className="flex-1 justify-center items-center py-8">
              <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
              <Text className="text-center text-muted-foreground mt-2 text-sm">No se pudieron cargar los datos del perfil</Text>
            </View>
          ) : (
            <>
              {/* Información Personal - optimizada */}
              <View className="mb-2">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="person" size={20} color={tema.primary} />
                    <Text className="text-lg font-bold text-foreground ml-2">Datos Personales</Text>
                  </View>
                  <Button onPress={() => setModalPerfilAbierto(true)} variant="secondary" size="icon">
                    <FontAwesome5 name="user-edit" size={20} color={tema.primary} />
                  </Button>
                </View>
                <View className="flex-row">
                  <CampoPerfil icono="card-outline" etiqueta="Cédula" valor={datosPersonales.cedulaIdentidad || "No especificado"} />
                  <CampoPerfil icono="call-outline" etiqueta="Celular" valor={datosPersonales.celular || "No especificado"} />
                </View>
                {/* Segunda fila */}
                <View className="flex-row mb-1">
                  <CampoPerfil
                    icono="calendar-outline"
                    etiqueta="Nacimiento"
                    valor={
                      datosPersonales.fechaNacimiento
                        ? formateadorFecha.formatearFechaLocal(new Date(datosPersonales.fechaNacimiento))
                        : "No especificado"
                    }
                  />
                  <CampoPerfil
                    icono="people-outline"
                    etiqueta="Edad"
                    valor={
                      datosPersonales.fechaNacimiento
                        ? `${Math.floor(
                            (new Date().getTime() - new Date(datosPersonales.fechaNacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
                          )} años`
                        : "No especificado"
                    }
                  />
                </View>
                {/* Tercera fila - Información adicional */}
                <View className="mb-1">
                  <CampoPerfil icono="mail-outline" etiqueta="Correo" valor={datosPersonales.correo || "No especificado"} />
                </View>
              </View>

              {/* Ubicación */}
              <View className="mb-2">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={20} color={tema.primary} />
                    <Text className="text-lg font-bold text-foreground ml-2">Ubicación</Text>
                  </View>
                  <Button onPress={() => setModalUbicacionAbierto(true)} variant="secondary" size="icon">
                    <MaterialIcons name="edit-location-alt" size={24} color={tema.primary} />
                  </Button>
                </View>
                <View className="mb-1">
                  <CampoPerfil
                    icono="location-outline"
                    etiqueta="Ubicación"
                    valor={`${datosUbicacion.municipio || "No especificado"}, ${datosUbicacion.provincia || "No especificado"}, ${
                      datosUbicacion.departamento || "No especificado"
                    }`}
                  />
                </View>
                <View className="mb-1">
                  <CampoPerfil
                    icono="home-outline"
                    etiqueta="Dirección"
                    valor={`${datosUbicacion.direccion.calle} ${datosUbicacion.direccion.numero}${
                      datosUbicacion.direccion.zona ? `, ${datosUbicacion.direccion.zona}` : ""
                    }${datosUbicacion.direccion.referencia ? ` (${datosUbicacion.direccion.referencia})` : ""}`}
                  />
                </View>
              </View>
              <View className="mb-2">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                      <Ionicons name="people" size={24} color={tema.primary} />
                    </View>
                    <Text className="text-lg font-bold text-foreground ml-2">Contactos de Emergencia</Text>
                  </View>
                  <Button onPress={() => setModalContactoAbierto(true)} variant="secondary" size="icon">
                    <Ionicons name="person-add" size={22} color={tema.primary} />
                  </Button>
                </View>

                {contactosEmergencia.map((contacto, index) => (
                  <View key={index} className="flex-row items-center py-2 px-3 rounded-lg mb-2">
                    <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-2">
                      <Ionicons name="person-outline" size={16} color={tema.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{contacto.nombre}</Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-foreground font-medium flex-1">{`${contacto.parentesco} - ${contacto.telefono}`}</Text>
                        {contacto.esPrincipal && (
                          <Badge variant="secondary" className="ml-2">
                            <Text className="text-xs">Principal</Text>
                          </Badge>
                        )}
                      </View>
                    </View>
                    <View className="flex-row gap-1">
                      <Button onPress={() => editarContacto(index)} variant="ghost" size="sm" className="p-2">
                        <Ionicons name="create" size={16} color={tema.primary} />
                      </Button>
                      <Button onPress={() => console.log("Eliminar contacto:", index)} variant="ghost" size="sm" className="p-2">
                        <Ionicons name="trash" size={16} color="#ef4444" />
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Modales de edición - fuera del ScrollView */}
      <ModalContactoEmergencia
        modalAbierto={modalContactoAbierto}
        setModalAbierto={setModalContactoAbierto}
        contactoTemporal={contactoTemporal}
        actualizarContactoTemporal={actualizarContactoTemporal}
        guardarContacto={guardarContacto}
        validarContactoTemporal={validarContactoTemporal}
        editandoIndex={editandoIndex}
      />

      {modalUbicacionAbierto && <EditarUbicacion />}

      <EditarPerfil abierto={modalPerfilAbierto} onClose={() => setModalPerfilAbierto(false)} />
    </View>
  );
}
