import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Eyebrow, Display, H2, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Rule } from "@/components/ui/Rule";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAuthStore } from "@/store/auth.store";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useSubscribe } from "@/features/newsletter/hooks/useSubscribe";

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
}

function Row({ icon, label, hint, onPress, right, last }: RowProps) {
  const { colors } = useTheme();
  return (
    <>
      <Pressable style={styles.row} onPress={onPress} hitSlop={4}>
        <Ionicons name={icon} size={20} color={colors.ink} />
        <Body style={{ flex: 1, marginLeft: spacing.md }}>{label}</Body>
        {hint ? (
          <Caption tone="faint" style={{ marginRight: 8 }}>
            {hint}
          </Caption>
        ) : null}
        {right ?? (
          <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
        )}
      </Pressable>
      {!last && <Rule tick={false} style={{ backgroundColor: colors.line }} />}
    </>
  );
}

export default function ProfileScreen() {
  const { colors, isDark, override, setOverride } = useTheme();
  const { data, isLoading } = useCurrentUser(useAuthStore((s) => s.isAuthenticated));
  const storeUser = useAuthStore((s) => s.user);
  const logout = useLogout();
  const subscribe = useSubscribe();

  const user = data?.user ?? storeUser;

  const cycleTheme = () => {
    const next =
      override === "system" ? "light" : override === "light" ? "dark" : "system";
    setOverride(next);
  };
  const themeLabel =
    override === "system" ? "System" : override === "light" ? "Light" : "Dark";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Eyebrow tone="soft">Account</Eyebrow>
          <Display style={{ marginTop: spacing.xs }}>Profile</Display>
        </View>

        {isLoading && !user ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator color={colors.brass} />
          </View>
        ) : (
          <>
            <View style={styles.identity}>
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={[styles.avatar, { borderColor: colors.line }]}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    styles.avatarFallback,
                    { backgroundColor: colors.surface2, borderColor: colors.line },
                  ]}
                >
                  <Txt style={{ ...type.h1 }}>
                    {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </Txt>
                </View>
              )}

              <View style={{ flex: 1, marginLeft: spacing.lg }}>
                <H2>{user?.name ?? "Guest"}</H2>
                <BodySm tone="faint" style={{ marginTop: 4 }}>
                  {user?.email ?? "Not signed in"}
                </BodySm>
                {user?.role === "admin" ? (
                  <Eyebrow style={{ marginTop: 8 }}>Administrator</Eyebrow>
                ) : null}
              </View>
            </View>

            <View style={[styles.group, { borderColor: colors.line }]}>
              <Row
                icon="cube-outline"
                label="My Orders"
                onPress={() => router.push("/orders")}
              />
              <Row
                icon="heart-outline"
                label="Wishlist"
                onPress={() => router.push("/(tabs)/wishlist")}
              />
              <Row
                icon="location-outline"
                label="Addresses"
                onPress={() => router.push("/account/addresses")}
                last
              />
            </View>

            <View style={[styles.group, { borderColor: colors.line }]}>
              <Row
                icon="person-outline"
                label="Edit Profile"
                onPress={() => router.push("/account/edit-profile")}
              />
              <Row
                icon="lock-closed-outline"
                label="Change Password"
                onPress={() => router.push("/account/change-password")}
              />
              <Row
                icon="contrast-outline"
                label="Appearance"
                hint={themeLabel}
                right={<Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />}
                onPress={cycleTheme}
                last
              />
            </View>

            <View style={[styles.group, { borderColor: colors.line }]}>
              <Row
                icon="mail-open-outline"
                label="Subscribe to Newsletter"
                onPress={() => {
                  if (!user?.email) return;
                  subscribe.mutate(user.email, {
                    onSuccess: () =>
                      Alert.alert("Subscribed", "You're on the newsletter list."),
                    onError: () =>
                      Alert.alert("Couldn't subscribe", "Please try again later."),
                  });
                }}
              />
              <Row
                icon="chatbox-ellipses-outline"
                label="Contact Us"
                onPress={() => router.push("/contact")}
              />
              <Row
                icon="information-circle-outline"
                label="About"
                onPress={() => router.push("/about")}
                last
              />
            </View>

            <Button
              label={logout.isPending ? "Signing out…" : "Sign Out"}
              variant="outline"
              loading={logout.isPending}
              onPress={() => logout.mutate()}
              style={{ marginTop: spacing.xl, marginHorizontal: 24 }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 140 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20 },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radii.xs,
    borderWidth: 1,
  },
  avatarFallback: { justifyContent: "center", alignItems: "center" },
  group: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: radii.xs,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
});
