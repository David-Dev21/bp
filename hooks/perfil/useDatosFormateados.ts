import { useMemo } from "react";
import { formateadorFecha } from "~/lib/formato/formateadorFecha";
import { DatosPersonales, DatosUbicacion, ContactoEmergencia } from "~/stores/perfilStore";

export function useDatosFormateados(datosPersonales: DatosPersonales, datosUbicacion: DatosUbicacion) {
  const fechaNacimientoFormateada = useMemo(() => {
    if (!datosPersonales.fechaNacimiento) return "No especificado";
    return formateadorFecha.formatearFechaLocal(new Date(datosPersonales.fechaNacimiento));
  }, [datosPersonales.fechaNacimiento]);

  const edadCalculada = useMemo(() => {
    if (!datosPersonales.fechaNacimiento) return "No especificado";
    const edadEnAnios = Math.floor((new Date().getTime() - new Date(datosPersonales.fechaNacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    return `${edadEnAnios} años`;
  }, [datosPersonales.fechaNacimiento]);

  const ubicacionCompleta = useMemo(() => {
    const { municipio, provincia, departamento } = datosUbicacion;
    return `${municipio || "No especificado"}, ${provincia || "No especificado"}, ${departamento || "No especificado"}`;
  }, [datosUbicacion]);

  const direccionCompleta = useMemo(() => {
    const { direccion } = datosUbicacion;
    let direccionTexto = `${direccion.calle} ${direccion.numero}`;

    if (direccion.zona) {
      direccionTexto += `, ${direccion.zona}`;
    }

    if (direccion.referencia) {
      direccionTexto += ` (${direccion.referencia})`;
    }

    return direccionTexto;
  }, [datosUbicacion.direccion]);

  const nombreCompleto = useMemo(() => {
    const { nombres, apellidos } = datosPersonales;
    return nombres && apellidos ? `${nombres} ${apellidos}` : "Mi Perfil";
  }, [datosPersonales.nombres, datosPersonales.apellidos]);

  return {
    fechaNacimientoFormateada,
    edadCalculada,
    ubicacionCompleta,
    direccionCompleta,
    nombreCompleto,
  };
}
