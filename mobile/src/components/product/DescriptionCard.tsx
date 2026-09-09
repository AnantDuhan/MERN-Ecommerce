import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Card } from "@/components/ui/Card";
import { H2, Body, Txt } from "@/components/ui/Text";
import { type } from "@/theme/tokens";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  description: string;
}

export default function DescriptionCard({ description }: Props) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.wrapper}>
      <Card>
        <View style={styles.header}>
          <H2>Description</H2>
          <Ionicons name="document-text-outline" size={18} color={colors.brass} />
        </View>

        <Body tone="soft" numberOfLines={expanded ? undefined : 3}>
          {description}
        </Body>

        <Pressable style={styles.button} onPress={toggle} hitSlop={8}>
          <Txt tone="brass" style={{ ...type.eyebrow }}>
            {expanded ? "Show Less" : "Show More"}
          </Txt>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.brass}
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 24, marginTop: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
});
