import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Display, Eyebrow, H3, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAdminUser } from "@/features/admin/users/hooks/useAdminUser";
import { useUpdateUserRole } from "@/features/admin/users/hooks/useUpdateUserRole";
import { useDeleteAdminUser } from "@/features/admin/users/hooks/useDeleteAdminUser";

const ROLES = ["user", "admin"] as const;

export default function AdminUserDetailScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: user, isLoading, isError } = useAdminUser(id);
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteAdminUser();
  const [showRolePicker, setShowRolePicker] = useState(false);

  const shell = (children: React.ReactNode, center?: boolean) => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Users" />
      {center ? <View style={styles.center}>{children}</View> : children}
    </SafeAreaView>
  );

  if (isLoading) return shell(<ActivityIndicator color={colors.brass} />, true);
  if (isError || !user) return shell(<Body tone="soft">User not found.</Body>, true);

  const changeRole = (role: string) => {
    setShowRolePicker(false);
    if (role === user.role || !id) return;
    updateRole.mutate({ id, payload: { name: user.name, email: user.email, role } });
  };

  const confirmDelete = () => {
    Alert.alert("Delete User", `Delete "${user.name}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteUser.mutate(user._id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  return shell(
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.identity}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.surface2 }]}>
            <Txt style={{ ...type.h1 }}>{user.name.charAt(0).toUpperCase()}</Txt>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: spacing.lg }}>
          <Display style={{ fontSize: 22 }}>{user.name}</Display>
          <BodySm tone="faint" style={{ marginTop: 4 }}>{user.email}</BodySm>
          <Caption tone="faint" style={{ marginTop: 4 }}>
            {`Joined ${new Date(user.createdAt).toLocaleDateString()}`}
          </Caption>
        </View>
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <H3 style={{ marginBottom: spacing.md }}>Role</H3>
        {showRolePicker ? (
          <View>
            {ROLES.map((r) => (
              <Pressable
                key={r}
                onPress={() => changeRole(r)}
                style={[styles.roleRow, { borderColor: colors.line, backgroundColor: r === user.role ? colors.surface2 : "transparent" }]}
              >
                <Body style={{ textTransform: "capitalize" }}>{r}</Body>
                {r === user.role && <Ionicons name="checkmark" size={18} color={colors.brass} />}
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.roleDisplay}>
            <Eyebrow>{user.role}</Eyebrow>
            <Button
              label={updateRole.isPending ? "Updating…" : "Change Role"}
              variant="outline"
              loading={updateRole.isPending}
              onPress={() => setShowRolePicker(true)}
            />
          </View>
        )}
        {updateRole.isError && (
          <Txt tone="danger" center style={{ marginTop: spacing.sm }}>Couldn't update role.</Txt>
        )}
      </Card>

      {deleteUser.isError && (
        <Txt tone="danger" center style={{ marginTop: spacing.lg }}>Couldn't delete user.</Txt>
      )}
      <Button
        label={deleteUser.isPending ? "Deleting…" : "Delete User"}
        variant="outline"
        loading={deleteUser.isPending}
        onPress={confirmDelete}
        style={{ marginTop: spacing.lg }}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  identity: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: radii.xs },
  avatarFallback: { justifyContent: "center", alignItems: "center" },
  roleRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderRadius: radii.xs, paddingHorizontal: spacing.md, paddingVertical: 12, marginBottom: 8,
  },
  roleDisplay: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
