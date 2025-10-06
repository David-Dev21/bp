import { MapView, Camera, ShapeSource, CircleLayer, PointAnnotation, LineLayer, Logger } from "@maplibre/maplibre-react-native";
import { View } from "react-native";
import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { THEME_COLORS } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { UnidadPolicial } from "~/lib/tiposApi";
import { useUnidades } from "~/hooks/useUnidades";
import { useMapa } from "~/hooks/useMapa";
import { PanelNavegacion } from "~/components/mapa/PanelNavegacion";
import { BotonUbicacion } from "~/components/mapa/BotonUbicacion";
import { DialogoUnidad } from "~/components/mapa/DialogoUnidad";
import { EstadoCarga, EstadoError } from "~/components/mapa/EstadosMapa";
import { BottomSheetUnidades } from "~/components/mapa/BottomSheetUnidades";

Logger.setLogLevel("error");

export default memo(function Mapa() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];
  const { unidades, cargando: cargandoUnidades } = useUnidades();

  const {
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
  } = useMapa();

  const [unidadSeleccionada, setUnidadSeleccionada] = useState<UnidadPolicial | null>(null);
  const [dialogAbierto, setDialogAbierto] = useState(false);

  if (cargando || cargandoUnidades) {
    return <EstadoCarga tema={tema} mensaje={cargando ? "Obteniendo tu ubicación..." : "Cargando unidades policiales..."} />;
  }

  if (error || !ubicacionActual) {
    return <EstadoError tema={tema} error={error || "No se pudo obtener tu ubicación"} onRetry={recargar} />;
  }

  return (
    <View className="flex-1">
      <View className={`flex-1 ${rutaNavegacion ? "pb-0" : "pb-[35%]"}`}>
        <MapView
          style={{ flex: 1 }}
          logoEnabled={true}
          logoPosition={{ top: 8, left: 8 }}
          attributionEnabled={true}
          attributionPosition={{ top: 8, right: 8 }}
          mapStyle={colorScheme === "dark" ? "https://tiles.openfreemap.org/styles/dark" : "https://tiles.openfreemap.org/styles/liberty"}
        >
          {ubicacionActual && (
            <Camera
              ref={cameraRef}
              defaultSettings={{
                centerCoordinate: ubicacionActual,
                zoomLevel: 13,
              }}
              minZoomLevel={8}
              maxZoomLevel={20}
            />
          )}

          {shapeUsuario && (
            <ShapeSource id="ubicacion-usuario" shape={shapeUsuario}>
              <CircleLayer
                id="ubicacion-usuario-outer"
                style={{
                  circleRadius: 20,
                  circleColor: "#3b82f6",
                  circleOpacity: 0.3,
                }}
              />
              <CircleLayer
                id="ubicacion-usuario-inner"
                style={{
                  circleRadius: 10,
                  circleColor: "#3b82f6",
                  circleStrokeWidth: 3,
                  circleStrokeColor: "#ffffff",
                }}
              />
            </ShapeSource>
          )}

          {rutaNavegacion && (
            <ShapeSource id="ruta-navegacion" shape={rutaNavegacion}>
              <LineLayer
                id="ruta-navegacion-line"
                style={{
                  lineColor: "#3b82f6",
                  lineWidth: 4,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </ShapeSource>
          )}

          {unidades.map((unidad) => (
            <PointAnnotation
              key={unidad.id}
              id={`unidad-${unidad.id}`}
              coordinate={[unidad.longitud, unidad.latitud]}
              onSelected={() => {
                setUnidadSeleccionada(unidad);
                setDialogAbierto(true);
              }}
            >
              <View className="items-center justify-center">
                <Ionicons name="shield" size={32} color={tema.primary} />
              </View>
            </PointAnnotation>
          ))}
        </MapView>
      </View>

      {rutaNavegacion && destinoNavegacion && (
        <PanelNavegacion
          rutaNavegacion={rutaNavegacion}
          destinoNavegacion={destinoNavegacion}
          colorScheme={colorScheme}
          tema={tema}
          onCancelar={cancelarNavegacion}
        />
      )}

      <BotonUbicacion onPress={centrarMiUbicacion} rutaActiva={!!rutaNavegacion} />

      <DialogoUnidad
        unidadSeleccionada={unidadSeleccionada}
        abierto={dialogAbierto}
        onAbrirCambio={setDialogAbierto}
        tema={tema}
        onNavegar={navegarAUnidad}
      />

      {!rutaNavegacion && <BottomSheetUnidades unidades={unidades} colorScheme={colorScheme} tema={tema} onUnidadPress={centrarEnUnidad} />}
    </View>
  );
});
