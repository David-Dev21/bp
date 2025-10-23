import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner-native";
import { useAtenticacionStore } from "~/stores/atenticacionStore";
import { VictimaService } from "~/services/victimaService";
import { DenunciasService } from "~/services/denunciasService";
import { usePerfilStore } from "~/stores/perfilStore";
import { PerfilVictima, ContactoEmergencia } from "~/lib/tiposApi";

interface DispositivoDiferente {
  mostrar: boolean;
  idVictima: string;
}

export const useLogin = () => {
  const router = useRouter();
  const { setUsuario, setCodigoDenuncia } = useAtenticacionStore();
  const { setDatosPersonales, setDatosUbicacion, setContactosEmergencia } = usePerfilStore();

  // Estado para manejar AlertDialog de dispositivo diferente
  const [dispositivoDiferente, setDispositivoDiferente] = useState<DispositivoDiferente>({
    mostrar: false,
    idVictima: "",
  });

  const verificarDenuncia = async (codigoDenuncia: string, cedulaIdentidad: string) => {
    try {
      const verificacion = await DenunciasService.verificarDenunciaPorCodigoYCedula(codigoDenuncia, cedulaIdentidad);
      // verificarDenunciaPorCodigoYCedula now returns { codigoValido: boolean }
      return verificacion.codigoValido;
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : "Error al verificar denuncia";
      toast.error(mensajeError);
      return false;
    }
  };

  const verificarUsuarioExistente = async (cedulaIdentidad: string) => {
    try {
      const verificacion = await VictimaService.verificarVictimaPorCI(cedulaIdentidad);
      // verificarVictimaPorCI now returns { existe: boolean; idVictima?: string; ... }
      if (!verificacion.existe) {
        return null;
      }
      return verificacion;
    } catch (error) {
      return null;
    }
  };

  const manejarUsuarioValidado = async (idVictima: string) => {
    // Verificar si ya tenemos la apiKey en el store (persisted)
    const { apiKey } = useAtenticacionStore.getState();
    if (apiKey) {
      setUsuario(idVictima, apiKey);
      router.push("/alerta");
    } else {
      // Si no hay apiKey guardada, redirigir a verificar código
      router.push("/verificar-codigo" as any);
    }
  };

  const manejarUsuarioPendiente = async (idVictima: string) => {
    try {
      const perfil = await VictimaService.obtenerPerfilPorIdVictima(idVictima);
      // obtenerPerfilPorIdVictima now returns { victima: PerfilVictima }
      cargarDatosPerfil(perfil.victima);
      router.push("/verificar-codigo" as any);
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : "Error al obtener perfil";
      toast.error(mensajeError);
    }
  };

  const manejarUsuarioNuevo = (cedulaIdentidad: string, codigoDenuncia: string) => {
    router.push({
      pathname: "/registro",
      params: { cedulaIdentidad, codigoDenuncia },
    });
  };

  const manejarLogin = async (data: { cedulaIdentidad: string; codigoDenuncia: string }) => {
    try {
      // Paso 1: Verificar denuncia
      const denunciaValida = await verificarDenuncia(data.codigoDenuncia, data.cedulaIdentidad);
      if (!denunciaValida) return;

      setCodigoDenuncia(data.codigoDenuncia);

      // Paso 2: Verificar si usuario existe
      const datosUsuario = await verificarUsuarioExistente(data.cedulaIdentidad);
      if (!datosUsuario) {
        manejarUsuarioNuevo(data.cedulaIdentidad, data.codigoDenuncia);
        return;
      }

      // Paso 3: Verificar idDispositivo
      const idVictima = datosUsuario.idVictima!;
      const idDispositivo = datosUsuario.idDispositivo;
      const storedId = await AsyncStorage.getItem("id_dispositivo");
      if (storedId && idDispositivo && idDispositivo !== storedId) {
        // Mostrar AlertDialog en el componente
        setDispositivoDiferente({ mostrar: true, idVictima });
        return;
      }

      // Paso 4: Manejar según estado de cuenta
      if (datosUsuario.estadoCuenta === "PENDIENTE_VERIFICACION") {
        await manejarUsuarioPendiente(idVictima);
      } else {
        await manejarUsuarioValidado(idVictima);
      }
    } catch (error: any) {
      toast.error("Algo salió mal. Intenta nuevamente.");
    }
  };

  const cargarDatosPerfil = (datosPerfil: PerfilVictima) => {
    setDatosPersonales({
      cedulaIdentidad: datosPerfil.cedulaIdentidad,
      nombres: datosPerfil.nombres,
      apellidos: datosPerfil.apellidos,
      fechaNacimiento: datosPerfil.fechaNacimiento,
      celular: datosPerfil.celular,
      correo: datosPerfil.correo,
      fechaRegistro: datosPerfil.fechaRegistro,
    });

    setDatosUbicacion({
      municipio: datosPerfil.municipio,
      provincia: datosPerfil.provincia,
      departamento: datosPerfil.departamento,
      direccion: {
        zona: datosPerfil.direccion?.zona || "",
        calle: datosPerfil.direccion?.calle || "",
        numero: datosPerfil.direccion?.numero || "",
        referencia: datosPerfil.direccion?.referencia || "",
      },
    });

    setContactosEmergencia(
      datosPerfil.contactosEmergencia?.map((contacto: ContactoEmergencia) => ({
        parentesco: contacto.parentesco,
        nombre: contacto.nombreCompleto,
        telefono: contacto.celular,
        esPrincipal: contacto.principal || false,
      })) || []
    );
  };

  return {
    manejarLogin,
    dispositivoDiferente,
    setDispositivoDiferente,
    manejarUsuarioPendiente,
  };
};
