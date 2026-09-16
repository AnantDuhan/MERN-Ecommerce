import React, { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import { Card } from "@/components/ui/Card";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAdminReturns } from "@/features/admin/returns/hooks/useAdminReturns";
import { useUpdateReturnStatus } from "@/features/admin/returns/hooks/useUpdateReturnStatus";
import { RETURN_STATUSES } from "@/features/admin/returns/types/adminReturn";

export default function AdminReturnsScreen() {
  const { colors, isDark } = useTheme();
  const { data: returns = [], isLoading, refetch, isFetching } = useAdminReturns();
  const updateStatus = useUpdateReturnStatus();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Admin" />

      <View style={styles.header}>
        <Eyebrow tone="soft">Requests</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>Returns</Display>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.brass} style={{ marginTop: 40 }} />
      ) : returns.length === 0 ? (
        <Body tone="soft" center style={{ marginTop: 40 }}>No return requests.</Body>
      ) : (
        <FlatList
          data={returns}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: spacing.md }}>
              <View style={styles.row}>
                <BodySm style={{ fontFamily: type.h3.fontFamily }}>{item.order.user?.name ?? "Unknown customer"}</BodySm>
                <Caption tone="faint">{new Date(item.requestedAt).toLocaleDateString()}</Caption>
              </View>
              <Caption tone="soft" style={{ marginTop: 4 }}>{item.reason}</Caption>
              <View style={styles.row}>
                <Txt tone="brass" style={{ ...type.eyebrow }}>{item.status}</Txt>
                <Txt style={{ ...type.h3 }}>{`\u20B9${item.order.totalPrice?.toLocaleString() ?? "—"}`}</Txt>
              </View>

              {openId === item._id ? (
                <View style={{ marginTop: spacing.md }}>
                  {RETURN_STATUSES.map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => {
                        updateStatus.mutate({ id: item._id, status: s });
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
