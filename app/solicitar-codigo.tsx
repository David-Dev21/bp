import React, { useState, useRef } from 'react';
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CodigoService } from '~/services/codigos/codigoService';
import { useAtenticacionStore } from '~/stores/victimas/atenticacionStore';
import { useRegistroStore } from '~/stores/registro/registroStore';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictimaService } from '~/services/victima/victimaService';
import { obtenerExpoPushToken } from '~/lib/utils';

// Función para ocultar dígitos del celular
const formatCelular = (celular: string) => {
  if (!celular || celular.length < 4) return celular;
  const visibleDigits = 3;
  const hiddenPart = '*'.repeat(celular.length - visibleDigits);
  const visiblePart = celular.slice(-visibleDigits);
  return hiddenPart + visiblePart;
};

export default function SolicitarCodigoScreen() {
  const router = useRouter();
  const { setUsuario } = useAtenticacionStore();
  const { obtenerDatosCompletos } = useRegistroStore();
  const [codigo, setCodigo] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { datosPersonales } = obtenerDatosCompletos();
  const celular = datosPersonales.celular;
  const celularFormateado = formatCelular(celular);

  // Crear array de refs para los inputs
  const inputRefs = Array.from({ length: 6 }, () => useRef<any>(null));

  const handleSolicitarCodigo = async () => {
    if (!celular) {
      Alert.alert('Error', 'No se encontró el número de celular');
      return;
    }

    setIsLoading(true);
    try {
      const result = await CodigoService.solicitarCodigo(celular);
      if (result.exito) {
        setCodigoEnviado(true);
        Alert.alert('Código enviado', result.mensaje || 'Revisa tu WhatsApp para el código de verificación');
      } else {
        Alert.alert('Error', result.mensaje || 'No se pudo enviar el código');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al solicitar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificarCodigo = async () => {
    if (!celular || codigo.length !== 6) {
      Alert.alert('Error', 'Ingresa el código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const result = await CodigoService.verificarCodigo(celular, codigo);
      if (result.exito && result.datos?.victima) {
        // Guardar en store de autenticación
        setUsuario(result.datos.victima.id, result.datos.victima.apiKey);

        // Actualizar idDispositivo y fcmToken en el backend
        try {
          const storedId = await AsyncStorage.getItem('id_dispositivo');
          const fcmToken = await obtenerExpoPushToken();
          const idVictima = useAtenticacionStore.getState().idVictima;
          if (storedId && idVictima) {
            await VictimaService.actualizarVictima(idVictima, { idDispositivo: storedId, fcmToken: fcmToken || undefined });
          }
        } catch (updateError) {
          console.error('Error updating device info:', updateError);
          // No bloquear el flujo si falla la actualización
        }

        Alert.alert('¡Verificación exitosa!', result.mensaje || 'Tu cuenta ha sido verificada correctamente.', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/alerta');
            },
          },
        ]);
      } else {
        Alert.alert('Error', result.mensaje || 'Código incorrecto');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (text: string, index: number) => {
    // Solo permitir números
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length > 1) return; // Solo un dígito por input

    // Actualizar el código
    const newCodigo = codigo.split('');
    newCodigo[index] = numericText;
    const updatedCodigo = newCodigo.join('');
    setCodigo(updatedCodigo);

    // Auto-focus al siguiente input si se ingresó un dígito
    if (numericText && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleInputKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !codigo[index] && index > 0) {
      // Si se presiona backspace en un input vacío, ir al anterior
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" className="flex-1" keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Header */}
            <View className="bg-primary p-6 rounded-b-3xl">
              <View className="items-center">
                <Ionicons name={codigoEnviado ? 'shield-checkmark' : 'chatbubble-ellipses'} size={64} color="#e0e8ca" />
                <Text className="text-2xl font-bold text-white mt-4">Verificación</Text>
              </View>
            </View>

            {/* Content */}
            <View className="flex-1 justify-start p-6">
              <View className="bg-white rounded-2xl p-6 shadow-lg">
                <Text className="text-lg text-center text-gray-700 mb-2">
                  {codigoEnviado ? 'Ingresa el código de verificación' : 'Envía código de verificación'}
                </Text>

                <View className="flex-row items-center justify-center mb-6">
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                  <Text className="text-xl font-semibold text-gray-800 ml-2">WhatsApp</Text>
                </View>

                <Text className="text-center text-gray-600 mb-2">
                  {codigoEnviado ? 'Código enviado al número:' : 'Se enviará un código al número:'}
                </Text>

                <View className="bg-gray-100 rounded-2xl p-4 mb-6">
                  <Text className="text-center text-xl font-mono text-gray-800">{celularFormateado}</Text>
                </View>

                {codigoEnviado ? (
                  <>
                    {/* 6 inputs separados para cada dígito */}
                    <View className="flex-row justify-center mb-6">
                      {Array.from({ length: 6 }, (_, index) => (
                        <Input
                          key={index}
                          ref={inputRefs[index]}
                          value={codigo[index] || ''}
                          onChangeText={(text) => handleInputChange(text, index)}
                          onKeyPress={({ nativeEvent }) => handleInputKeyPress(nativeEvent.key, index)}
                          keyboardType="numeric"
                          maxLength={1}
                          className="w-12 h-12 border-2 border-gray-300 rounded-2xl mx-1 text-center font-bold"
                          autoFocus={index === 0}
                        />
                      ))}
                    </View>

                    <Button onPress={handleVerificarCodigo} disabled={isLoading}>
                      <View className="flex-row items-center">
                        <Ionicons name={isLoading ? 'hourglass' : 'checkmark-circle'} size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">{isLoading ? 'Verificando...' : 'Verificar Código'}</Text>
                      </View>
                    </Button>
                  </>
                ) : (
                  <Button onPress={handleSolicitarCodigo} disabled={isLoading}>
                    <View className="flex-row items-center">
                      <Ionicons name={isLoading ? 'hourglass' : 'send'} size={20} color="white" />
                      <Text className="text-white font-semibold ml-2">{isLoading ? 'Enviando...' : 'Enviar Código'}</Text>
                    </View>
                  </Button>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
