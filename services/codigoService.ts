import { alertasApi } from "./baseApi";
import { RespuestaSolicitarCodigo, RespuestaVerificarCodigo } from "~/lib/tiposApi";

export class CodigoService {
  // Solicitar código por WhatsApp
  static async solicitarCodigo(celular: string): Promise<RespuestaSolicitarCodigo> {
    return await alertasApi.post("/codigos/solicitar-codigo", { celular });
  }

  // Verificar código
  static async verificarCodigo(celular: string, codigo: string): Promise<RespuestaVerificarCodigo> {
    return await alertasApi.post("/codigos/verificar-codigo", { celular, codigo });
  }
}
