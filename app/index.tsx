import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import VerificarDenuncia from "~/components/inicio/VerificarDenuncia";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { useLogin } from "~/hooks/victima/useLogin";

export default function PaginaLogin() {
  const router = useRouter();
  const { sesionActiva } = useAtenticacionStore();
  const { manejarLogin, dispositivoDiferente, setDispositivoDiferente, manejarUsuarioPendiente } = useLogin();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (montado && sesionActiva) {
      router.replace("/alerta");
    }
  }, [montado, sesionActiva, router]);

  // Si hay sesión activa, redirigir inmediatamente
  if (sesionActiva) {
    return null;
  }

  const confirmarCambiarDispositivo = async () => {
    setDispositivoDiferente({ mostrar: false, idVictima: "" });
    if (dispositivoDiferente.idVictima) {
      await manejarUsuarioPendiente(dispositivoDiferente.idVictima);
    }
  };

  // Si no hay sesión, mostrar formulario de verificación
  return (
    <View className="flex-1 bg-background">
      <VerificarDenuncia verificar={manejarLogin} />

      <AlertDialog open={dispositivoDiferente.mostrar}>
        <AlertDialogContent className="w-4/5">
          <AlertDialogHeader>
            <AlertDialogTitle>Dispositivo Diferente</AlertDialogTitle>
            <AlertDialogDescription>
              Ya existe una sesión activa en otro dispositivo. ¿Deseas continuar en este dispositivo? Esto cerrará la sesión en el otro dispositivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setDispositivoDiferente({ mostrar: false, idVictima: "" })}>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmarCambiarDispositivo}>
              <Text>Continuar Aquí</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
