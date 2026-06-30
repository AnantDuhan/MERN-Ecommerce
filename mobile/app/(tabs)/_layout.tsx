import React from "react";
import { Tabs } from "expo-router";

import CustomTabBar from "@/components/navigation/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <CustomTabBar {...props} />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}