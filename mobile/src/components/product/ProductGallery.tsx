import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Animated, {
  FadeIn,
} from "react-native-reanimated";

import { Product } from "@/types/product";

const { width } = Dimensions.get("window");

interface Props {
  product: Product;
  onBack?: () => void;
  onFavourite?: () => void;
}

export default function ProductGallery({
  product,
  onBack,
  onFavourite,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef =
    useRef<FlatList<ImageSourcePropType>>(null);

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.container}
    >
      {/* Floating Buttons */}

      <View style={styles.topBar}>
        <Pressable onPress={onBack}>
          <BlurView
            intensity={70}
            tint="light"
            style={styles.iconButton}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#0F172A"
            />
          </BlurView>
        </Pressable>

        <Pressable onPress={onFavourite}>
          <BlurView
            intensity={70}
            tint="light"
            style={styles.iconButton}
          >
            <Ionicons
              name={
                product.favourite
                  ? "heart"
                  : "heart-outline"
              }
              size={22}
              color={
                product.favourite
                  ? "#EF4444"
                  : "#0F172A"
              }
            />
          </BlurView>
        </Pressable>
      </View>

      {/* Images */}

      <FlatList
        ref={flatListRef}
        data={product.images}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) =>
          index.toString()
        }
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x /
              width
          );

          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View
            style={styles.imageContainer}
          >
            <Image
              source={item}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
        )}
      />

      {/* Pagination */}

      <View style={styles.pagination}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index &&
                styles.activeDot,
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 430,
    marginBottom: 24,
  },

  topBar: {
    position: "absolute",
    top: 10,
    left: 24,
    right: 24,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor:
      "rgba(255,255,255,0.18)",
    shadowColor: "#5EA8FF",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: width * 0.8,
    height: 300,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 5,
  },

  activeDot: {
    width: 24,
    borderRadius: 4,
    backgroundColor: "#2F80ED",
  },
});