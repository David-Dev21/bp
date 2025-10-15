import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import CampoPerfil from "./CampoPerfil";
import { DatosUbicacion } from "~/stores/perfilStore";

interface SeccionUbicacionProps {
  datosUbicacion: DatosUbicacion;
  ubicacionCompleta: string;
  direccionCompleta: string;
}

export default function SeccionUbicacion({ datosUbicacion, ubicacionCompleta, direccionCompleta }: SeccionUbicacionProps) {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-between mb-2 px-2">
        <View className="flex-row items-center">
          <Ionicons name="location" size={20} color={tema.primary} />
          <Text className="text-lg font-bold text-foreground ml-2">Ubicación</Text>
        </View>
        <Button onPress={() => router.push("/editar-ubicacion")} variant="secondary" size="icon">
          <MaterialIcons name="edit-location-alt" size={24} color={tema.primary} />
        </Button>
      </View>

      <CampoPerfil icono="location-outline" etiqueta="Ubicación" valor={ubicacionCompleta} />

      <View>
        <CampoPerfil icono="home-outline" etiqueta="Dirección" valor={direccionCompleta} />
      </View>
    </View>
  );
}
