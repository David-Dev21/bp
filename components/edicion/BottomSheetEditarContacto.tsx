import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { View } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { useActualizarContacto } from "~/hooks/victima/useActualizarContacto";
import { celularSchema, correoSchema } from "~/lib/zodSchemas";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface BottomSheetEditarContactoProps {
  campo: "celular" | "correo";
  valorActual: string;
  onClose: () => void;
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}

const BottomSheetEditarContacto = ({ campo, valorActual, onClose, bottomSheetRef }: BottomSheetEditarContactoProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = THEME_COLORS[isDark ? "dark" : "light"];
  const { actualizarContacto, isUpdating } = useActualizarContacto();
  const insets = useSafeAreaInsets();

  // Schema de validación según el campo
  const celularFormSchema = z.object({ celular: celularSchema });
  const correoFormSchema = z.object({ correo: correoSchema });

  const schema = campo === "celular" ? celularFormSchema : correoFormSchema;

  type CelularFormData = z.infer<typeof celularFormSchema>;
  type CorreoFormData = z.infer<typeof correoFormSchema>;
  type FormData = CelularFormData | CorreoFormData;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      [campo]: valorActual,
    } as any,
    mode: "onChange",
  });

  // Actualizar formulario cuando cambia el campo o valor
  useEffect(() => {
    reset({
      [campo]: valorActual,
    } as any);
  }, [campo, valorActual, reset]);

  const onSubmit = async (data: FormData) => {
    const contactoData = campo === "celular" ? { celular: (data as CelularFormData).celular } : { correo: (data as CorreoFormData).correo };

    const exito = await actualizarContacto(contactoData);
    if (exito) {
      bottomSheetRef.current?.dismiss();
      onClose();
    }
  };

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />, []);

  const getTitulo = () => {
    return campo === "celular" ? "Editar Celular" : "Editar Correo";
  };

  const getPlaceholder = () => {
    return campo === "celular" ? "Ej: 79550230" : "Ej: correo@ejemplo.com";
  };

  const getIcono = () => {
    return campo === "celular" ? "call" : "mail";
  };

  const getKeyboardType = () => {
    return campo === "celular" ? "phone-pad" : "email-address";
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      backgroundStyle={{ backgroundColor: themeColors.card }}
      handleIndicatorStyle={{ backgroundColor: themeColors.border }}
      enablePanDownToClose={true}
      onDismiss={handleClose}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}>
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name={getIcono() as any} size={24} color={themeColors.primary} />
            <View className="ml-3">
              <Text className="text-lg font-bold">{getTitulo()}</Text>
              <Text className="text-sm text-muted-foreground">Modifica tu información de contacto</Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Label>{campo === "celular" ? "Número de Celular *" : "Correo Electrónico"}</Label>
          <Controller
            control={control}
            name={campo}
            render={({ field: { onChange, value } }) => (
              <BottomSheetTextInput
                value={value}
                onChangeText={onChange}
                placeholder={getPlaceholder()}
                keyboardType={getKeyboardType()}
                maxLength={campo === "celular" ? 8 : undefined}
                style={{
                  marginTop: 8,
                  marginBottom: 10,
                  borderRadius: 10,
                  fontSize: 16,
                  lineHeight: 20,
                  padding: 12,
                  backgroundColor: colorScheme === "dark" ? "#374151" : "#f9fafb",
                  color: colorScheme === "dark" ? "#f9fafb" : "#111827",
                  borderWidth: 1,
                  borderColor: colorScheme === "dark" ? "#4b5563" : "#e5e7eb",
                }}
              />
            )}
          />
          {(errors as any)[campo] && <Text className="text-destructive text-xs mt-1">{(errors as any)[campo]?.message}</Text>}
        </View>

        <View className="flex-row justify-end gap-3">
          <Button variant="outline" onPress={handleClose}>
            <Text>Cancelar</Text>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || isUpdating}>
            <Text>{isUpdating ? "Guardando..." : "Guardar"}</Text>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheetEditarContacto;
