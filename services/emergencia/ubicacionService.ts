import { alertasApi } from '../base/alertasApi';
import { RespuestaBase } from '../../lib/tiposApi';

export interface Coordenadas {
  longitud: number;
  latitud: number;
}

export interface EnvioUbicacion {
  idAlerta: string;
  coordenadas: Coordenadas;
}

export class UbicacionService {
  /**
   * Envía la ubicación actual a la API
   */
  static async enviarUbicacion(datos: EnvioUbicacion): Promise<RespuestaBase> {
    try {
      const respuesta = await alertasApi.post('/ruta-alerta/punto', datos);
      return respuesta;
    } catch (error: any) {
      let mensaje = 'Error del servidor';

      if (error.message?.includes('404')) {
        mensaje = 'Servicio no encontrado';
      } else if (error.message?.includes('400')) {
        mensaje = 'Datos inválidos';
      } else if (error.message?.includes('ECONNREFUSED')) {
        mensaje = 'No se puede conectar al servidor';
      }

      throw new Error(mensaje);
    }
  }
}
