import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Svg, {
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { Ellipse } from "react-native-svg";
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface FloatingBlobProps {
  size: number;
  color: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  duration?: number;
}

export default function FloatingBlob({
  size,
  color,
  top,
  left,
  right,
  bottom,
  duration = 9000,
}: FloatingBlobProps) {

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {

    translateX.value = withRepeat(
      withSequence(
        withTiming(18, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(-18, {
          duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-22, {
          duration: duration + 1200,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(22, {
          duration: duration + 1200,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 6000,
        }),
        withTiming(0.98, {
          duration: 6000,
        })
      ),
      -1,
      true
    );

    rotation.value = withRepeat(
      withSequence(
        withTiming(8, {
          duration: 12000,
        }),
        withTiming(-8, {
          duration: 12000,
        })
      ),
      -1,
      true
    );

  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
      {
        scale: scale.value,
      },
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top,
          left,
          right,
          bottom,
        },
        animatedStyle,
      ]}
    >
      <AnimatedSvg width={size} height={size}>
        <Defs>

          <RadialGradient
            id="blobGradient"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
          >
            <Stop
              offset="0%"
              stopColor={color}
              stopOpacity="0.55"
            />

            <Stop
              offset="45%"
              stopColor={color}
              stopOpacity="0.22"
            />

            <Stop
              offset="75%"
              stopColor={color}
              stopOpacity="0.08"
            />

            <Stop
              offset="100%"
              stopColor={color}
              stopOpacity="0"
            />

          </RadialGradient>

        </Defs>

        <Ellipse
          cx={size / 2}
          cy={size / 2}
          rx={size * 0.48}
          ry={size * 0.40}
          fill="url(#blobGradient)"
        />

      </AnimatedSvg>

    </Animated.View>
  );
}