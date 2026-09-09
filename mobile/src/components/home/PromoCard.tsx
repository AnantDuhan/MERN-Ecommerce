import React, { useEffect } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Eyebrow, Display, Body } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { radii, spacing } from "@/theme/tokens";

interface Props {
  title: string;
  subtitle: string;
  description: string;
  button: string;
  colors?: readonly [string, string]; // kept for API compatibility (unused)
  image?: ImageSourcePropType;
  onPress?: () => void;
}

/** Editorial hero: bordered surface panel, brass eyebrow, serif headline, floating product. */
export default function PromoCard({
  title,
  subtitle,
  description,
  button,
  image,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-9, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: "-8deg" }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(700)} style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.surface, borderColor: colors.line },
        ]}
      >
        <View style={styles.left}>
          <Eyebrow>{title}</Eyebrow>
          <Display style={{ marginTop: spacing.sm }}>{subtitle}</Display>
          <Body tone="soft" style={{ marginTop: spacing.sm }}>
            {description}
          </Body>
          <Button
            label={button}
            onPress={onPress ?? (() => {})}
            style={{ marginTop: spacing.md, alignSelf: "flex-start" }}
          />
        </View>

        {image && (
          <View style={styles.right}>
            <Animated.Image
              source={image}
              resizeMode="contain"
              style={[styles.image, animatedImageStyle]}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 24, marginBottom: 8 },
  container: {
    borderWidth: 1,
    borderRadius: radii.xs,
    overflow: "hidden",
    flexDirection: "row",
    padding: spacing.lg,
    minHeight: 200,
  },
  left: { flex: 1, justifyContent: "center" },
  right: { width: 120, justifyContent: "center", alignItems: "center" },
  image: { width: 160, height: 160, marginRight: -20 },
});
