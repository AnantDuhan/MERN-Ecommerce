import { Ionicons } from "@expo/vector-icons";

export const categories: {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: "1",
    title: "Shoes",
    icon: "footsteps-outline",
  },
  {
    id: "2",
    title: "Fashion",
    icon: "shirt-outline",
  },
  {
    id: "3",
    title: "Phones",
    icon: "phone-portrait-outline",
  },
  {
    id: "4",
    title: "Watches",
    icon: "watch-outline",
  },
  {
    id: "5",
    title: "Audio",
    icon: "headset-outline",
  },
  {
    id: "6",
    title: "Gaming",
    icon: "game-controller-outline",
  },
  {
    id: "7",
    title: "Beauty",
    icon: "sparkles-outline",
  },
];