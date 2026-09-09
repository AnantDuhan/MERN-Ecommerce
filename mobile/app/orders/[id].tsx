import React from "react";
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import TopBar from "@/components/common/TopBar";
import StatusPill from "@/components/orders/StatusPill";
import ReturnRequestCard from "@/components/orders/ReturnRequestCard";
import DeliveryCountdownCard from "@/components/orders/DeliveryCountdownCard";
import { useDeliveryReviewPrompt } from "@/features/reviews/hooks/useDeliveryReviewPrompt";
import { Card } from "@/components/ui/Card";
import { Rule } from "@/components/ui/Rule";
import { Button } from "@/components/ui/Button";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { useOrder } from "@/features/orders/hooks/useOrder";
import { useReorder } from "@/features/orders/hooks/useReorder";

export default function OrderDetailScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: order, isLoading, isError, refetch, isFetching } = useOrder(id);
  const reorder = useReorder();
  useDeliveryReviewPrompt(id ?? "", order?.status ?? "");

  const shell = (children: React.ReactNode, center?: boolean) => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Order" />
      {center ? <View style={styles.stateBox}>{children}</View> : children}
    </SafeAreaView>
  );

  if (isLoading) return shell(<ActivityIndicator color={colors.brass} />, true);
  if (isError || !order) return shell(<Body tone="soft">Order not found.</Body>, true);

  return shell(
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.brass} />
      }
    >
      <View style={styles.headerRow}>
        <View>
          <Eyebrow tone="soft">{new Date(order.createdAt).toLocaleDateString()}</Eyebrow>
          <Display style={{ marginTop: spacing.xs }}>{`#${order.id.slice(-10)}`}</Display>
        </View>
        <StatusPill status={order.status} />
      </View>

      {order.shippingInfo ? (
        <Card style={{ marginTop: spacing.lg }}>
          <H3 style={{ marginBottom: spacing.sm }}>Shipping</H3>
          {order.customerName ? (
            <View style={styles.metaRow}>
              <Caption tone="faint">Name</Caption>
              <BodySm>{order.customerName}</BodySm>
            </View>
          ) : null}
          <View style={styles.metaRow}>
            <Caption tone="faint">Phone</Caption>
            <BodySm>{order.shippingInfo.phoneNumber}</BodySm>
          </View>
          <Rule style={{ marginVertical: spacing.sm }} />
          <Body tone="soft">{order.shippingInfo.address}</Body>
          <Body tone="soft">{`${order.shippingInfo.city}, ${order.shippingInfo.state}`}</Body>
          <Body tone="soft">{`${order.shippingInfo.country} — ${order.shippingInfo.pinCode}`}</Body>
        </Card>
      ) : null}

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.metaRow}>
          <H3>Payment</H3>
          <Txt tone={order.isPaid ? "success" : "danger"} style={{ ...type.eyebrow }}>
            {order.isPaid ? "Paid" : "Not Paid"}
          </Txt>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <H3 style={{ marginBottom: spacing.md }}>{`Items (${order.itemCount})`}</H3>
        {order.items.map((item, index) => (
          <Pressable
            key={index}
            onPress={() =>
              router.push({ pathname: "/(product)/[id]", params: { id: item.product } })
            }
            style={[styles.itemRow, index !== order.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.line }]}
          >
            {item.image ? <Image source={item.image} resizeMode="contain" style={styles.thumb} /> : <View style={[styles.thumb, { backgroundColor: colors.surface2 }]} />}
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <BodySm numberOfLines={1} style={{ fontFamily: type.h3.fontFamily }}>{item.name}</BodySm>
              <Caption tone="faint" style={{ marginTop: 2 }}>{`Qty ${item.quantity}`}</Caption>
            </View>
            <Txt style={{ ...type.bodySm, fontFamily: type.h3.fontFamily }}>{`\u20B9${(item.price * item.quantity).toLocaleString()}`}</Txt>
          </Pressable>
        ))}
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.priceRow}><Body tone="soft">Items</Body><Txt style={{ ...type.body }}>{`\u20B9${order.itemsPrice.toLocaleString()}`}</Txt></View>
        <View style={styles.priceRow}><Body tone="soft">Shipping</Body><Txt style={{ ...type.body }}>{order.shippingPrice === 0 ? "Free" : `\u20B9${order.shippingPrice}`}</Txt></View>
        <Rule style={{ marginVertical: spacing.md }} />
        <View style={styles.priceRow}><Eyebrow>Total</Eyebrow><Txt style={{ ...type.h3 }}>{`\u20B9${order.totalPrice.toLocaleString()}`}</Txt></View>
      </Card>

      {order.estimatedDeliveryDate && (
        <DeliveryCountdownCard
          estimatedDeliveryDate={order.estimatedDeliveryDate}
          status={order.status}
        />
      )}

      <ReturnRequestCard orderId={order.id} status={order.status} isReturned={order.isReturned} />

      {reorder.isError && (
        <Txt tone="danger" center style={{ marginTop: spacing.md }}>
          Couldn't reorder. Please try again.
        </Txt>
      )}

      <Button
        label={reorder.isPending ? "Placing order…" : "Reorder"}
        variant="outline"
        loading={reorder.isPending}
        onPress={() => reorder.mutate(order.id)}
        style={{ marginTop: spacing.lg }}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  thumb: { width: 52, height: 52 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  stateBox: { flex: 1, alignItems: "center", justifyContent: "center" },
});
