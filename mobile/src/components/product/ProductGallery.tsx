import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

import { Product } from "@/types/product";
import { useTheme } from "@/theme/ThemeContext";

const { width } = Dimensions.get("window");

interface Props {
  product: Product;
  onBack?: () => void;
  onFavourite?: () => void;
  onShare?: () => void;
}

export default function ProductGallery({ product, onBack, onFavourite, onShare }: Props) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<ImageSourcePropType>>(null);

  const iconBtn: ViewStyle = {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={iconBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>

        <View style={{ flexDirection: "row", gap: 12 }}>
          {onShare && (
            <Pressable onPress={onShare} style={iconBtn}>
              <Ionicons name="share-outline" size={20} color={colors.ink} />
            </Pressable>
          )}
          <Pressable onPress={onFavourite} style={iconBtn}>
            <Ionicons
              name={product.favourite ? "heart" : "heart-outline"}
              size={20}
              color={product.favourite ? colors.danger : colors.ink}
            />
          </Pressable>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={product.images}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          setCurrentIndex(
            Math.round(event.nativeEvent.contentOffset.x / width)
          );
        }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={item} resizeMode="contain" style={styles.image} />
          </View>
        )}
      />

      <View style={styles.pagination}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={{
              height: 3,
              width: currentIndex === index ? 24 : 8,
              backgroundColor: currentIndex === index ? colors.brass : colors.line,
              marginHorizontal: 3,
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { height: 430, marginBottom: 24 },
  topBar: {
    position: "absolute",
    top: 10,
    left: 24,
    right: 24,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: { width, justifyContent: "center", alignItems: "center" },
  image: { width: width * 0.8, height: 300 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
});
