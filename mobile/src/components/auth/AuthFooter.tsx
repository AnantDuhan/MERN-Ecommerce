import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  text: string;
  actionText: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function AuthFooter({
  text,
  actionText,
  onPress,
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {text}
      </Text>

      <Pressable onPress={onPress} disabled={disabled}>
        <Text style={[styles.action, disabled && styles.disabled]}>
          {actionText}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 15,
    color: "#64748B",
  },

  action: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "700",
    color: "#2F80ED",
  },
  
  disabled: {
    opacity: 0.5,
  },
});