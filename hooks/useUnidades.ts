import { useState, useEffect } from "react";
import { UnidadPolicial } from "~/lib/tiposApi";
import { UnidadesService } from "~/services/unidadesService";

export function useUnidades() {
  const [unidades, setUnidades] = useState<UnidadPolicial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarUnidades();
  }, []);

  const cargarUnidades = async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await UnidadesService.obtenerUnidadesCercanas();
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
    cargarUnidades();
  };

  return {
    unidades,
    cargando,
    error,
    recargarUnidades,
  };
}
