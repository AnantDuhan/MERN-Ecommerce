import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { H3, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { useSubmitReview } from "@/features/reviews/hooks/useSubmitReview";

interface Props {
  productId: string;
}

export default function WriteReviewCard({ productId }: Props) {
  const { colors } = useTheme();
  const submitReview = useSubmitReview(productId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = () => {
    if (rating === 0) return;
    submitReview.mutate(
      { rating, comment, productId },
      { onSuccess: () => setDone(true) }
    );
  };

  if (done) {
    return (
      <Animated.View entering={FadeInDown.duration(400)} style={styles.wrapper}>
        <Card>
          <Txt tone="success" center style={{ ...type.body }}>
            Thanks for your review!
          </Txt>
        </Card>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.wrapper}>
      <Card>
        <H3 style={{ marginBottom: spacing.md }}>Write a Review</H3>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable key={i} onPress={() => setRating(i)} hitSlop={6}>
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={28}
                color={colors.brass}
                style={{ marginRight: 6 }}
              />
            </Pressable>
          ))}
        </View>

        <TextInput
          placeholder="Share your thoughts (optional)"
          placeholderTextColor={colors.inkFaint}
          value={comment}
          onChangeText={setComment}
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
              marginTop: spacing.md,
            },
          ]}
        />

        {submitReview.isError && (
          <Txt tone="danger" center style={{ marginTop: spacing.sm }}>
            Couldn't submit your review.
          </Txt>
        )}

        <Button
          label={submitReview.isPending ? "Submitting…" : "Submit Review"}
          loading={submitReview.isPending}
          disabled={rating === 0}
          onPress={onSubmit}
          style={{ marginTop: spacing.md }}
        />
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 28, paddingHorizontal: 24 },
  stars: { flexDirection: "row" },
});
