import React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useProbarGPS } from '~/hooks/ubicacion/useProbarGPS';

interface ObtenerGPSProps {
  titulo: string;
}

export const ObtenerGPS: React.FC<ObtenerGPSProps> = ({ titulo }) => {
  const { probarGPS, cargando } = useProbarGPS();

  const manejarProbarGPS = async () => {
    await probarGPS();
  };

  return (
    <View>
      <Button variant={'secondary'} size={'sm'} onPress={manejarProbarGPS} disabled={cargando}>
        <Text>{titulo}</Text>
      </Button>
    </View>
  );
};
