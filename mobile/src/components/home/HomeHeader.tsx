import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Eyebrow, Display, BodySm } from "@/components/ui/Text";
import { spacing } from "@/theme/tokens";
import { useLocationLabel } from "@/features/location/hooks/useLocationLabel";

interface Props {
  userName: string;
  /** Overrides the auto-detected location label, if provided. */
  location?: string;
  onNotificationPress?: () => void;
}

export default function HomeHeader({
  userName,
  location,
  onNotificationPress,
}: Props) {
  const { colors } = useTheme();
  const { label, status } = useLocationLabel();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const displayLabel = location ?? label;
  const isDenied = status === "denied" && !displayLabel;

  return (
    <Animated.View entering={FadeInDown.duration(700)} style={styles.container}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Eyebrow tone="soft">{getGreeting()}</Eyebrow>
          <Display style={{ marginTop: spacing.xs }}>{userName}</Display>
        </View>

        <Pressable
          onPress={onNotificationPress}
          style={[styles.iconBtn, { borderColor: colors.line }]}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.ink} />
        </Pressable>
      </View>

      <Pressable
        style={styles.deliveryRow}
        disabled={!isDenied}
        onPress={() => Linking.openSettings()}
      >
        <Ionicons name="location-outline" size={15} color={colors.brass} />
        <Eyebrow tone="faint" style={{ marginLeft: 6 }}>
          Deliver to
        </Eyebrow>
        <BodySm tone="soft" style={{ marginLeft: 8 }} numberOfLines={1}>
          {isDenied
            ? "Enable location access"
            : displayLabel ?? "Detecting location…"}
        </BodySm>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 12, marginBottom: 28 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  deliveryRow: { marginTop: 20, flexDirection: "row", alignItems: "center" },
});
