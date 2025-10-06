import React, { useRef, useMemo } from "react";
import { View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import DatosPersonales from "~/components/registro/DatosPersonales";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { usePerfilStore } from "~/stores/perfilStore";

interface EditarPerfilProps {
  abierto: boolean;
  onClose: () => void;
}

export default function EditarPerfil({ abierto, onClose }: EditarPerfilProps) {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  const { idVictima } = useAtenticacionStore();
  const { obtenerDatosCompletos } = usePerfilStore();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["95%"], []);

  React.useEffect(() => {
    if (abierto) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [abierto]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: colorScheme === "dark" ? "#1f2937" : "#ffffff" }}
      handleIndicatorStyle={{ backgroundColor: colorScheme === "dark" ? "#6b7280" : "#d1d5db" }}
      enablePanDownToClose={true}
      onClose={onClose}
      animateOnMount={true}
      enableDynamicSizing={false}
    >
      <BottomSheetScrollView>
        <DatosPersonales esEdicion={true} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
