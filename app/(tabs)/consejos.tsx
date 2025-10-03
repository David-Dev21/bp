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
      <View className="px-4 pb-24 pt-4">
        {/* Sección 1 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="warning" size={20} color={tema.primary} />
              <Text className="text-lg font-bold ml-2 text-primary">La FELCV te recomienda</Text>
            </View>
            <View className="gap-2">
              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">
                  Evita comentar sobre la instalación del botón de pánico a personas que no sean de tu confianza
                </Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Nunca desinstales la aplicación de tu celular</Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Si pierdes tu teléfono celular acude a oficinas de la F.E.L.C.V. para su reinstalación</Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Recuerda siempre estar conectado a internet y ubicación GPS</Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Siempre lleva contigo el celular para dar con tu ubicación</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 2 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="warning" size={20} color={tema.primary} />
              <Text className="text-lg font-bold ml-2 text-primary">Activa el botón de pánico solo cuando:</Text>
            </View>

            <View className="gap-2">
              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Tu vida o la de tus hijos corre peligro</Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Tu agresor esté cerca</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 3 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="call" size={20} color={tema.primary} />
              <Text className="text-lg font-bold text-primary ml-2">Al momento de activar el botón de pánico recuerda que:</Text>
            </View>

            <View className="gap-2">
              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Puedes llamar a la línea gratuita 800 14 0348 o al 110</Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Llama a un familiar cercano</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 4 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="storefront" size={20} color={tema.primary} />
              <Text className="text-lg font-bold ml-2 text-primary">Si te encuentras en la calle</Text>
            </View>

            <View className="gap-2">
              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">
                  Busca un lugar resguardado: tiendas, oficinas, edificios, entidades financieras, entidades públicas o privadas
                </Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Pide ayuda a otras personas</Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">Busca un policía o dirígete a una oficina policial más cercana</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sección 5 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="home" size={20} color={tema.primary} />
              <Text className="text-lg font-bold text-primary ml-2">Si te encuentras en tu domicilio</Text>
            </View>

            <View className="gap-2">
              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">
                  Identifica la salida más rápida de tu casa y planifica una ruta de escape de cada espacio en caso que necesites salir apresurada
                </Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">
                  Si tienes una vecina/o de confianza, crea una señal especial con ella/él, para cuando la vean o la escuchen llamen de inmediato a la
                  FELCV. Podría ser: prender y apagar una luz varias veces o cuando se diga una palabra específica en voz alta, entre otras
                </Text>
              </View>

              <View className="p-3 bg-muted/20 rounded-lg">
                <Text className="text-sm leading-6">
                  Crea una señal que solamente tú y tus hijos/as conozcan y que al dar la señal ellos/as entiendan que significa que tienen que salir
                  de la casa rápidamente
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Footer institucional */}
        <Card>
          <CardContent className="p-4">
            <View className="gap-2">
              <View className="flex-row items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <Image source={require("~/assets/images/felcv/logo-felcv.webp")} className="w-10 h-10" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="font-bold text-sm">F.E.L.C.V.</Text>
                  <Text className="text-xs text-muted-foreground">Fuerza Especial de Lucha Contra la Violencia</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 p-3 bg-muted/20 rounded-lg">
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
