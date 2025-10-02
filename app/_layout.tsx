import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Appearance, Platform, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NAV_THEME, THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { obtenerIdDispositivo } from "~/lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { colorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";
  const tema = THEME_COLORS[isDarkColorScheme ? "dark" : "light"];

  // Inicializar ID del dispositivo al abrir la app
  React.useEffect(() => {
    obtenerIdDispositivo().catch(console.error);
    // Mostrar contenido de AsyncStorage en consola
    AsyncStorage.getAllKeys()
      .then((keys) => {
        AsyncStorage.multiGet(keys)
          .then((stores) => {
            console.log("AsyncStorage contents:", stores);
          })
          .catch((error) => console.error("Error getting AsyncStorage:", error));
      })
      .catch((error) => console.error("Error getting keys:", error));
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                headerTitle: "",
                headerStyle: { backgroundColor: tema.primary },
                headerTintColor: tema["primary-foreground"],
                headerLeft: () => (
                  <Link asChild href={"/perfil"}>
                    <Pressable>
                      <Ionicons name="person-circle-outline" size={32} color={tema["primary-foreground"]} />
                    </Pressable>
                  </Link>
                ),
                headerRight: () => (
                  <Pressable
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Ionicons name="information-circle-outline" size={32} color={tema["primary-foreground"]} />
                  </Pressable>
                ),
              }}
            />
            <Stack.Screen
              name="registro"
              options={{
                headerStyle: { backgroundColor: tema.primary },
                headerTintColor: tema["primary-foreground"],
                headerShown: true,
                title: "",
                headerBackTitle: "Volver",
              }}
            />
            <Stack.Screen
              name="informacion"
              options={{
                headerStyle: { backgroundColor: tema.primary },
                headerTintColor: tema["primary-foreground"],
                headerShown: true,
                title: "Información",
                headerBackTitle: "Volver",
              }}
            />
            <Stack.Screen
              name="perfil"
              options={{
                headerStyle: { backgroundColor: tema.primary },
                headerTintColor: tema["primary-foreground"],
                headerShown: true,
                title: "PERFIL",
                headerBackTitle: "Volver",
                headerRight: () => (
                  <Link asChild href={"/registro?modo=editar"}>
                    <Pressable
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Ionicons name="create" size={24} color={tema["primary-foreground"]} />
                    </Pressable>
                  </Link>
                ),
              }}
            />
            <Stack.Screen
              name="verificar-codigo"
              options={{
                headerStyle: { backgroundColor: tema.primary },
                headerTintColor: tema["primary-foreground"],
                headerShown: false,
                title: "Solicitar Código",
                headerBackTitle: "Volver",
              }}
            />
          </Stack>
        </SafeAreaView>
        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
const useIsomorphicLayoutEffect = Platform.OS === "web" && typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add("bg-background");
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() {}
