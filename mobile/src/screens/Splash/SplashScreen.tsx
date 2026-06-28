import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  AnimatedBackground,
  AppContainer,
  BrandLogo,
} from "@/components/layout";
import { Colors } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContainer>

        <AnimatedBackground />

        <SafeAreaView 
            edges={["left", "right", "bottom"]}
            style={{ flex: 1 }}
        >
            <View style={styles.content}>

                <BrandLogo size={140} />

                <Text style={styles.title}>
                    Order Planning
                </Text>

                <Text style={styles.subtitle}>
                    Discover Amazing Deals
                </Text>

                <ActivityIndicator
                    size="large"
                    color="#2F80ED"
                    style={{ marginTop: 50 }}
                />

            </View>
        </SafeAreaView>

    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: 25,
    fontSize: 34,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    color: Colors.textSecondary,
  },
});