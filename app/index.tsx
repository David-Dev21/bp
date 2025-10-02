import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import VerificarDenuncia from "~/components/inicio/VerificarDenuncia";
import { useAtenticacionStore } from "~/stores/victimas/atenticacionStore";
import { useLogin } from "~/hooks/victima/useLogin";

export default function PaginaLogin() {
  const router = useRouter();
  const { sesionActiva } = useAtenticacionStore();
  const { manejarLogin } = useLogin();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (montado && sesionActiva) {
      const timer = setTimeout(() => {
        router.replace("/alerta");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [montado, sesionActiva, router]);

  // Si hay sesión activa, mostrar loading mientras redirige
  if (sesionActiva) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#5a6a2f" />
      </View>
    );
  }

  // Si no hay sesión, mostrar formulario de verificación
  return (
    <View className="flex-1 bg-background">
      <VerificarDenuncia verificar={manejarLogin} />
    </View>
  );
}
