import React, { useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import TopBar from "@/components/common/TopBar";
import { Field } from "@/components/ui/Field";
import { Display, Eyebrow, BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAdminUsers } from "@/features/admin/users/hooks/useAdminUsers";

export default function AdminUsersScreen() {
  const { colors, isDark } = useTheme();
  const { data: users = [], isLoading, refetch, isFetching } = useAdminUsers();
  const [query, setQuery] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Admin" />

      <View style={styles.header}>
        <Eyebrow tone="soft">Accounts</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>Users</Display>
        <Field
          left="search-outline"
          placeholder="Search name or email"
          value={query}
          onChangeText={setQuery}
          containerStyle={{ marginTop: spacing.lg }}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.brass} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: "/admin/users/[id]", params: { id: item._id } })}
              style={[styles.row, { borderColor: colors.line }]}
            >
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.surface2 }]}>
                  <Txt style={{ ...type.h3 }}>{item.name.charAt(0).toUpperCase()}</Txt>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <BodySm numberOfLines={1} style={{ fontFamily: type.h3.fontFamily }}>{item.name}</BodySm>
                <Caption tone="faint" numberOfLines={1} style={{ marginTop: 2 }}>{item.email}</Caption>
              </View>
              {item.role === "admin" && <Eyebrow>Admin</Eyebrow>}
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: radii.xs },
  avatarFallback: { justifyContent: "center", alignItems: "center" },
});
