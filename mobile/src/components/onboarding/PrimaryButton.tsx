import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/theme/ThemeContext";
import { Txt } from "@/components/ui/Text";
import { radii, type } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  disabled?: boolean;
}

/** Editorial solid button (ink fill, uppercase tracked label). Kept API-compatible. */
export default function PrimaryButton({
  title,
  onPress,
  style,
  loading = false,
  disabled = false,
}: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const isOff = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={isOff}
      onPress={onPress}
      onPressIn={() => {
        if (!isOff) {
          scale.value = withSpring(0.98);
          Haptics.selectionAsync().catch(() => {});
        }
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        animatedStyle,
        {
          height: 54,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.ink,
          borderRadius: radii.none,
          opacity: isOff ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.onInk} />
      ) : (
        <Txt tone="onInk" style={{ ...type.eyebrow, fontSize: 12.5 }}>
          {title}
        </Txt>
      )}
    </AnimatedPressable>
  );
}
