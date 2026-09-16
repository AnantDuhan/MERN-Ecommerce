import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import CategoryCard from "./CategoryCard";

export interface Category {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
}

export default function CategoryList({
  categories,
  onCategoryPress,
}: Props) {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <CategoryCard
          title={item.title}
          icon={item.icon}
          onPress={() => onCategoryPress?.(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
});