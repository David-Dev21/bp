import React, { useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { ObtenerGPS } from '~/components/ubicacion/ObtenerGPS';
import { useRegistroStore } from '~/stores/registro/registroStore';
import { useSafeAreaInsetsWithFallback } from '~/hooks/base/useSafeAreaInsetsWithFallback';

interface DatosUbicacionProps {
  pasoActual: number;
  totalPasos: number;
  esEdicion: boolean;
  onNavigate: (action: 'prev' | 'next' | 'complete') => void;
}

const DatosUbicacion: React.FC<DatosUbicacionProps> = ({ pasoActual, totalPasos, esEdicion, onNavigate }) => {
  // Store global
  const { datosUbicacion, setDatosUbicacion, validarPaso2, validacionPasos } = useRegistroStore();

  // Safe area insets con fallback
  const espaciosSeguro = useSafeAreaInsetsWithFallback();

  const obtenerTituloPaso = () => {
    const prefijo = esEdicion ? 'Editar' : '';
    return `${prefijo} Datos Ubicación`.trim();
  };

  const validarDatos = () => {
    return (
      datosUbicacion.idMunicipio !== '' &&
      datosUbicacion.municipio !== '' &&
      datosUbicacion.provincia !== '' &&
      datosUbicacion.departamento !== '' &&
      datosUbicacion.direccion.zona.trim() !== '' &&
      datosUbicacion.direccion.calle.trim() !== ''
    );
  };

  useEffect(() => {
    const esValido = validarDatos();
    validarPaso2(esValido);
  }, [
    datosUbicacion.idMunicipio,
    datosUbicacion.municipio,
    datosUbicacion.provincia,
    datosUbicacion.departamento,
    datosUbicacion.direccion.zona,
    datosUbicacion.direccion.calle,
    validarPaso2,
  ]);

  const cerrarTeclado = () => {
    Keyboard.dismiss();
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

            <View className="flex-col gap-4">
              <View>
                <Label>Zona *</Label>
                <Input
                  value={datosUbicacion.direccion.zona}
                  onChangeText={(value) =>
                    setDatosUbicacion({
                      direccion: { ...datosUbicacion.direccion, zona: value },
                    })
                  }
                  placeholder="Ej: Miraflores"
                />
                {!datosUbicacion.direccion.zona.trim() && <Text className="text-destructive text-sm mt-1">La zona es obligatoria</Text>}
              </View>

              <View>
                <Label>Calle *</Label>
                <Input
                  value={datosUbicacion.direccion.calle}
                  onChangeText={(value) =>
                    setDatosUbicacion({
                      direccion: { ...datosUbicacion.direccion, calle: value },
                    })
                  }
                  placeholder="Ej: Av. Busch"
                />
                {!datosUbicacion.direccion.calle.trim() && <Text className="text-destructive text-sm mt-1">La calle es obligatoria</Text>}
              </View>

              <View>
                <Label>Número</Label>
                <Input
                  value={datosUbicacion.direccion.numero}
                  onChangeText={(value) =>
                    setDatosUbicacion({
                      direccion: { ...datosUbicacion.direccion, numero: value },
                    })
                  }
                  placeholder="Ej: 1234"
                />
              </View>

              <View>
                <Label>Referencia</Label>
                <Input
                  value={datosUbicacion.direccion.referencia}
                  onChangeText={(value) =>
                    setDatosUbicacion({
                      direccion: { ...datosUbicacion.direccion, referencia: value },
                    })
                  }
                  placeholder="Ej: Frente al Hospital Obrero"
                />
              </View>
              {/* Componente para obtener ubicación por GPS */}
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <Label>Obtener Ubicación por GPS</Label>
                  <ObtenerGPS titulo={datosUbicacion.municipio ? 'Actualizar' : 'Obtener'} />
                </View>
                {datosUbicacion.municipio ? (
                  <View className="mb-3 bg-muted/20 p-3 rounded-lg border border-border">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Ionicons name="location" size={16} color="#5a6a2f" />
                      <Text className="text-base text-foreground font-medium">
                        {datosUbicacion.municipio}, {datosUbicacion.provincia}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted-foreground ml-6">{datosUbicacion.departamento}</Text>
                  </View>
                ) : (
                  <View className="mb-3 bg-muted/20 p-3 rounded-lg border border-dashed border-muted-foreground/30">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="location-outline" size={18} color="#9CA3AF" />
                      <Text className="text-sm text-muted-foreground">No hay ubicación GPS</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Botones de navegación - Fuera del ScrollView */}
          <View className="flex-row justify-between items-center px-4" style={{ paddingBottom: espaciosSeguro.bottom + 16 }}>
            {/* Paso 2 siempre tiene botón anterior */}
            <Button variant="outline" onPress={() => onNavigate('prev')} className="flex-row items-center gap-2">
              <Ionicons name="arrow-back" size={20} />
              <Text>Anterior</Text>
            </Button>

            <Button variant="outline" onPress={() => onNavigate('next')} disabled={!validacionPasos.paso2} className="flex-row items-center gap-2">
              <Text>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} />
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default DatosUbicacion;
