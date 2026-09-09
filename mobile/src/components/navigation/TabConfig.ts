import { Ionicons } from "@expo/vector-icons";

export type TabItem = {
  route: string;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

export const TABS: TabItem[] = [
  {
    route: "index",
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  {
    route: "search",
    label: "Search",
    activeIcon: "search",
    inactiveIcon: "search-outline",
  },
  {
    route: "cart",
    label: "Cart",
    activeIcon: "cart",
    inactiveIcon: "cart-outline",
  },
  {
    route: "wishlist",
    label: "Wishlist",
    activeIcon: "heart",
    inactiveIcon: "heart-outline",
  },
  {
    route: "profile",
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
];