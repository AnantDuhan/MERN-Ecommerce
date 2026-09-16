import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import { Card } from "@/components/ui/Card";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAdminStats } from "@/features/admin/dashboard/hooks/useAdminStats";
import { useAdminAnalytics } from "@/features/admin/dashboard/hooks/useAdminAnalytics";

interface NavTile {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: number;
  route: string;
}

export default function AdminDashboardScreen() {
  const { colors, isDark } = useTheme();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();

  const tiles: NavTile[] = [
    { icon: "cube-outline", label: "Products", value: stats?.products, route: "/admin/products" },
    { icon: "receipt-outline", label: "Orders", value: stats?.orders, route: "/admin/orders" },
    { icon: "arrow-undo-outline", label: "Returns", value: stats?.returns, route: "/admin/returns" },
    { icon: "cash-outline", label: "Refunds", value: stats?.refunds, route: "/admin/refunds" },
    { icon: "people-outline", label: "Users", value: stats?.users, route: "/admin/users" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Admin" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Eyebrow tone="soft">Overview</Eyebrow>
        <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>Dashboard</Display>

        {statsLoading ? (
          <ActivityIndicator color={colors.brass} />
        ) : (
          <View style={styles.grid}>
            {tiles.map((tile) => (
              <Pressable
                key={tile.label}
                onPress={() => router.push(tile.route as any)}
                style={[styles.tile, { borderColor: colors.line, backgroundColor: colors.surface }]}
              >
                <Ionicons name={tile.icon} size={22} color={colors.brass} />
                <Txt style={{ ...type.h1, marginTop: spacing.sm }}>{tile.value ?? "—"}</Txt>
                <Caption tone="faint" style={{ marginTop: 2 }}>{tile.label}</Caption>
              </Pressable>
            ))}
          </View>
        )}

        {stats && (
          <Card style={{ marginTop: spacing.lg }}>
            <View style={styles.stockRow}>
              <BodySm tone="soft">In Stock</BodySm>
              <Txt tone="success" style={{ ...type.h3 }}>{stats.inStock}</Txt>
            </View>
            <View style={styles.stockRow}>
              <BodySm tone="soft">Out of Stock</BodySm>
              <Txt tone={stats.outOfStock > 0 ? "danger" : "success"} style={{ ...type.h3 }}>
                {stats.outOfStock}
              </Txt>
            </View>
          </Card>
        )}

        <H3 style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>Last 30 Days</H3>
        {analyticsLoading ? (
          <ActivityIndicator color={colors.brass} />
        ) : analytics ? (
          <Card>
            <View style={styles.statRow}>
              <Body tone="soft">Revenue</Body>
              <Txt style={{ ...type.h2 }}>{`\u20B9${analytics.summary.revenue.toLocaleString()}`}</Txt>
            </View>
            <View style={styles.statRow}>
              <Body tone="soft">Orders</Body>
              <Txt style={{ ...type.h3 }}>{analytics.summary.orders}</Txt>
            </View>
            <View style={styles.statRow}>
              <Body tone="soft">Avg. Order Value</Body>
              <Txt style={{ ...type.h3 }}>{`\u20B9${Math.round(analytics.summary.avgOrderValue).toLocaleString()}`}</Txt>
            </View>
            <View style={styles.statRow}>
              <Body tone="soft">Return Rate</Body>
              <Txt style={{ ...type.h3 }}>{`${analytics.summary.returnRate.toFixed(1)}%`}</Txt>
            </View>
          </Card>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  tile: {
    width: "31%",
    margin: "1.16%",
    borderWidth: 1,
    borderRadius: radii.xs,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  stockRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
});
