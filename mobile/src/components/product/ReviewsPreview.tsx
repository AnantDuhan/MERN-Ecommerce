import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Animated, { FadeInDown } from "react-native-reanimated";

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
  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.wrapper}>
      <BlurView intensity={55} tint="light" style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>

          <Pressable onPress={onSeeAll}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.summary}>
          <Ionicons name="star" size={26} color="#FBBF24" />

          <Text style={styles.rating}>{rating}</Text>

          <Text style={styles.count}>
            ({reviewsCount.toLocaleString()} Reviews)
          </Text>
        </View>

        {reviews.slice(0, 2).map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{review.user.charAt(0)}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.user}>{review.user}</Text>

                <View style={styles.stars}>
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Ionicons
                      key={index}
                      name={index < review.rating ? "star" : "star-outline"}
                      size={14}
                      color="#FBBF24"
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.date}>{review.date}</Text>
            </View>

            <Text style={styles.comment}>{review.comment}</Text>
          </View>
        ))}
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 28,
    paddingHorizontal: 24,
    marginBottom: 28,
  },

  card: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",

    shadowColor: "#5EA8FF",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  seeAll: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2F80ED",
  },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },

  rating: {
    marginLeft: 8,
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  count: {
    marginLeft: 10,
    fontSize: 15,
    color: "#64748B",
  },

  reviewCard: {
    marginBottom: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2F80ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 18,
  },

  user: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  stars: {
    flexDirection: "row",
    marginTop: 4,
  },

  date: {
    fontSize: 13,
    color: "#94A3B8",
  },

  comment: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    color: "#64748B",
  },
});
