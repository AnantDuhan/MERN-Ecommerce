import * as ImagePicker from "expo-image-picker";

export class ImagePickerService {
  static async pickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      throw new Error("Photo library permission denied.");
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  }
}