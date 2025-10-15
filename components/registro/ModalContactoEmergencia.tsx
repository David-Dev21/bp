import React, { useState, useEffect } from "react";
import { View, ScrollView, Modal, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { ContactoEmergencia } from "~/stores/perfilStore";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { parentescoSchema, nombreContactoSchema, telefonoContactoSchema } from "~/lib/zodSchemas";

interface ModalContactoEmergenciaProps {
  modalAbierto: boolean;
  setModalAbierto: (abierto: boolean) => void;
  contactoTemporal: ContactoEmergencia;
  actualizarContactoTemporal: (campo: keyof ContactoEmergencia, valor: string | boolean) => void;
  guardarContacto: () => void;
  validarContactoTemporal: () => boolean;
  editandoIndex: number | null;
}

const ModalContactoEmergencia = ({
  modalAbierto,
  setModalAbierto,
  contactoTemporal,
  actualizarContactoTemporal,
  guardarContacto,
  validarContactoTemporal,
  editandoIndex,
}: ModalContactoEmergenciaProps) => {
  // Color scheme para modo oscuro
  const { colorScheme } = useColorScheme();
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

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
    defaultValues: {
      parentesco: contactoTemporal.parentesco,
      nombre: contactoTemporal.nombre,
      telefono: contactoTemporal.telefono,
    },
    mode: "onChange",
  });

  const parentescoValue = watch("parentesco");

  // Actualizar form cuando cambia contactoTemporal
  useEffect(() => {
    if (modalAbierto) {
      reset({
        parentesco: contactoTemporal.parentesco,
        nombre: contactoTemporal.nombre,
        telefono: contactoTemporal.telefono,
      });
    }
  }, [modalAbierto, contactoTemporal, reset]);

  const onSubmit = (data: FormData) => {
    actualizarContactoTemporal("parentesco", data.parentesco);
    actualizarContactoTemporal("nombre", data.nombre);
    actualizarContactoTemporal("telefono", data.telefono);
    guardarContacto();
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

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <Modal visible={modalAbierto} transparent animationType="fade" onRequestClose={cerrarModal}>
      <Pressable className="flex-1 justify-start items-center bg-black/50 pt-8" onPress={cerrarModal}>
        <Pressable className="bg-background rounded-3xl w-[90%] max-h-[80%] shadow-2xl" onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View className="border-b border-border px-6 py-4">
            <Text className="text-lg text-center font-bold">{editandoIndex !== null ? "Editar Contacto" : "Nuevo Contacto"}</Text>
          </View>

          {/* Content */}
          <ScrollView
            className="px-6 py-4"
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-3">
              <View>
                <Label className="text-sm mb-1">Nombre Completo</Label>
                <Controller
                  control={control}
                  name="nombre"
                  render={({ field: { onChange, value } }) => (
                    <Input value={value} onChangeText={onChange} autoCorrect={false} autoComplete="off" spellCheck={false} />
                  )}
                />
                {errors.nombre && <Text className="text-destructive text-xs mt-1">{errors.nombre.message}</Text>}
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Label className="text-sm mb-1">Parentesco</Label>
                  <Pressable
                    onPress={() => setMostrarOpciones(true)}
                    className="border border-input rounded-2xl bg-background h-12 px-3 flex-row items-center justify-between active:bg-secondary/30"
                  >
                    <Text className={parentescoValue ? "text-foreground" : "text-muted-foreground"}>{obtenerLabelParentesco()}</Text>
                    <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                  </Pressable>
                  {errors.parentesco && <Text className="text-destructive text-xs mt-1">{errors.parentesco.message}</Text>}
                </View>
                <View className="flex-1">
                  <Label className="text-sm mb-1">Celular</Label>
                  <Controller
                    control={control}
                    name="telefono"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        maxLength={8}
                        autoCorrect={false}
                        autoComplete="off"
                        spellCheck={false}
                      />
                    )}
                  />
                  {errors.telefono && <Text className="text-destructive text-xs mt-1">{errors.telefono.message}</Text>}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row justify-between px-6 py-4">
            <Button variant="destructive" onPress={cerrarModal}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="close" size={18} color={colorIcono} />
                <Text>Cancelar</Text>
              </View>
            </Button>
            <Button variant="default" onPress={handleSubmit(onSubmit)} disabled={!isValid}>
              <View className="flex-row items-center gap-2">
                <Ionicons name={editandoIndex !== null ? "checkmark" : "save"} size={18} color={colorIcono} />
                <Text>{editandoIndex !== null ? "Actualizar" : "Guardar"}</Text>
              </View>
            </Button>
          </View>
        </Pressable>
      </Pressable>

      {/* Modal para seleccionar parentesco */}
      <Modal visible={mostrarOpciones} transparent animationType="fade" onRequestClose={() => setMostrarOpciones(false)}>
        <Pressable className="flex-1 justify-center items-center bg-black/50" onPress={() => setMostrarOpciones(false)}>
          <Pressable className="bg-background rounded-3xl w-[80%] max-h-[60%] shadow-2xl" onPress={(e) => e.stopPropagation()}>
            <View className="border-b border-border px-6 py-2">
              <Text className="text-lg text-center font-bold">Seleccionar Parentesco</Text>
            </View>
            <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
              {opcionesParentesco.map((opcion) => (
                <Pressable
                  key={opcion.value}
                  onPress={() => seleccionarParentesco(opcion.value)}
                  className="p-3 rounded-2xl border-b border-border/50 active:bg-secondary/30"
                >
                  <Text
                    className={
                      parentescoValue === opcion.value
                        ? "text-primary font-bold text-base bg-secondary/30 p-3 rounded-2xl"
                        : "text-foreground text-base"
                    }
                  >
                    {opcion.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
};

export default ModalContactoEmergencia;
