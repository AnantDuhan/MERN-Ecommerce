import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { Card } from "@/components/ui/Card";
import { Rule } from "@/components/ui/Rule";
import { Display, Eyebrow, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, radii, type } from "@/theme/tokens";
import { useCartStore, selectCartSubtotal } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { computePricing, estimateCouponDiscount } from "@/features/orders/pricing";
import { useCoupons } from "@/features/coupons/hooks/useCoupons";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import { useCreateCashfreeOrder } from "@/features/payment/hooks/useCreateCashfreeOrder";
import { CreateOrderRequest } from "@/features/orders/types/order";

type Method = "cashfree" | "cod";

export default function PaymentScreen() {
  const { colors, isDark } = useTheme();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = useCheckoutStore((s) => s.shipping);
  const couponCode = useCheckoutStore((s) => s.couponCode);
  const { data: coupons = [] } = useCoupons();
  const createOrder = useCreateOrder();
  const createCashfreeOrder = useCreateCashfreeOrder();
  const [method, setMethod] = useState<Method>("cashfree");

  if (!shipping) return <Redirect href="/checkout/shipping" />;

  const { itemsPrice, shippingPrice, totalPrice } = computePricing(subtotal);
  const isBusy = createOrder.isPending || createCashfreeOrder.isPending;

  // The backend applies the coupon's discount itself when we send the
  // ORIGINAL total + couponCode to /order/new — so `totalPrice` below stays
  // undiscounted for that call. This estimate is only for what we charge
  // via Cashfree, which must reflect what the customer actually pays now.
  const appliedCoupon = couponCode
    ? coupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase()) ?? null
    : null;
  const { discountedTotal: payableTotal } = estimateCouponDiscount(totalPrice, appliedCoupon);

  const placeCodOrder = () => {
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
      couponCode: couponCode ?? undefined,
    };
    createOrder.mutate(payload);
  };

  const startCashfree = () => {
    createCashfreeOrder.mutate(
      { amount: payableTotal, phoneNumber: shipping.phoneNumber },
      {
        onSuccess: (res) => {
          router.push({
            pathname: "/checkout/cashfree",
            params: { orderId: res.orderId, paymentSessionId: res.paymentSessionId },
          });
        },
      }
    );
  };

  const placeOrder = () => {
    if (method === "cod") placeCodOrder();
    else startCashfree();
  };

  const Option = ({ id, icon, title, subtitle }: {
    id: Method; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string;
  }) => {
    const selected = method === id;
    return (
      <Pressable
        onPress={() => setMethod(id)}
        style={[styles.option, {
          borderColor: selected ? colors.ink : colors.line,
          backgroundColor: colors.surface,
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

        <Option id="cashfree" icon="card-outline" title="Pay Securely" subtitle="Cards, UPI, netbanking & more via Cashfree" />
        <Option id="cod" icon="cash-outline" title="Pay on Delivery" subtitle="Pay with cash or UPI when it arrives" />

        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.priceRow}><Body tone="soft">Items</Body>
            <Txt style={{ ...type.body }}>{`\u20B9${itemsPrice.toLocaleString()}`}</Txt></View>
          <View style={styles.priceRow}><Body tone="soft">Shipping</Body>
            <Txt style={{ ...type.body }}>{shippingPrice === 0 ? "Free" : `\u20B9${shippingPrice}`}</Txt></View>
          <Rule style={{ marginVertical: spacing.md }} />
          {appliedCoupon && payableTotal !== totalPrice ? (
            <View style={styles.priceRow}><Body tone="soft">{`Coupon (${appliedCoupon.code})`}</Body>
              <Txt tone="success" style={{ ...type.body }}>{`- \u20B9${(totalPrice - payableTotal).toLocaleString()}`}</Txt></View>
          ) : null}
          <View style={styles.priceRow}><Eyebrow>Total</Eyebrow>
            <Txt style={{ ...type.h3 }}>{`\u20B9${payableTotal.toLocaleString()}`}</Txt></View>
        </Card>

        {(createOrder.isError || createCashfreeOrder.isError) && (
          <Txt tone="danger" center style={{ marginTop: spacing.md }}>
            Something went wrong. Please try again.
          </Txt>
        )}

        <Button
          label={
            isBusy
              ? "Please wait…"
              : method === "cashfree"
              ? "Proceed to Pay"
              : "Place Order"
          }
          loading={isBusy}
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
