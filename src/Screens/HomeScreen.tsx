import { ViewStyle } from "react-native";
import React, { FunctionComponent, useRef, useContext, useEffect } from "react";
import { Flex } from "../Components";
import { HomeScreenMessage } from "./HomeScreenMessage";
import { HomeScreenImages } from "./HomeScreenImages";
import { AnimatedScreen } from "./AnimatedScreen";
import { StackScreenProps } from "@react-navigation/stack";
import { ThemeContext } from "../Theme";
import { isScreenSmall } from "../Helpers";

export const CAT_MODE_KEY =
  "lorecraftCatMode 82jfnfoi239uf2jibn29yt928rth984h3ut9u923r";
export const SCREEN_SEEN_KEY =
  "lorecraftScreenSeed 82jfnfoi239uf2jibn29yt928rth984h3ut9u923r";

// This is the landing page of the website
// It's split into two halves, one for a typed-out and changing message, the other for an animated card showing previews of various apps
// On a small screen we only show one of these halves at once and alternate between the two each time the user comes to this screen/page
// It animates in and out using the usual AnimatedScreen
export const HomeScreen: FunctionComponent<StackScreenProps<any>> = ({
  route,
}) => {
  const catMode = useRef(Boolean(localStorage.getItem(CAT_MODE_KEY)));
  // get the last-seen-screen from storage or starting one and get the next one to be seen by negating it
  const lastSeenScreen = useRef(
    localStorage.getItem(SCREEN_SEEN_KEY) || JSON.stringify(Math.random() > 0.5)
  ).current;
  const nextScreen = useRef(!JSON.parse(lastSeenScreen)).current;
  useEffect(() => {
    // store last-seen screen
    localStorage.setItem(SCREEN_SEEN_KEY, JSON.stringify(nextScreen));
  }, []);

  const theme = useContext(ThemeContext);
  const space = theme.mediumSpace;
  const setCatMode = (mode: boolean) => {
    catMode.current = mode;
  };

  // we dont need a listener since the theme listens for us
  const smallScreen = isScreenSmall();
  // use min height to ensure the card's final size is used for centering
  const minHeight = theme.cardHeight * theme.cardScaleFinal;
  const optionalStyles = {
    paddingHorizontal: smallScreen ? theme.mediumSmallSpace : undefined,
    paddingBottom: smallScreen && nextScreen ? theme.largeSpace : undefined,
  };

  // if we're on a small screen, only show 1 of the two halves
  return (
    <AnimatedScreen fadeOut={route?.params?.fadeOut}>
      <Flex full centered style={[{ minHeight }, optionalStyles] as ViewStyle}>
        {smallScreen ? (
          nextScreen ? (
            <HomeScreenMessage
              setCatMode={setCatMode}
              catMode={catMode.current}
            />
          ) : (
            <HomeScreenImages catMode={catMode} showTitle />
          )
        ) : (
          <Flex full slim row>
            <Flex
              full
              centeredVertical
              style={{
                paddingHorizontal: space,
                marginTop: -space,
              }}
            >
              <HomeScreenMessage
                setCatMode={setCatMode}
                catMode={catMode.current}
              />
            </Flex>
            <Flex full centered style={{ paddingHorizontal: space }}>
              <HomeScreenImages catMode={catMode} />
            </Flex>
          </Flex>
        )}
      </Flex>
    </AnimatedScreen>
  );
};
