import { alertasApi } from '../base/alertasApi';
import { RespuestaVerificarDenuncia } from '../../lib/tiposApi';

export class DenunciasService {
  // Verificar que número de documento y CUD existen en el sistema de denuncias
  static async verificarDenuncia(numero_documento: string, cud: string): Promise<RespuestaVerificarDenuncia> {
    try {
      const payload = {
        codigo: cud,
        numero_documento: numero_documento,
      };

      const response = await alertasApi.post('/denuncias/verificar', payload);
      return response;
    } catch (error: any) {
      let mensaje = 'Error del servidor';

      if (error.message?.includes('404')) {
        mensaje = 'Denuncia no encontrada';
      } else if (error.message?.includes('400')) {
        mensaje = 'Datos inválidos';
      } else if (error.message?.includes('ECONNREFUSED')) {
        mensaje = 'No se puede conectar al servidor';
      }

      throw new Error(mensaje);
    }
  }

  // Verificar denuncia por código de denuncia y cédula de identidad
  static async verificarDenunciaPorCodigoYCedula(codigoDenuncia: string, cedulaIdentidad: string): Promise<RespuestaVerificarDenuncia> {
    try {
      const payload = {
        codigoDenuncia,
        cedulaIdentidad,
      };

      const response = await alertasApi.post('/verificar-denuncia', payload);
      return response;
    } catch (error: any) {
      let mensaje = 'Error del servidor';

      if (error.message?.includes('404')) {
        mensaje = 'Denuncia no encontrada';
      } else if (error.message?.includes('400')) {
        mensaje = 'Datos inválidos';
      } else if (error.message?.includes('ECONNREFUSED')) {
        mensaje = 'No se puede conectar al servidor';
      }

      throw new Error(mensaje);
    }
  }
}
