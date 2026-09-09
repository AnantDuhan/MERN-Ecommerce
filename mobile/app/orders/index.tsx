import React from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import StatusPill from "@/components/orders/StatusPill";
import { Card } from "@/components/ui/Card";
import { Display, Eyebrow, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { useMyOrders } from "@/features/orders/hooks/useMyOrders";

export default function MyOrdersScreen() {
  const { colors, isDark } = useTheme();
  const { data: orders = [], isLoading, isError, refetch, isFetching } = useMyOrders();

  const shell = (children: React.ReactNode) => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Account" />
      <View style={styles.header}>
        <Eyebrow tone="soft">History</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>My Orders</Display>
      </View>
      {children}
    </SafeAreaView>
  );

  if (isLoading) return shell(<View style={styles.stateBox}><ActivityIndicator color={colors.brass} /></View>);
  if (isError) return shell(<View style={styles.stateBox}><Body tone="soft">Couldn't load your orders.</Body></View>);
  if (orders.length === 0)
    return shell(
      <View style={styles.stateBox}>
        <Ionicons name="cube-outline" size={40} color={colors.inkFaint} />
        <Body tone="soft" center style={{ marginTop: spacing.md }}>No orders yet.</Body>
        <Button label="Start Shopping" variant="outline" onPress={() => router.replace("/(tabs)")} style={{ marginTop: spacing.lg }} />
      </View>
    );

  return shell(
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onRefresh={refetch}
      refreshing={isFetching}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push({ pathname: "/orders/[id]", params: { id: item.id } })}>
          <Card style={{ marginBottom: spacing.md }}>
            <View style={styles.rowTop}>
              <StatusPill status={item.status} />
              <Caption tone="faint">{new Date(item.createdAt).toLocaleDateString()}</Caption>
            </View>

            <View style={styles.thumbRow}>
              {item.items.slice(0, 3).map((line, index) =>
                line.image ? (
                  <Image
                    key={index}
                    source={line.image}
                    resizeMode="contain"
                    style={[
                      styles.thumb,
                      { borderColor: colors.line, marginLeft: index === 0 ? 0 : -14, zIndex: 3 - index },
                    ]}
                  />
                ) : (
                  <View
                    key={index}
                    style={[
                      styles.thumb,
                      { borderColor: colors.line, backgroundColor: colors.surface2, marginLeft: index === 0 ? 0 : -14, zIndex: 3 - index },
                    ]}
                  />
                )
              )}
              {item.itemCount > 3 && (
                <View style={[styles.thumb, styles.moreThumb, { borderColor: colors.line, backgroundColor: colors.surface2 }]}>
                  <Caption tone="soft">{`+${item.itemCount - 3}`}</Caption>
                </View>
              )}
              <BodySm tone="faint" style={{ marginLeft: spacing.md }}>{`Order #${item.id.slice(-10)}`}</BodySm>
            </View>

            <View style={styles.rowBottom}>
              <Caption tone="soft">{`${item.itemCount} item${item.itemCount === 1 ? "" : "s"}`}</Caption>
              <Txt style={{ ...type.h3 }}>{`\u20B9${item.totalPrice.toLocaleString()}`}</Txt>
            </View>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  thumbRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  thumb: { width: 44, height: 44, borderRadius: 4, borderWidth: 1 },
  moreThumb: { marginLeft: -14, justifyContent: "center", alignItems: "center" },
  rowBottom: { marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stateBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
});
