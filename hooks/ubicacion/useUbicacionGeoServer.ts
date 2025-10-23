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
      // obtenerUbicacionPorCoordenadas now returns DatosUbicacionGeografica directly

      setDatosUbicacion({
        idMunicipio: respuesta.municipio.id.toString(),
        municipio: respuesta.municipio.municipio,
        provincia: respuesta.provincia.provincia,
        departamento: respuesta.departamento.departamento,
      });

      setUbicacionObtenida(true);
      toast.success("Ubicación obtenida exitosamente");
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
