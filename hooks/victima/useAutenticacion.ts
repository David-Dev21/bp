import { useState } from 'react';
import { Alert } from 'react-native';
import { DenunciasService } from '~/services/victima/denunciasService';
import { VictimaService } from '~/services/victima/victimaService';

export const useAutenticacion = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (numero_documento: string, cud: string) => {
    setIsLoading(true);

    try {
      const result = await DenunciasService.verificarDenuncia(numero_documento, cud);

      if (result.exito) {
        const verificacion = await VictimaService.verificarVictimaPorCI(numero_documento);

        if (verificacion.exito && verificacion.datos?.existe && verificacion.datos.idVictima) {
          return { success: true, idVictima: verificacion.datos.idVictima };
        } else {
          Alert.alert('Usuario no encontrado', 'No encontramos tu registro. Regístrate primero.');
          return { success: false, message: 'Usuario no encontrado' };
        }
      } else {
        Alert.alert('Denuncia inválida', 'El código de denuncia no es válido.');
        return { success: false, message: 'Denuncia inválida' };
      }
    } catch (error) {
      Alert.alert('Error', 'Algo salió mal. Intenta nuevamente.');
      return { success: false, message: 'Error desconocido' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
  };
};
