import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { type } from "@/theme/tokens";

type Variant = keyof typeof type; // displayLg | display | h1 | h2 | h3 | body | bodySm | caption | eyebrow
type Tone = "ink" | "soft" | "faint" | "brass" | "onInk" | "onBrass" | "danger" | "success";

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
  center?: boolean;
  style?: TextStyle | TextStyle[];
}

function toneColor(tone: Tone, c: ReturnType<typeof useTheme>["colors"]) {
  switch (tone) {
    case "soft":
      return c.inkSoft;
    case "faint":
      return c.inkFaint;
    case "brass":
      return c.brass;
    case "onInk":
      return c.onInk;
    case "onBrass":
      return c.onBrass;
    case "danger":
      return c.danger;
    case "success":
      return c.success;
    case "ink":
    default:
      return c.ink;
  }
}

/** Base themed text. Prefer the named helpers below. */
export function Txt({ variant = "body", tone = "ink", center, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <RNText
      {...rest}
      style={[
        type[variant] as TextStyle,
        { color: toneColor(tone, colors) },
        center && { textAlign: "center" },
        style as TextStyle,
      ]}
    />
  );
}

export const DisplayLg = (p: Props) => <Txt variant="displayLg" {...p} />;
export const Display = (p: Props) => <Txt variant="display" {...p} />;
export const H1 = (p: Props) => <Txt variant="h1" {...p} />;
export const H2 = (p: Props) => <Txt variant="h2" {...p} />;
export const H3 = (p: Props) => <Txt variant="h3" {...p} />;
export const Body = (p: Props) => <Txt variant="body" {...p} />;
export const BodySm = (p: Props) => <Txt variant="bodySm" {...p} />;
export const Caption = (p: Props) => <Txt variant="caption" tone="faint" {...p} />;

/** Uppercase, wide-tracked, brass small-caps label (web .eyebrow). */
export const Eyebrow = (p: Props) => <Txt variant="eyebrow" tone="brass" {...p} />;
