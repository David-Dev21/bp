import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAtenticacionStore } from '~/stores/victimas/atenticacionStore';
import { VictimaService } from '~/services/victima/victimaService';
import { DenunciasService } from '~/services/victima/denunciasService';
import { useRegistroStore } from '~/stores/registro/registroStore';
import { PerfilVictima, ContactoEmergencia } from '~/lib/tiposApi';

export const useLogin = () => {
  const router = useRouter();
  const { setUsuario, setCodigoDenuncia } = useAtenticacionStore();
  const { setDatosPersonales, setDatosUbicacion, setContactosEmergencia } = useRegistroStore();

  const verificarDenuncia = async (codigoDenuncia: string, cedulaIdentidad: string) => {
    const verificacion = await DenunciasService.verificarDenunciaPorCodigoYCedula(codigoDenuncia, cedulaIdentidad);
    if (!verificacion.exito || !verificacion.datos?.codigoValido) {
      Alert.alert('Código inválido', 'El código de denuncia no existe o es incorrecto. Verifícalo con las autoridades.');
      return false;
    }
    return true;
  };

  const verificarUsuarioExistente = async (cedulaIdentidad: string) => {
    const verificacion = await VictimaService.verificarVictimaPorCI(cedulaIdentidad);
    if (!verificacion.exito || !verificacion.datos?.existe) {
      return null;
    }
    return verificacion.datos;
  };

  const manejarUsuarioValidado = async (idVictima: string) => {
    const perfil = await VictimaService.obtenerPerfilPorIdVictima(idVictima);
    if (perfil.exito && perfil.datos) {
      setUsuario(perfil.datos.id!, perfil.datos.apiKey!);
      router.push('/alerta');
    } else {
      Alert.alert('Error', 'No se pudo cargar tu información');
    }
  };

  const manejarUsuarioPendiente = async (idVictima: string) => {
    const perfil = await VictimaService.obtenerPerfilPorIdVictima(idVictima);
    if (perfil.exito && perfil.datos) {
      cargarDatosPerfil(perfil.datos);
      router.push('/solicitar-codigo' as any);
    } else {
      Alert.alert('Error', 'No se pudo cargar tu información');
    }
  };

  const manejarUsuarioNuevo = (cedulaIdentidad: string) => {
    router.push({
      pathname: '/registro',
      params: { cedulaIdentidad },
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
        manejarUsuarioNuevo(data.cedulaIdentidad);
        return;
      }

      // Paso 3: Verificar idDispositivo
      const idDispositivo = datosUsuario.idDispositivo;
      const storedId = await AsyncStorage.getItem('id_dispositivo');
      if (storedId && idDispositivo && idDispositivo !== storedId) {
        Alert.alert('Sesión iniciada en otro dispositivo', '¿Quieres cambiar la sesión a este dispositivo?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cambiar', onPress: () => manejarUsuarioPendiente(idVictima) },
        ]);
        return;
      }

      // Paso 4: Manejar según estado de cuenta
      const idVictima = datosUsuario.idVictima!;
      if (datosUsuario.estadoCuenta === 'PENDIENTE_VERIFICACION') {
        await manejarUsuarioPendiente(idVictima);
      } else {
        await manejarUsuarioValidado(idVictima);
      }
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', 'Algo salió mal. Intenta nuevamente.');
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
        zona: datosPerfil.direccion?.zona || '',
        calle: datosPerfil.direccion?.calle || '',
        numero: datosPerfil.direccion?.numero || '',
        referencia: datosPerfil.direccion?.referencia || '',
      },
    });

    setContactosEmergencia(
      datosPerfil.contactosEmergencia?.map((contacto: ContactoEmergencia) => ({
        parentesco: contacto.parentesco,
        nombre: contacto.nombreCompleto,
        telefono: contacto.celular,
        esPrincipal: contacto.principal || false,
      })) || [],
    );
  };

  return { manejarLogin };
};
