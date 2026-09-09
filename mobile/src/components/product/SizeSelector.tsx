import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { H3, Txt } from "@/components/ui/Text";
import { radii, spacing, type } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  sizes: string[];
  defaultSize?: string;
  onChange?: (size: string) => void;
}

interface SizeItemProps {
  size: string;
  selected: boolean;
  onPress: () => void;
}

function SizeItem({ size, selected, onPress }: SizeItemProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handlePress = async () => {
    scale.value = withSpring(0.92);
    await Haptics.selectionAsync();
    onPress();
    scale.value = withSpring(1);
  };
  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        {
          width: 48,
          height: 48,
          marginRight: 12,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: radii.xs,
          borderColor: selected ? colors.ink : colors.line,
          backgroundColor: selected ? colors.ink : colors.surface,
        },
        animatedStyle,
      ]}
    >
      <Txt
        tone={selected ? "onInk" : "ink"}
        style={{ ...type.bodySm, fontFamily: type.h3.fontFamily }}
      >
        {size}
      </Txt>
    </AnimatedPressable>
  );
}

export default function SizeSelector({ sizes, defaultSize, onChange }: Props) {
  const [selectedSize, setSelectedSize] = useState(defaultSize ?? sizes[0]);
  const selectSize = (size: string) => {
    setSelectedSize(size);
    onChange?.(size);
  };
  return (
    <View style={styles.container}>
      <H3 style={{ marginBottom: spacing.md }}>Select Size</H3>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {sizes.map((size) => (
          <SizeItem
            key={size}
            size={size}
            selected={selectedSize === size}
            onPress={() => selectSize(size)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, paddingHorizontal: 24 },
});
