import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onImageSelected: (uri: string) => void;
}

export default function AvatarPicker({ onImageSelected }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setImage(uri);
      onImageSelected(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage}>
        <View style={styles.avatarContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person" size={46} color="#94A3B8" />
            </View>
          )}

          <View style={styles.editButton}>
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </View>
        </View>
      </Pressable>

      <Text style={styles.title}>
        {image ? "Change Profile Photo" : "Add Profile Photo"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#D9EAFE",
  },

  placeholder: {
    width: 96,
    height: 96,
    borderRadius: 48,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#EEF6FF",

    borderWidth: 2,
    borderColor: "#D9EAFE",
  },

  editButton: {
    position: "absolute",

    right: -2,
    bottom: -2,

    width: 32,
    height: 32,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#2F80ED",

    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  title: {
    marginTop: 10,

    fontSize: 15,
    fontWeight: "600",

    color: "#475569",
  },
});
