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
      <View className="pb-24 pt-4">
        {/* Header */}
        <View className="mb-2">
          <Text className="text-2xl font-bold text-center mb-2">Consejos de Seguridad</Text>
          <Text className="text-center text-muted-foreground">Información importante para tu protección</Text>
        </View>

        {/* Sección 1 - Recomendaciones FELCV */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="shield-checkmark" size={20} color={tema.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-primary">Recomendaciones FELCV</Text>
                <Text className="text-sm text-muted-foreground">Consejos para usar la aplicación</Text>
              </View>
            </View>
            <View className="gap-3">
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="lock-closed" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">
                  Evita comentar sobre la instalación del botón de pánico a personas que no sean de tu confianza
                </Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="phone-portrait" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">Nunca desinstales la aplicación de tu celular</Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="business" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">
                  Si pierdes tu teléfono celular acude a oficinas de la F.E.L.C.V. para su reinstalación
                </Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="wifi" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">Recuerda siempre estar conectado a internet y ubicación GPS</Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="location" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">Siempre lleva contigo el celular para dar con tu ubicación</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 2 - Cuando activar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="alert-circle" size={20} color={tema.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-primary">¿Cuándo activar el botón?</Text>
                <Text className="text-sm text-muted-foreground">Solo en situaciones de riesgo real</Text>
              </View>
            </View>
            <View className="gap-3">
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="heart" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1 font-medium">Tu vida o la de tus hijos corre peligro</Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="person" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1 font-medium">Tu agresor esté cerca</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 3 - Al activar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="call" size={20} color={tema.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-primary">Al activar el botón</Text>
                <Text className="text-sm text-muted-foreground">Qué hacer inmediatamente</Text>
              </View>
            </View>
            <View className="gap-3">
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="call" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">Puedes llamar a la línea gratuita 800 14 0348 o al 110</Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="people" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">Llama a un familiar cercano</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 4 - En la calle */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="storefront" size={20} color={tema.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-primary">Si estás en la calle</Text>
                <Text className="text-sm text-muted-foreground">Busca protección inmediata</Text>
              </View>
            </View>
            <View className="gap-3">
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="business" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">
                  Busca un lugar resguardado: tiendas, oficinas, edificios, entidades financieras, entidades públicas o privadas
                </Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="people-circle" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">Pide ayuda a otras personas</Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="shield" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">Busca un policía o dirígete a una oficina policial más cercana</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 5 - En casa */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="home" size={20} color={tema.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-primary">Si estás en casa</Text>
                <Text className="text-sm text-muted-foreground">Planifica tu seguridad</Text>
              </View>
            </View>
            <View className="gap-3">
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="exit" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">
                  Identifica la salida más rápida de tu casa y planifica una ruta de escape de cada espacio en caso que necesites salir apresurada
                </Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="people" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">
                  Si tienes una vecina/o de confianza, crea una señal especial con ella/él, para cuando la vean o la escuchen llamen de inmediato a la
                  FELCV. Podría ser: prender y apagar una luz varias veces o cuando se diga una palabra específica en voz alta, entre otras
                </Text>
              </View>
              <View className="flex-row items-start gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
                <Ionicons name="key" size={16} color={tema.primary} className="mt-0.5" />
                <Text className="text-sm leading-5 flex-1">
                  Crea una señal que solamente tú y tus hijos/as conozcan y que al dar la señal ellos/as entiendan que significa que tienen que salir
                  de la casa rápidamente
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Footer institucional */}
        <Card className="border border-primary/20 mx-4">
          <CardContent className="p-4">
            <View className="gap-3">
              <View className="flex-row items-center gap-3 p-3 bg-primary/5 rounded-2xl">
                <Image source={require("~/assets/images/felcv/logo-felcv.webp")} className="w-12 h-12 rounded-2xl" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="font-bold text-sm">F.E.L.C.V.</Text>
                  <Text className="text-xs text-muted-foreground">Fuerza Especial de Lucha Contra la Violencia</Text>
                </View>
                {/* <Ionicons name="chevron-forward" size={20} color={tema.primary} /> */}
              </View>

              <View className="flex-row items-center gap-3 p-3 bg-primary/5 rounded-2xl">
                <Image source={require("~/assets/images/felcv/adelita.webp")} className="w-12 h-12 rounded-2xl" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="font-bold text-sm">Sistema Alertas Adela Zamudio</Text>
                  <Text className="text-xs text-muted-foreground">Protección y prevención de la violencia</Text>
                </View>
                {/* <Ionicons name="chevron-forward" size={20} color={tema.primary} /> */}
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
