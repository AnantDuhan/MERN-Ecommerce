import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Card } from "@/components/ui/Card";
import { H2, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { radii, type } from "@/theme/tokens";

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface Props {
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  onSeeAll?: () => void;
}

export default function ReviewsPreview({
  rating,
  reviewsCount,
  reviews,
  onSeeAll,
}: Props) {
  const { colors } = useTheme();
  const shown = Math.min(reviews.length, 2);

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.wrapper}>
      <Card>
        <View style={styles.header}>
          <H2>Reviews</H2>
          <Pressable onPress={onSeeAll} hitSlop={8}>
            <Txt tone="brass" style={{ ...type.eyebrow }}>
              See All
            </Txt>
          </Pressable>
        </View>

        <View style={styles.summary}>
          <Ionicons name="star" size={22} color={colors.brass} />
          <Txt style={{ ...type.h1, marginLeft: 8 }}>{`${rating}`}</Txt>
          <Caption tone="faint" style={{ marginLeft: 10 }}>
            {`(${reviewsCount.toLocaleString()} Reviews)`}
          </Caption>
        </View>

        {reviews.slice(0, 2).map((review, index) => (
          <View
            key={review.id}
            style={[
              styles.reviewCard,
              index !== shown - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
              },
            ]}
          >
            <View style={styles.userRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: colors.surface2, borderColor: colors.line },
                ]}
              >
                <Txt style={{ ...type.h3 }}>{review.user.charAt(0)}</Txt>
              </View>

              <View style={{ flex: 1 }}>
                <BodySm style={{ fontFamily: type.h3.fontFamily }}>
                  {review.user}
                </BodySm>
                <View style={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < review.rating ? "star" : "star-outline"}
                      size={13}
                      color={colors.brass}
                    />
                  ))}
                </View>
              </View>

              <Caption tone="faint">{review.date}</Caption>
            </View>

            <Body tone="soft" style={{ marginTop: 12 }}>
              {review.comment}
            </Body>
          </View>
        ))}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 28, paddingHorizontal: 24, marginBottom: 28 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  reviewCard: { marginBottom: 20, paddingBottom: 18 },
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.xs,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stars: { flexDirection: "row", marginTop: 4 },
});
