import React from "react";
import { View } from "react-native";
import CampoPerfil from "./CampoPerfil";
import { DatosPersonales } from "~/stores/perfilStore";

interface InformacionPersonalProps {
  datosPersonales: DatosPersonales;
  fechaNacimientoFormateada: string;
  edadCalculada: string;
  onEditarContacto: (campo: "celular" | "correo") => void;
}

export default function InformacionPersonal({
  datosPersonales,
  fechaNacimientoFormateada,
  edadCalculada,
  onEditarContacto,
}: InformacionPersonalProps) {
  return (
    <View>
      <View className="flex-row">
        <CampoPerfil icono="card-outline" etiqueta="Cédula" valor={datosPersonales.cedulaIdentidad || "No especificado"} />
        <CampoPerfil icono="calendar-outline" etiqueta="Nacimiento" valor={fechaNacimientoFormateada} />
      </View>

      <View className="flex-row">
        <CampoPerfil icono="people-outline" etiqueta="Edad" valor={edadCalculada} />
        <CampoPerfil
          icono="call-outline"
          etiqueta="Celular"
          valor={datosPersonales.celular || "No especificado"}
          onPress={() => onEditarContacto("celular")}
        />
      </View>

      <View className="mb-2">
        <CampoPerfil
          icono="mail-outline"
          etiqueta="Correo"
          valor={datosPersonales.correo || "No especificado"}
          onPress={() => onEditarContacto("correo")}
        />
      </View>
    </View>
  );
}
