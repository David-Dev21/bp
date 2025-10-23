import { baseApi, handleApiResponse } from "./baseApi";
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
    const response = await baseApi.get(`/victimas/verificar?ci=${ci}`);
    return handleApiResponse<RespuestaVerificarVictima>(response);
  }

  // Obtener perfil completo por ID Víctima
  static async obtenerPerfilPorIdVictima(idVictima: string): Promise<RespuestaObtenerPerfil> {
    const response = await baseApi.get(`/victimas/${idVictima}`);
    return handleApiResponse<RespuestaObtenerPerfil>(response);
  }

  // Registrar usuario en la app botón de pánico
  static async registrarVictima(profileData: PerfilVictima): Promise<RespuestaCrearVictima> {
    const response = await baseApi.post("/victimas", profileData);
    return handleApiResponse<RespuestaCrearVictima>(response);
  }

  // Actualizar perfil de víctima
  static async actualizarVictima(idVictima: string, profileData: Partial<PerfilVictima>): Promise<RespuestaActualizarVictima> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.patch(`/victimas/${idVictima}/perfil`, profileData, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    return handleApiResponse<RespuestaActualizarVictima>(response);
  }
  // Actualizar perfil de víctima
  static async actualizarUbicacion(idVictima: string, profileData: Partial<PerfilVictima>): Promise<RespuestaActualizarVictima> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.patch(`/victimas/${idVictima}/ubicacion`, profileData, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    return handleApiResponse<RespuestaActualizarVictima>(response);
  }

  // Actualizar cuenta de víctima
  static async actualizarCuenta(
    idVictima: string,
    accountData: {
      idDispositivo?: string;
      fcmToken?: string;
      infoDispositivo?: { marca: string; modelo: string; versionSO: string; versionApp: string };
    }
  ): Promise<RespuestaActualizarVictima> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.patch(`/victimas/${idVictima}/cuenta`, accountData, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    return handleApiResponse<RespuestaActualizarVictima>(response);
  }

  // Actualizar información de contacto (celular y correo)
  static async actualizarContacto(idVictima: string, contactoData: { celular?: string; correo?: string }): Promise<RespuestaActualizarVictima> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.patch(`/victimas/${idVictima}/contacto`, contactoData, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    return handleApiResponse<RespuestaActualizarVictima>(response);
  }

  // Verificar estado de la cuenta
  static async verificarEstadoCuenta(idVictima: string): Promise<RespuestaVerificarCuenta> {
    const response = await baseApi.get(`/victimas/${idVictima}/verificar-cuenta`);
    return handleApiResponse<RespuestaVerificarCuenta>(response);
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
  ): Promise<void> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.patch(`/victimas/${idVictima}/contactos/${idContacto}`, datosContacto, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    handleApiResponse(response);
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
  ): Promise<void> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.post(`/victimas/${idVictima}/contactos`, datosContacto, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    handleApiResponse(response);
  }

  // Eliminar contacto de emergencia
  static async eliminarContactoEmergencia(idVictima: string, idContacto: string): Promise<void> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.delete(`/victimas/${idVictima}/contactos/${idContacto}`, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    handleApiResponse(response);
  }

  // Marcar contacto como principal
  static async marcarContactoPrincipal(idVictima: string, idContacto: string): Promise<void> {
    const { apiKey } = useAtenticacionStore.getState();
    const response = await baseApi.patch(
      `/victimas/${idVictima}/contactos/${idContacto}/principal`,
      {},
      {
        headers: {
          "X-API-Key": apiKey,
        },
      }
    );
    handleApiResponse(response);
  }
}
