import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, Redirect } from "expo-router";

import TopBar from "@/components/common/TopBar";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { Card } from "@/components/ui/Card";
import { Rule } from "@/components/ui/Rule";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { useCartStore, selectCartSubtotal } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { computePricing } from "@/features/orders/pricing";

function PriceRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.priceRow}>
      {strong ? <Eyebrow>{label}</Eyebrow> : <Body tone="soft">{label}</Body>}
      <Txt style={strong ? { ...type.h3 } : { ...type.body }}>{value}</Txt>
    </View>
  );
}

export default function ConfirmScreen() {
  const { colors, isDark } = useTheme();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = useCheckoutStore((s) => s.shipping);

  if (!shipping) return <Redirect href="/checkout/shipping" />;

  const { itemsPrice, shippingPrice, totalPrice } = computePricing(subtotal);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Checkout" />
      <CheckoutSteps active={1} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Eyebrow tone="soft">Review</Eyebrow>
        <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>Confirm Order</Display>

        <Card style={{ marginBottom: spacing.lg }}>
          <View style={styles.cardHead}>
            <H3>Deliver To</H3>
          </View>
          <Body tone="soft">{shipping.address}</Body>
          <Body tone="soft">{`${shipping.city}, ${shipping.state}`}</Body>
          <Body tone="soft">{`${shipping.country} — ${shipping.pinCode}`}</Body>
          <Caption tone="faint" style={{ marginTop: 6 }}>{`Phone: ${shipping.phoneNumber}`}</Caption>
        </Card>

        <Card style={{ marginBottom: spacing.lg }}>
          <H3 style={{ marginBottom: spacing.md }}>{`Items (${items.length})`}</H3>
          {items.map((item, index) => (
            <View key={`${item.id}-${item.size ?? ""}`}
              style={[styles.itemRow, index !== items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.line }]}>
              {item.image ? (
                <Image source={item.image} resizeMode="contain" style={styles.thumb} />
              ) : <View style={[styles.thumb, { backgroundColor: colors.surface2 }]} />}
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <BodySm numberOfLines={1} style={{ fontFamily: type.h3.fontFamily }}>{item.name}</BodySm>
                <Caption tone="faint" style={{ marginTop: 2 }}>{`Qty ${item.quantity}`}</Caption>
              </View>
              <Txt style={{ ...type.bodySm, fontFamily: type.h3.fontFamily }}>
                {`\u20B9${(item.price * item.quantity).toLocaleString()}`}
              </Txt>
            </View>
          ))}
        </Card>

        <Card>
          <PriceRow label="Items" value={`\u20B9${itemsPrice.toLocaleString()}`} />
          <PriceRow label="Shipping" value={shippingPrice === 0 ? "Free" : `\u20B9${shippingPrice}`} />
          <Rule style={{ marginVertical: spacing.md }} />
          <PriceRow label="Total" value={`\u20B9${totalPrice.toLocaleString()}`} strong />
        </Card>

        <Button label="Continue to Payment" onPress={() => router.push("/checkout/payment")} style={{ marginTop: spacing.lg }} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  cardHead: { marginBottom: spacing.sm },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  thumb: { width: 52, height: 52 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
});
