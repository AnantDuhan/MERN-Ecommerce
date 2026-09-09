import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TopBar from "@/components/common/TopBar";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import AuthTextField from "@/components/auth/AuthTextField";
import { Display, Eyebrow } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useCheckoutStore } from "@/store/checkout.store";
import {
  shippingSchema,
  ShippingFormData,
} from "@/features/orders/validation/shipping.schema";

export default function ShippingScreen() {
  const { colors, isDark } = useTheme();
  const shipping = useCheckoutStore((s) => s.shipping);
  const setShipping = useCheckoutStore((s) => s.setShipping);

  const { control, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shipping ?? {
      address: "", city: "", state: "", country: "", pinCode: "", phoneNumber: "",
    },
  });

  const onSubmit = (data: ShippingFormData) => {
    setShipping(data);
    router.push("/checkout/confirm");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Checkout" />
      <CheckoutSteps active={0} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Eyebrow tone="soft">Where to</Eyebrow>
          <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>Shipping</Display>

          <Controller control={control} name="address" render={({ field }) => (
            <AuthTextField label="Address" icon="home-outline" placeholder="Street address"
              value={field.value} onChangeText={field.onChange} error={errors.address?.message} />
          )} />
          <Controller control={control} name="city" render={({ field }) => (
            <AuthTextField label="City" icon="business-outline" placeholder="City"
              value={field.value} onChangeText={field.onChange} error={errors.city?.message} />
          )} />
          <Controller control={control} name="state" render={({ field }) => (
            <AuthTextField label="State" icon="map-outline" placeholder="State"
              value={field.value} onChangeText={field.onChange} error={errors.state?.message} />
          )} />
          <Controller control={control} name="country" render={({ field }) => (
            <AuthTextField label="Country" icon="earth-outline" placeholder="Country"
              value={field.value} onChangeText={field.onChange} error={errors.country?.message} />
          )} />
          <Controller control={control} name="pinCode" render={({ field }) => (
            <AuthTextField label="PIN / ZIP Code" icon="location-outline" placeholder="e.g. 641001"
              keyboardType="number-pad" value={field.value} onChangeText={field.onChange} error={errors.pinCode?.message} />
          )} />
          <Controller control={control} name="phoneNumber" render={({ field }) => (
            <AuthTextField label="Phone Number" icon="call-outline" placeholder="10-digit number"
              keyboardType="phone-pad" value={field.value} onChangeText={field.onChange} error={errors.phoneNumber?.message} />
          )} />

          <Button label="Continue to Confirm" onPress={handleSubmit(onSubmit)} style={{ marginTop: spacing.lg }} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
});
