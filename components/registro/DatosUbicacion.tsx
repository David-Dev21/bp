import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { usePerfilStore } from "~/stores/perfilStore";
import { useSafeAreaInsetsWithFallback } from "~/hooks/useSafeAreaInsetsWithFallback";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { useUbicacionGeoServer } from "~/hooks/ubicacion/useUbicacionGeoServer";
import { zonaSchema, calleSchema } from "~/lib/zodSchemas";
import { toast } from "sonner-native";

interface DatosUbicacionProps {
  pasoActual: number;
  totalPasos: number;
  esEdicion?: boolean;
  onNavigate: (action: "prev" | "next" | "complete") => void;
}

const DatosUbicacion = ({ pasoActual, totalPasos, esEdicion, onNavigate }: DatosUbicacionProps) => {
  // Store global
  const { datosUbicacion, setDatosUbicacion } = usePerfilStore();

  // Safe area insets con fallback
  const espaciosSeguro = useSafeAreaInsetsWithFallback();

  // Color scheme para modo oscuro
  const { colorScheme } = useColorScheme();
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

  // Hook para obtener ubicación GPS
  const { ubicacionGeoServer, cargando } = useUbicacionGeoServer();

  // Schema de validación
  const ubicacionSchema = z.object({
    zona: zonaSchema,
    calle: calleSchema,
    numero: z.string().optional(),
    referencia: z.string().optional(),
  });

  type FormData = z.infer<typeof ubicacionSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(ubicacionSchema),
    defaultValues: {
      zona: datosUbicacion.direccion.zona,
      calle: datosUbicacion.direccion.calle,
      numero: datosUbicacion.direccion.numero,
      referencia: datosUbicacion.direccion.referencia,
    },
    mode: "onChange",
  });

  const obtenerTituloPaso = () => {
    const prefijo = esEdicion ? "Editar" : "";
    return `${prefijo} Datos Ubicación`.trim();
  };

  const onSubmit = (data: FormData) => {
    if (!datosUbicacion.idMunicipio || !datosUbicacion.municipio) {
      toast.error("Por favor obtén tu ubicación por GPS");
      return;
    }

    setDatosUbicacion({
      direccion: {
        zona: data.zona,
        calle: data.calle,
        numero: data.numero || "",
        referencia: data.referencia || "",
      },
    });

    onNavigate("next");
  };

  return (
    <View className="flex-1">
      <KeyboardAwareScrollView
        bottomOffset={100}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View>
          <Text className="text-2xl font-bold text-center">{obtenerTituloPaso()}</Text>
          <Text className="text-center text-muted-foreground mt-1 mb-2">
            Paso {pasoActual} de {totalPasos}
          </Text>
        </View>

        <View className="flex-col gap-4">
          <View>
            <Label>Zona *</Label>
            <Controller
              control={control}
              name="zona"
              render={({ field: { onChange, value } }) => <Input value={value} onChangeText={onChange} placeholder="Ej: Miraflores" />}
            />
            {errors.zona && <Text className="text-destructive text-xs mt-1">{errors.zona.message}</Text>}
          </View>

          <View>
            <Label>Calle *</Label>
            <Controller
              control={control}
              name="calle"
              render={({ field: { onChange, value } }) => <Input value={value} onChangeText={onChange} placeholder="Ej: Av. Busch" />}
            />
            {errors.calle && <Text className="text-destructive text-xs mt-1">{errors.calle.message}</Text>}
          </View>

          <View>
            <Label>Número</Label>
            <Controller
              control={control}
              name="numero"
              render={({ field: { onChange, value } }) => <Input value={value} onChangeText={onChange} placeholder="Ej: 1234" />}
            />
          </View>

          <View>
            <Label>Referencia</Label>
            <Controller
              control={control}
              name="referencia"
              render={({ field: { onChange, value } }) => <Input value={value} onChangeText={onChange} placeholder="Ej: Frente al Hospital Obrero" />}
            />
          </View>
          {/* Componente para obtener ubicación por GPS */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Label>Obtener Ubicación por GPS</Label>
              <Button variant="secondary" size="sm" onPress={ubicacionGeoServer} disabled={cargando}>
                <Text>{datosUbicacion.municipio ? "Actualizar" : "Obtener"}</Text>
              </Button>
            </View>
            {datosUbicacion.municipio ? (
              <View className="mb-3 bg-muted/20 p-3 rounded-2xl border border-border">
                <View className="flex-row items-center gap-2 mb-1">
                  <Ionicons name="location" size={16} color="#5a6a2f" />
                  <Text className="text-base text-foreground font-medium">
                    {datosUbicacion.municipio}, {datosUbicacion.provincia}
                  </Text>
                </View>
                <Text className="text-sm text-muted-foreground ml-6">{datosUbicacion.departamento}</Text>
              </View>
            ) : (
              <View className="mb-3 bg-muted/20 p-3 rounded-2xl border border-dashed border-muted-foreground/30">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="location-outline" size={18} color="#9CA3AF" />
                  <Text className="text-sm text-muted-foreground">No hay ubicación GPS</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Botones de navegación sticky */}
      <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
        <View className="flex-row justify-between items-center px-6 py-4 bg-background border-t border-border">
          {/* Paso 2 siempre tiene botón anterior */}
          <Button variant="default" onPress={() => onNavigate("prev")}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="arrow-back" size={20} color={colorIcono} />
              <Text>Anterior</Text>
            </View>
          </Button>

          <Button variant="default" onPress={handleSubmit(onSubmit)} disabled={!isValid}>
            <View className="flex-row items-center gap-2">
              <Text>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} color={colorIcono} />
            </View>
          </Button>
        </View>
      </KeyboardStickyView>
    </View>
  );
};

export default DatosUbicacion;
