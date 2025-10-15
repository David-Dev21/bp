import { alertasApi } from "./baseApi";
import { RespuestaVerificarDenuncia } from "~/lib/tiposApi";

export class DenunciasService {
  // Verificar que número de documento y CUD existen en el sistema de denuncias
  static async verificarDenuncia(numero_documento: string, cud: string): Promise<RespuestaVerificarDenuncia> {
    const payload = {
      codigo: cud,
      numero_documento: numero_documento,
    };
    return await alertasApi.post("/denuncias/verificar", payload);
  }

  // Verificar denuncia por código de denuncia y cédula de identidad
  static async verificarDenunciaPorCodigoYCedula(codigoDenuncia: string, cedulaIdentidad: string): Promise<RespuestaVerificarDenuncia> {
    const payload = {
      codigoDenuncia,
      cedulaIdentidad,
    };
    return await alertasApi.post("/verificar-denuncia", payload);
  }
}
