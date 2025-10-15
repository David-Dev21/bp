import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";

interface CampoPerfilProps {
  icono: string;
  etiqueta: string;
  valor: string;
  onPress?: () => void;
}

const CampoPerfil = ({ icono, etiqueta, valor, onPress }: CampoPerfilProps) => {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-2 px-3 rounded-2xl flex-1 mr-2 bg-primary/5 active:bg-primary/10 my-1"
    >
      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-2">
        <Ionicons name={icono as any} size={16} color={tema.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{etiqueta}</Text>
        <Text className="text-sm text-foreground font-medium">{valor}</Text>
      </View>
      {onPress && (
        <View className="ml-2">
          <Ionicons name="chevron-forward" size={16} color={tema.primary} />
        </View>
      )}
    </Pressable>
  );
};

export default CampoPerfil;
