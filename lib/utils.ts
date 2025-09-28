import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generar ID único del dispositivo
export async function generarIdDispositivo(): Promise<string> {
  try {
    // Usar installationId de Expo como base
    const baseId = Constants.installationId || `fallback-${Date.now()}`;

    // Crear ID único combinando platform, installationId y timestamp
    const deviceId = `${Platform.OS}-${baseId.slice(0, 8)}-${Date.now().toString().slice(-6)}`;

    return deviceId;
  } catch (error) {
    // Fallback final
    return `device-fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Obtener o generar ID único del dispositivo desde AsyncStorage
export async function obtenerIdDispositivo(): Promise<string> {
  try {
    const storedId = await AsyncStorage.getItem('id_dispositivo');
    if (storedId) {
      return storedId;
    }
    // Si no existe, generar uno nuevo y guardarlo
    const newId = await generarIdDispositivo();
    await AsyncStorage.setItem('id_dispositivo', newId);
    return newId;
  } catch (error) {
    // Fallback si hay error con AsyncStorage
    return await generarIdDispositivo();
  }
}

// Obtener token de Expo Push (NO FCM token)
export async function obtenerExpoPushToken(): Promise<string | null> {
  try {
    // Verificar que sea un dispositivo físico
    if (!Device.isDevice) {
      throw new Error('Debe usar un dispositivo físico para notificaciones push');
    }

    // Configurar canal de notificaciones para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Notificaciones de Emergencia',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        showBadge: true,
      });
    }

    // Solicitar permisos para notificaciones
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permisos de notificación no concedidos. Habilite las notificaciones en configuración.');
    }

    // Obtener projectId de EAS
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      throw new Error('Project ID de EAS no encontrado. Configure su proyecto en EAS.');
    }

    // Obtener el token de Expo (NO el nativo FCM)
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const token = tokenData.data;
    return token;
  } catch (error) {
    throw error;
  }
}

// Generar datos de dispositivo completos
export async function generarDatosDispositivo() {
  const [idDispositivo, expoPushToken] = await Promise.all([obtenerIdDispositivo(), obtenerExpoPushToken()]);

  return {
    idDispositivo,
    pushToken: expoPushToken, // Cambiado el nombre para claridad
  };
}
