import { alertasApi } from '../base/alertasApi';

export interface RespuestaSolicitarCodigo {
  exito: boolean;
  codigo: number;
  mensaje: string;
}

export interface RespuestaVerificarCodigo {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos?: {
    victima: {
      id: string;
      apiKey: string;
    };
  };
}

export class CodigoService {
  // Solicitar código por WhatsApp
  static async solicitarCodigo(celular: string): Promise<RespuestaSolicitarCodigo> {
    try {
      const response = await alertasApi.post('/codigos/solicitar-codigo', { celular });
      return response;
    } catch (error: any) {
      const datosError = error.response?.data?.datos || error.response?.data;
      if (datosError?.error) {
        throw new Error(datosError.error);
      }
      if (datosError?.mensaje) {
        throw new Error(datosError.mensaje);
      }
      throw new Error('Error al solicitar código');
    }
  }

  // Verificar código
  static async verificarCodigo(celular: string, codigo: string): Promise<RespuestaVerificarCodigo> {
    try {
      const response = await alertasApi.post('/codigos/verificar-codigo', { celular, codigo });
      return response;
    } catch (error: any) {
      const datosError = error.response?.data?.datos || error.response?.data;
      if (datosError?.error) {
        throw new Error(datosError.error);
      }
      if (datosError?.mensaje) {
        throw new Error(datosError.mensaje);
      }
      throw new Error('Error al verificar código');
    }
  }
}
