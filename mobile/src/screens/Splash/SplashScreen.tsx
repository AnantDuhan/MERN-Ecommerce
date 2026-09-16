import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { Screen } from "@/components/ui/Screen";
import { Eyebrow, Display, Body } from "@/components/ui/Text";
import { Rule } from "@/components/ui/Rule";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";

export default function SplashScreen() {
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Screen padded>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          entering={FadeInDown.duration(700)}
          style={{ alignItems: "center" }}
        >
          <Eyebrow>Curated Commerce</Eyebrow>

          <Display center style={{ marginTop: spacing.md }}>
            Order Planning
          </Display>

          <Rule
            style={{ width: 120, marginTop: spacing.lg, alignSelf: "center" }}
          />

          <Body tone="soft" center style={{ marginTop: spacing.lg }}>
            Discover amazing deals
          </Body>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeIn.delay(400).duration(700)}
        style={{ alignItems: "center", paddingBottom: spacing.xl }}
      >
        <ActivityIndicator size="small" color={colors.brass} />
      </Animated.View>
    </Screen>
  );
}
