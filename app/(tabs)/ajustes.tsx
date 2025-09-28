import { View, ScrollView, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardContent } from '~/components/ui/card';
import { useAtenticacionStore } from '~/stores/victimas/atenticacionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

// Pantalla de ajustes
export default function AjustesScreen() {
  const { idVictima, codigoDenuncia, sesionActiva: sesionIniciada } = useAtenticacionStore();
  const [storageContent, setStorageContent] = useState<string>('');

  const debugAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);

      let content = 'CONTENIDO DEL ASYNCSTORAGE:\n\n';

      stores.forEach(([key, value]) => {
        content += `Clave: ${key}\n`;
        content += `Valor: ${value || 'null'}\n`;
        content += '─'.repeat(40) + '\n';
      });

      if (stores.length === 0) {
        content += '✅ AsyncStorage está vacío\n';
      }
      setStorageContent(content);
    } catch (error) {
      console.error('Error leyendo AsyncStorage:', error);
      setStorageContent('Error leyendo AsyncStorage');
    }
  };

  const limpiarTodosLosStorages = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('✅ Storages limpiados', 'Todos los datos del AsyncStorage han sido eliminados');
      setStorageContent('');
    } catch (error) {
      console.error('Error limpiando AsyncStorage:', error);
      Alert.alert('❌ Error', 'No se pudieron limpiar los storages');
    }
  };

  return (
    <View className="flex-1 ">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Solo mostrar información de sesión - NO opciones de limpiar */}
        <Card className="mb-4">
          <CardHeader>
            <Text className="text-lg font-bold">Estado de Sesión</Text>
          </CardHeader>
          <CardContent>
            <Text className="mb-2">Sesión: {sesionIniciada ? '✅ Iniciada' : '❌ No iniciada'}</Text>
            <Text className="mb-2">ID Víctima: {idVictima || 'No disponible'}</Text>
            <Text className="mb-2">CUD: {codigoDenuncia || 'No disponible'}</Text>
            <Text className="mb-2">Registro: {idVictima ? '✅ Completo' : '❌ Incompleto'}</Text>
          </CardContent>
        </Card>

        {/* Debug AsyncStorage - Solo para ver, no para limpiar */}
        <Card className="mb-4">
          <CardHeader>
            <Text className="text-lg font-bold">Debug AsyncStorage</Text>
          </CardHeader>
          <CardContent className="gap-3">
            <Button onPress={debugAsyncStorage} variant="outline" className="w-full">
              <Text className="font-semibold">Ver Contenido del Storage</Text>
            </Button>

            <Button onPress={limpiarTodosLosStorages} variant="destructive" className="w-full">
              <Text className="font-semibold text-white">🗑️ LIMPIAR TODOS LOS STORAGES</Text>
            </Button>

            {storageContent && (
              <View className="bg-muted p-3 rounded-lg mt-3">
                <Text className="text-xs font-mono">{storageContent}</Text>
              </View>
            )}
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
