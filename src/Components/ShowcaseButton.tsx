import { TouchableOpacity, Linking, Animated, Easing } from "react-native";
import React, { FunctionComponent, useRef, useEffect, useContext } from "react";
// @ts-ignore-next-line
import LinearGradient from "react-native-web-linear-gradient";
import apple from "../assets/card0.png"; //todo
import android from "../assets/card0.png"; //todo
import { StyledText } from "./Text";
import { ThemeContext } from "../Theme";
import { useNavigation } from "@react-navigation/native";
import { FadeInImage } from "./FadeInImage";

type ShowcaseButtonProps = {
  link: string | { path: string };
  name: "Android" | "Apple" | "Link";
  singleColumn?: boolean;
};

// This button shows either an Apple icon, Android icon, or a pill button
// When it is pressed, it opens the link in a new tab
export const ShowcaseButton: FunctionComponent<ShowcaseButtonProps> = ({
  link,
  name,
  singleColumn = false,
}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);

  // When the user presses this showcase button
  const onPress = () => {
    // open a normal link in a new tab
    if (typeof link === "string") {
      Linking.openURL(link);
    }
    // if the link is a path within our own site, manually fade out and navigate
    else {
      // @ts-ignore-next-line
      navigation.setParams({ fadeOut: true });
      setTimeout(() => {
        // @ts-ignore-next-line
        navigation.push(link.path)
        // default screen animation time from SideMenu.tsx
      }, theme.sideMenuSpeed/2)
    }
  };

  return (
    <TouchableOpacity
      style={{
        marginRight: singleColumn ? undefined : theme.mediumSmallSpace,
        marginHorizontal: singleColumn ? theme.smallSpace : undefined,
        marginTop: theme.mediumSmallSpace,
      }}
      onPress={onPress}
    >
      {name === "Apple" && <AppleIcon />}
      {name === "Android" && <AndroidIcon />}
      {name === "Link" && <PillButton />}
    </TouchableOpacity>
  );
};

// This calls the given function after 5-30 seconds
const randomTimeout = (f: Function) => {
  setTimeout(f, Math.random() * 25000 + 5000);
};

// The android icon slides from left to right and back, with appropriate acceleration/whip shown through rotation
const AndroidIcon: FunctionComponent<{}> = () => {
  const theme = useContext(ThemeContext);
  // use a central animation value to drive the icon's position and rotation using interpolation
  const androidAnimation = useRef(new Animated.Value(0)).current;
  const androidRotation = useRef(
    androidAnimation.interpolate({
      inputRange: [0, 10, 20, 50, 65, 75, 100, 107, 115],
      outputRange: [
        "0deg",
        "-10deg",
        "-20deg",
        "-20deg",
        "10deg",
        "20deg",
        "20deg",
        "-10deg",
        "0deg",
      ],
      extrapolate: "clamp",
    })
  ).current;
  const androidLeft = useRef(
    androidAnimation.interpolate({
      inputRange: [0, 50, 55, 115],
      outputRange: [0, 144, 150, 0],
      extrapolate: "clamp",
    })
  ).current;

  // animate the icon after 5-30 seconds
  useEffect(() => {
    randomTimeout(nextAnimationAndroid);
  }, []);

  const nextAnimationAndroid = () => {
    Animated.timing(androidAnimation, {
      toValue: 115,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      androidAnimation.setValue(0);
    });
    // animate the icon again after 5-30 seconds
    randomTimeout(nextAnimationAndroid);
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateX: androidLeft }],
      }}
    >
      <FadeInImage
        style={{
          height: theme.appLinkSize,
          width: theme.appLinkSize,
          transform: [{ rotate: androidRotation }],
        }}
        source={android}
      />
    </Animated.View>
  );
};

