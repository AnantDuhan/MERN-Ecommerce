import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
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
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
}

interface ActionButtonProps {
  icon: "add" | "remove";
  onPress: () => void;
}

function ActionButton({ icon, onPress }: ActionButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handlePress = async () => {
    scale.value = withSpring(0.9);
    await Haptics.selectionAsync();
    onPress();
    scale.value = withSpring(1);
  };
  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        {
          width: 40,
          height: 40,
          borderRadius: radii.xs,
          borderWidth: 1,
          borderColor: colors.line,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.surface,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name={icon === "add" ? "add" : "remove"} size={20} color={colors.ink} />
    </AnimatedPressable>
  );
}

export default function QuantitySelector({
  initialValue = 1,
  min = 1,
  max = 99,
  onChange,
}: Props) {
  const { colors } = useTheme();
  const [quantity, setQuantity] = useState(initialValue);
  const updateQuantity = (value: number) => {
    setQuantity(value);
    onChange?.(value);
  };
  const decrease = () => {
    if (quantity <= min) return;
    updateQuantity(quantity - 1);
  };
  const increase = () => {
    if (quantity >= max) return;
    updateQuantity(quantity + 1);
  };
  return (
    <View style={styles.container}>
      <H3 style={{ marginBottom: spacing.md }}>Quantity</H3>
      <View
        style={[
          styles.selector,
          { borderColor: colors.line, backgroundColor: colors.surface },
        ]}
      >
        <ActionButton icon="remove" onPress={decrease} />
        <Txt style={{ ...type.h3 }}>{`${quantity}`}</Txt>
        <ActionButton icon="add" onPress={increase} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 28, paddingHorizontal: 24 },
  selector: {
    height: 56,
    borderRadius: radii.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
    width: 160,
  },
});
