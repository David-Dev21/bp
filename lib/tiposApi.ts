// Estructura base de respuesta del backend
export interface RespuestaBase<T = unknown> {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos?: T;
  error?: string;
}

// Interfaces para unidades policiales
export interface UnidadPolicial {
  id: number;
  unidad: string;
  direccion: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  referencia: string;
  departamento: string;
  provincia: string;
  municipio: string;
  organismo: string;
}

// Respuesta para unidades policiales
export type RespuestaUnidadesPoliciales = RespuestaBase<{ unidades: UnidadPolicial[] }>;

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
export type RespuestaVerificarVictima = {
  existe: boolean;
  idVictima?: string;
  estadoCuenta?: EstadoCuenta;
  idDispositivo?: string;
};

export type RespuestaCrearVictima = { victima: { id: string } };

export type RespuestaActualizarVictima = { victima: { id: string } };

export type RespuestaObtenerPerfil = { victima: PerfilVictima };

export type RespuestaCrearAlerta = { alerta: { id: string; estadoAlerta: EstadoAlerta } };

export type RespuestaUbicacionGPS = DatosUbicacionGeografica;

export type RespuestaVerificarCuenta = { estadoCuenta: EstadoCuenta };

// Respuestas para denuncias
export type RespuestaVerificarDenuncia = { codigoValido: boolean };

// Respuestas para códigos de verificación
export type RespuestaSolicitarCodigo = void;

export type RespuestaVerificarCodigo = {
  victima: {
    id: string;
    apiKey: string;
  };
};
