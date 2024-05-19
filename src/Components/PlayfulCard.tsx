import { Animated, Image, Dimensions } from "react-native";
import React, { FunctionComponent, useEffect, useRef, useContext } from "react";
import { easeOutBack, CardFlip, CardFlipRef } from "../Components";
import card_back from "../assets/box.png";
import card0 from "../assets/card0.png";
import { ThemeContext } from "../Theme";

type PlayfulCardProps = {
  fast?: boolean;
  onAnimationComplete: () => void;
};

// This component animates in the card. It will slide up playfully, then flip over to reveal the front of the card
// You'll see constants used in various equations below. These are relative sizes to ensure that all the images appear in the correct proportions
export const PlayfulCard: FunctionComponent<PlayfulCardProps> = ({
  onAnimationComplete,
  fast = false,
}) => {
  // animate in a card from off-screen
  const theme = useContext(ThemeContext);
  // we dont need a listener since the theme listens for us
  const windowHeight = Dimensions.get("window").height / 2;
  const cardTop = useRef(new Animated.Value(windowHeight)).current;
  const cardScale = useRef(
    new Animated.Value(theme.cardScaleInitial)
  ).current;
  const cardRef = useRef<CardFlipRef>(null);
  const finalCardScale = theme.cardScaleFinal;
  const baseCardHeight = theme.cardHeight;
  const defaultCardHeight = 933;
  const cardHeightRatio = baseCardHeight / defaultCardHeight;
  const baseCardWidth = 600 * cardHeightRatio;

  useEffect(() => {
    // Use various delays to time the animations naturally
    Animated.sequence([
      Animated.delay(1000),
      // slide up (onto the screen) at moderate speed
      Animated.timing(cardTop, {
        toValue: windowHeight - 500 * cardHeightRatio,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.delay(500),
      // slide back down (off-screen) slowly
      Animated.timing(cardTop, {
        toValue: windowHeight,
        duration: fast ? 3000 : 4000,
        useNativeDriver: false,
      }),
      Animated.delay(fast ? 400 : 800),
      // slide up (onto the screen) a little bit at high speed
      Animated.timing(cardTop, {
        toValue: windowHeight - 350 * cardHeightRatio,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.delay(100),
      // slide back off also at high speed
      Animated.timing(cardTop, {
        toValue: windowHeight,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.delay(fast ? 500 : 1000),
      // now scale the card down to its normal size and slide it up into the center of its container
      Animated.parallel([
        Animated.timing(cardTop, {
          toValue: -baseCardHeight / 2,
          easing: easeOutBack,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(cardScale, {
          toValue: finalCardScale,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(500),
    ]).start(() => {
      // flip the card to reveal the front face
      cardRef.current?.flip();
    });
  }, []);

  // render the card
  return (
    <Animated.View
      style={{
        position: "absolute",
        zIndex: 0,
        transform: [{ scale: cardScale }, { translateY: cardTop }],
      }}
    >
      <CardFlip
        ref={cardRef}
        expectedWidth={baseCardWidth}
        onFlipEnd={() => setTimeout(onAnimationComplete, 1500)}
      >
        <Image
          style={{
            width: baseCardWidth,
            height: baseCardHeight,
            resizeMode: "stretch",
          }}
          source={card_back}
        />
        <Image
          style={{
            width: baseCardWidth,
            height: baseCardHeight,
            resizeMode: "stretch",
          }}
          source={card0}
        />
      </CardFlip>
    </Animated.View>
  );
};
