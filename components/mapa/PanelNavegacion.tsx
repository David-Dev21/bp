import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { UnidadPolicial } from "~/lib/tiposApi";
import { RutaNavegacion } from "~/services/navegacionService";

interface PanelNavegacionProps {
  rutaNavegacion: RutaNavegacion;
  destinoNavegacion: UnidadPolicial;
  colorScheme: string | undefined;
  tema: any;
  onCancelar: () => void;
}

export function PanelNavegacion({ rutaNavegacion, destinoNavegacion, colorScheme, tema, onCancelar }: PanelNavegacionProps) {
  return (
    <View className={`absolute left-4 bottom-24 ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"} py-3 px-4 rounded-3xl shadow-lg w-3/4`}>
      <View className="flex-row items-start justify-between">
        <Text className="font-bold text-sm flex-1">Ruta Inicial para {destinoNavegacion.unidad}</Text>
        <Pressable onPress={onCancelar} className="p-1">
          <Ionicons name="close" size={24} color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"} />
        </Pressable>
      </View>
      {rutaNavegacion.properties && (
        <View className="flex-row gap-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time" size={16} color={tema.primary} />
            <Text className="text-sm text-muted-foreground">{Math.round(rutaNavegacion.properties.duration / 60)} min</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="car" size={16} color={tema.primary} />
            <Text className="text-sm text-muted-foreground">{(rutaNavegacion.properties.distance / 1000).toFixed(1)} km</Text>
          </View>
        </View>
      )}
    </View>
  );
}