// The apple icon jumps up and back down, with appropriate deceleration/acceleration to show interesting gravity
const AppleIcon: FunctionComponent<{}> = () => {
  const theme = useContext(ThemeContext);
  const appleAnimation = useRef(new Animated.Value(0)).current;

  // animate the icon after 5-30 seconds
  useEffect(() => {
    randomTimeout(nextAnimationApple);
  }, []);

  const nextAnimationApple = () => {
    Animated.sequence([
      // go up, decelerating
      Animated.timing(appleAnimation, {
        toValue: -100,
        duration: 500,
        easing: Easing.out(Easing.sin),
        useNativeDriver: false,
      }),
      // go down, accelerating
      Animated.timing(appleAnimation, {
        toValue: 0,
        duration: 750,
        easing: Easing.bounce,
        useNativeDriver: false,
      }),
    ]).start();
    // animate the icon after 5-30 seconds
    randomTimeout(nextAnimationApple);
  };

  return (
    <FadeInImage
      style={{
        height: theme.appLinkSize,
        width: theme.appLinkSize,
        transform: [{ translateY: appleAnimation }],
      }}
      source={apple}
    />
  );
};

// The pill button bulges, curves/sharpens, and twists to show interesting motion
// It then returns to its original state
const PillButton: FunctionComponent<{}> = () => {
  const theme = useContext(ThemeContext);
  // use a central animation value to drive the button's scale, radius, and rotation using interpolation
  const linkAnimation = useRef(new Animated.Value(0)).current;
  // bulge vertically
  const linkScaleY = useRef(
    linkAnimation.interpolate({
      inputRange: [0, 20, 40, 60, 80, 100],
      outputRange: [1, 1.2, 1.5, 1.2, 1.8, 1],
      extrapolate: "clamp",
    })
  ).current;
  // bulge horizontally
  const linkScaleX = useRef(
    linkAnimation.interpolate({
      inputRange: [0, 20, 40, 60, 80, 100],
      outputRange: [1, 0.75, 1, 1.25, 1.5, 1],
      extrapolate: "clamp",
    })
  ).current;
  // curve/sharpen
  const linkRadius = useRef(
    linkAnimation.interpolate({
      inputRange: [0, 20, 40, 60, 80, 100],
      outputRange: [35, 10, 20, 50, 20, 35],
      extrapolate: "clamp",
    })
  ).current;
  // twist
  const linkRotation = useRef(
    linkAnimation.interpolate({
      inputRange: [0, 20, 40, 60, 80, 100],
      outputRange: ["0deg", "-10deg", "10deg", "-20deg", "30deg", "0deg"],
      extrapolate: "clamp",
    })
  ).current;
  // keep the link text upright
  const linkCounterRotate = useRef(
    linkAnimation.interpolate({
      inputRange: [0, 20, 40, 60, 80, 100],
      outputRange: ["0deg", "10deg", "-10deg", "20deg", "-30deg", "0deg"],
      extrapolate: "clamp",
    })
  ).current;

  // animate the icon after 5-30 seconds
  useEffect(() => {
    randomTimeout(nextAnimationLink);
  }, []);

  const nextAnimationLink = () => {
    Animated.timing(linkAnimation, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      linkAnimation.setValue(0);
    });
    // animate the icon after 5-30 seconds
    randomTimeout(nextAnimationLink);
  };

  return (
    <Animated.View
      style={{
        borderRadius: linkRadius,
        overflow: "hidden",
        height: theme.webLinkHeight,
        width: theme.webLinkWidth,
        transform: [
          { scaleY: linkScaleY },
          { scaleX: linkScaleX },
          { rotate: linkRotation },
        ],
      }}
    >
      <LinearGradient
        colors={theme.linkBackground}
        {...theme.linearGradient}
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledText
          animated
          style={{
            transform: [
              { scaleY: Animated.divide(new Animated.Value(1), linkScaleY) },
              { scaleX: Animated.divide(new Animated.Value(1), linkScaleX) },
              { rotate: linkCounterRotate },
            ],
          }}
          type={"button"}
        >
          Link
        </StyledText>
      </LinearGradient>
    </Animated.View>
  );
};
