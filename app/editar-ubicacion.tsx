import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import DatosUbicacion from "~/components/registro/DatosUbicacion";

export default function EditarUbicacionModal() {
  const handleNavigate = (action: "prev" | "next" | "complete") => {
    // Solo manejar complete para guardar y cerrar modal
    if (action === "complete") {
      // Aquí irá la lógica para actualizar ubicación
      console.log("Guardar ubicación");
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <DatosUbicacion pasoActual={1} totalPasos={1} esEdicion={true} onNavigate={handleNavigate} />
    </View>
  );
}
