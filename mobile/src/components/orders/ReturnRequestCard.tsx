import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { H3, Body, BodySm, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing } from "@/theme/tokens";
import { useRequestReturn } from "@/features/orders/hooks/useRequestReturn";

// Kept in sync with the web app's return dialog.
const RETURN_REASONS = [
  "Defective Product",
  "Wrong Product Shipped",
  "Received Incomplete Order",
  "Product Doesn't Match Description",
  "Size Does Not Fit",
  "Color Doesn't Match",
  "Changed My Mind",
  "Item Arrived Late",
  "Ordered by Mistake",
  "Unsatisfactory Quality",
  "Received Damaged Product",
  "Ordered Duplicate Product",
  "Product Expired/Short Expiry Date",
  "Not Satisfied with Performance",
  "Item Doesn't Meet Expectations",
];

interface Props {
  orderId: string;
  status: string;
  isReturned: boolean;
}

export default function ReturnRequestCard({ orderId, status, isReturned }: Props) {
  const { colors } = useTheme();
  const requestReturn = useRequestReturn();
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState(RETURN_REASONS[0]);

  // Matches the web app: disabled while Processing/Shipped or already returned.
  const disallowed = ["processing", "shipped"].includes(status.toLowerCase());
  if (disallowed && !isReturned) return null;

  if (isReturned || requestReturn.isSuccess) {
    return (
      <Card style={{ marginTop: spacing.lg }}>
        <Body tone="soft" center>
          A return request has been submitted for this order.
        </Body>
      </Card>
    );
  }

  return (
    <Card style={{ marginTop: spacing.lg }}>
      <H3>Not what you expected?</H3>

      {showForm ? (
        <View style={{ marginTop: spacing.md }}>
          <BodySm tone="faint" style={{ marginBottom: spacing.sm }}>
            Reason for return
          </BodySm>
          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
            {RETURN_REASONS.map((option) => {
              const selected = option === reason;
              return (
                <Pressable
                  key={option}
                  onPress={() => setReason(option)}
                  style={[
                    styles.reasonRow,
                    { borderColor: colors.line, backgroundColor: selected ? colors.surface2 : "transparent" },
                  ]}
                >
                  <Body tone={selected ? "ink" : "soft"} style={{ flex: 1 }}>
                    {option}
                  </Body>
                  {selected && <Ionicons name="checkmark" size={18} color={colors.brass} />}
                </Pressable>
              );
            })}
          </ScrollView>

          {requestReturn.isError && (
            <Txt tone="danger" center style={{ marginTop: spacing.sm }}>
              Couldn't submit your request.
            </Txt>
          )}
          <Button
            label={requestReturn.isPending ? "Submitting…" : "Submit Return Request"}
            loading={requestReturn.isPending}
            onPress={() => requestReturn.mutate({ orderId, returnReason: reason })}
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        <Button
          label="Request a Return"
          variant="outline"
          onPress={() => setShowForm(true)}
          style={{ marginTop: spacing.md }}
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: 8,
  },
});
