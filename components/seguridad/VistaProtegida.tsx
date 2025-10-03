import { useEffect, useState } from "react";
import { View, Image, AppState, type AppStateStatus } from "react-native";

// Componente que se muestra cuando la app está en segundo plano (vista previa multitask)
export function VistaProtegida({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Si la app está en background o inactive, mostrar vista de seguridad
  if (appState !== "active") {
    return (
      <View className="flex-1 bg-[#009688] items-center justify-center">
        <Image source={require("~/assets/images/iconos/android/res/mipmap-xxxhdpi/ic_launcher.png")} className="w-40 h-40" resizeMode="contain" />
      </View>
    );
  }

  return <>{children}</>;
}
