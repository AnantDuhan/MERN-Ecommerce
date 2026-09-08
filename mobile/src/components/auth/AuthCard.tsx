import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import { Card } from "@/components/ui/Card";

interface Props extends ViewProps {
  children: React.ReactNode;
}

/** Auth panel = the editorial bordered Card with the soft luxe shadow. */
export default function AuthCard({ children, style }: Props) {
  return (
    <Card elevated style={style as ViewStyle}>
      {children}
    </Card>
  );
}
