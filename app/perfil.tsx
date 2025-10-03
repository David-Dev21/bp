import React from "react";
import { View, ScrollView, Alert, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useAtenticacionStore } from "~/stores/victimas/atenticacionStore";
import { Ionicons } from "@expo/vector-icons";
import { formateadorFecha } from "~/lib/formato/formateadorFecha";
import { usePerfil } from "~/hooks/victima/usePerfil";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";

// Pantalla de perfil del usuario (solo lectura)
export default function PantallaPerfil() {
  const router = useRouter();
  const { cerrarSesion } = useAtenticacionStore();
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  const { datosPersonales, datosUbicacion, contactosEmergencia, isRefreshing, refrescarDatos } = usePerfil();

  const handleCerrarSesion = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: () => {
          cerrarSesion();
          router.replace("/");
        },
      },
    ]);
  };

  const CampoPerfil = ({ icono, etiqueta, valor }: { icono: string; etiqueta: string; valor: string }) => (
    <View className="flex-row items-center py-2 px-3 bg-card/50 rounded-lg mb-1.5">
      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-2">
        <Ionicons name={icono as any} size={16} color={tema.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{etiqueta}</Text>
        <Text className="text-sm text-foreground font-medium">{valor}</Text>
      </View>
    </View>
  );

  const CampoPerfilCompacto = ({ icono, etiqueta, valor }: { icono: string; etiqueta: string; valor: string }) => (
    <View className="flex-1 mr-2">
      <CampoPerfil icono={icono} etiqueta={etiqueta} valor={valor} />
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
        <View className="flex-row items-center px-4 py-2 bg-card/50">
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
                <View className="flex-row">
                  <CampoPerfilCompacto icono="card-outline" etiqueta="Cédula" valor={datosPersonales.cedulaIdentidad || "No especificado"} />
                  <CampoPerfilCompacto icono="call-outline" etiqueta="Celular" valor={datosPersonales.celular || "No especificado"} />
                </View>

                {/* Segunda fila */}
                <View className="flex-row mb-1">
                  <CampoPerfilCompacto
                    icono="calendar-outline"
                    etiqueta="Nacimiento"
                    valor={
                      datosPersonales.fechaNacimiento
                        ? formateadorFecha.formatearFechaLocal(new Date(datosPersonales.fechaNacimiento))
                        : "No especificado"
                    }
                  />
                  <CampoPerfilCompacto
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
                <View className="flex-row mb-1">
                  <CampoPerfilCompacto icono="mail-outline" etiqueta="Correo" valor={datosPersonales.correo || "No especificado"} />
                </View>
              </View>

              {/* Ubicación Completa */}
              <View className="mb-2">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="location" size={20} color={tema.primary} />
                  <Text className="text-lg font-bold text-foreground ml-2">Datos de Ubicación</Text>
                </View>

                <View className="flex-row px-2">
                  {/* Columna Ubicación */}
                  <View className="flex-1 bg-card/50 rounded-lg">
                    <Text className="text-sm text-foreground leading-5">
                      <Text className="font-semibold">Municipio:</Text>
                      {"\n"}
                      {datosUbicacion.municipio || "No especificado"}
                      {"\n"}
                      <Text className="font-semibold">Provincia:</Text>
                      {"\n"}
                      {datosUbicacion.provincia || "No especificado"}
                      {"\n"}
                      <Text className="font-semibold">Departamento:</Text>
                      {"\n"}
                      {datosUbicacion.departamento || "No especificado"}
                      {"\n"}
                    </Text>
                  </View>

                  {/* Columna Dirección */}
                  <View className="flex-1 bg-card/50 rounded-lg">
                    <Text className="text-sm text-foreground leading-5">
                      <Text className="font-semibold">Calle:</Text>
                      {"\n"}
                      {datosUbicacion.direccion.calle} {datosUbicacion.direccion.numero}
                      {"\n"}
                      {datosUbicacion.direccion.zona && (
                        <>
                          <Text className="font-semibold">Zona:</Text>
                          {"\n"}
                          {datosUbicacion.direccion.zona}
                          {"\n"}
                        </>
                      )}
                      {datosUbicacion.direccion.referencia && (
                        <>
                          <Text className="font-semibold">Referencia:</Text>
                          {"\n"}
                          {datosUbicacion.direccion.referencia}
                          {"\n"}
                        </>
                      )}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mb-2">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="people" size={20} color={tema.primary} />
                  <Text className="text-lg font-bold text-foreground ml-2">Contactos de Emergencia</Text>
                </View>

                {!contactosEmergencia || contactosEmergencia.length === 0 ? (
                  <View className="p-4 items-center">
                    <Ionicons name="people-outline" size={24} color={tema.primary} />
                    <Text className="text-center text-muted-foreground mt-1 text-sm">No hay contactos registrados</Text>
                  </View>
                ) : (
                  contactosEmergencia.map((contacto, index) => (
                    <CampoPerfil
                      key={index}
                      icono="person"
                      etiqueta={contacto.nombre}
                      valor={`${contacto.parentesco} - ${contacto.telefono} ${contacto.esPrincipal ? "(Principal)" : ""}`}
                    />
                  ))
                )}
              </View>
            </>
          )}
          {/* Botones de acción */}
          <View className="mb-6">
            <Button onPress={handleCerrarSesion} variant="destructive" className="flex-row justify-center items-center">
              <Ionicons name="log-out" size={18} color="#fff" />
              <Text className="font-semibold ml-2 text-sm">Cerrar Sesión</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
