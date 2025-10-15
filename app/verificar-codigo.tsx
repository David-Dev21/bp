import React from "react";
import { View, Text, ScrollView, Keyboard } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME_COLORS } from "~/lib/theme";
import { useVerificacionCodigo } from "~/hooks/victima/useVerificacionCodigo";

export default function SolicitarCodigoScreen() {
  const { colorScheme } = useColorScheme();
  const tema = THEME_COLORS[colorScheme === "dark" ? "dark" : "light"];
  const { codigo, codigoEnviado, isLoading, celular, inputRefs, solicitarCodigo, verificarCodigo, handleInputChange, handleInputKeyPress } =
    useVerificacionCodigo();

  // Función para ocultar dígitos del celular
  const formatCelular = (celular: string) => {
    if (!celular || celular.length < 4) return celular;
    const visibleDigits = 3;
    const hiddenPart = "*".repeat(celular.length - visibleDigits);
    const visiblePart = celular.slice(-visibleDigits);
    return hiddenPart + visiblePart;
  };

  const celularFormateado = formatCelular(celular);

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="p-6 rounded-b-3xl" style={{ backgroundColor: "#5a6a2f" }}>
          <View className="items-center">
            <Ionicons name={codigoEnviado ? "shield-checkmark" : "chatbubble-ellipses"} size={64} color="white" />
            <Text className="text-2xl font-bold text-white mt-4">Verificación</Text>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 justify-start p-6">
          <View className="p-6">
            <Text className="text-lg text-center text-foreground mb-2">
              {codigoEnviado ? "Ingresa el código de verificación" : "Obtener código verificación mediante:"}
            </Text>

            <View className="flex-row items-center justify-center mb-6">
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text className="text-xl font-semibold text-foreground ml-2">WhatsApp</Text>
            </View>

            <Text className="text-center text-muted-foreground mb-2">
              {codigoEnviado ? "Código enviado al número:" : "Se enviará un código al número:"}
            </Text>

            <View className="bg-muted rounded-2xl p-4 mb-6">
              <Text className="text-center text-xl font-mono text-foreground">{celularFormateado}</Text>
            </View>

            {codigoEnviado ? (
              <>
                {/* 6 inputs separados para cada dígito */}
                <View className="flex-row justify-center mb-8">
                  {Array.from({ length: 6 }, (_, index) => (
                    <Input
                      key={index}
                      ref={inputRefs[index]}
                      value={codigo[index] || ""}
                      onChangeText={(text) => handleInputChange(text, index)}
                      onKeyPress={({ nativeEvent }) => handleInputKeyPress(nativeEvent.key, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      className="w-12 h-12 border-2 border-input rounded-2xl mx-1 text-center font-bold bg-background text-foreground"
                      autoFocus={index === 0}
                    />
                  ))}
                </View>

                <Button onPress={verificarCodigo} disabled={isLoading} className="mb-4">
                  <View className="flex-row items-center">
                    <Text className="font-semibold mr-2 text-primary-foreground">{isLoading ? "Verificando..." : "Verificar Código"}</Text>
                    <Ionicons name={isLoading ? "hourglass" : "checkmark-circle"} size={20} color={tema["primary-foreground"]} />
                  </View>
                </Button>
                <Button onPress={solicitarCodigo} disabled={isLoading} variant="outline">
                  <View className="flex-row items-center">
                    <Ionicons name="reload" size={18} color={tema.foreground} />
                    <Text className="text-muted-foreground font-medium ml-2">Reenviar Código</Text>
                  </View>
                </Button>
              </>
            ) : (
              <Button onPress={solicitarCodigo} disabled={isLoading}>
                <View className="flex-row items-center">
                  <Text className="font-semibold mr-2 text-primary-foreground">{isLoading ? "Enviando..." : "Obtener Código"}</Text>
                  <Ionicons name={isLoading ? "hourglass" : "send"} size={20} color={tema["primary-foreground"]} />
                </View>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
