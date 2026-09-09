import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { H3, Body, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { useRequestReturn } from "@/features/orders/hooks/useRequestReturn";

interface Props {
  orderId: string;
  status: string;
  isReturned: boolean;
}

export default function ReturnRequestCard({ orderId, status, isReturned }: Props) {
  const { colors } = useTheme();
  const requestReturn = useRequestReturn();
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");

  if (status.toLowerCase() !== "delivered") return null;

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
          <TextInput
            placeholder="Tell us why you'd like to return this order"
            placeholderTextColor={colors.inkFaint}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            style={[
              type.body,
              {
                color: colors.ink,
                borderWidth: 1,
                borderColor: colors.line,
                padding: spacing.md,
                minHeight: 80,
                textAlignVertical: "top",
              },
            ]}
          />
          {requestReturn.isError && (
            <Txt tone="danger" center style={{ marginTop: spacing.sm }}>
              Couldn't submit your request.
            </Txt>
          )}
          <Button
            label={requestReturn.isPending ? "Submitting…" : "Submit Return Request"}
            loading={requestReturn.isPending}
            disabled={reason.trim().length === 0}
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
