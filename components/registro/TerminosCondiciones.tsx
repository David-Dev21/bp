import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  pasoActual: number;
  totalPasos: number;
  onNavigate: (action: "prev" | "next" | "complete") => void;
  isLoading: boolean;
}

export default function TerminosCondiciones({ pasoActual, totalPasos, onNavigate, isLoading }: Props) {
  const [aceptado, setAceptado] = useState(false);

  // Color scheme para modo oscuro
  const { colorScheme } = useColorScheme();
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

  // Safe area insets
  const insets = useSafeAreaInsets();

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={120}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="text-2xl font-bold text-center mb-2">Términos y Condiciones</Text>
          {pasoActual && totalPasos && (
            <Text className="text-center text-muted-foreground">
              Paso {pasoActual} de {totalPasos}
            </Text>
          )}
        </View>

        <View className="flex-col gap-4 mt-6">
          <Text className="text-sm text-muted-foreground leading-5">
            Al continuar con el registro, usted acepta los siguientes términos y condiciones:
          </Text>

          {/* Sección 1 */}
          <View>
            <Text className="text-sm font-semibold mb-1">1. Recopilación de Datos</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              La aplicación recopila y comparte su ubicación en tiempo real con las autoridades de la FELCV únicamente durante situaciones de
              emergencia activadas por usted.
            </Text>
          </View>

          {/* Sección 2 */}
          <View>
            <Text className="text-sm font-semibold mb-1">2. Ubicación en Segundo Plano</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              Durante una alerta activa, la aplicación accederá a su ubicación incluso cuando esté cerrada o en segundo plano para mantener su
              seguridad.
            </Text>
          </View>

          {/* Sección 3 */}
          <View>
            <Text className="text-sm font-semibold mb-1">3. Compartir Información</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              Al activar una alerta, sus datos personales, ubicación y contactos de emergencia serán compartidos con las autoridades y sus contactos
              registrados.
            </Text>
          </View>

          {/* Sección 4 */}
          <View>
            <Text className="text-sm font-semibold mb-1">4. Mensajes Automáticos</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              La aplicación enviará mensajes automáticos de WhatsApp a sus contactos de emergencia cuando active una alerta.
            </Text>
          </View>

          {/* Sección 5 */}
          <View>
            <Text className="text-sm font-semibold mb-1">5. Notificaciones</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              Durante una alerta activa, se mostrará una notificación permanente en su dispositivo. Esto es requerido por Android para servicios en
              segundo plano.
            </Text>
          </View>

          {/* Sección 6 */}
          <View>
            <Text className="text-sm font-semibold mb-1">6. Responsabilidad</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              Esta aplicación es una herramienta de asistencia. No sustituye las llamadas a servicios de emergencia (911 o 110). La FELCV no se hace
              responsable por fallas técnicas o retrasos.
            </Text>
          </View>

          {/* Sección 7 */}
          <View>
            <Text className="text-sm font-semibold mb-1">7. Uso Responsable</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              El uso indebido del botón de pánico puede resultar en acciones legales. Active la alerta únicamente en situaciones de emergencia real.
            </Text>
          </View>

          {/* Sección 8 */}
          <View>
            <Text className="text-sm font-semibold mb-1">8. Privacidad</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              Sus datos serán tratados de manera confidencial y utilizados exclusivamente para fines de seguridad. Solo será compartida con personal
              autorizado.
            </Text>
          </View>

          {/* Contacto */}
          <View className="bg-muted/50 p-4 rounded-xl">
            <Text className="text-xs font-semibold mb-1">Contacto FELCV:</Text>
            <Text className="text-xs text-muted-foreground">Línea gratuita: 800-140-348</Text>
          </View>

          {/* Checkbox de aceptación */}
          <Pressable
            onPress={() => setAceptado(!aceptado)}
            className={`flex-row items-center p-4 rounded-xl border-2 ${aceptado ? "border-primary bg-primary/5" : "border-muted bg-muted/20"}`}
          >
            <View
              className={`w-6 h-6 rounded-md mr-3 items-center justify-center ${
                aceptado ? "bg-primary" : "bg-background border-2 border-muted-foreground/30"
              }`}
            >
              {aceptado && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
            <Text className="flex-1 text-sm leading-5">He leído y acepto los términos y condiciones de uso de la aplicación</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>

      {/* Botones de navegación sticky */}
      <KeyboardStickyView offset={{ closed: 0, opened: 10 }}>
        <View className="flex-row justify-between px-6 bg-background" style={{ paddingTop: 10, paddingBottom: insets.bottom + 15 }}>
          <Button variant="default" onPress={() => onNavigate("prev")} disabled={isLoading}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="arrow-back" size={20} color={colorIcono} />
              <Text>Anterior</Text>
            </View>
          </Button>

          <Button variant="default" onPress={() => onNavigate("complete")} disabled={!aceptado || isLoading}>
            <View className="flex-row items-center gap-2">
              <Text>{isLoading ? "Registrando..." : "Completar"}</Text>
              <Ionicons name="checkmark-circle" size={20} color={colorIcono} />
            </View>
          </Button>
        </View>
      </KeyboardStickyView>
    </>
  );
}
