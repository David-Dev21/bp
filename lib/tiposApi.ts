// Tipos e interfaces comunes para respuestas de API
export interface RespuestaBase<T = any> {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos?: T;
  error?: string;
}

// Interfaces para unidades policiales
export interface UnidadPolicial {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

// Respuesta para unidades policiales
export interface RespuestaUnidadesPoliciales extends RespuestaBase<{ unidades: UnidadPolicial[] }> {}

// Tipos específicos para datos comunes
export interface DatosMunicipio {
  id: number;
  municipio: string;
}

export interface DatosProvincia {
  id: number;
  provincia: string;
}

export interface DatosDepartamento {
  id: number;
  departamento: string;
}

export interface DatosUbicacionGeografica {
  municipio: DatosMunicipio;
  provincia: DatosProvincia;
  departamento: DatosDepartamento;
}

// Estados de alerta
export type EstadoAlerta = "PENDIENTE" | "ASIGNADA" | "EN_ATENCION" | "RESUELTA" | "CANCELADA" | "FALSA_ALERTA";

// Estados de cuenta
export type EstadoCuenta = "ACTIVA" | "INACTIVA" | "SUSPENDIDA" | "PENDIENTE_VERIFICACION";

// Interfaces para víctimas
export interface ContactoEmergencia {
  id?: string;
  parentesco: string;
  nombreCompleto: string;
  celular: string;
  principal?: boolean;
}

export interface DireccionVictima {
  zona?: string;
  calle?: string;
  numero?: string;
  referencia?: string;
}

export interface PerfilVictima {
  id?: string;
  cedulaIdentidad?: string;
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  celular?: string;
  correo?: string;
  idMunicipio?: number;
  municipio?: string;
  provincia?: string;
  departamento?: string;
  direccion?: DireccionVictima;
  estadoCuenta?: EstadoCuenta;
  fechaRegistro?: string;
  idDispositivo?: string;
  fcmToken?: string;
  apiKey?: string;
  contactosEmergencia?: ContactoEmergencia[];
}

// Interfaces específicas para respuestas de víctimas
export interface RespuestaVerificarVictima
  extends RespuestaBase<{ existe: boolean; idVictima?: string; estadoCuenta?: EstadoCuenta; idDispositivo?: string }> {}

export interface RespuestaCrearVictima extends RespuestaBase<{ victima: { id: string } }> {}

export interface RespuestaActualizarVictima extends RespuestaBase<{ victima: { id: string } }> {}

export interface RespuestaObtenerPerfil extends RespuestaBase<{ victima: PerfilVictima }> {}

export interface RespuestaCrearAlerta extends RespuestaBase<{ alerta: { id: string; estadoAlerta: EstadoAlerta } }> {}

export interface RespuestaEstadoAlerta extends RespuestaBase<{ estadoAlerta: EstadoAlerta }> {}

export interface RespuestaUbicacionGPS extends RespuestaBase<DatosUbicacionGeografica> {}

export interface RespuestaVerificarCuenta extends RespuestaBase<{ estadoCuenta: EstadoCuenta }> {}

// Respuestas para denuncias
export interface RespuestaVerificarDenuncia extends RespuestaBase<{ codigoValido: boolean }> {}

// Respuestas para códigos de verificación
export interface RespuestaSolicitarCodigo extends RespuestaBase {}

export interface RespuestaVerificarCodigo
  extends RespuestaBase<{
    victima: {
      id: string;
      apiKey: string;
    };
  }> {}
