import { useState, useMemo, useRef, useEffect, RefObject } from "react";
import { CameraRef } from "@maplibre/maplibre-react-native";
import { UnidadPolicial } from "~/lib/tiposApi";
import { useUbicacionStore } from "~/stores/ubicacionStore";
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
  const { ubicacionActual: ubicacionStore, error: errorStore, actualizarUbicacion } = useUbicacionStore();
  const cameraRef = useRef<CameraRef | null>(null);

  const [ubicacionActual, setUbicacionActual] = useState<[number, number] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rutaNavegacion, setRutaNavegacion] = useState<RutaNavegacion | null>(null);
  const [destinoNavegacion, setDestinoNavegacion] = useState<UnidadPolicial | null>(null);

  // Sincronizar con el store global
  useEffect(() => {
    if (ubicacionStore) {
      setUbicacionActual([ubicacionStore.coords.longitude, ubicacionStore.coords.latitude]);
      setError(errorStore);
    } else {
      setError(errorStore);
    }
  }, [ubicacionStore, errorStore]);

  const recargar = async () => {
    await actualizarUbicacion();
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

    // Actualizar ubicación actual
    await actualizarUbicacion();

    // Usar la ubicación actualizada del store
    const ubicacionStore = useUbicacionStore.getState().ubicacionActual;
    if (ubicacionStore) {
      const nuevaUbicacion: [number, number] = [ubicacionStore.coords.longitude, ubicacionStore.coords.latitude];
      setUbicacionActual(nuevaUbicacion);
      centrarCamara(nuevaUbicacion);

      // Si hay navegación activa, recalcular la ruta desde la nueva ubicación
      if (destinoNavegacion) {
        const rutaActualizada = await navegacionService.obtenerRutaOSRM(nuevaUbicacion, [
          destinoNavegacion.ubicacion.longitud,
          destinoNavegacion.ubicacion.latitud,
        ]);
        if (rutaActualizada) {
          setRutaNavegacion(rutaActualizada);
        }
      }
    }
  };

  const centrarEnUnidad = (unidad: UnidadPolicial) => {
    centrarCamara([unidad.ubicacion.longitud, unidad.ubicacion.latitud]);
  };

  const navegarAUnidad = async (unidad: UnidadPolicial) => {
    if (!ubicacionActual) return;

    const ruta = await navegacionService.obtenerRutaOSRM(ubicacionActual, [unidad.ubicacion.longitud, unidad.ubicacion.latitud]);
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
