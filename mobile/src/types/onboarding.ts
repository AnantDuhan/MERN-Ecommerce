export type IllustrationType = "shopping" | "shipping" | "cart";

export interface OnboardingItem {
  id: string;
  illustration: IllustrationType;
  title: string;
  description: string;
}