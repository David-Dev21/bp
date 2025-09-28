import { useState } from 'react';
import { Alert } from 'react-native';
import { GPSUbicacionService } from '~/services/ubicacion/gpsUbicacionService';
import { useRegistroStore } from '~/stores/registro/registroStore';

export const useProbarGPS = () => {
  const [cargando, setCargando] = useState(false);
  const [ubicacionObtenida, setUbicacionObtenida] = useState(false);

  const { setDatosUbicacion } = useRegistroStore();

  const probarGPS = async () => {
    setCargando(true);

    try {
      const ubicacion = await GPSUbicacionService.obtenerUbicacionActual();

      // Obtener información geográfica usando las coordenadas
      const posicion = {
        latitud: ubicacion.coords.latitude,
        longitud: ubicacion.coords.longitude,
      };

      const infoGeografica = await GPSUbicacionService.obtenerUbicacionPorCoordenadas(posicion);

      if (!infoGeografica.exito || !infoGeografica.datos) {
        throw new Error(infoGeografica.mensaje || 'Error al obtener información geográfica');
      }

      setDatosUbicacion({
        idMunicipio: infoGeografica.datos.municipio.id.toString(),
        municipio: infoGeografica.datos.municipio.municipio,
        provincia: infoGeografica.datos.provincia.provincia,
        departamento: infoGeografica.datos.departamento.departamento,
      });

      setUbicacionObtenida(true);
      Alert.alert('Éxito', 'Ubicación obtenida correctamente');
    } catch (error: any) {
      Alert.alert('Error GPS', error.message || 'Problema al obtener ubicación');
    } finally {
      setCargando(false);
    }
  };

  return {
    cargando,
    ubicacionObtenida,
    probarGPS,
  };
};
