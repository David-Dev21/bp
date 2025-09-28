import { alertasApi } from '../base/alertasApi';
import * as Location from 'expo-location';
import { RespuestaUbicacionGPS } from '../../lib/tiposApi';

export interface PosicionGPS {
  latitud: number;
  longitud: number;
}

export class GPSUbicacionService {
  static async obtenerUbicacionActual() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Permisos de ubicación denegados');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return location;
    } catch (error: any) {
      let mensaje = 'Error al obtener ubicación';

      if (error.message?.includes('denegados')) {
        mensaje = 'Permisos de ubicación denegados';
      } else if (error.message?.includes('timeout')) {
        mensaje = 'Tiempo agotado al obtener ubicación';
      }

      throw new Error(mensaje);
    }
  }

  static async obtenerUbicacionPorCoordenadas(posicion: PosicionGPS): Promise<RespuestaUbicacionGPS> {
    try {
      const response = await alertasApi.get(`/departamentos/encontrar?latitud=${posicion.latitud}&longitud=${posicion.longitud}`);
      return response;
    } catch (error: any) {
      let mensaje = 'Error del servidor';

      if (error.message?.includes('404')) {
        mensaje = 'Ubicación no encontrada';
      } else if (error.message?.includes('400')) {
        mensaje = 'Coordenadas inválidas';
      } else if (error.message?.includes('ECONNREFUSED')) {
        mensaje = 'No se puede conectar al servidor';
      }

      throw new Error(mensaje);
    }
  }
}
