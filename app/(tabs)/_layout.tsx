import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  const TabLabel = ({ focused, titulo }: { focused: boolean; titulo: string }) => (
    <Text style={{ fontSize: 12, fontWeight: focused ? "bold" : "normal", color: focused ? tema.primary : tema["muted-foreground"] }}>{titulo}</Text>
  );

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} backgroundColor={tema.primary} />
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "shift",
          tabBarStyle: {
            height: 75,
            backgroundColor: tema.background,
            borderTopWidth: 0,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
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
                  marginTop: -8,
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
                  marginTop: -8,
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
                  marginTop: -8,
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
