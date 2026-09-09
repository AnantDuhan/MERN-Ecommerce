import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import { Card } from "@/components/ui/Card";
import { Rule } from "@/components/ui/Rule";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useMembershipPlans } from "@/features/membership/hooks/useMembershipPlans";
import { useCurrentMembership } from "@/features/membership/hooks/useCurrentMembership";
import { useCreateMembership } from "@/features/membership/hooks/useCreateMembership";
import { useCancelMembership } from "@/features/membership/hooks/useCancelMembership";
import { PlanInterval } from "@/features/membership/types/membership";

const STATUS_MESSAGES: Record<string, string> = {
  INITIALIZED: "Membership created. Complete authorization to activate it.",
  BANK_APPROVAL_PENDING: "Authorization received. Your bank is reviewing it.",
  ACTIVE: "Your recurring membership is active.",
  ON_HOLD: "A recurring payment needs attention.",
  CANCELLED: "This membership has been cancelled.",
};

const PERKS = ["Complimentary shipping", "Early access to new drops", "Member-only offers"];

export default function MembershipScreen() {
  const { colors, isDark } = useTheme();
  const { data: plans = [], isLoading: plansLoading } = useMembershipPlans();
  const { data: membership, isLoading: membershipLoading } = useCurrentMembership();
  const createMembership = useCreateMembership();
  const cancelMembership = useCancelMembership();
  const [busyInterval, setBusyInterval] = useState<PlanInterval | null>(null);

  const isMember = membership?.isActive && membership.status === "ACTIVE";
  const isAuthPending = ["INITIALIZED", "BANK_APPROVAL_PENDING"].includes(membership?.status ?? "");
  const statusMessage = STATUS_MESSAGES[membership?.status ?? ""] ?? "Checking your membership status…";

  const startMembership = async (interval: PlanInterval) => {
    setBusyInterval(interval);
    try {
      const res = await createMembership.mutateAsync(interval);
      router.push({
        pathname: "/membership-checkout",
        params: { subscriptionId: res.subscriptionId, subsSessionId: res.subscriptionSessionId },
      });
    } catch {
      // surfaced via createMembership.isError below
    } finally {
      setBusyInterval(null);
    }
  };

  const continueAuthorization = () => {
    if (!membership?.subscriptionSessionId) {
      const interval: PlanInterval = membership?.planId === "maison-yearly" ? "yearly" : "monthly";
      startMembership(interval);
      return;
    }
    router.push({
      pathname: "/membership-checkout",
      params: {
        subscriptionId: membership.subscriptionId,
        subsSessionId: membership.subscriptionSessionId,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Account" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Eyebrow tone="soft">Maison Membership</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>A quieter way to shop well.</Display>
        <Body tone="soft" style={{ marginTop: spacing.md }}>
          Choose a recurring membership and authorize secure automatic billing.
        </Body>

        <View style={styles.perks}>
          {PERKS.map((perk) => (
            <View key={perk} style={[styles.perk, { borderLeftColor: colors.brass }]}>
              <BodySm tone="soft">{perk}</BodySm>
            </View>
          ))}
        </View>

        {membershipLoading ? (
          <ActivityIndicator color={colors.brass} style={{ marginTop: spacing.xl }} />
        ) : membership ? (
          <Card style={{ marginTop: spacing.xl }}>
            <Eyebrow>{isMember ? "You are a Maison member" : "Membership status"}</Eyebrow>
            <Display style={{ marginTop: spacing.sm, fontSize: 28 }}>{membership.name}</Display>
            <Body tone="soft" style={{ marginTop: spacing.sm }}>{statusMessage}</Body>

            {isMember && membership.nextPaymentDate ? (
              <Caption tone="faint" style={{ marginTop: spacing.sm }}>
                {`Next payment: ${new Date(membership.nextPaymentDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`}
              </Caption>
            ) : null}

            <Rule style={{ marginVertical: spacing.lg }} />

            {isAuthPending && (
              <Button label="Continue Authorization" onPress={continueAuthorization} />
            )}
            {isMember && (
              <Button
                label={cancelMembership.isPending ? "Cancelling…" : "Cancel Membership"}
                variant="outline"
                loading={cancelMembership.isPending}
                onPress={() => cancelMembership.mutate(membership.subscriptionId)}
              />
            )}
          </Card>
        ) : null}

        {(!membership || membership.status === "CANCELLED") && (
          <View style={{ marginTop: spacing.xl }}>
            <H3 style={{ marginBottom: spacing.md }}>Choose a Plan</H3>
            {plansLoading ? (
              <ActivityIndicator color={colors.brass} />
            ) : (
              plans.map((plan) => (
                <Card key={plan.interval} style={{ marginBottom: spacing.md }}>
                  <View style={styles.planRow}>
                    <View>
                      <BodySm style={{ fontFamily: type.h3.fontFamily }}>{plan.name}</BodySm>
                      <Caption tone="faint" style={{ marginTop: 2 }}>
                        {plan.duration === 1 ? "Billed monthly" : "Billed yearly"}
                      </Caption>
                    </View>
                    <Txt style={{ ...type.h2 }}>{`\u20B9${plan.amount.toLocaleString()}`}</Txt>
                  </View>
                  <Button
                    label={busyInterval === plan.interval ? "Starting…" : "Start Membership"}
                    loading={busyInterval === plan.interval}
                    onPress={() => startMembership(plan.interval)}
                    style={{ marginTop: spacing.md }}
                  />
                </Card>
              ))
            )}
            {createMembership.isError && (
              <Txt tone="danger" center style={{ marginTop: spacing.sm }}>
                {(createMembership.error as any)?.response?.data?.message ?? "Couldn't start membership."}
              </Txt>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  perks: { marginTop: spacing.lg, gap: 8 },
  perk: { borderLeftWidth: 2, paddingLeft: spacing.sm },
  planRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
