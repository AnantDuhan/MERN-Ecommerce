import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import StatusPill from "@/components/orders/StatusPill";
import { Card } from "@/components/ui/Card";
import { Rule } from "@/components/ui/Rule";
import { Button } from "@/components/ui/Button";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useOrder } from "@/features/orders/hooks/useOrder";
import { ORDER_STATUSES } from "@/features/admin/orders/types/adminOrder";
import { useUpdateAdminOrderStatus } from "@/features/admin/orders/hooks/useUpdateAdminOrderStatus";
import { useDeleteAdminOrder } from "@/features/admin/orders/hooks/useDeleteAdminOrder";
import { useInitiateRefund } from "@/features/admin/orders/hooks/useInitiateRefund";

export default function AdminOrderDetailScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateStatus = useUpdateAdminOrderStatus();
  const deleteOrder = useDeleteAdminOrder();
  const initiateRefund = useInitiateRefund();
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const shell = (children: React.ReactNode, center?: boolean) => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Orders" />
      {center ? <View style={styles.center}>{children}</View> : children}
    </SafeAreaView>
  );

  if (isLoading) return shell(<ActivityIndicator color={colors.brass} />, true);
  if (isError || !order) return shell(<Body tone="soft">Order not found.</Body>, true);

  const changeStatus = (status: string) => {
    setShowStatusPicker(false);
    updateStatus.mutate(
      { id: order.id, status },
      { onSuccess: () => refetch() }
    );
  };

  const confirmDelete = () => {
    Alert.alert("Delete Order", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteOrder.mutate(order.id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  return shell(
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Eyebrow tone="soft">{new Date(order.createdAt).toLocaleDateString()}</Eyebrow>
          <Display style={{ marginTop: spacing.xs }}>{`#${order.id.slice(-10)}`}</Display>
        </View>
        <StatusPill status={order.status} />
      </View>

      {order.customerName && (
        <Card style={{ marginTop: spacing.lg }}>
          <H3 style={{ marginBottom: spacing.sm }}>Customer</H3>
          <Body tone="soft">{order.customerName}</Body>
        </Card>
      )}

      <Card style={{ marginTop: spacing.lg }}>
        <H3 style={{ marginBottom: spacing.md }}>Update Status</H3>
        {showStatusPicker ? (
          <View>
            {ORDER_STATUSES.map((s) => (
              <Pressable
                key={s}
                onPress={() => changeStatus(s)}
                style={[styles.statusRow, { borderColor: colors.line, backgroundColor: s === order.status ? colors.surface2 : "transparent" }]}
              >
                <Body>{s}</Body>
                {s === order.status && <Ionicons name="checkmark" size={18} color={colors.brass} />}
              </Pressable>
            ))}
          </View>
        ) : (
          <Button
            label={updateStatus.isPending ? "Updating…" : "Change Status"}
            variant="outline"
            loading={updateStatus.isPending}
            onPress={() => setShowStatusPicker(true)}
          />
        )}
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <H3 style={{ marginBottom: spacing.md }}>{`Items (${order.itemCount})`}</H3>
        {order.items.map((item, index) => (
          <View key={index} style={[styles.itemRow, index !== order.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.line }]}>
            <BodySm style={{ flex: 1 }} numberOfLines={1}>{item.name}</BodySm>
            <Caption tone="faint">{`x${item.quantity}`}</Caption>
            <Txt style={{ ...type.bodySm, marginLeft: spacing.md }}>{`\u20B9${(item.price * item.quantity).toLocaleString()}`}</Txt>
          </View>
        ))}
        <Rule style={{ marginVertical: spacing.md }} />
        <View style={styles.itemRow}>
          <Eyebrow>Total</Eyebrow>
          <Txt style={{ ...type.h3 }}>{`\u20B9${order.totalPrice.toLocaleString()}`}</Txt>
        </View>
      </Card>

      {order.isReturned && (
        <Card style={{ marginTop: spacing.lg }}>
          <H3 style={{ marginBottom: spacing.sm }}>Return Requested</H3>
          {initiateRefund.isError && (
            <Txt tone="danger" style={{ marginBottom: spacing.sm }}>Couldn't initiate refund.</Txt>
          )}
          <Button
            label={initiateRefund.isPending ? "Initiating…" : "Initiate Refund"}
            onPress={() => initiateRefund.mutate(order.id)}
            loading={initiateRefund.isPending}
          />
        </Card>
      )}

      <Button
        label={deleteOrder.isPending ? "Deleting…" : "Delete Order"}
        variant="outline"
        loading={deleteOrder.isPending}
        onPress={confirmDelete}
        style={{ marginTop: spacing.lg }}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  statusRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderRadius: radii.xs, paddingHorizontal: spacing.md, paddingVertical: 12, marginBottom: 8,
  },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
});
