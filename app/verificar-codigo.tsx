import React from "react";
import { View, Text, ScrollView, Keyboard } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import { useVerificacionCodigo } from "~/hooks/victima/useVerificacionCodigo";

export default function SolicitarCodigoScreen() {
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
        <View className="bg-primary p-6 rounded-b-3xl">
          <View className="items-center">
            <Ionicons name={codigoEnviado ? "shield-checkmark" : "chatbubble-ellipses"} size={64} color="#e0e8ca" />
            <Text className="text-2xl font-bold text-white mt-4">Verificación</Text>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 justify-start p-6">
          <View className="bg-primary/5 rounded-2xl p-6">
            <Text className="text-lg text-center text-gray-700 mb-2">
              {codigoEnviado ? "Ingresa el código de verificación" : "Obtener código verificación mediante:"}
            </Text>

            <View className="flex-row items-center justify-center mb-6">
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text className="text-xl font-semibold text-gray-800 ml-2">WhatsApp</Text>
            </View>

            <Text className="text-center text-gray-600 mb-2">{codigoEnviado ? "Código enviado al número:" : "Se enviará un código al número:"}</Text>

            <View className="bg-gray-100 rounded-2xl p-4 mb-6">
              <Text className="text-center text-xl font-mono text-gray-800">{celularFormateado}</Text>
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
                      className="w-12 h-12 border-2 border-gray-300 rounded-2xl mx-1 text-center font-bold"
                      autoFocus={index === 0}
                    />
                  ))}
                </View>

                <Button onPress={verificarCodigo} disabled={isLoading} className="mb-4">
                  <View className="flex-row items-center">
                    <Text className="text-white font-semibold mr-2">{isLoading ? "Verificando..." : "Verificar Código"}</Text>
                    <Ionicons name={isLoading ? "hourglass" : "checkmark-circle"} size={20} color="white" />
                  </View>
                </Button>
                <Button onPress={solicitarCodigo} disabled={isLoading} variant="outline">
                  <View className="flex-row items-center">
                    <Ionicons name="reload" size={18} color="#6b7280" />
                    <Text className="text-muted-foreground font-medium ml-2">Reenviar Código</Text>
                  </View>
                </Button>
              </>
            ) : (
              <Button onPress={solicitarCodigo} disabled={isLoading}>
                <View className="flex-row items-center">
                  <Text className="text-white font-semibold mr-2">{isLoading ? "Enviando..." : "Obtener Código"}</Text>
                  <Ionicons name={isLoading ? "hourglass" : "send"} size={20} color="white" />
                </View>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
