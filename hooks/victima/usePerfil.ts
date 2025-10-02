import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAtenticacionStore } from "~/stores/victimas/atenticacionStore";
import { useRegistroStore } from "~/stores/registro/registroStore";
import { VictimaService } from "~/services/victima/victimaService";
import { ContactoEmergencia } from "~/lib/tiposApi";

/**
 * Hook para manejar la lógica del perfil de usuario
 * Solo carga datos si no existen en el store global
 */
export function usePerfil() {
  const { idVictima } = useAtenticacionStore();
  const { datosPersonales, datosUbicacion, contactosEmergencia, setDatosPersonales, setDatosUbicacion, setContactosEmergencia } = useRegistroStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Verificar si ya hay datos básicos en el store
  const tieneDatosBasicos = Boolean(datosPersonales.nombres && datosPersonales.apellidos && datosPersonales.cedulaIdentidad);

  // Cargar datos solo si no hay datos básicos y no se ha cargado antes
  useEffect(() => {
    if (!idVictima || hasLoaded || tieneDatosBasicos) return;

    cargarDatosDelServidor();
  }, [idVictima, hasLoaded, tieneDatosBasicos]);

  // Función para cargar datos desde la API (solo cuando se solicita)
  const cargarDatosDelServidor = async () => {
    if (!idVictima) return;

    try {
      setIsRefreshing(true);
      const respuesta = await VictimaService.obtenerPerfilPorIdVictima(idVictima);

      if (respuesta?.datos?.victima) {
        const victima = respuesta.datos.victima;

        // Actualizar store con datos del servidor
        setDatosPersonales({
          cedulaIdentidad: victima.cedulaIdentidad || "",
          nombres: victima.nombres || "",
          apellidos: victima.apellidos || "",
          fechaNacimiento: victima.fechaNacimiento || "",
          celular: victima.celular || "",
          correo: victima.correo || "",
          fechaRegistro: victima.fechaRegistro || "",
        });

        setDatosUbicacion({
          idMunicipio: victima.idMunicipio ? String(victima.idMunicipio) : "",
          municipio: victima.municipio || "",
          provincia: victima.provincia || "",
          departamento: victima.departamento || "",
          direccion: {
            zona: victima.direccion?.zona || "",
            calle: victima.direccion?.calle || "",
            numero: victima.direccion?.numero || "",
            referencia: victima.direccion?.referencia || "",
          },
        });

        if (victima.contactosEmergencia) {
          const contactosFormateados = victima.contactosEmergencia.map((contacto: ContactoEmergencia) => ({
            parentesco: contacto.parentesco,
            nombre: contacto.nombreCompleto,
            telefono: contacto.celular,
            esPrincipal: contacto.principal || true,
          }));
          setContactosEmergencia(contactosFormateados);
        }

        setHasLoaded(true);
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      Alert.alert("Error", "No se pudieron cargar los datos del perfil");
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    datosPersonales,
    datosUbicacion,
    contactosEmergencia,
    isRefreshing,
    tieneDatosBasicos,
    refrescarDatos: cargarDatosDelServidor,
  };
}
