import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';

interface PropiedadesContenidoBoton {
  enviandoAlerta: boolean;
  alertaEstaActiva: boolean;
  cancelacionSolicitada: boolean;
  manteniendoPresionado: boolean;
  primerToque: boolean;
  tiempoRestante: number;
}

export function ContenidoBotonEmergencia({
  enviandoAlerta,
  alertaEstaActiva,
  cancelacionSolicitada,
  manteniendoPresionado,
  primerToque,
  tiempoRestante,
}: PropiedadesContenidoBoton) {
  if (enviandoAlerta) {
    return (
      <View className="items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white text-sm font-bold mt-2">{alertaEstaActiva ? 'CANCELANDO...' : 'ENVIANDO...'}</Text>
      </View>
    );
  }

  if (alertaEstaActiva) {
    if (manteniendoPresionado) {
      return (
        <View className="items-center">
          <Text className="text-white text-4xl font-bold">{tiempoRestante}</Text>
          <Text className="text-white text-sm font-bold mt-1">CANCELANDO...</Text>
        </View>
      );
    }

    if (primerToque) {
      return (
        <View className="items-center">
          <Text className="text-white text-lg font-bold">TOCA</Text>
          <Text className="text-white text-lg font-bold">NUEVAMENTE</Text>
          <Text className="text-white text-xs mt-1">PARA CANCELAR</Text>
        </View>
      );
    }

    return (
      <View className="items-center">
        <Text className="text-white text-lg font-bold text-center">
          {cancelacionSolicitada ? 'CANCELACIÓN\nSOLICITADA' : 'SOLICITAR\nCANCELACIÓN'}
        </Text>
      </View>
    );
  }

  if (manteniendoPresionado) {
    return (
      <View className="items-center">
        <Text className="text-white text-4xl font-bold">{tiempoRestante}</Text>
        <Text className="text-white text-sm font-bold mt-1">MANTENIENDO...</Text>
      </View>
    );
  }

  if (primerToque) {
    return (
      <View className="items-center">
        <Text className="text-white text-lg font-bold">TOCA</Text>
        <Text className="text-white text-lg font-bold">NUEVAMENTE</Text>
      </View>
    );
  }

  return <Text className="text-white text-xl font-bold text-center">{alertaEstaActiva ? 'Alerta Enviada' : 'Emergencia'}</Text>;
}
