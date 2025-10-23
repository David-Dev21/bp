import { useEffect, useState } from "react";
import { toast } from "sonner-native";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { usePerfilStore } from "~/stores/perfilStore";
import { VictimaService } from "~/services/victimaService";
import { ContactoEmergencia } from "~/lib/tiposApi";

export function usePerfil() {
  const { idVictima } = useAtenticacionStore();
  const { datosPersonales, datosUbicacion, contactosEmergencia, setDatosPersonales, setDatosUbicacion, setContactosEmergencia } = usePerfilStore();
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

      // obtenerPerfilPorIdVictima now returns { victima: PerfilVictima }
      const victima = respuesta.victima;

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
          id: contacto.id,
          parentesco: contacto.parentesco,
          nombre: contacto.nombreCompleto,
          telefono: contacto.celular,
          esPrincipal: contacto.principal || false,
        }));
        setContactosEmergencia(contactosFormateados);
      }

      setHasLoaded(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cargar perfil");
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
