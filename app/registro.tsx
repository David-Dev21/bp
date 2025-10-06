import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRegistro } from "~/hooks/victima/useRegistro";
import { usePerfilStore } from "~/stores/perfilStore";
import DatosPersonales from "~/components/registro/DatosPersonales";
import DatosUbicacion from "~/components/registro/DatosUbicacion";
import DatosContactoEmergencia from "~/components/registro/DatosContactoEmergencia";

export default function PantallaRegistro() {
  // Hook para registro
  const { isLoading, handleRegistro } = useRegistro();

  // Store global del registro
  const { obtenerDatosCompletos } = usePerfilStore();

  // Estado del wizard
  const [pasoActual, setPasoActual] = useState(1);
  const totalPasos = 3;

  // Navegación simplificada
  const handleNavigate = (action: "prev" | "next" | "complete") => {
    switch (action) {
      case "prev":
        if (pasoActual > 1) {
          setPasoActual(pasoActual - 1);
        }
        break;
      case "next":
        if (pasoActual < totalPasos) {
          setPasoActual(pasoActual + 1);
        }
        break;
      case "complete":
        completarRegistro();
        break;
    }
  };

  const completarRegistro = async () => {
    try {
      // Obtener datos del store global
      const { datosPersonales, datosUbicacion, contactosEmergencia } = obtenerDatosCompletos();

      const datosCompletos = {
        cedulaIdentidad: datosPersonales.cedulaIdentidad,
        nombres: datosPersonales.nombres,
        apellidos: datosPersonales.apellidos,
        fechaNacimiento: datosPersonales.fechaNacimiento,
        celular: datosPersonales.celular,
        correo: datosPersonales.correo?.trim() || undefined,
        idMunicipio: Number(datosUbicacion.idMunicipio),
        direccion: datosUbicacion.direccion,
        contactosEmergencia: contactosEmergencia.map((contacto) => ({
          parentesco: contacto.parentesco,
          nombreCompleto: contacto.nombre,
          celular: contacto.telefono,
          principal: contacto.esPrincipal,
        })),
      };

      await handleRegistro(datosCompletos);
      // Todas las alertas y navegación se manejan en los hooks
    } catch (error) {
      console.error("Error en registro:", error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* PASO 1: DATOS PERSONALES */}
      {pasoActual === 1 && <DatosPersonales pasoActual={pasoActual} totalPasos={totalPasos} onNavigate={handleNavigate} />}

      {/* PASO 2: DATOS DE UBICACIÓN */}
      {pasoActual === 2 && <DatosUbicacion pasoActual={pasoActual} totalPasos={totalPasos} onNavigate={handleNavigate} />}

      {/* PASO 3: CONTACTOS DE EMERGENCIA */}
      {pasoActual === 3 && (
        <DatosContactoEmergencia pasoActual={pasoActual} totalPasos={totalPasos} onNavigate={handleNavigate} isLoading={isLoading} />
      )}
    </View>
  );
}
