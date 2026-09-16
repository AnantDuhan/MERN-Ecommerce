import React, { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import { Card } from "@/components/ui/Card";
import { Display, Eyebrow, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAdminRefunds } from "@/features/admin/refunds/hooks/useAdminRefunds";
import { useUpdateRefundStatus } from "@/features/admin/refunds/hooks/useUpdateRefundStatus";
import { REFUND_STATUSES } from "@/features/admin/refunds/types/adminRefund";

export default function AdminRefundsScreen() {
  const { colors, isDark } = useTheme();
  const { data: refunds = [], isLoading, refetch, isFetching } = useAdminRefunds();
  const updateStatus = useUpdateRefundStatus();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Admin" />

      <View style={styles.header}>
        <Eyebrow tone="soft">Processing</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>Refunds</Display>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.brass} style={{ marginTop: 40 }} />
      ) : refunds.length === 0 ? (
        <Body tone="soft" center style={{ marginTop: 40 }}>No refunds yet.</Body>
      ) : (
        <FlatList
          data={refunds}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.row}>
                <BodySm style={{ fontFamily: type.h3.fontFamily }}>{item.order.user?.name ?? "Unknown customer"}</BodySm>
                <Caption tone="faint">{new Date(item.initiatedAt).toLocaleDateString()}</Caption>
              </View>
              <View style={styles.row}>
                <Txt tone="brass" style={{ ...type.eyebrow }}>{item.status}</Txt>
                <Txt style={{ ...type.h3 }}>{`\u20B9${item.amount.toLocaleString()}`}</Txt>
              </View>

              {openId === item._id ? (
                <View style={{ marginTop: spacing.md }}>
                  {REFUND_STATUSES.map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => {
                        updateStatus.mutate({ orderId: item.order._id, refundId: item._id, refundStatus: s });
                        setOpenId(null);
                      }}
                      style={[styles.statusRow, { borderColor: colors.line, backgroundColor: s === item.status ? colors.surface2 : "transparent" }]}
                    >
                      <Body>{s}</Body>
                      {s === item.status && <Ionicons name="checkmark" size={16} color={colors.brass} />}
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Button
                  label="Update Status"
                  variant="outline"
                  onPress={() => setOpenId(item._id)}
                  style={{ marginTop: spacing.md }}
                />
              )}
            </Card>
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
  statusRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderRadius: radii.xs, paddingHorizontal: spacing.md, paddingVertical: 10, marginBottom: 6,
  },
});
