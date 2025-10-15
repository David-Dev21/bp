import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { useRouter } from "expo-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Text } from "~/components/ui/text";

// Componente para el header right del perfil
export function CerrarSession() {
  const { cerrarSesion } = useAtenticacionStore();
  const { limpiarDatos } = usePerfilStore();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];
  const [mostrarDialogo, setMostrarDialogo] = React.useState(false);

  const handleCerrarSesion = () => {
    setMostrarDialogo(true);
  };

  const confirmarCerrarSesion = () => {
    setMostrarDialogo(false);
    // Limpiar todos los estados globales
    limpiarDatos();
    cerrarSesion();
    router.replace("/");
  };

  return (
    <>
      <Pressable
        onPress={handleCerrarSesion}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Ionicons name="log-out" size={24} color={tema["primary"]} />
      </Pressable>

      <AlertDialog open={mostrarDialogo}>
        <AlertDialogContent className="w-4/5">
          <AlertDialogHeader>
            <AlertDialogTitle>Cerrar Sesión</AlertDialogTitle>
            <AlertDialogDescription>¿Estás seguro de que quieres cerrar sesión?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setMostrarDialogo(false)}>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmarCerrarSesion}>
              <Text>Cerrar Sesión</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
