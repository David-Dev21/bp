import { useState, useRef } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CodigoService } from "~/services/codigos/codigoService";
import { VictimaService } from "~/services/victima/victimaService";
import { useAtenticacionStore } from "~/stores/victimas/atenticacionStore";
import { useRegistroStore } from "~/stores/registro/registroStore";
import { obtenerExpoPushToken } from "~/lib/utils";

export function useVerificacionCodigo() {
  const router = useRouter();
  const { setUsuario } = useAtenticacionStore();
  const { obtenerDatosCompletos } = useRegistroStore();

  const [codigo, setCodigo] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { datosPersonales } = obtenerDatosCompletos();
  const celular = datosPersonales.celular;

  // Crear array de refs para los inputs
  const inputRefs = Array.from({ length: 6 }, () => useRef<any>(null));

  const solicitarCodigo = async () => {
    if (!celular) {
      Alert.alert("Error", "No se encontró el número de celular");
      return;
    }

    setIsLoading(true);
    try {
      const result = await CodigoService.solicitarCodigo(celular);
      if (result.exito) {
        setCodigoEnviado(true);
        Alert.alert("Código enviado", result.mensaje || "Revisa tu WhatsApp para el código de verificación");
      } else {
        Alert.alert("Error", result.mensaje || "No se pudo enviar el código");
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Error al solicitar código");
    } finally {
      setIsLoading(false);
    }
  };

  const verificarCodigo = async () => {
    if (!celular || codigo.length !== 6) {
      Alert.alert("Error", "Ingresa el código completo de 6 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      const result = await CodigoService.verificarCodigo(celular, codigo);
      if (result.exito && result.datos?.victima) {
        // Guardar en store de autenticación (se persiste automáticamente)
        setUsuario(result.datos.victima.id, result.datos.victima.apiKey);

        // Activar cuenta con dispositivo y tokens
        const storedId = await AsyncStorage.getItem("id_dispositivo");
        const fcmToken = await obtenerExpoPushToken();
        const idVictima = useAtenticacionStore.getState().idVictima;

        if (!storedId || !idVictima) {
          Alert.alert("Error", "No se pudo obtener la información del dispositivo. Intenta nuevamente.");
          return;
        }

        try {
          await VictimaService.activarCuentaVictima(idVictima, {
            apiKey: result.datos.victima.apiKey,
            idDispositivo: storedId,
            fcmToken: fcmToken || undefined,
            estadoCuenta: "ACTIVA",
          });
        } catch (updateError) {
          Alert.alert("Error", "No se pudo activar tu cuenta. Verifica tu conexión e intenta nuevamente.");
          return;
        }

        Alert.alert("¡Verificación exitosa!", result.mensaje || "Tu cuenta ha sido verificada correctamente.", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/alerta");
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.mensaje || "Código incorrecto");
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Error al verificar código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (text: string, index: number) => {
    // Solo permitir números
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText.length > 1) return; // Solo un dígito por input

    // Actualizar el código
    const newCodigo = codigo.split("");
    newCodigo[index] = numericText;
    const updatedCodigo = newCodigo.join("");
    setCodigo(updatedCodigo);

    // Auto-focus al siguiente input si se ingresó un dígito
    if (numericText && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleInputKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !codigo[index] && index > 0) {
      // Si se presiona backspace en un input vacío, ir al anterior
      inputRefs[index - 1].current?.focus();
    }
  };

  return {
    codigo,
    codigoEnviado,
    isLoading,
    celular,
    inputRefs,
    solicitarCodigo,
    verificarCodigo,
    handleInputChange,
    handleInputKeyPress,
  };
}
