import { TouchableOpacity, Image } from "react-native";
import React, { FunctionComponent, useContext } from "react";
import { StackHeaderProps } from "@react-navigation/stack";
import { ThemeContext } from "../Theme";
import {
  Flex,
  Padding,
  SideMenu,
  StyledText,
  ThemeButtons,
} from ".";
import { isScreenSmall } from "../Helpers";

// This component takes up the full width of the screen and is shown on every screen
// It is used to display the current page name (unless the user is on the home page), the menu button, and three empty buttons
export const ScreenHeader: FunctionComponent<StackHeaderProps> = ({
  navigation,
  route,
  options,
  back,
}) => {
  const theme = useContext(ThemeContext);

  // we maintain a sidemneu ref to toggle it open or closed
  const sideMenuRef = React.useRef<{ toggleMenu: Function } | null>(null);
  // we dont need to add a listener since our theme will rerender us
  const bigScreen = !isScreenSmall()

  return (
    <Flex
      fullWidth
      row
      centeredVertical
      style={{
        paddingHorizontal: theme.largeSpace,
        paddingVertical: theme.mediumSpace,
      }}
    >
      <SideMenu navigation={navigation} ref={sideMenuRef} />
      <TouchableOpacity onPress={sideMenuRef.current?.toggleMenu as () => {}}>
        <Image
          source={theme.menu}
          style={{ width: theme.menuSize, height: theme.menuSize }}
        />
      </TouchableOpacity>
      {bigScreen && (
        <>
          <Padding horizontal={theme.mediumSpace} />
          <StyledText type={"caption"}>LaPlante Apps</StyledText>
          <StyledText
            type={"caption"}
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            {route.name === "Home" ? null : route.name}
          </StyledText>
        </>
      )}
      <ThemeButtons />
    </Flex>
  );
};
