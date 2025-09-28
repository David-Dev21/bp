import { ScrollView, View, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

export default function ConsejosScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        {/* Encabezado con jerarquía visual clara */}
        <View className="items-center mb-8">
          <Image source={require('~/assets/images/felcv/logo-felcv.webp')} className="w-20 h-20 mb-4" resizeMode="contain" />
          <Text className="text-xl font-bold text-center text-gray-900 mb-2">LA F.E.L.C.V. TE RECOMIENDA</Text>
          <View className="w-12 h-0.5 bg-blue-600" />
        </View>

        {/* Información crítica con mayor prominencia visual */}
        <View className="mb-8 p-4 bg-white">
          <View className="flex-row items-center mb-4">
            <Ionicons name="warning" size={18} color="#dc2626" />
            <Text className="text-lg font-bold text-gray-900 flex-1 ml-2">CUÁNDO ACTIVAR EL BOTÓN</Text>
          </View>

          <View className="space-y-3 mb-4">
            <View className="flex-row items-start">
              <Text className="mr-3 text-red-600">•</Text>
              <Text className="flex-1 text-sm leading-5 text-gray-800 font-medium">TU VIDA O LA DE TUS HIJOS CORRE PELIGRO</Text>
            </View>
            <View className="flex-row items-start">
              <Text className="mr-3 text-red-600">•</Text>
              <Text className="flex-1 text-sm leading-5 text-gray-800 font-medium">TU AGRESOR ESTÉ CERCA</Text>
            </View>
          </View>

          <View className="pt-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="call" size={16} color="#2563eb" />
              <Text className="text-base font-bold text-gray-900 ml-2">AL ACTIVAR RECUERDA:</Text>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">LÍNEA GRATUITA: 800 14 0348 O 110</Text>
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">LLAMA A UN FAMILIAR CERCANO</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Secciones organizadas */}
        <View className="space-y-6">
          {/* Recomendaciones Generales */}
          <View className="p-4 bg-white">
            <View className="flex-row items-center mb-3">
              <Ionicons name="document-text" size={18} color="#2563eb" />
              <Text className="text-base font-bold text-gray-900 ml-2">RECOMENDACIONES GENERALES</Text>
            </View>
            <View className="space-y-2 ml-4">
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">EVITA COMENTAR</Text> sobre la instalación del botón de pánico a personas que no sean de tu
                  confianza
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">NUNCA DESINSTALES</Text> la aplicación de tu celular
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  Si pierdes tu teléfono celular <Text className="font-semibold">ACUDE A OFICINAS DE LA F.E.L.C.V.</Text> para su reinstalación
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">RECUERDA SIEMPRE ESTAR CONECTADO</Text> a internet y ubicación GPS
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">SIEMPRE LLEVA CONTIGO EL CELULAR</Text> para dar con tu ubicación
                </Text>
              </View>
            </View>
          </View>

          {/* Si te encuentras en la calle */}
          <View className="p-4 bg-white">
            <View className="flex-row items-center mb-3">
              <Ionicons name="storefront" size={18} color="#2563eb" />
              <Text className="text-base font-bold text-gray-900 ml-2">SI TE ENCUENTRAS EN LA CALLE</Text>
            </View>
            <View className="space-y-2 ml-4">
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">BUSCA UN LUGAR RESGUARDADO:</Text> tiendas, oficinas, edificios, entidades financieras o públicas
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">PIDE AYUDA A OTRAS PERSONAS</Text>
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">BUSCA UN POLICÍA</Text> o dirígete a una oficina policial más cercana
                </Text>
              </View>
            </View>
          </View>

          {/* Si te encuentras en tu domicilio */}
          <View className="p-4 bg-white">
            <View className="flex-row items-center mb-3">
              <Ionicons name="home" size={18} color="#2563eb" />
              <Text className="text-base font-bold text-gray-900 ml-2">SI TE ENCUENTRAS EN TU DOMICILIO</Text>
            </View>
            <View className="space-y-2 ml-4">
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">IDENTIFICA LA SALIDA MÁS RÁPIDA</Text> de tu casa y planifica una ruta de escape
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">CREA UNA SEÑAL ESPECIAL</Text> con vecinos de confianza para que llamen a la FELCV
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-3 text-blue-600">•</Text>
                <Text className="flex-1 text-sm leading-5 text-gray-700">
                  <Text className="font-semibold">ESTABLECE UNA SEÑAL FAMILIAR</Text> que solo tú y tus hijos conozcan para salir rápidamente
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mensaje final */}
        <View className="p-4 bg-white mt-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="warning" size={16} color="#dc2626" />
            <Text className="flex-1 text-base font-bold text-gray-900 ml-2">INFORMACIÓN IMPORTANTE</Text>
          </View>

          <Text className="text-sm leading-5 text-gray-800 mb-4">
            Recuerda que el <Text className="font-bold text-red-700">botón de pánico</Text> está diseñado para situaciones de emergencia real. Su uso
            adecuado puede salvarte la vida.
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center p-3 bg-white">
              <Image source={require('~/assets/images/felcv/logo-felcv.webp')} className="w-12 h-12 mr-3" resizeMode="contain" />
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-sm">F.E.L.C.V.</Text>
                <Text className="text-gray-600 text-xs">Fuerza Especial de Lucha Contra la Violencia</Text>
              </View>
            </View>

            <View className="flex-row items-center p-3 bg-white">
              <Image source={require('~/assets/images/felcv/adelita.webp')} className="w-12 h-12 mr-3" resizeMode="contain" />
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-sm">Sistema Adelita</Text>
                <Text className="text-gray-600 text-xs">Protección y prevención de la violencia</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
