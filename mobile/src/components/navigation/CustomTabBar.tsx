import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import ActivePill from "./ActivePill";
import TabBarButton from "./TabBarButton";
import { TABS } from "./TabConfig";
import { useTheme } from "@/theme/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: any;
}

/** Docked editorial tab bar: surface panel, hairline top edge, brass active tick. */
export default function CustomTabBar({ state, navigation }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabWidth = SCREEN_WIDTH / state.routes.length;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom || 12,
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
        },
      ]}
    >
      <ActivePill index={state.index} tabWidth={tabWidth} />

      {TABS.map((tab, index) => (
        <TabBarButton
          key={tab.route}
          route={tab}
          focused={state.index === index}
          onPress={async () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index].key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented && state.index !== index) {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.jumpTo(tab.route);
            }
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 10,
    borderTopWidth: 1,
  },
});
