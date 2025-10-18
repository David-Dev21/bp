import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsetsWithFallback } from "~/hooks/useSafeAreaInsetsWithFallback";
import { useUbicacionStore } from "~/stores/ubicacionStore";
import { Toaster } from "sonner-native";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsetsWithFallback();
  const [ubicacionLista, setUbicacionLista] = React.useState(false);

  // Obtener ubicación silenciosamente al entrar a las pestañas
  React.useEffect(() => {
    const obtenerUbicacion = async () => {
      const { actualizarUbicacion } = useUbicacionStore.getState();
      await actualizarUbicacion();
      setUbicacionLista(true);
    };

    obtenerUbicacion();
  }, []);

  // No mostrar tabs hasta que la ubicación esté lista
  if (!ubicacionLista) {
    return null; // O un loading screen si quieres
  }

  const TabLabel = ({ focused, titulo }: { focused: boolean; titulo: string }) => (
    <Text style={{ fontSize: 12, fontWeight: focused ? "bold" : "normal", color: focused ? tema.primary : tema["muted-foreground"] }}>{titulo}</Text>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "shift",
          tabBarStyle: {
            height: 75,
            backgroundColor: tema.background,
            borderTopWidth: 0,
            left: 0,
            right: 0,
            bottom: insets.bottom,
          },
          tabBarActiveTintColor: tema.primary,
          tabBarInactiveTintColor: tema["muted-foreground"],
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="mapa"
          options={{
            title: "Mapa",
            tabBarLabel: ({ focused }) => <TabLabel focused={focused} titulo="Mapa" />,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  borderTopWidth: focused ? 4 : 4,
                  borderTopColor: focused ? tema.primary : "transparent",
                  width: 60,
                  alignItems: "center",
                  marginTop: -5,
                  paddingTop: 4,
                }}
              >
                <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="alerta"
          options={{
            title: "Alerta",
            tabBarLabel: ({ focused }) => <TabLabel focused={focused} titulo="Alerta" />,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  borderTopWidth: 4,
                  borderTopColor: focused ? tema.primary : "transparent",
                  width: 60,
                  alignItems: "center",
                  marginTop: -5,
                  paddingTop: 4,
                }}
              >
                <Ionicons name={focused ? "warning" : "warning-outline"} size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="consejos"
          options={{
            title: "Consejos",
            tabBarLabel: ({ focused }) => <TabLabel focused={focused} titulo="Consejos" />,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  borderTopWidth: 4,
                  borderTopColor: focused ? tema.primary : "transparent",
                  width: 60,
                  alignItems: "center",
                  marginTop: -5,
                  paddingTop: 4,
                }}
              >
                <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
