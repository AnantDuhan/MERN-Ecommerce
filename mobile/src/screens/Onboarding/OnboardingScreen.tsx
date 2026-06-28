import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import AnimatedBackground from "@/components/layout/AnimatedBackground";

import { ONBOARDING_DATA } from "@/components/onboarding/constants/onboarding";
import { OnboardingItem } from "@/types/onboarding";

import Pagination from "@/components/onboarding/Pagination";
import PrimaryButton from "@/components/onboarding/PrimaryButton";
import OnboardingSlide from "@/components/onboarding/OnboardingSlide";

const { width } = Dimensions.get("window");

const AnimatedFlatList =
  Animated.createAnimatedComponent(
    FlatList<OnboardingItem>
  );

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();

  const flatListRef =
    useRef<FlatList<OnboardingItem>>(null);

  const scrollX = useSharedValue(0);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const scrollHandler =
    useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollX.value = event.contentOffset.x;
      },
    });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(
          viewableItems[0].index ?? 0
        );
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    console.log("Current Index:", currentIndex);

    if (currentIndex === ONBOARDING_DATA.length - 1) {
      console.log("Navigate to Login");
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

  const renderItem: ListRenderItem<OnboardingItem> =
    ({ item }) => (
      <View style={{ width }}>
        <OnboardingSlide
          illustration={item.illustration}
          title={item.title}
          description={item.description}
        />
      </View>
    );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <AnimatedBackground />

      <Animated.View
        entering={FadeInDown.duration(600)}
        style={[
          styles.header,
          {
            top: insets.top + 12,
          },
        ]}
      >
        {currentIndex !==
          ONBOARDING_DATA.length - 1 && (
          <Pressable onPress={handleSkip}>
            <BlurView
              intensity={70}
              tint="light"
              style={styles.skipButton}
            >
              <Text style={styles.skip}>
                Skip
              </Text>
            </BlurView>
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
        onViewableItemsChanged={
          onViewableItemsChanged
        }
        viewabilityConfig={
          viewabilityConfig
        }
        contentContainerStyle={
          styles.listContent
        }
      />

      <View style={styles.paginationContainer}>
        <Pagination
          dataLength={
            ONBOARDING_DATA.length
          }
          scrollX={scrollX}
          width={width}
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={
            currentIndex ===
            ONBOARDING_DATA.length - 1
              ? "Get Started"
              : "Next"
          }
          onPress={handleNext}
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
    paddingTop: 80,
    paddingBottom: 200,
  },

  paginationContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 110,
    alignItems: "center",
    zIndex: 50,
  },

  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 30,
    zIndex: 50,
  },

  skipButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  skip: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
});