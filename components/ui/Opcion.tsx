import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Ionicons } from "@expo/vector-icons";

interface OpcionProps {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descripcion: string;
  onPress?: () => void;
}

export default function Opcion({
  icono,
  titulo,
  descripcion,
  onPress,
}: OpcionProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-4">
            <Ionicons name={icono} size={20} color="#5a6a2f" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground mb-1">{titulo}</Text>
            <Text className="text-xs text-muted-foreground">{descripcion}</Text>
          </View>
          {onPress && (
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          )}
        </View>
      </CardContent>
    </Card>
  );
}
