import { View } from "react-native";

// Componente wrapper simple para mantener compatibilidad
export function VistaProtegida({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
