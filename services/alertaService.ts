import { baseApi, handleApiResponse } from "./baseApi";
import { RespuestaCrearAlerta, EstadoAlerta } from "../lib/tiposApi";

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
    const response = await baseApi.post("/alertas", datosAlerta);
    return handleApiResponse<RespuestaCrearAlerta>(response);
  }

  // Solicitar cancelación de alerta al backend
  static async solicitarCancelacionAlerta(idAlerta: string): Promise<void> {
    const response = await baseApi.post(`/solicitudes-cancelacion`, {
      idAlerta,
      fechaSolicitud: this.obtenerFechaHoraISO(),
    });
    handleApiResponse(response);
  }

  // Formatear fecha como ISO 8601
  static obtenerFechaHoraISO(): string {
    const now = new Date();
    return now.toISOString().replace("T", " ").replace("Z", "+00");
  }
}
