import React from "react";
import { Modal, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface ModalOpcionesContactoProps {
  visible: boolean;
  onClose: () => void;
  onEditar: () => void;
  onEliminar: () => void;
  onMarcarPrincipal: () => void;
  esPrincipal: boolean;
  permiteEliminar: boolean;
  mostrarConfirmacionEliminar: boolean;
  onConfirmarEliminar: () => void;
  onCancelarEliminar: () => void;
  deleteText?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmActionText?: string;
}

const ModalOpcionesContacto = ({
  visible,
  onClose,
  onEditar,
  onEliminar,
  onMarcarPrincipal,
  esPrincipal,
  permiteEliminar,
  mostrarConfirmacionEliminar,
  onConfirmarEliminar,
  onCancelarEliminar,
  deleteText = "Quitar",
  confirmTitle = "¿Quitar contacto?",
  confirmDescription = "¿Está seguro que desea quitar este contacto de emergencia?",
  confirmActionText = "Quitar",
}: ModalOpcionesContactoProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <>
      {/* Modal de opciones del contacto */}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable className="flex-1 justify-center items-center bg-black/50" onPress={onClose}>
          <Pressable className="bg-background rounded-3xl w-[80%] shadow-2xl" onPress={(e) => e.stopPropagation()}>
            {!esPrincipal && (
              <Pressable onPress={onMarcarPrincipal} className="flex-row items-center gap-3 px-6 py-3 border-b border-border/50 active:bg-primary/10">
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text className="text-base font-medium">Marcar como Principal</Text>
              </Pressable>
            )}
            <Pressable onPress={onEditar} className="flex-row items-center gap-3 px-6 py-3 border-b border-border/50 active:bg-primary/10">
              <Ionicons name="create" size={24} color="#5a6a2f" />
              <Text className="text-base font-medium">Editar</Text>
            </Pressable>
            <Pressable onPress={onEliminar} className="flex-row items-center gap-3 px-6 py-3 active:bg-destructive/10" disabled={!permiteEliminar}>
              <Ionicons name="close-circle" size={24} color={!permiteEliminar ? "#9CA3AF" : "#DC2626"} />
              <Text className={`text-base font-medium ${!permiteEliminar ? "text-muted-foreground" : "text-destructive"}`}>{deleteText}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* AlertDialog de confirmación para eliminar */}
      <AlertDialog open={mostrarConfirmacionEliminar} onOpenChange={onCancelarEliminar}>
        <AlertDialogContent className="4/5">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={onConfirmarEliminar} className="bg-destructive active:bg-destructive/80">
              <Text className="text-destructive-foreground">{confirmActionText}</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ModalOpcionesContacto;
