import React, { useMemo } from "react";
import { View, Pressable, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useBotonPanico } from "~/hooks/emergencia/useBotonPanico";
import { useAlertaStore } from "~/stores/alertaStore";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { useUbicacionStore } from "~/stores/ubicacionStore";
import { ContenidoBotonEmergencia } from "~/components/emergencia/ContenidoBotonEmergencia";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { useSafeAreaInsetsWithFallback } from "~/hooks/useSafeAreaInsetsWithFallback";
import { AlertaService } from "~/services/alertaService";

export default function BotonPanico() {
  const { colorScheme } = useColorScheme();
  const { estado } = useAlertaStore();
  const { codigoDenuncia, idVictima } = useAtenticacionStore();
  const { ubicacionActual } = useUbicacionStore();
  const insets = useSafeAreaInsetsWithFallback();

  // PREPARAR TODOS LOS DATOS PARA ENVÍO INMEDIATO (estado local optimizado)
  const datosAlertaPreparados = useMemo(() => {
    if (!idVictima || !codigoDenuncia) {
      return undefined; // No se puede enviar sin datos básicos
    }

    // Ubicación lista (si existe)
    const ubicacion = ubicacionActual
      ? {
          longitud: ubicacionActual.coords.longitude,
          latitud: ubicacionActual.coords.latitude,
          precision: ubicacionActual.coords.accuracy || 10,
          marcaTiempo: AlertaService.obtenerFechaHoraISO(),
        }
      : undefined;

    return {
      idVictima,
      fechaHora: AlertaService.obtenerFechaHoraISO(),
      codigoDenuncia,
      codigoRegistro: `REG-${idVictima.slice(-8)}`,
      ...(ubicacion && { ubicacion }),
    };
  }, [idVictima, codigoDenuncia, ubicacionActual]);

  const {
    alertaEstaActiva,
    cancelacionSolicitada,
    compartiendoUbicacion,
    estadoBoton,
    botonDeshabilitado,
    manejarToque,
    manejarPressIn,
    manejarPressOut,
    obtenerTextoEstado,
    obtenerEstilosBoton,
  } = useBotonPanico(datosAlertaPreparados);

  const realizarLlamada = (numero: string) => {
    Linking.openURL(`tel:${numero}`);
  };

  // Color del ícono desde THEME_COLORS_HEX (un solo lugar de configuración)
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

  return (
    <View className="flex-1 justify-center px-4" style={{ paddingBottom: insets.bottom }}>
      {/* Título */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          {alertaEstaActiva ? "Alerta Activa" : `CUD: ${codigoDenuncia || "Sin código"}`}
        </Text>
        <Text className="text-sm text-center text-muted-foreground px-4">
          {alertaEstaActiva
            ? "Tu alerta ha sido enviada. Las autoridades han sido notificadas"
            : "Presiona el botón en caso de emergencia para enviar una alerta a la FELCV"}
        </Text>
      </View>

      {/* Botón de Emergencia */}
      <View className="mb-4">
        <View className="items-center">
          <Pressable
            onPress={manejarToque}
            onPressIn={manejarPressIn}
            onPressOut={manejarPressOut}
            disabled={botonDeshabilitado}
            className="w-64 h-64 rounded-full items-center justify-center border-8"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              ...obtenerEstilosBoton(),
            }}
          >
            <ContenidoBotonEmergencia
              alertaEstaActiva={alertaEstaActiva}
              cancelacionSolicitada={cancelacionSolicitada}
              manteniendoPresionado={estadoBoton.manteniendoPresionado}
              primerToque={estadoBoton.primerToque}
              tiempoRestante={estadoBoton.tiempoRestante}
            />
          </Pressable>

          {/* Mensajes de estado */}
          {alertaEstaActiva && (
            <View className="mt-4">
              {estado === "EN_ATENCION" ? (
                <Text className="text-center text-sm text-blue-600">Tu alerta está siendo atendida por las autoridades</Text>
              ) : compartiendoUbicacion ? (
                <Text className="text-center text-sm text-orange-600">Compartiendo ubicacion en tiempo real</Text>
              ) : null}
            </View>
          )}
        </View>
        <Text className="text-center text-foreground/70 py-4 text-sm">{obtenerTextoEstado()}</Text>

        {/* Llamadas de emergencia */}
        <View className="mt-4">
          <Text className="text-center text-sm text-muted-foreground mb-3">
            Llamadas de emergencia
            <Ionicons className="call" size={4} color={colorIcono} />
          </Text>
          <View className="flex-row justify-center gap-4">
            <Button onPress={() => realizarLlamada("80014348")} variant="default">
              <Text className="font-medium">FELCV: 800 14 0348</Text>
            </Button>
            <Button onPress={() => realizarLlamada("110")} variant="default">
              <Text className="font-medium">RADIO PATRULLA: 110</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
