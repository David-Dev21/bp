import { UnidadPolicial } from "~/lib/tiposApi";
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
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { View } from "react-native";

interface DialogoUnidadProps {
  unidadSeleccionada: UnidadPolicial | null;
  abierto: boolean;
  onAbrirCambio: (abierto: boolean) => void;
  tema: any;
  onNavegar: (unidad: UnidadPolicial) => void;
}

export function DialogoUnidad({ unidadSeleccionada, abierto, onAbrirCambio, tema, onNavegar }: DialogoUnidadProps) {
  const handleCancelar = () => {
    onAbrirCambio(false);
  };

  const handleNavegar = () => {
    if (unidadSeleccionada) {
      onNavegar(unidadSeleccionada);
      onAbrirCambio(false);
    }
  };

  if (!unidadSeleccionada) return null;

  return (
    <AlertDialog open={abierto} onOpenChange={onAbrirCambio}>
      <AlertDialogContent className="w-4/5">
        <AlertDialogHeader>
          <AlertDialogTitle>{unidadSeleccionada.nombre}</AlertDialogTitle>
          <AlertDialogDescription>
            <View className="flex-row items-start">
              <Ionicons name="location" size={18} color={tema.primary} />
              <Text className="text-sm text-muted-foreground flex-1">{unidadSeleccionada.direccion}</Text>
            </View>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={handleCancelar}>
            <Text>Cancelar</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleNavegar}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="navigate" size={18} color={tema["primary-foreground"]} />
              <Text className="font-semibold">Cómo llegar</Text>
            </View>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
