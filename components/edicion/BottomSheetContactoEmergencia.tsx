import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Modal } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { ContactoEmergencia } from "~/stores/perfilStore";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { parentescoSchema, nombreContactoSchema, telefonoContactoSchema } from "~/lib/zodSchemas";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetContactoEmergenciaProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  guardarContacto: (data: { nombre: string; telefono: string; parentesco: string }) => void;
  editandoIndex: number | null;
  onClose: () => void;
  contactoActual?: ContactoEmergencia;
}

const BottomSheetContactoEmergencia = ({
  bottomSheetRef,
  guardarContacto,
  editandoIndex,
  onClose,
  contactoActual,
}: BottomSheetContactoEmergenciaProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = THEME_COLORS[isDark ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  // Schema completo para validar contacto
  const contactoSchema = z.object({
    parentesco: parentescoSchema,
    nombre: nombreContactoSchema,
    telefono: telefonoContactoSchema,
  });

  type FormData = z.infer<typeof contactoSchema>;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(contactoSchema),
    defaultValues: contactoActual
      ? {
          parentesco: contactoActual.parentesco,
          nombre: contactoActual.nombre,
          telefono: contactoActual.telefono,
        }
      : {
          parentesco: "",
          nombre: "",
          telefono: "",
        },
    mode: "onChange",
  });

  const parentescoValue = watch("parentesco");

  // Actualizar form cuando cambia contactoActual
  useEffect(() => {
    if (contactoActual) {
      reset({
        parentesco: contactoActual.parentesco,
        nombre: contactoActual.nombre,
        telefono: contactoActual.telefono,
      });
    } else {
      reset({
        parentesco: "",
        nombre: "",
        telefono: "",
      });
    }
  }, [contactoActual, reset]);

  const onSubmit = (data: FormData) => {
    guardarContacto(data);
  };

  const opcionesParentesco = [
    { label: "Madre", value: "madre" },
    { label: "Padre", value: "padre" },
    { label: "Hermano/a", value: "hermano" },
    { label: "Esposo/a", value: "esposo" },
    { label: "Hijo/a", value: "hijo" },
    { label: "Tío/a", value: "tio" },
    { label: "Primo/a", value: "primo" },
    { label: "Abuelo/a", value: "abuelo" },
    { label: "Vecino/a", value: "vecino" },
    { label: "Amigo/a", value: "amigo" },
    { label: "Otro", value: "otro" },
  ];

  const seleccionarParentesco = (valor: string) => {
    setValue("parentesco", valor, { shouldValidate: true });
    setMostrarOpciones(false);
  };

  const obtenerLabelParentesco = () => {
    const opcion = opcionesParentesco.find((op) => op.value === parentescoValue);
    return opcion ? opcion.label : "Seleccionar";
  };

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  const renderBackdrop = React.useCallback((props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />, []);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        backgroundStyle={{ backgroundColor: themeColors.card }}
        handleIndicatorStyle={{ backgroundColor: themeColors.border }}
        enablePanDownToClose={true}
        onDismiss={handleClose}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 24) }}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="people" size={24} color={themeColors.primary} />
              <View className="ml-3">
                <Text className="text-lg font-bold">{editandoIndex !== null ? "Editar Contacto" : "Nuevo Contacto"}</Text>
                <Text className="text-sm text-muted-foreground">Contacto de emergencia</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="gap-4 mb-4">
            <View>
              <Label className="text-sm mb-2">Nombre Completo</Label>
              <Controller
                control={control}
                name="nombre"
                render={({ field: { onChange, value } }) => (
                  <BottomSheetTextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ej: María López"
                    style={{
                      marginBottom: 4,
                      borderRadius: 8,
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
              {errors.nombre && <Text className="text-destructive text-xs mt-1">{errors.nombre.message}</Text>}
            </View>

            <View>
              <Label className="text-sm mb-2">Parentesco</Label>
              <Pressable
                onPress={() => setMostrarOpciones(true)}
                className="border border-input rounded-lg bg-background h-12 px-3 flex-row items-center justify-between active:bg-secondary/30"
              >
                <Text className={parentescoValue ? "text-foreground" : "text-muted-foreground"}>{obtenerLabelParentesco()}</Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </Pressable>
              {errors.parentesco && <Text className="text-destructive text-xs mt-1">{errors.parentesco.message}</Text>}
            </View>

            <View>
              <Label className="text-sm mb-2">Celular</Label>
              <Controller
                control={control}
                name="telefono"
                render={({ field: { onChange, value } }) => (
                  <BottomSheetTextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ej: 79550230"
                    keyboardType="phone-pad"
                    maxLength={8}
                    style={{
                      marginBottom: 4,
                      borderRadius: 8,
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
              {errors.telefono && <Text className="text-destructive text-xs mt-1">{errors.telefono.message}</Text>}
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row justify-end gap-3 mt-4">
            <Button variant="outline" onPress={handleClose}>
              <Text>Cancelar</Text>
            </Button>
            <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
              <Text>{editandoIndex !== null ? "Actualizar" : "Guardar"}</Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Modal de React Native para seleccionar parentesco */}
      <Modal visible={mostrarOpciones} transparent animationType="fade" onRequestClose={() => setMostrarOpciones(false)}>
        <Pressable className="flex-1 justify-center items-center bg-black/50" onPress={() => setMostrarOpciones(false)}>
          <Pressable className="bg-background rounded-3xl w-[80%] max-h-[60%] shadow-2xl" onPress={(e) => e.stopPropagation()}>
            <View className="border-b border-border px-6 py-4">
              <Text className="text-lg text-center font-bold">Seleccionar Parentesco</Text>
            </View>
            <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
              {opcionesParentesco.map((opcion) => (
                <Pressable
                  key={opcion.value}
                  onPress={() => seleccionarParentesco(opcion.value)}
                  className="py-3 px-4 rounded-lg border-b border-border/50 active:bg-secondary/30"
                >
                  <Text className={parentescoValue === opcion.value ? "text-primary font-bold text-base" : "text-foreground text-base"}>
                    {opcion.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default BottomSheetContactoEmergencia;
