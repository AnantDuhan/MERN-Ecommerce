import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Card } from "@/components/ui/Card";
import { H2, BodySm, Txt } from "@/components/ui/Text";
import { type } from "@/theme/tokens";

interface Specification {
  title: string;
  value: string;
}

interface Props {
  specifications?: Specification[];
}

export default function SpecificationCard({ specifications = [] }: Props) {
  const { colors } = useTheme();
  if (specifications.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.wrapper}>
      <Card>
        <View style={styles.header}>
          <H2>Specifications</H2>
          <Ionicons name="grid-outline" size={18} color={colors.brass} />
        </View>

        {specifications.map((item, index) => (
          <View
            key={`${item.title}-${index}`}
            style={[
              styles.row,
              index !== specifications.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
              },
            ]}
          >
            <BodySm tone="faint" style={{ flex: 1 }}>
              {item.title}
            </BodySm>
            <Txt
              style={{
                ...type.bodySm,
                fontFamily: type.h3.fontFamily,
                flex: 1,
                textAlign: "right",
              }}
            >
              {item.value}
            </Txt>
          </View>
        ))}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 28, paddingHorizontal: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
});
