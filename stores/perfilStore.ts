import { create } from "zustand";

export interface DatosPersonales {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  celular: string;
  correo: string;
  fechaRegistro?: string;
  codigoDenuncia?: string;
}

export interface DatosUbicacion {
  idMunicipio?: string;
  municipio?: string;
  provincia?: string;
  departamento?: string;
  direccion: {
    zona: string;
    calle: string;
    numero: string;
    referencia: string;
  };
}

export interface ContactoEmergencia {
  id?: string;
  parentesco: string;
  nombre: string;
  telefono: string;
  esPrincipal: boolean;
}

interface EstadoRegistro {
  // Datos del registro
  datosPersonales: DatosPersonales;
  datosUbicacion: DatosUbicacion;
  contactosEmergencia: ContactoEmergencia[];

  // Acciones para datos personales
  setDatosPersonales: (datos: Partial<DatosPersonales>) => void;

  // Acciones para datos de ubicación
  setDatosUbicacion: (datos: Partial<DatosUbicacion>) => void;

  // Acciones para contactos de emergencia
  setContactosEmergencia: (contactos: ContactoEmergencia[]) => void;

  // Utilidades
  limpiarDatos: () => void;
  obtenerDatosCompletos: () => {
    datosPersonales: DatosPersonales;
    datosUbicacion: DatosUbicacion;
    contactosEmergencia: ContactoEmergencia[];
  };
}

const estadoInicialDatosPersonales: DatosPersonales = {
  cedulaIdentidad: "",
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  celular: "",
  correo: "",
  fechaRegistro: new Date().toISOString(),
};

const estadoInicialDatosUbicacion: DatosUbicacion = {
  idMunicipio: "",
  municipio: "",
  provincia: "",
  departamento: "",
  direccion: {
    zona: "",
    calle: "",
    numero: "",
    referencia: "",
  },
};

const estadoInicialContactosEmergencia: ContactoEmergencia[] = [];

export const usePerfilStore = create<EstadoRegistro>((set, get) => ({
  // Estado inicial
  datosPersonales: estadoInicialDatosPersonales,
  datosUbicacion: estadoInicialDatosUbicacion,
  contactosEmergencia: estadoInicialContactosEmergencia,

  // Acciones para datos personales
  setDatosPersonales: (datos) =>
    set((state) => ({
      datosPersonales: { ...state.datosPersonales, ...datos },
    })),

  // Acciones para datos de ubicación
  setDatosUbicacion: (datos: Partial<DatosUbicacion>) =>
    set((state) => ({
      datosUbicacion: { ...state.datosUbicacion, ...datos },
    })),

  // Acciones para contactos de emergencia
  setContactosEmergencia: (contactos: ContactoEmergencia[]) =>
    set(() => ({
      contactosEmergencia: contactos,
    })),

  // Utilidades
  limpiarDatos: () =>
    set(() => ({
      datosPersonales: estadoInicialDatosPersonales,
      datosUbicacion: estadoInicialDatosUbicacion,
      contactosEmergencia: estadoInicialContactosEmergencia,
    })),

  obtenerDatosCompletos: () => {
    const state = get();
    return {
      datosPersonales: state.datosPersonales,
      datosUbicacion: state.datosUbicacion,
      contactosEmergencia: state.contactosEmergencia,
    };
  },
}));
