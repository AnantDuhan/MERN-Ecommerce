import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import ShoppingIllustration from "@/assets/illustrations/shopping.svg";
import ShippingIllustration from "@/assets/illustrations/shipping.svg";
import CartIllustration from "@/assets/illustrations/cart.svg";

type Props = {
  type: "shopping" | "shipping" | "cart";
};

export default function HeroIllustration({
  type,
}: Props) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, {
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(8, {
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(-1.5, { duration: 2500 }),
        withTiming(1.5, { duration: 2500 })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2500 }),
        withTiming(1, { duration: 2500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const renderIllustration = () => {
    switch (type) {
      case "shopping":
        return (
          <ShoppingIllustration
            width="100%"
            height="100%"
          />
        );

      case "shipping":
        return (
          <ShippingIllustration
            width="100%"
            height="100%"
          />
        );

      case "cart":
        return (
          <CartIllustration
            width="100%"
            height="100%"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderIllustration()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});