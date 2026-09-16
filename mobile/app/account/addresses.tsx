import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TopBar from "@/components/common/TopBar";
import AuthTextField from "@/components/auth/AuthTextField";
import { Card } from "@/components/ui/Card";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useAddresses } from "@/features/addresses/hooks/useAddresses";
import { useAddAddress } from "@/features/addresses/hooks/useAddAddress";
import { useDeleteAddress } from "@/features/addresses/hooks/useDeleteAddress";
import {
  shippingSchema,
  ShippingFormData,
} from "@/features/orders/validation/shipping.schema";

export default function AddressesScreen() {
  const { colors, isDark } = useTheme();
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const deleteAddress = useDeleteAddress();
  const [showForm, setShowForm] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { address: "", city: "", state: "", country: "", pinCode: "", phoneNumber: "" },
  });

  const onSubmit = (data: ShippingFormData) => {
    addAddress.mutate(data, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Account" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View>
              <Eyebrow tone="soft">Saved</Eyebrow>
              <Display style={{ marginTop: spacing.xs }}>Addresses</Display>
            </View>
            <Pressable
              onPress={() => setShowForm((v) => !v)}
              style={[styles.addBtn, { borderColor: colors.line }]}
            >
              <Ionicons name={showForm ? "close" : "add"} size={22} color={colors.ink} />
            </Pressable>
          </View>

          {showForm && (
            <Card style={{ marginTop: spacing.lg }}>
              <Controller control={control} name="address" render={({ field }) => (
                <AuthTextField label="Address" icon="home-outline" value={field.value}
                  onChangeText={field.onChange} error={errors.address?.message} />
              )} />
              <Controller control={control} name="city" render={({ field }) => (
                <AuthTextField label="City" icon="business-outline" value={field.value}
                  onChangeText={field.onChange} error={errors.city?.message} />
              )} />
              <Controller control={control} name="state" render={({ field }) => (
                <AuthTextField label="State" icon="map-outline" value={field.value}
                  onChangeText={field.onChange} error={errors.state?.message} />
              )} />
              <Controller control={control} name="country" render={({ field }) => (
                <AuthTextField label="Country" icon="earth-outline" value={field.value}
                  onChangeText={field.onChange} error={errors.country?.message} />
              )} />
              <Controller control={control} name="pinCode" render={({ field }) => (
                <AuthTextField label="PIN / ZIP" icon="location-outline" keyboardType="number-pad"
                  value={field.value} onChangeText={field.onChange} error={errors.pinCode?.message} />
              )} />
              <Controller control={control} name="phoneNumber" render={({ field }) => (
                <AuthTextField label="Phone Number" icon="call-outline" keyboardType="phone-pad"
                  value={field.value} onChangeText={field.onChange} error={errors.phoneNumber?.message} />
              )} />
              {addAddress.isError && (
                <Txt tone="danger" center style={{ marginBottom: spacing.sm }}>
                  {(addAddress.error as any)?.response?.data?.message ?? "Couldn't save address."}
                </Txt>
              )}
              <Button label={addAddress.isPending ? "Saving…" : "Save Address"} loading={addAddress.isPending} onPress={handleSubmit(onSubmit)} />
            </Card>
          )}

          <View style={{ marginTop: spacing.lg }}>
            {isLoading ? (
              <ActivityIndicator color={colors.brass} style={{ marginTop: 24 }} />
            ) : addresses.length === 0 ? (
              <Body tone="soft" center style={{ marginTop: 24 }}>
                No saved addresses yet.
              </Body>
            ) : (
              addresses.map((a) => (
                <Card key={a._id} style={{ marginBottom: spacing.md }}>
                  <View style={styles.addressRow}>
                    <View style={{ flex: 1 }}>
                      {a.label ? <BodySm style={{ marginBottom: 4 }}>{a.label}</BodySm> : null}
                      <Body tone="soft">{a.address}</Body>
                      <Body tone="soft">{`${a.city}, ${a.state}`}</Body>
                      <Caption tone="faint" style={{ marginTop: 4 }}>{`${a.country} — ${a.pinCode}`}</Caption>
                    </View>
                    <Pressable onPress={() => deleteAddress.mutate(a._id)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={18} color={colors.inkFaint} />
                    </Pressable>
                  </View>
                </Card>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  addBtn: { width: 44, height: 44, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  addressRow: { flexDirection: "row", alignItems: "flex-start" },
});
