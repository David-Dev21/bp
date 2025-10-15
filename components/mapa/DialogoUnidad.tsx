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
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Linking } from "react-native";

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

  const handleAbrirGoogleMaps = () => {
    if (unidadSeleccionada) {
      const { latitud, longitud } = unidadSeleccionada.ubicacion;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`;
      Linking.openURL(url);
      onAbrirCambio(false);
    }
  };

  if (!unidadSeleccionada) return null;

  return (
    <AlertDialog open={abierto} onOpenChange={onAbrirCambio}>
      <AlertDialogContent className="w-4/5">
        <AlertDialogHeader>
          <AlertDialogTitle>{unidadSeleccionada.unidad}</AlertDialogTitle>
          <AlertDialogDescription>
            <Text className="text-sm text-muted-foreground">
              {unidadSeleccionada.direccion} - {unidadSeleccionada.referencia}
            </Text>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2">
          <AlertDialogAction onPress={handleNavegar}>
            <View className="flex-row items-center justify-center gap-2">
              <Text className="font-semibold">Ver Ruta Inicial</Text>
              <Ionicons name="navigate" size={18} color={tema["primary-foreground"]} />
            </View>
          </AlertDialogAction>
          <Button onPress={handleAbrirGoogleMaps}>
            <View className="flex-row items-center justify-center gap-2">
              <Text className="font-semibold">Abrir en Google Maps</Text>
              <Ionicons name="map" size={18} color={tema["primary-foreground"]} />
            </View>
          </Button>
          <AlertDialogCancel onPress={handleCancelar}>
            <Text>Cancelar</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
