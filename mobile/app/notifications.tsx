import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import { Display, Eyebrow, Body, BodySm, Caption } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useNotificationsStore } from "@/store/notifications.store";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationsScreen() {
  const { colors, isDark } = useTheme();
  const items = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  React.useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Account" />

      <View style={styles.header}>
        <Eyebrow tone="soft">Updates</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>Notifications</Display>
      </View>

      {items.length === 0 ? (
        <View style={styles.stateBox}>
          <Ionicons name="notifications-outline" size={40} color={colors.inkFaint} />
          <Body tone="soft" center style={{ marginTop: spacing.md }}>
            You're all caught up. Order and account updates will appear here.
          </Body>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: spacing.md }}>
              <BodySm style={{ fontWeight: "600" }}>{item.title}</BodySm>
              <Body tone="soft" style={{ marginTop: 4 }}>{item.body}</Body>
              <Caption tone="faint" style={{ marginTop: spacing.sm }}>
                {timeAgo(item.receivedAt)}
              </Caption>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  stateBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
});
