import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

const SIZE = 52;

interface Props {
  images: { uri: string }[];
}

/** A 52x52 thumbnail that becomes a tiny swipeable carousel when an order
 * item has more than one product image — matching the web app's item
 * gallery, scaled down for the compact order-row layout. */
export default function OrderItemThumb({ images }: Props) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <View style={[styles.box, { backgroundColor: colors.surface2 }]} />;
  }

  if (images.length === 1) {
    return <Image source={images[0]} resizeMode="contain" style={styles.box} />;
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.box}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / SIZE))
        }
      >
        {images.map((img, i) => (
          <Image key={i} source={img} resizeMode="contain" style={styles.box} />
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === index ? colors.brass : colors.line },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: SIZE, height: SIZE },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 3,
  },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 1.5 },
});
