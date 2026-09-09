import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "location.label";

export type LocationStatus = "loading" | "granted" | "denied" | "error";

/**
 * Requests foreground location permission, resolves a "City, Region" label
 * via reverse geocoding, and caches the last known label so the header
 * doesn't flash a placeholder on every app open.
 */
export function useLocationLabel() {
  const [label, setLabel] = useState<string | null>(null);
  const [status, setStatus] = useState<LocationStatus>("loading");

  useEffect(() => {
    let alive = true;

    (async () => {
      // Show a cached label immediately while we resolve a fresh one.
      const cached = await AsyncStorage.getItem(CACHE_KEY).catch(() => null);
      if (cached && alive) setLabel(cached);

      try {
        const { status: permStatus } =
          await Location.requestForegroundPermissionsAsync();

        if (permStatus !== "granted") {
          if (alive) setStatus("denied");
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const [place] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (!alive) return;

        const resolved = [place?.city, place?.region].filter(Boolean).join(", ");
        if (resolved) {
          setLabel(resolved);
          setStatus("granted");
          AsyncStorage.setItem(CACHE_KEY, resolved).catch(() => {});
        } else {
          setStatus("error");
        }
      } catch {
        if (alive) setStatus("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { label, status };
}
