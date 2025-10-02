import { ScrollView, View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";

export default function ConsejosScreen() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header con logo */}
      <View className="items-center pt-8 pb-6 px-4 bg-card">
        <Image source={require("~/assets/images/felcv/logo-felcv.webp")} className="w-20 h-20 mb-3" resizeMode="contain" />
        <Text className="text-2xl font-bold text-center">LA F.E.L.C.V. TE RECOMIENDA</Text>
      </View>

      <View className="px-4 pb-24">
        {/* EMERGENCIA - Cuándo activar */}
        <Card className="mb-4 border-2 border-destructive">
          <CardContent className="pt-6">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="bg-destructive p-2 rounded-full">
                <Ionicons name="warning" size={20} color="white" />
              </View>
              <Text className="text-lg font-bold flex-1">CUÁNDO ACTIVAR EL BOTÓN</Text>
            </View>

            <View className="gap-3 mb-4">
              <View className="flex-row items-center gap-3 bg-destructive/10 p-3 rounded-lg">
                <Ionicons name="alert-circle" size={18} color="#ef4444" />
                <Text className="flex-1 font-semibold text-sm">TU VIDA O LA DE TUS HIJOS CORRE PELIGRO</Text>
              </View>
              <View className="flex-row items-center gap-3 bg-destructive/10 p-3 rounded-lg">
                <Ionicons name="alert-circle" size={18} color="#ef4444" />
                <Text className="flex-1 font-semibold text-sm">TU AGRESOR ESTÉ CERCA</Text>
              </View>
            </View>

            <View className="bg-primary/10 p-3 rounded-lg">
              <Text className="font-bold mb-2">AL ACTIVAR RECUERDA:</Text>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="call" size={16} color="#3b82f6" />
                  <Text className="flex-1 text-sm">LÍNEA GRATUITA: 800 14 0348 O 110</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="people" size={16} color="#3b82f6" />
                  <Text className="flex-1 text-sm">LLAMA A UN FAMILIAR CERCANO</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* RECOMENDACIONES GENERALES */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="shield-checkmark" size={20} color={tema.primary} />
              <Text className="text-lg font-bold">RECOMENDACIONES GENERALES</Text>
            </View>

            <View className="gap-3">
              <View className="flex-row items-start gap-3">
                <Ionicons name="eye-off" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">EVITA COMENTAR</Text> sobre la instalación del botón de pánico a personas que no sean de tu
                  confianza
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="close-circle" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">NUNCA DESINSTALES</Text> la aplicación de tu celular
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="business" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  Si pierdes tu teléfono <Text className="font-semibold">ACUDE A OFICINAS DE LA F.E.L.C.V.</Text> para reinstalación
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="wifi" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">ESTAR CONECTADO</Text> a internet y ubicación GPS
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="phone-portrait" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">LLEVA CONTIGO EL CELULAR</Text> para dar con tu ubicación
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* EN LA CALLE */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="storefront" size={20} color={tema.primary} />
              <Text className="text-lg font-bold">SI ESTÁS EN LA CALLE</Text>
            </View>

            <View className="gap-3">
              <View className="flex-row items-start gap-3">
                <Ionicons name="business" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">BUSCA REFUGIO:</Text> tiendas, oficinas, edificios, bancos
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="people" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">PIDE AYUDA</Text> a otras personas
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="shield" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">BUSCA UN POLICÍA</Text> o ve a la oficina más cercana
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* EN DOMICILIO */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="home" size={20} color={tema.primary} />
              <Text className="text-lg font-bold">SI ESTÁS EN CASA</Text>
            </View>

            <View className="gap-3">
              <View className="flex-row items-start gap-3">
                <Ionicons name="exit" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">IDENTIFICA LA SALIDA</Text> más rápida y planifica ruta de escape
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="hand-left" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">SEÑAL CON VECINOS</Text> de confianza para llamar a FELCV
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="people-circle" size={16} color={tema["muted-foreground"]} />
                <Text className="flex-1 text-sm leading-5">
                  <Text className="font-semibold">SEÑAL FAMILIAR</Text> que solo tú y tus hijos conozcan
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Footer institucional */}
        <Card>
          <CardContent className="pt-6">
            <Text className="text-center mb-4 text-sm leading-6">
              El <Text className="font-bold text-destructive">botón de pánico</Text> es para emergencias reales. Su uso adecuado puede salvarte la
              vida.
            </Text>

            <View className="gap-2">
              <View className="flex-row items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Image source={require("~/assets/images/felcv/logo-felcv.webp")} className="w-10 h-10" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="font-bold text-sm">F.E.L.C.V.</Text>
                  <Text className="text-xs text-muted-foreground">Fuerza Especial de Lucha Contra la Violencia</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Image source={require("~/assets/images/felcv/adelita.webp")} className="w-10 h-10" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="font-bold text-sm">Sistema Adelita</Text>
                  <Text className="text-xs text-muted-foreground">Protección y prevención de la violencia</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
