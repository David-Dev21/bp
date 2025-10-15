import { useState, useEffect } from "react";
import { UnidadPolicial } from "~/lib/tiposApi";
import { UnidadesService } from "~/services/unidadesService";

export function useUnidades(latitud?: number, longitud?: number) {
  const [unidades, setUnidades] = useState<UnidadPolicial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitud !== undefined && longitud !== undefined) {
      cargarUnidades(latitud, longitud);
    }
  }, [latitud, longitud]);

  const cargarUnidades = async (lat: number, lon: number) => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await UnidadesService.obtenerUnidadesCercanas(lat, lon);
      if (respuesta.exito && respuesta.datos) {
        setUnidades(respuesta.datos.unidades);
      } else {
        setError(respuesta.mensaje || "Error al cargar unidades policiales");
      }
    } catch (err) {
      setError("Error al cargar unidades policiales");
      console.error("Error cargando unidades:", err);
    } finally {
      setCargando(false);
    }
  };

  const recargarUnidades = () => {
    if (latitud !== undefined && longitud !== undefined) {
      cargarUnidades(latitud, longitud);
    }
  };

  return {
    unidades,
    cargando,
    error,
    recargarUnidades,
  };
}
