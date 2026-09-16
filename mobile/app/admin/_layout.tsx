import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

/**
 * Guards the entire /admin route group. Any non-admin (or logged-out)
 * user is bounced straight back to the storefront — this is a UX guard,
 * not the security boundary; every admin endpoint is separately protected
 * server-side by authRoles('admin').
 */
export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== "admin") {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />;
}
