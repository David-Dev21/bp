import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';

interface LoadingProps {
  mensaje?: string;
}

export function Loading({ mensaje = 'Cargando...' }: LoadingProps) {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size="large" color="#5a6a2f" />
      <Text className="mt-4 text-muted-foreground">{mensaje}</Text>
    </View>
  );
}
