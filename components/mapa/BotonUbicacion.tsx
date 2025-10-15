import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BotonUbicacionProps {
  onPress: () => void;
  rutaActiva: boolean;
}

export function BotonUbicacion({ onPress, rutaActiva }: BotonUbicacionProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`absolute right-4 bg-blue-600 rounded-full p-4 shadow-lg active:bg-blue-700 ${rutaActiva ? "bottom-28" : "bottom-40"}`}
    >
      <Ionicons name="locate" size={24} color="white" />
    </Pressable>
  );
}
