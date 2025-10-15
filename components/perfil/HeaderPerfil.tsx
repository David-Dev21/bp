import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";

interface HeaderPerfilProps {
  nombreCompleto: string;
}

export default function HeaderPerfil({ nombreCompleto }: HeaderPerfilProps) {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View className="flex-row items-center justify-start py-4">
      <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
        <Ionicons name="person" size={24} color={tema.primary} />
      </View>
      <View>
        <Text className="ml-2 text-xl px-4 font-bold text-foreground">{nombreCompleto}</Text>
      </View>
    </View>
  );
}
