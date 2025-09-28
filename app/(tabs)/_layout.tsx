import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#5a6a2f" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 90,
            paddingTop: 5,
          },
          tabBarActiveTintColor: '#5a6a2f',
          tabBarInactiveTintColor: '#808080',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="ajustes"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="alerta"
          options={{
            title: 'Alerta',
            tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'warning' : 'warning-outline'} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="consejos"
          options={{
            title: 'Consejos',
            tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'help' : 'help-outline'} size={size} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
