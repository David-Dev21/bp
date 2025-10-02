import { alertasApi } from "../base/alertasApi";
import { RespuestaCrearAlerta, RespuestaEstadoAlerta, EstadoAlerta } from "../../lib/tiposApi";

// Estados de una alerta
export type { EstadoAlerta };

export interface AlertaEmergencia {
  idVictima: string;
  fechaHora: string;
  codigoDenuncia: string;
  codigoRegistro: string;
  ubicacion?: {
    longitud: number;
    latitud: number;
    precision?: number;
    marcaTiempo: string;
  };
}

export interface AlertaActiva {
  idAlerta: string;
  estado: EstadoAlerta;
  fechaCreacion: string;
}

export class AlertaService {
  // Enviar alerta de emergencia
  static async enviarAlerta(datosAlerta: AlertaEmergencia): Promise<RespuestaCrearAlerta> {
    try {
      const response = await alertasApi.post("/alertas", datosAlerta);
      return response as RespuestaCrearAlerta;
    } catch (error: any) {
      let mensaje = "Error del servidor";

      if (error.message?.includes("404")) {
        mensaje = "Servicio no encontrado";
      } else if (error.message?.includes("400")) {
        mensaje = "Datos inválidos";
      } else if (error.message?.includes("ECONNREFUSED")) {
        mensaje = "No se puede conectar al servidor";
      }

      throw new Error(mensaje);
    }
  }

  // Consultar estado actual de una alerta
  static async consultarEstadoAlerta(idAlerta: string): Promise<RespuestaEstadoAlerta> {
    try {
      const response = await alertasApi.get(`/alertas/${idAlerta}/estado`);
      return response as RespuestaEstadoAlerta;
    } catch (error: any) {
      let mensaje = "Error del servidor";

      if (error.message?.includes("404")) {
        mensaje = "Alerta no encontrada";
      } else if (error.message?.includes("ECONNREFUSED")) {
        mensaje = "No se puede conectar al servidor";
      }

      throw new Error(mensaje);
    }
  }

  // Solicitar cancelación de alerta al backend
  static async solicitarCancelacionAlerta(idAlerta: string): Promise<boolean> {
    try {
      const response = await alertasApi.post(`/solicitudes-cancelacion`, {
        idAlerta,
        fechaSolicitud: this.obtenerFechaHoraISO(),
      });

      if (response?.exito) {
        return true;
      } else {
        throw new Error(response?.mensaje || "Error en cancelación");
      }
    } catch (error: any) {
      let mensaje = "Error del servidor";

      if (error.message?.includes("404")) {
        mensaje = "Alerta no encontrada";
      } else if (error.message?.includes("400")) {
        mensaje = "Datos inválidos";
      } else if (error.message?.includes("ECONNREFUSED")) {
        mensaje = "No se puede conectar al servidor";
      }

      throw new Error(mensaje);
    }
  }

  // Formatear fecha como ISO 8601
  static obtenerFechaHoraISO(): string {
    const now = new Date();
    return now.toISOString().replace("T", " ").replace("Z", "+00");
  }
}
