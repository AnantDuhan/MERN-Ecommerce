declare module "*.svg" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";

  const SvgComponent: React.FC<SvgProps>;

  export default SvgComponent;
}