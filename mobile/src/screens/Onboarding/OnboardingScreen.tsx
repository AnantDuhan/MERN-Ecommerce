import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { ONBOARDING_DATA } from "@/components/onboarding/constants/onboarding";
import { OnboardingItem } from "@/types/onboarding";

import Pagination from "@/components/onboarding/Pagination";
import OnboardingSlide from "@/components/onboarding/OnboardingSlide";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";

const { width } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<OnboardingItem>
);

export default function OnboardingScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const flatListRef = useRef<FlatList<OnboardingItem>>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const isLast = currentIndex === ONBOARDING_DATA.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace("/login");
      return;
    }
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  const renderItem: ListRenderItem<OnboardingItem> = ({ item, index }) => (
    <View style={{ width }}>
      <OnboardingSlide
        eyebrow={`0${index + 1} \u2014 0${ONBOARDING_DATA.length}`}
        illustration={item.illustration}
        title={item.title}
        description={item.description}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Animated.View
        entering={FadeInDown.duration(600)}
        style={[styles.header, { top: insets.top + 12 }]}
      >
        {!isLast && (
          <Pressable onPress={handleSkip} hitSlop={10}>
            <Eyebrow tone="soft">Skip</Eyebrow>
          </Pressable>
        )}
      </Animated.View>

      <AnimatedFlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.paginationContainer}>
        <Pagination
          dataLength={ONBOARDING_DATA.length}
          scrollX={scrollX}
          width={width}
        />
      </View>

      <View style={styles.footer}>
        <Button
          label={isLast ? "Get Started" : "Next"}
          onPress={handleNext}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    left: 24,
    right: 24,
    zIndex: 100,
    alignItems: "flex-end",
  },
  listContent: {
    paddingTop: 60,
    paddingBottom: 200,
  },
  paginationContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 120,
    alignItems: "center",
    zIndex: 50,
  },
  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 36,
    zIndex: 50,
  },
});
