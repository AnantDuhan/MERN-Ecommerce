import { Platform } from "react-native";

export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 22,
      shadowOffset: {
        width: 0,
        height: 10,
      },
    },

    android: {
      elevation: 10,
    },
  }),
};