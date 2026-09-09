import React from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Eyebrow, Display, Body } from "@/components/ui/Text";
import { Rule } from "@/components/ui/Rule";
import { spacing } from "@/theme/tokens";

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export default function AuthHeader({
  title,
  subtitle,
  eyebrow = "Order Planning",
}: Props) {
  return (
    <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
      <Animated.View entering={FadeInDown.delay(100).duration(700)}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(700)}>
        <Display center style={{ marginTop: spacing.md }}>
          {title}
        </Display>
      </Animated.View>

      <Rule style={{ width: 80, marginTop: spacing.md, alignSelf: "center" }} />

      {subtitle ? (
        <Animated.View entering={FadeInDown.delay(350).duration(700)}>
          <Body
            tone="soft"
            center
            style={{ marginTop: spacing.md, paddingHorizontal: spacing.lg }}
          >
            {subtitle}
          </Body>
        </Animated.View>
      ) : null}
    </View>
  );
}
