import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import CampoPerfil from "./CampoPerfil";
import { ContactoEmergencia } from "~/stores/perfilStore";

interface SeccionContactosEmergenciaProps {
  contactosEmergencia: ContactoEmergencia[];
  onAgregarContacto: () => void;
  onAbrirModalOpciones: (index: number) => void;
}

export default function SeccionContactosEmergencia({
  contactosEmergencia,
  onAgregarContacto,
  onAbrirModalOpciones,
}: SeccionContactosEmergenciaProps) {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-between mb-2 px-2">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full items-center justify-center">
            <Ionicons name="people" size={24} color={tema.primary} />
          </View>
          <Text className="text-lg font-bold text-foreground ml-2">Contactos de Emergencia</Text>
        </View>
        <Button onPress={onAgregarContacto} variant="secondary" size="icon">
          <Ionicons name="person-add" size={22} color={tema.primary} />
        </Button>
      </View>

      {contactosEmergencia.map((contacto, index) => (
        <CampoPerfil
          key={contacto.id || index}
          icono="person"
          etiqueta={contacto.nombre}
          valor={`${contacto.parentesco} - ${contacto.telefono}${contacto.esPrincipal ? " - Principal" : ""}`}
          onPress={() => onAbrirModalOpciones(index)}
        />
      ))}
    </View>
  );
}
