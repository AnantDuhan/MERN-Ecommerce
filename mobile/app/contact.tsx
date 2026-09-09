import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import TopBar from "@/components/common/TopBar";
import AuthTextField from "@/components/auth/AuthTextField";
import { Display, Eyebrow, Body, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useSendContact } from "@/features/contact/hooks/useSendContact";
import { useAuthStore } from "@/store/auth.store";

export default function ContactScreen() {
  const { colors, isDark } = useTheme();
  const user = useAuthStore((s) => s.user);
  const sendContact = useSendContact();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    sendContact.mutate(
      { name, email, message },
      { onSuccess: () => setSent(true) }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Support" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Eyebrow tone="soft">We're here to help</Eyebrow>
          <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>Contact Us</Display>

          {sent ? (
            <>
              <Body tone="soft">
                Thanks for reaching out — we'll get back to you shortly.
              </Body>
              <Button label="Done" variant="outline" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
            </>
          ) : (
            <>
              <AuthTextField label="Name" icon="person-outline" value={name} onChangeText={setName} />
              <AuthTextField label="Email" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <AuthTextField
                label="Message" icon="chatbox-ellipses-outline" value={message} onChangeText={setMessage}
                multiline numberOfLines={5} style={{ minHeight: 110, textAlignVertical: "top" }}
              />
              {sendContact.isError && (
                <Txt tone="danger" center style={{ marginBottom: spacing.sm }}>
                  Couldn't send your message. Please try again.
                </Txt>
              )}
              <Button
                label={sendContact.isPending ? "Sending…" : "Send Message"}
                loading={sendContact.isPending}
                onPress={onSubmit}
                style={{ marginTop: spacing.lg }}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },
});
