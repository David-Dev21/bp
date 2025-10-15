import React, { useState } from "react";
import { View, Pressable, Platform } from "react-native";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import DatePicker from "react-native-date-picker";
import { usePerfilStore } from "~/stores/perfilStore";
import { formateadorFecha } from "~/lib/formato/formateadorFecha";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { nombresSchema, apellidosSchema, celularSchema, correoSchema, fechaNacimientoSchema } from "~/lib/zodSchemas";

interface DatosPersonalesProps {
  pasoActual: number;
  totalPasos: number;
  onNavigate: (action: "prev" | "next" | "complete") => void;
}

const DatosPersonales = ({ pasoActual, totalPasos, onNavigate }: DatosPersonalesProps) => {
  // Store global
  const { datosPersonales, setDatosPersonales } = usePerfilStore();

  // Color scheme para modo oscuro
  const { colorScheme } = useColorScheme();
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

  // Schema de validación completo
  const datosPersonalesSchema = z.object({
    nombres: nombresSchema,
    apellidos: apellidosSchema,
    celular: celularSchema,
    correo: correoSchema,
    fechaNacimiento: fechaNacimientoSchema,
  });

  type FormData = z.infer<typeof datosPersonalesSchema>;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(datosPersonalesSchema),
    defaultValues: {
      nombres: datosPersonales.nombres || "",
      apellidos: datosPersonales.apellidos || "",
      celular: datosPersonales.celular || "",
      correo: datosPersonales.correo || "",
      fechaNacimiento: datosPersonales.fechaNacimiento || "", // Vacío por defecto
    },
    mode: "onChange",
  });

  // Estados locales para el DateTimePicker
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(() => {
    if (datosPersonales.fechaNacimiento) {
      return new Date(datosPersonales.fechaNacimiento);
    }
    return null;
  });

  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  const confirmarFecha = (fecha: Date) => {
    setMostrarDatePicker(false);
    setFechaNacimiento(fecha);
    setValue("fechaNacimiento", fecha.toISOString().split("T")[0], { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    setDatosPersonales(data);

    if (onNavigate) {
      onNavigate("next");
    }
  };

  const cancelarSeleccion = () => {
    setMostrarDatePicker(false);
  };

  const abrirDatePicker = () => {
    setMostrarDatePicker(true);
  };

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={120}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="text-2xl font-bold text-center mb-2">Datos Personales</Text>
          {pasoActual && totalPasos && (
            <Text className="text-center text-muted-foreground">
              Paso {pasoActual} de {totalPasos}
            </Text>
          )}
        </View>
        {datosPersonales.codigoDenuncia && <Text className="text-center font-bold">Código: {datosPersonales.codigoDenuncia}</Text>}

        <View className="flex-col gap-4">
          <View>
            <Label>Nombres</Label>
            <Controller
              control={control}
              name="nombres"
              render={({ field: { onChange, value } }) => <Input value={value} onChangeText={onChange} placeholder="Ingrese sus nombres" />}
            />
            {errors.nombres && <Text className="text-destructive text-xs mt-1">{errors.nombres.message}</Text>}
          </View>
          <View>
            <Label>Apellidos</Label>
            <Controller
              control={control}
              name="apellidos"
              render={({ field: { onChange, value } }) => <Input value={value} onChangeText={onChange} placeholder="Ingrese sus apellidos" />}
            />
            {errors.apellidos && <Text className="text-destructive text-xs mt-1">{errors.apellidos.message}</Text>}
          </View>
          <View className="w-full flex-row gap-4">
            <View className="flex-1">
              <Label>Cédula de Identidad</Label>
              <Input value={datosPersonales.cedulaIdentidad || ""} readOnly editable={false} className="bg-muted" />
            </View>
            <View className="flex-1">
              <Label>Nro. Celular</Label>
              <Controller
                control={control}
                name="celular"
                render={({ field: { onChange, value } }) => (
                  <Input value={value} onChangeText={onChange} placeholder="Ej: 79550230" keyboardType="phone-pad" maxLength={8} />
                )}
              />
              {errors.celular && <Text className="text-destructive text-xs mt-1">{errors.celular.message}</Text>}
            </View>
          </View>
          <View>
            <Label>Correo (Opcional)</Label>
            <Controller
              control={control}
              name="correo"
              render={({ field: { onChange, value } }) => (
                <Input value={value} onChangeText={onChange} placeholder="correo@ejemplo.com" keyboardType="email-address" />
              )}
            />
            {errors.correo && <Text className="text-destructive text-xs mt-1">{errors.correo.message}</Text>}
          </View>
          <View>
            <Label>Fecha de Nacimiento</Label>
            <Pressable onPress={abrirDatePicker} className="mt-1">
              <View className="relative">
                <Input
                  value={fechaNacimiento ? formateadorFecha.formatearFechaLarga(fechaNacimiento) : ""}
                  readOnly
                  className="pr-10"
                  placeholder="Seleccionar fecha"
                />
                <View className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Ionicons name="calendar" size={20} color="#5a6a2f" />
                </View>
              </View>
            </Pressable>
            {errors.fechaNacimiento && <Text className="text-destructive text-xs mt-1">{errors.fechaNacimiento.message}</Text>}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Botones de navegación sticky */}
      <KeyboardStickyView offset={{ closed: Platform.OS === "ios" ? 0 : -40, opened: Platform.OS === "android" ? 0 : 10 }}>
        <View className="flex-row justify-end px-6 bg-background py-2">
          <Button variant="default" onPress={handleSubmit(onSubmit)} disabled={!isValid}>
            <View className="flex-row items-center gap-2">
              <Text>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} color={colorIcono} />
            </View>
          </Button>
        </View>
      </KeyboardStickyView>

      {/* DatePicker Modal - Completamente fuera para centrado correcto */}
      <DatePicker
        modal
        open={mostrarDatePicker}
        date={fechaNacimiento || new Date(2000, 11, 19)}
        mode="date"
        maximumDate={new Date()}
        onConfirm={confirmarFecha}
        onCancel={cancelarSeleccion}
        title="Seleccione su fecha de nacimiento"
        confirmText="Confirmar"
        cancelText="Cancelar"
        locale="es"
        theme={colorScheme === "dark" ? "dark" : "light"}
      />
    </>
  );
};

export default DatosPersonales;
