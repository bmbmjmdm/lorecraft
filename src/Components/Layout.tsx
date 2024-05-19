import { View, ViewStyle } from "react-native";
import React, { FunctionComponent, ReactNode } from "react";
import { styles } from "../Theme";

// A component that makes it easy to create layout components, such as full-width, centered, row, etc
type FlexProps = {
  full?: boolean;
  fullWidth?: boolean;
  centered?: boolean;
  centeredVertical?: boolean;
  style?: ViewStyle;
  children: ReactNode;
  slim?: boolean;
  row?: boolean;
  reverse?: boolean;
};
export const Flex: FunctionComponent<FlexProps> = ({
  full = false,
  fullWidth = false,
  centered = false,
  slim = false,
  centeredVertical = false,
  style = {},
  row = false,
  reverse = false,
  children,
}) => {
  return (
    <View
      style={[
        full ? styles.flex : {},
        fullWidth ? styles.fullWidth : {},
        centered ? styles.centered : {},
        centeredVertical && row ? styles.alignCenter : {},
        centeredVertical && !row ? styles.justifyCenter : {},
        slim ? styles.slim : {},
        row ? styles.row : {},
        reverse && row ? styles.reverseRow : {},
        reverse && !row ? styles.reverseColumn : {},
        style,
      ]}
    >
      {children}
    </View>
  );
};

// A component that makes padding less messy
type PaddingProps = {
  vertical?: number;
  horizontal?: number;
};
export const Padding: FunctionComponent<PaddingProps> = ({
  vertical = 0,
  horizontal = 0,
}) => {
  return (
    <View
      style={{
        paddingTop: vertical,
        paddingLeft: horizontal,
      }}
    />
  );
};
