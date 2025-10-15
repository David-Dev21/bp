import React, { useRef } from "react";
import { View, Keyboard, TextInput, ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { cedulaIdentidadSchema, codigoDenunciaSchema } from "~/lib/zodSchemas";
import { Label } from "../ui/label";
import { usePerfilStore } from "~/stores/perfilStore";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { Ionicons } from "@expo/vector-icons";

interface VerificarDenunciaProps {
  verificar?: (data: { cedulaIdentidad: string; codigoDenuncia: string }) => void;
  cargando?: boolean;
}

export default function VerificarDenuncia({ verificar, cargando = false }: VerificarDenunciaProps) {
  const codigoDenunciaInputRef = useRef<TextInput>(null);
  const { setDatosPersonales } = usePerfilStore();

  // Color scheme para modo oscuro
  const { colorScheme } = useColorScheme();
  const colorIcono = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"]["primary-foreground"];

  // Esquema usando los individuales
  const VerificarDenunciaSchema = z.object({
    cedulaIdentidad: cedulaIdentidadSchema,
    codigoDenuncia: codigoDenunciaSchema,
  });

  type FormData = z.infer<typeof VerificarDenunciaSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(VerificarDenunciaSchema),
    defaultValues: {
      cedulaIdentidad: "",
      codigoDenuncia: "LPDD-361/2019",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: { cedulaIdentidad: string; codigoDenuncia: string }) => {
    // Cerrar el teclado antes de proceder
    Keyboard.dismiss();
    // Setear cédula y código en el store global
    setDatosPersonales({ cedulaIdentidad: data.cedulaIdentidad, codigoDenuncia: data.codigoDenuncia });
    if (verificar) {
      verificar(data);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 30,
          paddingTop: 60,
          paddingBottom: 40,
          flexGrow: 1,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <View className="items-center mb-8">
            <Image
              source={require("~/assets/images/felcv/logo-felcv.webp")}
              style={{
                width: 90,
                height: 90,
              }}
            />
          </View>

          {/* Formulario */}
          <View className="gap-y-5">
            {/* Campo Carnet */}
            <View className="gap-y-2">
              <Label className="text-foreground font-bold">
                Carnet de Identidad
                <Text className="text-red-500"> *</Text>
              </Label>
              <Controller
                control={control}
                name="cedulaIdentidad"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    editable={!isSubmitting && !cargando}
                    returnKeyType="next"
                    onSubmitEditing={() => codigoDenunciaInputRef.current?.focus()}
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="bg-card"
                  />
                )}
              />
              {errors.cedulaIdentidad && <Text className="text-xs text-red-500 font-medium">{errors.cedulaIdentidad.message}</Text>}
            </View>
            {/* Campo Código de Denuncia */}
            <View className="gap-y-2">
              <Label className="text-foreground font-bold">
                Código de Denuncia
                <Text className="text-red-500"> *</Text>
              </Label>
              <Controller
                control={control}
                name="codigoDenuncia"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={codigoDenunciaInputRef}
                    value={value}
                    onChangeText={onChange}
                    placeholder="LPDD-361/2019"
                    editable={!isSubmitting && !cargando}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    className="bg-card"
                  />
                )}
              />
              {errors.codigoDenuncia && <Text className="text-xs text-red-500 font-medium">{errors.codigoDenuncia.message}</Text>}
              <Text className="text-xs text-muted-foreground leading-4">
                El Código de Denuncia es proporcionado por las autoridades al realizar una denuncia formal.
              </Text>
            </View>

            {/* Botón */}
            <View className="gap-y-3 mt-6">
              <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting || cargando} testID="continuar-button" className="h-12">
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-primary-foreground font-semibold text-base">
                    {isSubmitting || cargando ? "Verificando..." : "Verificar Denuncia"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={colorIcono} />
                </View>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
