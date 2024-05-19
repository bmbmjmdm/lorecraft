import { TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
import React, {
  FunctionComponent,
  useContext,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { ThemeContext } from "../Theme";
import { Padding, StyledText } from ".";
import { ParamListBase } from "@react-navigation/native";

type SideMenuProps = {
  navigation: StackNavigationProp<ParamListBase, string, undefined>;
};

// Component that can be toggled by its parent to show/hide a navigation menu
const SideMenuComponent: FunctionComponent<SideMenuProps> = (
  { navigation },
  ref
) => {
  const theme = useContext(ThemeContext);
  const sideMenuWidth = theme.sideMenuWidth;
  const sideMenuSpeed = theme.sideMenuSpeed;
  // we don't need to add a listener since the theme will rerender us if it changes
  const smallScreen = Dimensions.get("window").width < 1750;

  // slide in the menu from off-screen left
  const sideMenuLeft = useRef(new Animated.Value(-sideMenuWidth)).current;
  const sideMenuOpacity = useRef(new Animated.Value(1)).current;
  const isSideMenuShown = useRef(false);
  const toggleMenu = (fast?: boolean) => {
    Animated.timing(sideMenuLeft, {
      toValue: isSideMenuShown.current ? -sideMenuWidth : 0,
      duration: fast ? sideMenuSpeed / 2 : sideMenuSpeed,
      easing: Easing.out(Easing.sin),
      useNativeDriver: false,
    }).start(() => {
      isSideMenuShown.current = !isSideMenuShown.current;
    });
  };

  // when navigating to a new screen, fade out the menu and slide it off-screen
  // Also set page params to trigger the AnimatedScreen component's fade-out animation
  const navigate = (path: string) => () => {
    navigation.setParams({ fadeOut: true });
    toggleMenu(true);
    Animated.timing(sideMenuOpacity, {
      toValue: 0,
      duration: sideMenuSpeed / 2,
      useNativeDriver: false,
    }).start(() => {
      navigation.push(path);
      setTimeout(() => {
        // after completing the navigation, re-opacify the menu
        sideMenuOpacity.setValue(1);
      }, 100);
    });
  };

  // Let our parent toggle the menu
  useImperativeHandle(ref, () => ({
    toggleMenu,
  }));

  // reset menu when theme changes
  React.useEffect(() => {
    sideMenuLeft.setValue(-sideMenuWidth);
    isSideMenuShown.current = false;
  }, [theme]);

  return (
    <Animated.View
      style={{
        paddingLeft: theme.mediumSpace,
        paddingRight: theme.mediumSmallSpace,
        paddingTop: theme.largeSpace * 2,
        opacity: sideMenuOpacity,
        backgroundColor: smallScreen ? theme.sideMenuColor : undefined,
        height: "100vh", // Replace with svh or dvh if problems with mobile/scrolls?
        position: "absolute",
        left: 0,
        top: 0,
        transform: [{ translateX: sideMenuLeft }],
      }}
    >
      <TouchableOpacity onPress={navigate("Home")}>
        <StyledText type={"body"}>Home</StyledText>
      </TouchableOpacity>
      <Padding vertical={theme.mediumSmallSpace} />
      <TouchableOpacity onPress={navigate("Videos & Links")}>
        <StyledText type={"body"}>Videos & Links</StyledText>
      </TouchableOpacity>
      <Padding vertical={theme.mediumSmallSpace} />
      <a href="mailto:bmbmjmdm@gmail.com">
        <StyledText type={"body"}>Contact</StyledText>
      </a>
    </Animated.View>
  );
};

// @ts-ignore-next-line
export const SideMenu = forwardRef(SideMenuComponent);
