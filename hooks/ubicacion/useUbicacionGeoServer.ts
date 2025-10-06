import { useState } from "react";
import { toast } from "sonner-native";
import { departamentoService } from "~/services/departamentoService";
import { usePerfilStore } from "~/stores/perfilStore";
import { useUbicacionDispositivo } from "./useUbicacionDispositivo";

export const useUbicacionGeoServer = () => {
  const [cargando, setCargando] = useState(false);
  const [ubicacionObtenida, setUbicacionObtenida] = useState(false);

  const { setDatosUbicacion } = usePerfilStore();
  const { obtenerUbicacionActual } = useUbicacionDispositivo();

  const ubicacionGeoServer = async () => {
    setCargando(true);

    try {
      const ubicacion = await obtenerUbicacionActual();

      if (!ubicacion) {
        throw new Error("No se pudo obtener la ubicación");
      }

      // Obtener información geográfica usando las coordenadas
      const posicion = {
        latitud: ubicacion.coords.latitude,
        longitud: ubicacion.coords.longitude,
      };

      const respuesta = await departamentoService.obtenerUbicacionPorCoordenadas(posicion);

      if (!respuesta.exito || !respuesta.datos) {
        throw new Error(respuesta.mensaje || "Error al obtener información geográfica");
      }

      setDatosUbicacion({
        idMunicipio: respuesta.datos.municipio.id.toString(),
        municipio: respuesta.datos.municipio.municipio,
        provincia: respuesta.datos.provincia.provincia,
        departamento: respuesta.datos.departamento.departamento,
      });

      setUbicacionObtenida(true);
      const mensajeExito = respuesta.error ? `${respuesta.mensaje} - ${respuesta.error}` : respuesta.mensaje;
      toast.success(mensajeExito);
    } catch (error: any) {
      const mensajeError = error instanceof Error ? error.message : "Error al obtener ubicación";
      toast.error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return {
    cargando,
    ubicacionObtenida,
    ubicacionGeoServer,
  };
};
