import { baseApi, handleApiResponse } from "./baseApi";
import { RespuestaSolicitarCodigo, RespuestaVerificarCodigo } from "~/lib/tiposApi";

export class CodigoService {
  // Solicitar código por WhatsApp
  static async solicitarCodigo(celular: string): Promise<RespuestaSolicitarCodigo> {
    const response = await baseApi.post("/codigos/solicitar-codigo", { celular });
    return handleApiResponse<RespuestaSolicitarCodigo>(response);
  }

  // Verificar código
  static async verificarCodigo(celular: string, codigo: string): Promise<RespuestaVerificarCodigo> {
    const response = await baseApi.post("/codigos/verificar-codigo", { celular, codigo });
    return handleApiResponse<RespuestaVerificarCodigo>(response);
  }
}
