import { alertasApi } from "./baseApi";
import { RespuestaCrearAlerta, RespuestaEstadoAlerta, EstadoAlerta, RespuestaBase } from "../lib/tiposApi";

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
    return await alertasApi.post("/alertas", datosAlerta);
  }

  // Consultar estado actual de una alerta
  static async consultarEstadoAlerta(idAlerta: string): Promise<RespuestaEstadoAlerta> {
    return await alertasApi.get(`/alertas/${idAlerta}/estado`);
  }

  // Solicitar cancelación de alerta al backend
  static async solicitarCancelacionAlerta(idAlerta: string): Promise<RespuestaBase> {
    return await alertasApi.post(`/solicitudes-cancelacion`, {
      idAlerta,
      fechaSolicitud: this.obtenerFechaHoraISO(),
    });
  }

  // Formatear fecha como ISO 8601
  static obtenerFechaHoraISO(): string {
    const now = new Date();
    return now.toISOString().replace("T", " ").replace("Z", "+00");
  }
}
