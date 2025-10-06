import { useState, useMemo, useRef, useEffect, RefObject } from "react";
import { CameraRef } from "@maplibre/maplibre-react-native";
import { UnidadPolicial } from "~/lib/tiposApi";
import { useUbicacionDispositivo } from "~/hooks/ubicacion/useUbicacionDispositivo";
import { navegacionService, RutaNavegacion } from "~/services/navegacionService";

interface GeoJsonFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface EstadoMapa {
  ubicacionActual: [number, number] | null;
  cargando: boolean;
  error: string | null;
  rutaNavegacion: RutaNavegacion | null;
  destinoNavegacion: UnidadPolicial | null;
  shapeUsuario: GeoJsonFeature | null;
  cameraRef: RefObject<CameraRef | null>;
}

export interface AccionesMapa {
  recargar: () => Promise<void>;
  centrarMiUbicacion: () => Promise<void>;
  centrarEnUnidad: (unidad: UnidadPolicial) => void;
  navegarAUnidad: (unidad: UnidadPolicial) => Promise<void>;
  cancelarNavegacion: () => void;
  centrarCamara: (coordenadas: [number, number], zoom?: number) => void;
}

export function useMapa(): EstadoMapa & AccionesMapa {
  const { obtenerUbicacionActual } = useUbicacionDispositivo();
  const cameraRef = useRef<CameraRef | null>(null);

  const [ubicacionActual, setUbicacionActual] = useState<[number, number] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rutaNavegacion, setRutaNavegacion] = useState<RutaNavegacion | null>(null);
  const [destinoNavegacion, setDestinoNavegacion] = useState<UnidadPolicial | null>(null);

  useEffect(() => {
    cargarUbicacionInicial();
  }, []);

  const cargarUbicacionInicial = async () => {
    setCargando(true);
    setError(null);
    const ubicacion = await obtenerUbicacionActual();
    if (ubicacion) {
      setUbicacionActual([ubicacion.coords.longitude, ubicacion.coords.latitude]);
    } else {
      setError("No se pudo obtener tu ubicación");
    }
    setCargando(false);
  };

  const recargar = async () => {
    await cargarUbicacionInicial();
  };

  const centrarCamara = (coordenadas: [number, number], zoom = 15) => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: coordenadas,
        zoomLevel: zoom,
        animationDuration: 1000,
      });
    }
  };

  const centrarMiUbicacion = async () => {
    // Si no hay navegación activa, centrar inmediatamente en ubicación conocida
    if (!destinoNavegacion) {
      if (ubicacionActual) {
        centrarCamara(ubicacionActual);
        return;
      }
    }

    // Obtener ubicación actual más reciente
    const ubicacion = await obtenerUbicacionActual();
    if (ubicacion) {
      const nuevaUbicacion: [number, number] = [ubicacion.coords.longitude, ubicacion.coords.latitude];
      setUbicacionActual(nuevaUbicacion);
      centrarCamara(nuevaUbicacion);

      // Si hay navegación activa, recalcular la ruta desde la nueva ubicación
      if (destinoNavegacion) {
        const rutaActualizada = await navegacionService.obtenerRutaOSRM(nuevaUbicacion, [destinoNavegacion.longitud, destinoNavegacion.latitud]);
        if (rutaActualizada) {
          setRutaNavegacion(rutaActualizada);
        }
      }
    }
  };

  const centrarEnUnidad = (unidad: UnidadPolicial) => {
    centrarCamara([unidad.longitud, unidad.latitud]);
  };

  const navegarAUnidad = async (unidad: UnidadPolicial) => {
    if (!ubicacionActual) return;

    const ruta = await navegacionService.obtenerRutaOSRM(ubicacionActual, [unidad.longitud, unidad.latitud]);
    if (ruta) {
      setRutaNavegacion(ruta);
      setDestinoNavegacion(unidad);
      centrarCamara(ubicacionActual);
    }
  };

  const cancelarNavegacion = () => {
    setRutaNavegacion(null);
    setDestinoNavegacion(null);
  };

  const shapeUsuario = useMemo(
    () =>
      ubicacionActual
        ? {
            type: "Feature" as const,
            properties: {},
            geometry: {
              type: "Point" as const,
              coordinates: ubicacionActual,
            },
          }
        : null,
    [ubicacionActual]
  );

  return {
    ubicacionActual,
    cargando,
    error,
    rutaNavegacion,
    destinoNavegacion,
    shapeUsuario,
    cameraRef,
    recargar,
    centrarMiUbicacion,
    centrarEnUnidad,
    navegarAUnidad,
    cancelarNavegacion,
    centrarCamara,
  };
}
