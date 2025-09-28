import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useBotonPanico } from '~/hooks/emergencia/useBotonPanico';
import { useAlertaStore } from '~/stores/emergencia/alertaStore';
import { useAtenticacionStore } from '~/stores/victimas/atenticacionStore';
import { ContenidoBotonEmergencia } from '~/components/emergencia/ContenidoBotonEmergencia';
import { Ionicons } from '@expo/vector-icons';

export default function BotonPanico() {
  const { estado } = useAlertaStore();
  const { codigoCud } = useAtenticacionStore();
  const {
    alertaEstaActiva,
    cancelacionSolicitada,
    compartiendoUbicacion,
    estadoBoton,
    botonDeshabilitado,
    enviandoAlerta,
    manejarToque,
    manejarPressIn,
    manejarPressOut,
    obtenerTextoEstado,
    obtenerEstilosBoton,
  } = useBotonPanico();

  const realizarLlamada = (numero: string) => {
    Linking.openURL(`tel:${numero}`);
  };

  return (
    <View className="flex-1 h-100 justify-center px-4">
      {/* Título */}
      <View className="mb-8">
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          {alertaEstaActiva ? 'Alerta Activa' : `CUD: ${codigoCud || 'Sin código'}`}
        </Text>
        <Text className="text-sm text-center text-muted-foreground px-4">
          {alertaEstaActiva
            ? 'Tu alerta ha sido enviada. Las autoridades han sido notificadas'
            : 'Presiona el botón en caso de emergencia para enviar una alerta a la FELCV'}
        </Text>
      </View>

      {/* Botón de Emergencia */}
      <View className="mb-8">
        <View className="items-center">
          <Pressable
            onPress={manejarToque}
            onPressIn={manejarPressIn}
            onPressOut={manejarPressOut}
            disabled={botonDeshabilitado}
            className="w-64 h-64 rounded-full items-center justify-center border-8"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              ...obtenerEstilosBoton(),
            }}
          >
            <ContenidoBotonEmergencia
              enviandoAlerta={enviandoAlerta}
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
              {estado === 'EN_ATENCION' ? (
                <Text className="text-center text-sm text-blue-600">Tu alerta está siendo atendida por las autoridades</Text>
              ) : compartiendoUbicacion ? (
                <Text className="text-center text-sm text-orange-600">Compartiendo ubicacion en tiempo real</Text>
              ) : null}
            </View>
          )}
        </View>
        <Text className="text-center text-foreground/70 py-4 text-sm">{obtenerTextoEstado()}</Text>

        {/* Llamadas de emergencia - usando Button pequeño */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-around">
            <Button onPress={() => realizarLlamada('80014348')} variant="destructive" size="sm" className="flex-row items-center">
              <Ionicons name="call-outline" size={14} color="white" />
              <View className="ml-1 flex-row ">
                <Text className="text-white font-medium text-xs">FELCV: </Text>
                <Text className="text-white/80 text-xs">800 14 0348</Text>
              </View>
            </Button>

            <Button onPress={() => realizarLlamada('110')} variant="default" size="sm" className="flex-row items-center">
              <Ionicons name="call-outline" size={14} color="white" />
              <View className="ml-1 flex-row ">
                <Text className="text-white font-medium text-xs">Policía: </Text>
                <Text className="text-white/80 text-xs">110</Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
