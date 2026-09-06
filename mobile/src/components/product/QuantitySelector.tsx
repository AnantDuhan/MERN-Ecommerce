import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import * as Haptics from "expo-haptics";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
      style={[styles.button, animatedStyle]}
    >
      <Ionicons
        name={icon === "add" ? "add" : "remove"}
        size={22}
        color="#2F80ED"
      />
    </AnimatedPressable>
  );
}

export default function QuantitySelector({
  initialValue = 1,
  min = 1,
  max = 99,
  onChange,
}: Props) {
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
      <Text style={styles.title}>Quantity</Text>

      <View style={styles.selector}>
        <ActionButton icon="remove" onPress={decrease} />

        <Text style={styles.quantity}>{quantity}</Text>

        <ActionButton icon="add" onPress={increase} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  selector: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5EA8FF",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  quantity: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
});
