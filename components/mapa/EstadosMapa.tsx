import { View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

interface EstadoCargaProps {
  tema: any;
  mensaje: string;
}

export function EstadoCarga({ tema, mensaje }: EstadoCargaProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={tema.primary} />
      <Text className="mt-4 text-muted-foreground">{mensaje}</Text>
    </View>
  );
}

interface EstadoErrorProps {
  tema: any;
  error: string;
  onRetry: () => void;
}

export function EstadoError({ tema, error, onRetry }: EstadoErrorProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <Ionicons name="location-outline" size={64} color={tema.primary} />
      <Text className="text-lg font-bold mt-4 text-center px-6">{error}</Text>
      <Text className="text-center text-muted-foreground mt-2 px-6">Verifica que los permisos de ubicación estén activados</Text>
      <Button onPress={onRetry} className="mt-6">
        <Text className="font-semibold">Intentar nuevamente</Text>
      </Button>
    </View>
  );
}
