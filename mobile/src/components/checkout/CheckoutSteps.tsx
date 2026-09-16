import React from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { Txt } from "@/components/ui/Text";
import { type } from "@/theme/tokens";

const STEPS = ["Shipping", "Confirm", "Payment"];

export default function CheckoutSteps({ active }: { active: 0 | 1 | 2 }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {STEPS.map((label, index) => {
        const done = index < active;
        const current = index === active;
        const on = done || current;
        return (
          <React.Fragment key={label}>
            <View style={styles.step}>
              <View
                style={[
                  styles.tick,
                  {
                    borderColor: on ? colors.brass : colors.line,
                    backgroundColor: done ? colors.brass : "transparent",
                  },
                ]}
              >
                <Txt
                  style={{
                    ...type.eyebrow,
                    fontSize: 11,
                    color: done
                      ? colors.onBrass
                      : current
                      ? colors.brass
                      : colors.inkFaint,
                  }}
                >
                  {index + 1}
                </Txt>
              </View>
              <Txt
                style={{
                  ...type.eyebrow,
                  fontSize: 9,
                  marginTop: 6,
                  color: on ? colors.ink : colors.inkFaint,
                }}
              >
                {label}
              </Txt>
            </View>

            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.line,
                  { backgroundColor: index < active ? colors.brass : colors.line },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  step: { alignItems: "center", width: 64 },
  tick: {
    width: 30,
    height: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  line: { flex: 1, height: 1, marginBottom: 18 },
});
