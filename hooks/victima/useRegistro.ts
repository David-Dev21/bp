import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { VictimaService } from '~/services/victima/victimaService';
import { PerfilVictima } from '~/lib/tiposApi';
import { useRegistroStore } from '~/stores/registro/registroStore';
import { generarDatosDispositivo } from '~/lib/utils';

interface DatosRegistro {
  cedulaIdentidad: string;
  codigoDenuncia: string;
  esEdicion?: boolean;
  idVictima?: string;
}

export function useRegistro(registroDatos?: DatosRegistro) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { limpiarDatos } = useRegistroStore();

  const handleRegistro = useCallback(
    async (datos: Partial<PerfilVictima>) => {
      if (!registroDatos?.cedulaIdentidad || !registroDatos?.codigoDenuncia) {
        Alert.alert('Error', 'Datos incompletos.');
        return { exito: false, mensaje: 'Datos incompletos', codigo: 400 }; // Mantener consistencia con RespuestaBase
      }
      setIsLoading(true);
      try {
        // Generar datos del dispositivo automáticamente
        const datosDispositivo = await generarDatosDispositivo();

        // Combinar datos del formulario con datos del dispositivo
        const datosCompletos: PerfilVictima = {
          ...datos,
          idDispositivo: datosDispositivo.idDispositivo,
          ...(datosDispositivo.pushToken && { fcmToken: datosDispositivo.pushToken }),
        };

        const result = await VictimaService.registrarVictima(datosCompletos);

        if (result.exito && result.datos?.victima.id) {
          // No guardar en store aquí, se hace después de verificar código
          Alert.alert('¡Éxito!', 'Registro completado correctamente. Ahora verifica tu código.', [
            {
              text: 'OK',
              onPress: () => {
                limpiarDatos();
                router.push('/solicitar-codigo' as any);
              },
            },
          ]);
          return result;
        } else {
          Alert.alert('Error', result.mensaje || 'No se pudo registrar.');
          return result;
        }
      } catch (error) {
        const mensajeError = error instanceof Error ? error.message : 'Algo salió mal.';
        return { exito: false, mensaje: mensajeError, codigo: 500 }; // Mantener consistencia con RespuestaBase
      } finally {
        setIsLoading(false);
      }
    },
    [registroDatos, router],
  );

  const handleActualizacion = useCallback(
    async (datos: Partial<PerfilVictima>) => {
      if (!registroDatos?.idVictima) {
        Alert.alert('Error', 'Usuario no identificado.');
        return { exito: false, mensaje: 'Usuario no identificado', codigo: 400 }; // Mantener consistencia con RespuestaBase
      }

      setIsLoading(true);

      try {
        const result = await VictimaService.actualizarVictima(registroDatos.idVictima, datos);

        if (result.exito) {
          Alert.alert('¡Éxito!', 'Perfil actualizado correctamente.', [
            {
              text: 'OK',
              onPress: () => {
                router.push('/perfil');
              },
            },
          ]);
          return result;
        } else {
          Alert.alert('Error', 'No se pudo actualizar.');
          return result; // Devolver directamente la respuesta de la API
        }
      } catch (error) {
        const mensajeError = error instanceof Error ? error.message : 'Algo salió mal.';
        return { exito: false, mensaje: mensajeError, codigo: 500 }; // Mantener consistencia con RespuestaBase
      } finally {
        setIsLoading(false);
      }
    },
    [registroDatos, router],
  );

  return {
    isLoading,
    handleRegistro,
    handleActualizacion,
  };
}
