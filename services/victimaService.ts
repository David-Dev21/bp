import { alertasApi } from "./baseApi";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import {
  RespuestaVerificarVictima,
  RespuestaCrearVictima,
  RespuestaActualizarVictima,
  RespuestaObtenerPerfil,
  RespuestaVerificarCuenta,
  PerfilVictima,
} from "../lib/tiposApi";

export class VictimaService {
  // Verificar si ya existe el usuario en la app botón de pánico
  static async verificarVictimaPorCI(ci: string): Promise<RespuestaVerificarVictima> {
    return await alertasApi.get(`/victimas/verificar?ci=${ci}`);
  }

  // Obtener perfil completo por ID Víctima
  static async obtenerPerfilPorIdVictima(idVictima: string): Promise<RespuestaObtenerPerfil> {
    return await alertasApi.get(`/victimas/${idVictima}`);
  }

  // Registrar usuario en la app botón de pánico
  static async registrarVictima(profileData: PerfilVictima): Promise<RespuestaCrearVictima> {
    return await alertasApi.post("/victimas", profileData);
  }

  // Actualizar perfil de víctima
  static async actualizarVictima(idVictima: string, profileData: Partial<PerfilVictima>): Promise<RespuestaActualizarVictima> {
    const { apiKey } = useAtenticacionStore.getState();
    return await alertasApi.patch(`/victimas/${idVictima}/perfil`, profileData, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
  }
  // Actualizar perfil de víctima
  static async actualizarUbicacion(idVictima: string, profileData: Partial<PerfilVictima>): Promise<RespuestaActualizarVictima> {
    const { apiKey } = useAtenticacionStore.getState();
    return await alertasApi.patch(`/victimas/${idVictima}/ubicacion`, profileData, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
  }

  // Actualizar cuenta de víctima
  static async actualizarCuenta(idVictima: string, accountData: { idDispositivo: string; fcmToken: string }): Promise<RespuestaActualizarVictima> {
    const { apiKey } = useAtenticacionStore.getState();
    return await alertasApi.patch(`/victimas/${idVictima}/cuenta`, accountData, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
  }

  // Verificar estado de la cuenta
  static async verificarEstadoCuenta(idVictima: string): Promise<RespuestaVerificarCuenta> {
    return await alertasApi.get(`/victimas/${idVictima}/verificar-cuenta`);
  }

  // Actualizar contacto específico de emergencia
  static async actualizarContactoEmergencia(
    idVictima: string,
    idContacto: string,
    datosContacto: {
      parentesco: string;
      nombreCompleto: string;
      celular: string;
    }
  ): Promise<any> {
    const { apiKey } = useAtenticacionStore.getState();
    return await alertasApi.patch(`/victimas/${idVictima}/contactos/${idContacto}`, datosContacto, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
  }

  // Crear nuevo contacto de emergencia
  static async crearContactoEmergencia(
    idVictima: string,
    datosContacto: {
      parentesco: string;
      nombreCompleto: string;
      celular: string;
      principal: boolean;
    }
  ): Promise<any> {
    const { apiKey } = useAtenticacionStore.getState();
    return await alertasApi.post(`/victimas/${idVictima}/contactos`, datosContacto, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
  }

  // Eliminar contacto de emergencia
  static async eliminarContactoEmergencia(idVictima: string, idContacto: string): Promise<any> {
    const { apiKey } = useAtenticacionStore.getState();
    return await alertasApi.delete(`/victimas/${idVictima}/contactos/${idContacto}`, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
  }
}
