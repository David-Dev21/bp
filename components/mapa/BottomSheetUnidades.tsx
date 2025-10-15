import { memo, useMemo, useRef } from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { UnidadPolicial } from "~/lib/tiposApi";
import { THEME_COLORS } from "~/lib/theme";

interface BottomSheetUnidadesProps {
  unidades: UnidadPolicial[];
  colorScheme: string | undefined;
  tema: any;
  onUnidadPress?: (unidad: UnidadPolicial) => void;
}

export const BottomSheetUnidades = memo(function BottomSheetUnidades({ unidades, colorScheme, tema, onUnidadPress }: BottomSheetUnidadesProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "50%"], []);
  const isDark = colorScheme === "dark";
  const themeColors = THEME_COLORS[isDark ? "dark" : "light"];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: themeColors.card }}
      handleIndicatorStyle={{ backgroundColor: themeColors.border }}
      enablePanDownToClose={false}
      enableOverDrag={false}
      animateOnMount={false}
      enableDynamicSizing={false}
    >
      <View className="px-4 pb-8">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-lg font-bold">Unidades Policiales Cercanas</Text>
          <Badge variant="secondary" className="mt-1">
            <Text>
              {unidades.length} {unidades.length === 1 ? "unidad" : "unidades"}
            </Text>
          </Badge>
        </View>
      </View>

      <BottomSheetFlatList
        data={unidades}
        keyExtractor={(item: UnidadPolicial) => item.id}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 85 }}
        renderItem={({ item: unidad }: { item: UnidadPolicial }) => (
          <Pressable onPress={() => onUnidadPress?.(unidad)} className="active:bg-secondary/20 rounded-xl p-3 my-1 bg-primary/5">
            <View className="flex-row items-start gap-3">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mt-1"
                style={{
                  backgroundColor: `${themeColors.primary}20`,
                }}
              >
                <Ionicons name="shield" size={16} color={themeColors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-sm flex-1">{unidad.unidad}</Text>
                <Text className="text-xs text-muted-foreground mb-1" numberOfLines={2}>
                  {unidad.direccion}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </BottomSheet>
  );
});
