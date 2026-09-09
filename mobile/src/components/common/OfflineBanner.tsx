import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeContext";
import { Caption } from "./../ui/Text";
import { spacing } from "@/theme/tokens";

/**
 * A slim banner that appears whenever the device has no network
 * connection, and disappears the moment it's back. Cart, wishlist, and
 * recently-viewed all stay usable offline since they're persisted locally;
 * this just makes that state visible instead of silent.
 */
export default function OfflineBanner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // isConnected can briefly be null while resolving — only flag a
      // confirmed disconnect, not the initial unknown state.
      setOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, []);

  if (!offline) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      exiting={FadeOutUp.duration(200)}
      style={[
        styles.container,
        { top: insets.top, backgroundColor: colors.ink },
      ]}
    >
      <Ionicons name="cloud-offline-outline" size={14} color={colors.onInk} />
      <Caption tone="onInk" style={{ marginLeft: spacing.xs }}>
        You're offline — showing saved data
      </Caption>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
});
