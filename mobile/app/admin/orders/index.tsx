import React from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import TopBar from "@/components/common/TopBar";
import StatusPill from "@/components/orders/StatusPill";
import { Card } from "@/components/ui/Card";
import { Display, Eyebrow, BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { useAdminOrders } from "@/features/admin/orders/hooks/useAdminOrders";

export default function AdminOrdersScreen() {
  const { colors, isDark } = useTheme();
  const { data, isLoading, refetch, isFetching } = useAdminOrders();
  const orders = data?.orders ?? [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Admin" />

      <View style={styles.header}>
        <Eyebrow tone="soft">All Orders</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>Orders</Display>
        {data && (
          <Caption tone="faint" style={{ marginTop: spacing.sm }}>
            {`${orders.length} orders — \u20B9${data.totalAmount.toLocaleString()} total`}
          </Caption>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.brass} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push({ pathname: "/admin/orders/[id]", params: { id: item._id } })}>
              <Card style={{ marginBottom: spacing.md }}>
                <View style={styles.row}>
                  <StatusPill status={item.orderStatus} />
                  <Caption tone="faint">{new Date(item.createdAt).toLocaleDateString()}</Caption>
                </View>
                <BodySm tone="faint" style={{ marginTop: spacing.sm }}>{`#${item._id.slice(-10)}`}</BodySm>
                <View style={styles.row}>
                  <Caption tone="soft">{`${item.orderItems.length} item${item.orderItems.length === 1 ? "" : "s"}`}</Caption>
                  <Txt style={{ ...type.h3 }}>{`\u20B9${item.totalPrice.toLocaleString()}`}</Txt>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm },
});
