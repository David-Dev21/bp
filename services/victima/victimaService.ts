import { alertasApi } from '../base/alertasApi';
import {
  RespuestaVerificarVictima,
  RespuestaCrearVictima,
  RespuestaActualizarVictima,
  RespuestaObtenerPerfil,
  RespuestaVerificarCuenta,
  PerfilVictima,
} from '../../lib/tiposApi';

export class VictimaService {
  // Verificar si ya existe el usuario en la app botón de pánico
  static async verificarVictimaPorCI(ci: string): Promise<RespuestaVerificarVictima> {
    try {
      const response = await alertasApi.get(`/victimas/verificar?ci=${ci}`);
      return response;
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return {
          exito: false,
          codigo: 404,
          mensaje: 'Usuario no encontrado',
          datos: { existe: false },
        };
      }
      throw new Error('Error al verificar usuario');
    }
  }

  // Obtener perfil completo por ID Víctima
  static async obtenerPerfilPorIdVictima(idVictima: string): Promise<RespuestaObtenerPerfil> {
    try {
      const response = await alertasApi.get(`/victimas/${idVictima}`);
      return response;
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return {
          exito: false,
          codigo: 404,
          mensaje: 'Usuario no encontrado',
          datos: undefined,
        };
      }
      throw new Error('Error al obtener perfil');
    }
  }

  // Registrar usuario en la app botón de pánico
  static async registrarVictima(profileData: PerfilVictima): Promise<RespuestaCrearVictima> {
    try {
      const response = await alertasApi.post('/victimas', profileData);
      return response;
    } catch (error: any) {
      // Solo usar el mensaje de error que viene del servidor
      const datosError = error.response?.data?.datos || error.response?.data;
      if (datosError?.error) {
        throw new Error(datosError.error);
      }
      if (datosError?.mensaje) {
        throw new Error(datosError.mensaje);
      }
      // Si no hay mensaje específico del servidor, usar genérico
      throw new Error('Error del servidor');
    }
  }

  // Actualizar perfil de víctima
  static async actualizarVictima(idVictima: string, profileData: Partial<PerfilVictima>): Promise<RespuestaActualizarVictima> {
    try {
      const response = await alertasApi.patch(`/victimas/${idVictima}`, profileData);
      return response;
    } catch (error: any) {
      // Solo usar el mensaje de error que viene del servidor
      const datosError = error.response?.data?.datos || error.response?.data;
      if (datosError?.error) {
        throw new Error(datosError.error);
      }
      if (datosError?.mensaje) {
        throw new Error(datosError.mensaje);
      }
      // Si no hay mensaje específico del servidor, usar genérico
      throw new Error('Error del servidor');
    }
  }

  // Verificar estado de la cuenta
  static async verificarEstadoCuenta(idVictima: string): Promise<RespuestaVerificarCuenta> {
    try {
      const response = await alertasApi.get(`/victimas/${idVictima}/verificar-cuenta`);
      return response;
    } catch (error: any) {
      throw new Error('Error al verificar estado de cuenta');
    }
  }
}
