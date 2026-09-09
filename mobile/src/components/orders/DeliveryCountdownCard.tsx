import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Eyebrow, H3, Body, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";

interface Props {
  estimatedDeliveryDate: string;
  status: string;
}

function getRemaining(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, mins };
}

function Unit({ value, label }: { value: number; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.unit}>
      <Txt style={{ ...type.h1, color: colors.brass }}>{String(value).padStart(2, "0")}</Txt>
      <Eyebrow tone="faint" style={{ marginTop: 2 }}>{label}</Eyebrow>
    </View>
  );
}

/**
 * A live-updating countdown to the order's estimated delivery date.
 * Ticks every minute — this is display-only, so a coarse interval is
 * plenty and keeps it cheap while the order screen stays open.
 */
export default function DeliveryCountdownCard({ estimatedDeliveryDate, status }: Props) {
  const { colors } = useTheme();
  const [remaining, setRemaining] = useState(() => getRemaining(estimatedDeliveryDate));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(getRemaining(estimatedDeliveryDate));
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [estimatedDeliveryDate]);

  if (["delivered", "cancelled"].includes(status.toLowerCase())) return null;
  if (!remaining) return null;

  return (
    <Card style={{ marginTop: spacing.lg }}>
      <View style={styles.header}>
        <H3>Arriving In</H3>
        <Ionicons name="bicycle-outline" size={20} color={colors.brass} />
      </View>

      <View style={styles.row}>
        <Unit value={remaining.days} label="Days" />
        <Unit value={remaining.hours} label="Hours" />
        <Unit value={remaining.mins} label="Mins" />
      </View>

      <Body tone="soft" center style={{ marginTop: spacing.md }}>
        {`Estimated ${new Date(estimatedDeliveryDate).toDateString()}`}
      </Body>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", justifyContent: "space-around", marginTop: spacing.lg },
  unit: { alignItems: "center" },
});
