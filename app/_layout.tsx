import "react-native-gesture-handler";
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Appearance, Platform, Pressable, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { NAV_THEME, THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { obtenerIdDispositivo } from "~/lib/utils";
import * as ScreenCapture from "expo-screen-capture";
import { CerrarSession } from "~/components/CerrarSession";
import { useNotificaciones } from "~/hooks/useNotificaciones";
import "~/global.css";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { colorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";
  const tema = THEME_COLORS[isDarkColorScheme ? "dark" : "light"];

  // Inicializar configuración de notificaciones
  useNotificaciones();

  // Inicializar ID del dispositivo al abrir la app
  React.useEffect(() => {
    obtenerIdDispositivo();

    // Proteger contra capturas de pantalla
    const activarProteccionPantalla = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };

    activarProteccionPantalla();

    // Limpiar al desmontar
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <View style={{ flex: 1 }}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: true,
                      headerTitle: "",
                      headerStyle: { backgroundColor: THEME_COLORS.light.primary },
                      headerTintColor: THEME_COLORS.light["primary-foreground"],
                      headerLeft: () => (
                        <Link asChild href={"/perfil"}>
                          <Pressable>
                            <Ionicons name="person-circle-outline" size={32} color={THEME_COLORS.light["primary-foreground"]} />
                          </Pressable>
                        </Link>
                      ),
                      // headerRight: () => (
                      //   <Pressable
                      //     style={({ pressed }) => ({
                      //       opacity: pressed ? 0.7 : 1,
                      //     })}
                      //   >
                      //     <Ionicons name="information-circle-outline" size={32} color={THEME_COLORS.light["primary-foreground"]} />
                      //   </Pressable>
                      // ),
                    }}
                  />
                  <Stack.Screen
                    name="registro"
                    options={{
                      headerStyle: { backgroundColor: THEME_COLORS.light.primary },
                      headerTintColor: THEME_COLORS.light["primary-foreground"],
                      headerShown: true,
                      title: "Regístrate",
                      headerBackTitle: "Volver",
                    }}
                  />
                  <Stack.Screen
                    name="informacion"
                    options={{
                      headerStyle: { backgroundColor: THEME_COLORS.light.primary },
                      headerTintColor: THEME_COLORS.light["primary-foreground"],
                      headerShown: true,
                      title: "Información",
                      headerBackTitle: "Volver",
                    }}
                  />
                  <Stack.Screen
                    name="perfil"
                    options={{
                      headerStyle: { backgroundColor: THEME_COLORS.light.primary },
                      headerTintColor: THEME_COLORS.light["primary-foreground"],
                      headerShown: true,
                      title: "PERFIL",
                      headerBackTitle: "Volver",
                      headerRight: () => <CerrarSession />,
                    }}
                  />
                  <Stack.Screen
                    name="verificar-codigo"
                    options={{
                      headerStyle: { backgroundColor: THEME_COLORS.light.primary },
                      headerTintColor: THEME_COLORS.light["primary-foreground"],
                      headerShown: false,
                      title: "Solicitar Código",
                      headerBackTitle: "Volver",
                    }}
                  />
                  <Stack.Screen
                    name="editar-ubicacion"
                    options={{
                      presentation: "modal",
                      headerStyle: { backgroundColor: THEME_COLORS.light.primary },
                      headerTintColor: THEME_COLORS.light["primary-foreground"],
                      headerShown: true,
                      title: "EDITAR UBICACIÓN",
                    }}
                  />
                </Stack>
                <StatusBar style="light" />
                <PortalHost />
                <Toaster />
              </ThemeProvider>
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </View>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() {}
