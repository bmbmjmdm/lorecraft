// @ts-ignore-next-line
import { ScrollView, Linking } from "react-native";
import { AnimatedScreen } from "./AnimatedScreen";
import React, { FunctionComponent } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ShowcaseRowCustom, StyledText } from "../Components";
import { isScreenSmall } from "../Helpers";

// Shows a list of videos/links
// Uses ShowcaseRowCustom to handle padding/dividers
// It animates in and out using the usual AnimatedScreen
export const MediaScreen: FunctionComponent<StackScreenProps<any>> = ({
  route,
}) => {
  const smallScreen = isScreenSmall();
  const videoWidth = smallScreen ? 300 : 560;
  const videoHeight = smallScreen ? 169 : 315;

  return (
    <AnimatedScreen fadeOut={route?.params?.fadeOut}>
      <ScrollView style={{ height: 1 }}>
        <ShowcaseRowCustom isFirst>
          <StyledText
            type="body"
            style={{textAlign: 'center'}}
          >
            Kickstarter Coming Soon!
          </StyledText>
        </ShowcaseRowCustom>
        <ShowcaseRowCustom>
          <iframe
            width={videoWidth}
            height={videoHeight}
            src="https://www.youtube.com/embed/OjyGHSUeTyg"
            title="Gameplay Teaser"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </ShowcaseRowCustom>
        <ShowcaseRowCustom>
          <iframe
            width={videoWidth}
            height={videoHeight}
            src="https://www.youtube.com/embed/19Ma2sum7aQ"
            title="How to Play"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </ShowcaseRowCustom>
        <ShowcaseRowCustom>
          <StyledText
            type="body"
            style={{textAlign: 'center'}}
            onPress={() => Linking.openURL("https://boardgamegeek.com/boardgame/398730/lorecraft")}
          >
            See on Board Game Geek, click here!
          </StyledText>
        </ShowcaseRowCustom>
        <ShowcaseRowCustom>
          <StyledText
            type="body"
            style={{textAlign: 'center'}}
          >
            Delux Game Tutorial Coming Soon!
          </StyledText>
        </ShowcaseRowCustom>
      </ScrollView>
    </AnimatedScreen>
  );
};
