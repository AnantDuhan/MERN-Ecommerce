import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { Card } from "@/components/ui/Card";
import { Rule } from "@/components/ui/Rule";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, radii, type } from "@/theme/tokens";
import { useCartStore, selectCartSubtotal } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { computePricing } from "@/features/orders/pricing";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import { CreateOrderRequest } from "@/features/orders/types/order";

type Method = "cod" | "card";

export default function PaymentScreen() {
  const { colors, isDark } = useTheme();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = useCheckoutStore((s) => s.shipping);
  const createOrder = useCreateOrder();
  const [method, setMethod] = useState<Method>("cod");

  if (!shipping) return <Redirect href="/checkout/shipping" />;

  const { itemsPrice, shippingPrice, totalPrice } = computePricing(subtotal);

  const placeOrder = () => {
    const payload: CreateOrderRequest = {
      shippingInfo: {
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        country: shipping.country,
        pinCode: Number(shipping.pinCode),
        phoneNumber: Number(shipping.phoneNumber),
      },
      orderItems: items.map((i) => {
        const uri = (i.image as any)?.uri as string | undefined;
        return {
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          images: uri ? [{ url: uri }] : [],
          product: i.id,
        };
      }),
      paymentInfo: { id: `cod_${Date.now()}`, status: "Pay on Delivery" },
      itemsPrice,
      shippingPrice,
      totalPrice,
    };
    createOrder.mutate(payload);
  };

  const Option = ({ id, icon, title, subtitle, disabled }: {
    id: Method; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; disabled?: boolean;
  }) => {
    const selected = method === id;
    return (
      <Pressable
        disabled={disabled}
        onPress={() => setMethod(id)}
        style={[styles.option, {
          borderColor: selected ? colors.ink : colors.line,
          backgroundColor: colors.surface,
          opacity: disabled ? 0.5 : 1,
        }]}
      >
        <Ionicons name={icon} size={22} color={colors.ink} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <BodySm style={{ fontFamily: type.h3.fontFamily }}>{title}</BodySm>
          <Caption tone="faint" style={{ marginTop: 2 }}>{subtitle}</Caption>
        </View>
        <Ionicons
          name={selected ? "radio-button-on" : "radio-button-off"}
          size={20}
          color={selected ? colors.brass : colors.inkFaint}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Checkout" />
      <CheckoutSteps active={2} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Eyebrow tone="soft">Almost done</Eyebrow>
        <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>Payment</Display>

        <Option id="cod" icon="cash-outline" title="Pay on Delivery" subtitle="Pay with cash or UPI when it arrives" />
        <Option id="card" icon="card-outline" title="Card (Stripe)" subtitle="Coming soon" disabled />

        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.priceRow}><Body tone="soft">Items</Body>
            <Txt style={{ ...type.body }}>{`\u20B9${itemsPrice.toLocaleString()}`}</Txt></View>
          <View style={styles.priceRow}><Body tone="soft">Shipping</Body>
            <Txt style={{ ...type.body }}>{shippingPrice === 0 ? "Free" : `\u20B9${shippingPrice}`}</Txt></View>
          <Rule style={{ marginVertical: spacing.md }} />
          <View style={styles.priceRow}><Eyebrow>Total</Eyebrow>
            <Txt style={{ ...type.h3 }}>{`\u20B9${totalPrice.toLocaleString()}`}</Txt></View>
        </Card>

        {createOrder.isError && (
          <Txt tone="danger" center style={{ marginTop: spacing.md }}>
            Couldn't place order. Please try again.
          </Txt>
        )}

        <Button
          label={createOrder.isPending ? "Placing Order…" : "Place Order"}
          loading={createOrder.isPending}
          onPress={placeOrder}
          style={{ marginTop: spacing.lg }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radii.xs,
    padding: 16,
    marginBottom: 12,
  },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
});
