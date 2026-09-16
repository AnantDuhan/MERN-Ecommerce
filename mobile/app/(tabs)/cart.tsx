import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "expo-router/js-tabs";

import { Eyebrow, Display, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Rule } from "@/components/ui/Rule";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import {
  CartItem,
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart.store";

function QtyButton({
  icon,
  onPress,
}: {
  icon: "add" | "remove";
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={{
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: radii.xs,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={16} color={colors.ink} />
    </Pressable>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const { colors } = useTheme();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  return (
    <View style={[styles.row, { borderColor: colors.line }]}>
      {item.image ? (
        <Image source={item.image} resizeMode="contain" style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: colors.surface2 }]} />
      )}

      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <BodySm numberOfLines={1} style={{ fontFamily: type.h3.fontFamily }}>
          {item.name}
        </BodySm>
        {item.size ? (
          <Caption tone="faint" style={{ marginTop: 2 }}>
            {`Size ${item.size}`}
          </Caption>
        ) : null}
        <Txt style={{ ...type.h3, marginTop: 6 }}>
          {`\u20B9${item.price.toLocaleString()}`}
        </Txt>

        <View style={styles.qtyRow}>
          <QtyButton
            icon="remove"
            onPress={() =>
              setQuantity(item.id, item.quantity - 1, item.size)
            }
          />
          <Txt style={{ ...type.h3, marginHorizontal: spacing.md }}>
            {`${item.quantity}`}
          </Txt>
          <QtyButton
            icon="add"
            onPress={() =>
              setQuantity(item.id, item.quantity + 1, item.size)
            }
          />
        </View>
      </View>

      <Pressable onPress={() => remove(item.id, item.size)} hitSlop={8}>
        <Ionicons name="trash-outline" size={18} color={colors.inkFaint} />
      </Pressable>
    </View>
  );
}

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);

  const shell = (children: React.ReactNode) => (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </SafeAreaView>
  );

  const Header = (
    <View style={styles.header}>
      <Eyebrow tone="soft">Your bag</Eyebrow>
      <Display style={{ marginTop: spacing.xs }}>Cart</Display>
    </View>
  );

  if (items.length === 0) {
    return shell(
      <>
        {Header}
        <View style={styles.stateBox}>
          <Ionicons name="bag-outline" size={40} color={colors.inkFaint} />
          <Body tone="soft" center style={{ marginTop: spacing.md }}>
            Your cart is empty.
          </Body>
          <Button
            label="Browse Products"
            variant="outline"
            onPress={() => router.push("/(tabs)/search")}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </>
    );
  }

  return shell(
    <View style={{ flex: 1 }}>
      {Header}
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.id}-${item.size ?? ""}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        renderItem={({ item }) => <CartRow item={item} />}
      />

      <View
        style={[
          styles.footer,
          {
            bottom: tabBarHeight,
            backgroundColor: colors.surface,
            borderTopColor: colors.line,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <Eyebrow tone="soft">Subtotal</Eyebrow>
          <Txt style={{ ...type.h2 }}>{`\u20B9${subtotal.toLocaleString()}`}</Txt>
        </View>
        <Rule style={{ marginVertical: spacing.md }} />
        <Button
          label="Proceed to Checkout"
          onPress={() => router.push("/checkout/shipping")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  list: { paddingHorizontal: 24, paddingBottom: 260 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  thumb: { width: 72, height: 72 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
