import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import VerificarDenuncia from '~/components/inicio/VerificarDenuncia';
import { useAtenticacionStore } from '~/stores/victimas/atenticacionStore';
import { useLogin } from '~/hooks/victima/useLogin';

export default function PaginaLogin() {
  const router = useRouter();
  const { sesionActiva, idVictima } = useAtenticacionStore();
  const { manejarLogin } = useLogin();

  // Navegación automática cuando hay sesión
  useEffect(() => {
    if (sesionActiva && idVictima) {
      // Pequeña demora para que el Root Layout se monte primero
      const timer = setTimeout(() => {
        router.push('/alerta');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [sesionActiva, idVictima, router]);

  return (
    <View className="flex-1 bg-background">
      <VerificarDenuncia verificar={manejarLogin} />
    </View>
  );
}
