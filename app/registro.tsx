import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRegistro } from '~/hooks/victima/useRegistro';
import { useRegistroStore } from '~/stores/registro/registroStore';
import { useAtenticacionStore } from '~/stores/victimas/atenticacionStore';
import DatosPersonales from '~/components/registro/DatosPersonales';
import DatosUbicacion from '~/components/registro/DatosUbicacion';
import DatosContactoEmergencia from '~/components/registro/DatosContactoEmergencia';

export default function PantallaRegistro() {
  const { cedulaIdentidad, codigoDenuncia, modo } = useLocalSearchParams<{
    cedulaIdentidad: string;
    codigoDenuncia: string;
    modo: string;
  }>();

  const esEdicion = modo === 'editar';

  // Obtener idVictima del store de autenticación
  const { idVictima } = useAtenticacionStore();

  const { isLoading, handleRegistro, handleActualizacion } = useRegistro({
    cedulaIdentidad: cedulaIdentidad || '',
    codigoDenuncia: codigoDenuncia || '',
    esEdicion,
    idVictima: idVictima || '',
  });

  // Store global del registro
  const { validacionPasos, obtenerDatosCompletos, limpiarDatos } = useRegistroStore();

  // Estado del wizard
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 3;

  // Limpiar datos al montar el componente (solo en modo registro)
  useEffect(() => {
    if (!esEdicion) {
      limpiarDatos();
    }
  }, [esEdicion]);

  // Manejo de validaciones (ahora usan el store)
  const esPasoValido = () => {
    switch (pasoActual) {
      case 1:
        return validacionPasos.paso1;
      case 2:
        return validacionPasos.paso2;
      case 3:
        return validacionPasos.paso3;
      default:
        return false;
    }
  };

  // Navegación simplificada
  const handleNavigate = (action: 'prev' | 'next' | 'complete') => {
    switch (action) {
      case 'prev':
        if (pasoActual > 1) {
          setPasoActual(pasoActual - 1);
        }
        break;
      case 'next':
        if (esPasoValido() && pasoActual < totalPasos) {
          setPasoActual(pasoActual + 1);
        }
        break;
      case 'complete':
        completarRegistro();
        break;
    }
  };

  const completarRegistro = async () => {
    try {
      // Obtener datos del store global
      const { datosPersonales, datosUbicacion, contactosEmergencia } = obtenerDatosCompletos();

      const datosCompletos = {
        cedulaIdentidad: esEdicion ? datosPersonales.cedulaIdentidad : cedulaIdentidad || '',
        nombres: datosPersonales.nombres,
        apellidos: datosPersonales.apellidos,
        fechaNacimiento: datosPersonales.fechaNacimiento,
        celular: datosPersonales.celular,
        correo: datosPersonales.correo,
        idMunicipio: Number(datosUbicacion.idMunicipio),
        direccion: datosUbicacion.direccion,
        contactosEmergencia: contactosEmergencia.map((contacto) => ({
          parentesco: contacto.parentesco,
          nombreCompleto: contacto.nombre,
          celular: contacto.telefono,
          principal: contacto.esPrincipal,
        })),
      };

      let result;
      if (esEdicion) {
        result = await handleActualizacion(datosCompletos);
      } else {
        result = await handleRegistro(datosCompletos);
      }

      // Todas las alertas y navegación se manejan en los hooks
    } catch (error) {
      console.error(`Error en ${esEdicion ? 'actualización' : 'registro'}:`, error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* PASO 1: DATOS PERSONALES */}
      {pasoActual === 1 && (
        <DatosPersonales
          cedulaIdentidad={cedulaIdentidad || ''}
          pasoActual={pasoActual}
          totalPasos={totalPasos}
          esEdicion={esEdicion}
          onNavigate={handleNavigate}
          codigoDenuncia={codigoDenuncia}
        />
      )}

      {/* PASO 2: DATOS DE UBICACIÓN */}
      {pasoActual === 2 && <DatosUbicacion pasoActual={pasoActual} totalPasos={totalPasos} esEdicion={esEdicion} onNavigate={handleNavigate} />}

      {/* PASO 3: CONTACTOS DE EMERGENCIA */}
      {pasoActual === 3 && (
        <DatosContactoEmergencia
          pasoActual={pasoActual}
          totalPasos={totalPasos}
          esEdicion={esEdicion}
          onNavigate={handleNavigate}
          isLoading={isLoading}
        />
      )}
    </View>
  );
}
