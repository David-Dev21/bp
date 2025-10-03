import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Stack } from "expo-router";
import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";

// Configurar MapLibre
MapLibreGL.setAccessToken(null);

interface UnidadPolicial {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
  distancia?: number;
}

export default function MapaScreen() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];

  const [ubicacionActual, setUbicacionActual] = useState<[number, number] | null>(null);
  const [unidadesCercanas, setUnidadesCercanas] = useState<UnidadPolicial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<UnidadPolicial | null>(null);

  useEffect(() => {
    obtenerUbicacionYUnidades();
  }, []);

  const obtenerUbicacionYUnidades = async () => {
    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación para mostrar unidades cercanas");
        setCargando(false);
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      const coordenadas: [number, number] = [location.coords.longitude, location.coords.latitude];
      setUbicacionActual(coordenadas);

      // TODO: Aquí llamarás a tu API para obtener unidades policiales cercanas
      // Por ahora, datos de ejemplo
      const unidadesEjemplo: UnidadPolicial[] = [
        {
          id: "1",
          nombre: "F.E.L.C.V. La Paz - Zona Sur",
          direccion: "Av. Costanera esquina Calle 10, Calacoto",
          telefono: "800 14 0348",
          latitud: location.coords.latitude - 0.01,
          longitud: location.coords.longitude - 0.01,
          distancia: 1.2,
        },
        {
          id: "2",
          nombre: "F.E.L.C.V. La Paz - Centro",
          direccion: "Calle Comercio #1234",
          telefono: "800 14 0348",
          latitud: location.coords.latitude + 0.015,
          longitud: location.coords.longitude + 0.015,
          distancia: 2.5,
        },
        {
          id: "3",
          nombre: "F.E.L.C.V. La Paz - Alto",
          direccion: "Av. Buenos Aires #5678",
          telefono: "800 14 0348",
          latitud: location.coords.latitude + 0.02,
          longitud: location.coords.longitude - 0.02,
          distancia: 3.1,
        },
      ];

      setUnidadesCercanas(unidadesEjemplo);
      setCargando(false);
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener tu ubicación");
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={tema.primary} />
        <Text className="mt-4 text-muted-foreground">Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  if (!ubicacionActual) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Ionicons name="location-outline" size={64} color={tema.primary} />
        <Text className="text-lg font-bold mt-4">No se pudo obtener tu ubicación</Text>
        <Text className="text-center text-muted-foreground mt-2">Verifica que los permisos de ubicación estén activados</Text>
        <Button onPress={obtenerUbicacionYUnidades} className="mt-6">
          <Text className="font-semibold">Intentar nuevamente</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Unidades Policiales Cercanas",
          headerStyle: { backgroundColor: tema.primary },
          headerTintColor: tema["primary-foreground"],
        }}
      />

      {/* Mapa */}
      <MapLibreGL.MapView style={styles.mapa} logoEnabled={false}>
        <MapLibreGL.Camera zoomLevel={13} centerCoordinate={ubicacionActual} />

        {/* Marcador de ubicación actual */}
        <MapLibreGL.PointAnnotation id="ubicacion-actual" coordinate={ubicacionActual}>
          <View style={styles.marcadorUsuario}>
            <Ionicons name="person" size={20} color="white" />
          </View>
        </MapLibreGL.PointAnnotation>

        {/* Marcadores de unidades policiales */}
        {unidadesCercanas.map((unidad) => (
          <MapLibreGL.PointAnnotation
            key={unidad.id}
            id={unidad.id}
            coordinate={[unidad.longitud, unidad.latitud]}
            onSelected={() => setUnidadSeleccionada(unidad)}
          >
            <View style={styles.marcadorPolicia}>
              <Ionicons name="shield" size={24} color={tema.primary} />
            </View>
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      {/* Panel inferior con lista de unidades */}
      <View className="absolute bottom-0 left-0 right-0 bg-background" style={styles.panelInferior}>
        <View className="px-4 py-3 border-b border-border">
          <Text className="text-lg font-bold">Unidades F.E.L.C.V. Cercanas</Text>
          <Text className="text-sm text-muted-foreground">{unidadesCercanas.length} unidades encontradas</Text>
        </View>

        <View className="px-4 py-2 gap-2" style={styles.listaUnidades}>
          {unidadesCercanas.map((unidad) => (
            <Card
              key={unidad.id}
              className={unidadSeleccionada?.id === unidad.id ? "border-2 border-primary" : ""}
              onTouchEnd={() => setUnidadSeleccionada(unidad)}
            >
              <CardContent className="p-3">
                <View className="flex-row items-start gap-3">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons name="shield" size={20} color={tema.primary} />
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-sm">{unidad.nombre}</Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      <Ionicons name="location-outline" size={12} color={tema["muted-foreground"]} />
                      <Text className="text-xs text-muted-foreground flex-1">{unidad.direccion}</Text>
                    </View>
                    <View className="flex-row items-center gap-1 mt-1">
                      <Ionicons name="call-outline" size={12} color={tema["muted-foreground"]} />
                      <Text className="text-xs text-muted-foreground">{unidad.telefono}</Text>
                    </View>
                  </View>

                  {unidad.distancia && (
                    <View className="bg-primary/10 px-2 py-1 rounded">
                      <Text className="text-xs font-semibold text-primary">{unidad.distancia} km</Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapa: {
    flex: 1,
  },
  marcadorUsuario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  marcadorPolicia: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#10b981",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  panelInferior: {
    maxHeight: "40%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  listaUnidades: {
    maxHeight: 200,
  },
});
