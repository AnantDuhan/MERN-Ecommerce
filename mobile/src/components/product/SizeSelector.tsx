import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as Haptics from "expo-haptics";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

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

function SizeItem({
  size,
  selected,
  onPress,
}: SizeItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  const handlePress = async () => {
    scale.value = withSpring(0.92);
    await Haptics.selectionAsync();
    onPress();
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      style={[
        styles.sizeButton,
        selected && styles.selectedButton,
        animatedStyle,
      ]}
      onPress={handlePress}
    >
      <Text
        style={[
          styles.sizeText,
          selected && styles.selectedText,
        ]}
      >
        {size}
      </Text>
    </AnimatedPressable>
  );
}

export default function SizeSelector({
  sizes,
  defaultSize,
  onChange,
}: Props) {
  const [selectedSize, setSelectedSize] = useState(
    defaultSize ?? sizes[0]
  );

  const selectSize = (size: string) => {
    setSelectedSize(size);
    onChange?.(size);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Select Size
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
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
  container: {
    marginTop: 24,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 18,
  },

  list: {
    paddingRight: 24,
  },

  sizeButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5EA8FF",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  selectedButton: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
    shadowOpacity: 0.12,
  },

  sizeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },

  selectedText: {
    color: "#FFFFFF",
  },
});