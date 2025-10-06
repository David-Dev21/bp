import React, { useRef, useMemo } from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import DatosUbicacion from "~/components/registro/DatosUbicacion";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";

export default function PantallaEditarUbicacion() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["85%"], []);

  const handleNavigate = (action: "prev" | "next" | "complete") => {
    // Solo manejar complete para guardar
    if (action === "complete") {
      // Aquí irá la lógica para actualizar ubicación
      console.log("Guardar ubicación");
      bottomSheetRef.current?.close();
      router.back();
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      {/* Overlay para cerrar */}
      <Pressable className="flex-1" onPress={handleClose} />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colorScheme === "dark" ? "#1f2937" : "#ffffff" }}
        handleIndicatorStyle={{ backgroundColor: colorScheme === "dark" ? "#6b7280" : "#d1d5db" }}
        enablePanDownToClose={true}
        onClose={handleClose}
        animateOnMount={true}
      >
        <View className="px-4 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="location" size={24} color={tema.primary} />
              <View className="ml-3">
                <Text className="text-lg font-bold">Editar Ubicación</Text>
                <Text className="text-sm text-muted-foreground">Modifica tu dirección y ubicación</Text>
              </View>
            </View>
          </View>
        </View>

        <DatosUbicacion
          pasoActual={1}
          totalPasos={1}
          esEdicion={true}
          onNavigate={handleNavigate}
        />
      </BottomSheet>
    </View>
  );
}