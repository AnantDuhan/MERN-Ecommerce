import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { api } from "@/api/axios";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests notification permission, obtains an Expo push token where
 * possible, and registers it with the backend. Also listens for
 * notifications received while the app is foregrounded and records them
 * into the local notifications store for the in-app Notifications screen.
 *
 * NOTE: as of Expo SDK 53, a remote (Expo) push token can only be obtained
 * from a Development Build — Expo Go on Android cannot provide one. This
 * hook degrades gracefully: permission + local/foreground notifications
 * still work everywhere; only the backend registration step is skipped
 * when no token is available.
 */
export function usePushRegistration() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addNotification = useNotificationsStore((s) => s.add);
  const registered = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || registered.current) return;

    (async () => {
      try {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;

        if (existing !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") return;

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          (Constants as any)?.easConfig?.projectId;

        const tokenResponse = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        );

        registered.current = true;
        await api.put("/me/push-token", { pushToken: tokenResponse.data });
      } catch {
        // No token available on this runtime (e.g. Expo Go on Android) —
        // local/foreground notifications still work, so this is non-fatal.
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((n) => {
      const { title, body, data } = n.request.content;
      addNotification({ title: title ?? "Notification", body: body ?? "", data });
    });
    return () => subscription.remove();
  }, [addNotification]);
}
