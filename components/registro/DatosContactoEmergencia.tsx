import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, Pressable, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useRegistroStore, ContactoEmergencia } from '~/stores/registro/registroStore';
import { Badge } from '~/components/ui/badge';
import { useSafeAreaInsetsWithFallback } from '~/hooks/base/useSafeAreaInsetsWithFallback';
import ModalContactoEmergencia from './ModalContactoEmergencia';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '~/components/ui/dropdown-menu';

interface DatosContactoEmergenciaProps {
  pasoActual: number;
  totalPasos: number;
  esEdicion: boolean;
  onNavigate: (action: 'prev' | 'next' | 'complete') => void;
  isLoading: boolean;
}

const DatosContactoEmergencia: React.FC<DatosContactoEmergenciaProps> = ({ pasoActual, totalPasos, esEdicion, onNavigate, isLoading }) => {
  // Store global
  const { contactosEmergencia, setContactosEmergencia, validarPaso3, validacionPasos } = useRegistroStore();

  // Safe area insets con fallback
  const espaciosSeguro = useSafeAreaInsetsWithFallback();

  const obtenerTituloPaso = () => {
    const prefijo = esEdicion ? 'Editar' : '';
    return `${prefijo} Contactos de Emergencia`.trim();
  };

  // Estado local del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [contactoTemporal, setContactoTemporal] = useState<ContactoEmergencia>({
    parentesco: '',
    nombre: '',
    telefono: '',
    esPrincipal: false,
  });
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  const validarDatos = () => {
    return (
      contactosEmergencia.length > 0 &&
      contactosEmergencia.every(
        (contacto) => contacto.parentesco !== '' && contacto.nombre.trim() !== '' && contacto.telefono.trim() !== '' && contacto.telefono.length >= 8,
      )
    );
  };

  const validarContactoTemporal = () => {
    return (
      contactoTemporal.parentesco !== '' &&
      contactoTemporal.nombre.trim() !== '' &&
      contactoTemporal.telefono.trim() !== '' &&
      contactoTemporal.telefono.length >= 8
    );
  };

  const abrirModal = (index?: number) => {
    if (index !== undefined) {
      setContactoTemporal({ ...contactosEmergencia[index] });
      setEditandoIndex(index);
    } else {
      setContactoTemporal({ parentesco: '', nombre: '', telefono: '', esPrincipal: false });
      setEditandoIndex(null);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setContactoTemporal({ parentesco: '', nombre: '', telefono: '', esPrincipal: false });
    setEditandoIndex(null);
  };

  const guardarContacto = () => {
    if (!validarContactoTemporal()) return;

    let nuevosContactos = [...contactosEmergencia];

    if (editandoIndex !== null) {
      nuevosContactos[editandoIndex] = { ...contactoTemporal };
    } else {
      nuevosContactos.push({ ...contactoTemporal });
    }

    setContactosEmergencia(nuevosContactos);
    cerrarModal();
  };

  const eliminarContacto = (index: number) => {
    const nuevosContactos = contactosEmergencia.filter((_, i) => i !== index);
    setContactosEmergencia(nuevosContactos);
  };

  const marcarComoPrincipal = (index: number) => {
    const nuevosContactos = contactosEmergencia.map((contacto, i) => ({
      ...contacto,
      esPrincipal: i === index,
    }));
    setContactosEmergencia(nuevosContactos);
  };

  useEffect(() => {
    const esValido = validarDatos();
    validarPaso3(esValido);
  }, [contactosEmergencia, validarPaso3]);

  const actualizarContactoTemporal = (campo: keyof ContactoEmergencia, valor: string | boolean) => {
    setContactoTemporal((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Título */}
        <View>
          <Text className="text-2xl font-bold text-center">{obtenerTituloPaso()}</Text>
          <Text className="text-center text-muted-foreground mt-1 mb-2">
            Paso {pasoActual} de {totalPasos}
          </Text>
        </View>

        <View className="flex-col gap-4">
          <View className="mx-auto">
            <Button onPress={() => abrirModal()} variant={'secondary'} size={'sm'} disabled={contactosEmergencia.length >= 5}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-add" size={16} color="#5a6a2f" />
                <Text>Contacto</Text>
              </View>
            </Button>
          </View>

          {/* Lista de contactos agregados */}
          <View>
            <Text className="font-medium mb-2">Contactos agregados ({contactosEmergencia.length})</Text>
            {contactosEmergencia.length === 0 ? (
              <View className="border border-dashed border-muted-foreground/30 rounded-lg p-4 bg-muted/20">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="person-outline" size={16} color="#9CA3AF" />
                  <Text className="text-muted-foreground text-sm">Debe agregar al menos un contacto de emergencia</Text>
                </View>
              </View>
            ) : (
              <View className="gap-2">
                {contactosEmergencia.map((item, index) => (
                  <View key={index} className="p-4 border-b border-border">
                    <View className="flex-row items-start">
                      <View className="flex-1">
                        <Text className="font-semibold text-base mb-2" numberOfLines={1}>
                          {item.nombre}
                        </Text>
                        <View className="flex-row items-center gap-2 mb-1">
                          <Ionicons name="people" size={16} color="#6B7280" />
                          <Text className="text-sm font-medium text-foreground capitalize">{item.parentesco}</Text>
                          {item.esPrincipal && (
                            <Badge>
                              <Text className="text-xs">Principal</Text>
                            </Badge>
                          )}
                        </View>
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="call" size={16} color="#6B7280" />
                          <Text className="text-sm text-muted-foreground">{item.telefono}</Text>
                        </View>
                      </View>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Pressable className="p-2">
                            <Ionicons name="ellipsis-vertical" size={20} />
                          </Pressable>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                          {!item.esPrincipal && (
                            <DropdownMenuItem onPress={() => marcarComoPrincipal(index)}>
                              <Ionicons name="star" size={16} color="#FFD700" />
                              <Text>Marcar como Principal</Text>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onPress={() => abrirModal(index)}>
                            <Ionicons name="pencil" size={16} color="#6B7280" />
                            <Text>Editar</Text>
                          </DropdownMenuItem>
                          <DropdownMenuItem onPress={() => eliminarContacto(index)} variant="destructive">
                            <Ionicons name="trash" size={16} color="#DC2626" />
                            <Text>Eliminar</Text>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Botones de navegación - Fuera del ScrollView */}
      <View className="flex-row justify-between items-center" style={{ paddingBottom: espaciosSeguro.bottom + 16 }}>
        {pasoActual > 1 ? (
          <Button variant="ghost" onPress={() => onNavigate('prev')} className="flex-row items-center gap-2">
            <Ionicons name="arrow-back" size={20} />
            <Text>Anterior</Text>
          </Button>
        ) : (
          <View style={{ width: 100 }} />
        )}

        <Button
          variant={'ghost'}
          onPress={() => onNavigate('complete')}
          disabled={isLoading || !validacionPasos.paso3}
          size={'sm'}
          className="flex-row items-center gap-2"
        >
          <Ionicons name="save" size={20} />
          <Text>{isLoading ? 'Guardando...' : 'Guardar'}</Text>
        </Button>
      </View>

      {/* Modal para agregar/editar contacto */}
      <ModalContactoEmergencia
        modalAbierto={modalAbierto}
        setModalAbierto={setModalAbierto}
        contactoTemporal={contactoTemporal}
        actualizarContactoTemporal={actualizarContactoTemporal}
        guardarContacto={guardarContacto}
        validarContactoTemporal={validarContactoTemporal}
        editandoIndex={editandoIndex}
      />
    </View>
  );
};

export default DatosContactoEmergencia;
