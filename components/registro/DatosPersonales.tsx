import React, { useState, useEffect } from 'react';
import { View, Pressable, Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRegistroStore } from '~/stores/registro/registroStore';
import { formateadorFecha } from '~/lib/formato/formateadorFecha';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsetsWithFallback } from '~/hooks/base/useSafeAreaInsetsWithFallback';

interface DatosPersonalesProps {
  cedulaIdentidad: string;
  pasoActual: number;
  totalPasos: number;
  esEdicion: boolean;
  onNavigate: (action: 'prev' | 'next' | 'complete') => void;
  codigoDenuncia?: string;
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({ cedulaIdentidad, pasoActual, totalPasos, esEdicion, onNavigate, codigoDenuncia }) => {
  // Store global
  const { datosPersonales, setDatosPersonales, validarPaso1, validacionPasos } = useRegistroStore();

  // Safe area insets con fallback
  const espaciosSeguro = useSafeAreaInsetsWithFallback();

  // Inicializar cédula de identidad en el store si viene como prop
  useEffect(() => {
    if (cedulaIdentidad && !datosPersonales.cedulaIdentidad) {
      setDatosPersonales({ cedulaIdentidad });
    }
  }, [cedulaIdentidad]);

  // Estados locales para el DateTimePicker
  const [fechaNacimiento, setFechaNacimiento] = useState(() => {
    if (datosPersonales.fechaNacimiento) {
      return new Date(datosPersonales.fechaNacimiento);
    }
    return null;
  });

  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  const validarDatos = () => {
    const valido =
      datosPersonales.nombres.trim() !== '' &&
      datosPersonales.apellidos.trim() !== '' &&
      datosPersonales.celular.trim() !== '' &&
      datosPersonales.celular.length >= 8 &&
      datosPersonales.fechaNacimiento.trim() !== '';

    return valido;
  };

  useEffect(() => {
    const esValido = validarDatos();
    validarPaso1(esValido);
  }, [datosPersonales.nombres, datosPersonales.apellidos, datosPersonales.celular, datosPersonales.fechaNacimiento, validarPaso1]);

  const onFechaChange = (event: any, selectedDate: any) => {
    setMostrarDatePicker(false);
    if (selectedDate) {
      setFechaNacimiento(selectedDate);
      setDatosPersonales({
        fechaNacimiento: selectedDate.toISOString().split('T')[0],
      });
    }
  };

  const abrirDatePicker = () => {
    setMostrarDatePicker(true);
  };

  const cerrarTeclado = () => {
    Keyboard.dismiss();
  };

  const obtenerTituloPaso = () => {
    const prefijo = esEdicion ? 'Editar' : '';
    return `${prefijo} Datos Personales`.trim();
  };

  return (
    <View className="flex-1">
      <TouchableWithoutFeedback onPress={cerrarTeclado}>
        <KeyboardAvoidingView behavior="padding" className="flex-1" keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 40}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 20,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Título */}
            <View>
              <Text className="text-2xl font-bold text-center">{obtenerTituloPaso()}</Text>
              <Text className="text-center text-muted-foreground mt-1 mb-2">
                Paso {pasoActual} de {totalPasos}
              </Text>
            </View>
            {codigoDenuncia && <Text className="text-center font-bold">Código: {codigoDenuncia}</Text>}

            <View className="flex-col gap-4">
              <View>
                <Label>Nombres</Label>
                <Input
                  value={datosPersonales.nombres}
                  onChangeText={(value) => setDatosPersonales({ nombres: value })}
                  placeholder="Ingrese sus nombres"
                />
                {!datosPersonales.nombres.trim() && <Text className="text-destructive text-xs mt-1">Los nombres son obligatorios</Text>}
              </View>
              <View>
                <Label>Apellidos</Label>
                <Input
                  value={datosPersonales.apellidos}
                  onChangeText={(value) => setDatosPersonales({ apellidos: value })}
                  placeholder="Ingrese sus apellidos"
                />
                {!datosPersonales.apellidos.trim() && <Text className="text-destructive text-xs mt-1">Los apellidos son obligatorios</Text>}
              </View>
              <View className="w-full flex-row gap-4">
                <View className="flex-1">
                  <Label>Cédula de Identidad</Label>
                  <Input value={datosPersonales.cedulaIdentidad || cedulaIdentidad} readOnly editable={false} />
                </View>
                <View className="flex-1">
                  <Label>Nro. Celular</Label>
                  <Input
                    value={datosPersonales.celular}
                    onChangeText={(value) => setDatosPersonales({ celular: value })}
                    placeholder="Ej: 79550230"
                    keyboardType="phone-pad"
                    maxLength={8}
                  />
                  {(!datosPersonales.celular.trim() || datosPersonales.celular.length < 8) && (
                    <Text className="text-destructive text-sm mt-1">Ingrese un número de celular válido (8 dígitos)</Text>
                  )}
                </View>
              </View>
              <View>
                <Label>Correo (Opcional)</Label>
                <Input
                  value={datosPersonales.correo}
                  onChangeText={(value) => setDatosPersonales({ correo: value })}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                />
              </View>
              <View>
                <Label>Fecha de Nacimiento</Label>
                <Pressable onPress={abrirDatePicker} className="mt-1">
                  <View className="relative">
                    <Input
                      value={fechaNacimiento ? formateadorFecha.formatearFechaLarga(fechaNacimiento) : ''}
                      readOnly
                      className="pr-10"
                      placeholder="Seleccionar fecha"
                    />
                    <View className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Ionicons name="calendar" size={20} color="#5a6a2f" />
                    </View>
                  </View>
                </Pressable>
                {mostrarDatePicker && (
                  <DateTimePicker
                    value={fechaNacimiento || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={onFechaChange}
                  />
                )}
                {!datosPersonales.fechaNacimiento.trim() && <Text className="text-destructive text-xs mt-1">Seleccione fecha de nacimiento</Text>}
              </View>
            </View>
          </ScrollView>

          {/* Botones de navegación - Fuera del ScrollView */}
          <View className="flex-row justify-between items-center p-4" style={{ paddingBottom: espaciosSeguro.bottom + 16 }}>
            {/* Paso 1 nunca tiene botón anterior */}
            <View style={{ width: 100 }} />

            <Button variant="outline" onPress={() => onNavigate('next')} disabled={!validacionPasos.paso1} className="flex-row items-center gap-2">
              <Text>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} className="bg-primary rounded-full" />
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default DatosPersonales;
