import React from "react";
import { Dimensions, StyleSheet } from "react-native";

import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ActivePill from "./ActivePill";
import TabBarButton from "./TabBarButton";
import { TABS } from "./TabConfig";

import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HORIZONTAL_MARGIN = 20;

interface Props {
  state: {
    index: number;
    routes: {
      key: string;
      name: string;
    }[];
  };

  navigation: any;
}

export default function CustomTabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();

  const tabWidth = (SCREEN_WIDTH - HORIZONTAL_MARGIN * 2) / state.routes.length;

  return (
    <BlurView
      intensity={90}
      tint="light"
      style={[
        styles.container,
        {
          bottom: insets.bottom + 14,
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
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: HORIZONTAL_MARGIN,
    right: HORIZONTAL_MARGIN,
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",
    opacity: 0.7,
    // iOS Shadow
    shadowColor: "#2F80ED",
    shadowOpacity: 0.62,
    shadowRadius: 45,
    shadowOffset: {
        width: 0,
        height: 22,
    },

    // Android Shadow
    elevation: 22,
  },
});
