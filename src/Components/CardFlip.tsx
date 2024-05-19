import React, {
  FunctionComponent,
  useImperativeHandle,
  forwardRef,
} from "react";
import { StyleSheet, Animated, ViewStyle } from "react-native";

export type CardFlipProps = {
  style?: ViewStyle;
  duration?: number;
  flipZoom?: number;
  flipDirection?: "y" | "x";
  onFlip?: (index: number) => void;
  onFlipEnd?: (index: number) => void;
  onFlipStart?: (index: number) => void;
  children: React.ReactNode[];
  // we could look this up via layout events but this is a bit more performant and cleaner
  expectedWidth: number;
};

// allow our parent to tell this component to flip
export type CardFlipRef = {
  flip: () => void;
};

// This is a component that flips between two children, animating the flip with a slight depth effect
const CardFlipComponent: FunctionComponent<CardFlipProps> = (
  {
    style = {},
    duration = 750,
    flipZoom = 0.2,
    flipDirection = "y",
    onFlip = () => {},
    onFlipStart = () => {},
    onFlipEnd = () => {},
    children = [],
    expectedWidth,
  },
  ref
) => {
  const [side, setSide] = React.useState(0);
  const progress = React.useRef(new Animated.Value(0)).current;
  const rotationX = React.useRef(new Animated.Value(50)).current;
  const rotationY = React.useRef(new Animated.Value(50)).current;
  const zoom = React.useRef(new Animated.Value(0)).current;
  const [rotateOrientation, setRotateOrientation] = React.useState("");

  // Expose flip method to parent & call helper based on direction
  useImperativeHandle(ref, () => ({
    flip: () => {
      if (flipDirection == "y") {
        flipY();
      } else {
        flipX();
      }
    },
  }));

  // flipping over y axis
  function flipY() {
    _flipTo({
      x: 50,
      y: side === 0 ? 100 : 50,
    });
    // update state for later flips
    setSide(side === 0 ? 1 : 0);
    setRotateOrientation("y");
  }

  // flipping over x axis
  function flipX() {
    _flipTo({
      y: 50,
      x: side === 0 ? 100 : 50,
    });
    // update state for later flips
    setSide(side === 0 ? 1 : 0);
    setRotateOrientation("x");
  }

  function _flipTo(toValue: any) {
    // callbacks
    onFlip?.(side === 0 ? 1 : 0);
    onFlipStart?.(side === 0 ? 1 : 0);
    Animated.parallel([
      // use a central progress value to interpolate the opacity of both sides simultaneously
      Animated.timing(progress, {
        toValue: side === 0 ? 100 : 0,
        duration,
        useNativeDriver: false,
      }),
      // zoom in and then out (scale up and then down) in for depth effect
      Animated.sequence([
        Animated.timing(zoom, {
          toValue: 100,
          duration: duration / 2,
          useNativeDriver: false,
        }),
        Animated.timing(zoom, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: false,
        }),
      ]),
      // rotate around the given axis to make the side look like its flipping over
      Animated.timing(rotationX, {
        toValue: toValue.x,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(rotationY, {
        toValue: toValue.y,
        duration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // callback
      onFlipEnd?.(side === 0 ? 1 : 0);
    });
  }

  // interpolate side A opacity so it switches over from A to B at 50% flip progress
  const sideAOpacity = progress.interpolate({
    inputRange: [50, 51],
    outputRange: [100, 0],
    extrapolate: "clamp",
  });
  const cardATransform = {
    opacity: sideAOpacity,
    zIndex: side === 0 ? 1 : 0,
    transform: [],
  };
  if (rotateOrientation === "x") {
    // interpolate side A rotation so it flips over the x axis
    const aXRotation = rotationX.interpolate({
      inputRange: [0, 50, 100, 150],
      outputRange: ["-180deg", "0deg", "180deg", "0deg"],
      extrapolate: "clamp",
    });
    cardATransform.transform.push({ rotateX: aXRotation } as never);
  } else {
    // interpolate side A rotation so it flips over the Y axis
    const aYRotation = rotationY.interpolate({
      inputRange: [0, 50, 100, 150],
      outputRange: ["-180deg", "0deg", "180deg", "0deg"],
      extrapolate: "clamp",
    });
    cardATransform.transform.push({ rotateY: aYRotation } as never);
  }
  // include a shift along the X axis to counter-act the card sliding out of place as it flips
  cardATransform.transform.push({ translateX: -expectedWidth / 2 } as never);

  // interpolate side B opacity so it switches over from B to A at 50% flip progress
  const sideBOpacity = progress.interpolate({
    inputRange: [50, 51],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const cardBTransform = {
    opacity: sideBOpacity,
    zIndex: side === 0 ? 0 : 1,
    transform: [],
  };
  let bYRotation;
  if (rotateOrientation === "x") {
    // interpolate side B rotation so it flips over the x axis
    const bXRotation = rotationX.interpolate({
      inputRange: [0, 50, 100, 150],
      outputRange: ["0deg", "-180deg", "-360deg", "180deg"],
      extrapolate: "clamp",
    });
    cardBTransform.transform.push({ rotateX: bXRotation } as never);
  } else {
    // interpolate side B rotation so it flips over the y axis
    bYRotation = rotationY.interpolate({
      inputRange: [0, 50, 100, 150],
      outputRange: ["0deg", "-180deg", "0deg", "180deg"],
      extrapolate: "clamp",
    });
    cardBTransform.transform.push({ rotateY: bYRotation } as never);
  }
  // include a shift along the X axis to counter-act the card sliding out of place as it flips
  cardBTransform.transform.push({ translateX: -expectedWidth / 2 } as never);

  // scale card with zoom for depth effect
  const cardZoom = zoom.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 1 + flipZoom],
    extrapolate: "clamp",
  });

  const scaling = {
    transform: [{ scale: cardZoom }],
  };

  return (
    <Animated.View style={[style, scaling]}>
      <Animated.View style={[styles.cardContainer, cardATransform]}>
        {children[0]}
      </Animated.View>
      <Animated.View style={[styles.cardContainer, cardBTransform]}>
        {children[1]}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});

// @ts-ignore-next-line
export const CardFlip = forwardRef(CardFlipComponent);
