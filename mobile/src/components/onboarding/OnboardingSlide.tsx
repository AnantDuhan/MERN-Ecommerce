import React from "react";
import { View } from "react-native";

import HeroIllustration from "@/components/onboarding/HeroIllustration";
import { IllustrationType } from "@/types/onboarding";
import { Eyebrow, Display, Body } from "@/components/ui/Text";
import { spacing } from "@/theme/tokens";

interface Props {
  illustration: IllustrationType;
  title: string;
  description: string;
  eyebrow?: string;
}

export default function OnboardingSlide({
  illustration,
  title,
  description,
  eyebrow,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
        paddingBottom: 40,
      }}
    >
      <HeroIllustration type={illustration} />

      {eyebrow ? (
        <Eyebrow style={{ marginTop: spacing.lg }}>{eyebrow}</Eyebrow>
      ) : null}

      <Display center style={{ marginTop: spacing.sm }}>
        {title}
      </Display>

      <Body
        tone="soft"
        center
        style={{ marginTop: spacing.md, maxWidth: 320 }}
      >
        {description}
      </Body>
    </View>
  );
}
