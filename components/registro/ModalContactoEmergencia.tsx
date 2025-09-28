import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Picker } from '@react-native-picker/picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { ContactoEmergencia } from '~/stores/registro/registroStore';

interface ModalContactoEmergenciaProps {
  modalAbierto: boolean;
  setModalAbierto: (abierto: boolean) => void;
  contactoTemporal: ContactoEmergencia;
  actualizarContactoTemporal: (campo: keyof ContactoEmergencia, valor: string | boolean) => void;
  guardarContacto: () => void;
  validarContactoTemporal: () => boolean;
  editandoIndex: number | null;
}

const ModalContactoEmergencia: React.FC<ModalContactoEmergenciaProps> = ({
  modalAbierto,
  setModalAbierto,
  contactoTemporal,
  actualizarContactoTemporal,
  guardarContacto,
  validarContactoTemporal,
  editandoIndex,
}) => {
  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
      <DialogContent className="w-full mx-2 min-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-base text-center">{editandoIndex !== null ? 'EDITAR' : 'NUEVO CONTACTO'}</DialogTitle>
        </DialogHeader>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="gap-3">
            <View>
              <Label className="text-sm mb-1">Nombre</Label>
              <Input
                value={contactoTemporal.nombre}
                onChangeText={(valor) => actualizarContactoTemporal('nombre', valor)}
                autoCorrect={false}
                autoComplete="off"
                spellCheck={false}
              />
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Label className="text-sm mb-1">Parentesco</Label>
                <View className="border border-input rounded-2xl bg-background h-12 justify-center">
                  <Picker
                    selectedValue={contactoTemporal.parentesco}
                    onValueChange={(valor: string) => actualizarContactoTemporal('parentesco', valor)}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Madre" value="madre" />
                    <Picker.Item label="Padre" value="padre" />
                    <Picker.Item label="Hermano/a" value="hermano" />
                    <Picker.Item label="Esposo/a" value="esposo" />
                    <Picker.Item label="Hijo/a" value="hijo" />
                    <Picker.Item label="Tío/a" value="tio" />
                    <Picker.Item label="Primo/a" value="primo" />
                    <Picker.Item label="Abuelo/a" value="abuelo" />
                    <Picker.Item label="Vecino/a" value="vecino" />
                    <Picker.Item label="Amigo/a" value="amigo" />
                    <Picker.Item label="Otro" value="otro" />
                  </Picker>
                </View>
              </View>
              <View className="flex-1">
                <Label className="text-sm mb-1">Teléfono</Label>
                <Input
                  value={contactoTemporal.telefono}
                  onChangeText={(valor) => actualizarContactoTemporal('telefono', valor)}
                  keyboardType="phone-pad"
                  maxLength={8}
                  autoCorrect={false}
                  autoComplete="off"
                  spellCheck={false}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <DialogFooter className="flex-row justify-between gap-2 mt-2">
          <Button variant="outline" onPress={cerrarModal}>
            <Text className="text-sm">Cancelar</Text>
          </Button>
          <Button onPress={guardarContacto} disabled={!validarContactoTemporal()}>
            <Text className="text-sm">{editandoIndex !== null ? 'Actualizar' : 'Guardar'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContactoEmergencia;
