import { create } from 'zustand';

export interface DatosPersonales {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  celular: string;
  correo: string;
  fechaRegistro?: string;
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

  // Estado de validación
  validacionPasos: {
    paso1: boolean;
    paso2: boolean;
    paso3: boolean;
  };

  // Acciones para datos personales
  setDatosPersonales: (datos: Partial<DatosPersonales>) => void;
  validarPaso1: (esValido: boolean) => void;

  // Acciones para datos de ubicación
  setDatosUbicacion: (datos: Partial<DatosUbicacion>) => void;
  validarPaso2: (esValido: boolean) => void;

  // Acciones para contactos de emergencia
  setContactosEmergencia: (contactos: ContactoEmergencia[]) => void;
  validarPaso3: (esValido: boolean) => void;

  // Utilidades
  limpiarDatos: () => void;
  obtenerDatosCompletos: () => {
    datosPersonales: DatosPersonales;
    datosUbicacion: DatosUbicacion;
    contactosEmergencia: ContactoEmergencia[];
  };
}

const estadoInicialDatosPersonales: DatosPersonales = {
  cedulaIdentidad: '',
  nombres: 'Vanessa',
  apellidos: 'Pérez García',
  fechaNacimiento: '',
  celular: '79550230',
  correo: 'juan.perez@email.com',
  fechaRegistro: new Date().toISOString(),
};

const estadoInicialDatosUbicacion: DatosUbicacion = {
  idMunicipio: '',
  municipio: '',
  provincia: '',
  departamento: '',
  direccion: {
    zona: 'Villa Fátima',
    calle: 'Calle 21 de Calacoto',
    numero: '1234',
    referencia: 'Cerca del mercado central',
  },
};

const estadoInicialContactosEmergencia: ContactoEmergencia[] = [
  {
    parentesco: 'Madre',
    nombre: 'María González Pérez',
    telefono: '70123456',
    esPrincipal: true,
  },
];

const estadoInicialValidacion = {
  paso1: false,
  paso2: false,
  paso3: false,
};

export const useRegistroStore = create<EstadoRegistro>((set, get) => ({
  // Estado inicial
  datosPersonales: estadoInicialDatosPersonales,
  datosUbicacion: estadoInicialDatosUbicacion,
  contactosEmergencia: estadoInicialContactosEmergencia,
  validacionPasos: estadoInicialValidacion,

  // Acciones para datos personales
  setDatosPersonales: (datos) =>
    set((state) => ({
      datosPersonales: { ...state.datosPersonales, ...datos },
    })),

  validarPaso1: (esValido) =>
    set((state) => ({
      validacionPasos: { ...state.validacionPasos, paso1: esValido },
    })),

  // Acciones para datos de ubicación
  setDatosUbicacion: (datos: Partial<DatosUbicacion>) =>
    set((state) => ({
      datosUbicacion: { ...state.datosUbicacion, ...datos },
    })),

  validarPaso2: (esValido) =>
    set((state) => ({
      validacionPasos: { ...state.validacionPasos, paso2: esValido },
    })),

  // Acciones para contactos de emergencia
  setContactosEmergencia: (contactos: ContactoEmergencia[]) =>
    set(() => ({
      contactosEmergencia: contactos,
    })),

  validarPaso3: (esValido) =>
    set((state) => ({
      validacionPasos: { ...state.validacionPasos, paso3: esValido },
    })),

  // Utilidades
  limpiarDatos: () =>
    set(() => ({
      datosPersonales: estadoInicialDatosPersonales,
      datosUbicacion: estadoInicialDatosUbicacion,
      contactosEmergencia: estadoInicialContactosEmergencia,
      validacionPasos: estadoInicialValidacion,
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
