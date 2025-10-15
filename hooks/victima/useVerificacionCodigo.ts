import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner-native";
import { CodigoService } from "~/services/codigoService";
import { VictimaService } from "~/services/victimaService";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { useFcmToken } from "~/hooks/useFcmToken";
import * as Device from "expo-device";
import Constants from "expo-constants";

export function useVerificacionCodigo() {
  const router = useRouter();
  const { setUsuario } = useAtenticacionStore();
  const { obtenerDatosCompletos } = usePerfilStore();
  const { obtenerTokenActual } = useFcmToken();

  const [codigo, setCodigo] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { datosPersonales } = obtenerDatosCompletos();
  const celular = datosPersonales.celular;

  // Crear array de refs para los inputs
  const inputRefs = Array.from({ length: 6 }, () => useRef<any>(null));

  const solicitarCodigo = async () => {
    if (!celular) {
      toast.error("No se encontró el número de celular");
      return;
    }

    setIsLoading(true);
    try {
      const result = await CodigoService.solicitarCodigo(celular);
      if (result.exito) {
        setCodigoEnviado(true);
        const mensajeExito = result.error ? `${result.mensaje} - ${result.error}` : result.mensaje;
        toast.success(mensajeExito);
      } else {
        const mensajeError = result.error ? `${result.mensaje} - ${result.error}` : result.mensaje;
        toast.error(mensajeError);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al solicitar código");
    } finally {
      setIsLoading(false);
    }
  };

  const verificarCodigo = async () => {
    if (!celular || codigo.length !== 6) {
      toast.error("Ingresa el código completo de 6 dígitos");
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
        const fcmToken = await obtenerTokenActual();
        const idVictima = useAtenticacionStore.getState().idVictima;

        if (!storedId || !idVictima) {
          toast.error("No se pudo obtener la información del dispositivo. Intenta nuevamente.");
          return;
        }

        try {
          await VictimaService.actualizarCuenta(idVictima, {
            idDispositivo: storedId,
            fcmToken: fcmToken || "",
            infoDispositivo: {
              marca: Device.brand || "Desconocido",
              modelo: Device.modelName || "Desconocido",
              versionSO: Device.osVersion || "Desconocido",
              versionApp: Constants.nativeAppVersion || "1.0.0",
            },
          });
        } catch (updateError) {
          toast.error("No se pudo activar tu cuenta. Verifica tu conexión e intenta nuevamente.");
          return;
        }

        const mensajeExito = result.error ? `${result.mensaje} - ${result.error}` : result.mensaje;
        toast.success(mensajeExito);
        // Navegar después de un pequeño delay para que se vea el toast
        setTimeout(() => {
          router.replace("/alerta");
        }, 500);
      } else {
        const mensajeError = result.error ? `${result.mensaje} - ${result.error}` : result.mensaje;
        toast.error(mensajeError);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al verificar código");
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
