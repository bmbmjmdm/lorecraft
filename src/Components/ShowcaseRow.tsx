import { View } from "react-native";
import React, { FunctionComponent, useContext } from "react";
import { Flex, Padding, StyledText } from "../Components";
import { ShowcaseButton } from "./ShowcaseButton";
import { ThemeContext } from "../Theme";
import { FadeInImage } from "./FadeInImage";
import { isScreenSmall } from "../Helpers";

type ShowcaseRowProps = {
  title: string;
  description: string;
  tech?: string;
  image: any;
  horizontalImage?: boolean;
  customImageDimensions?: { width: number; height: number; left?: number };
  sharpEdges?: boolean;
  android?: string;
  apple?: string;
  link?: string | { path: string };
  isFirst?: boolean;
};

type ShowcaseRowCustomProps = {
  children: any;
  isFirst?: boolean;
}

export const ShowcaseRowCustom: FunctionComponent<ShowcaseRowCustomProps> = ({ children, isFirst }) => {
  const theme = useContext(ThemeContext);
  // we dont need a listener since the theme listens for us
  const singleColumn = isScreenSmall();

  return (
    <Flex fullWidth centered>
      <Flex slim centered>
        {(!isFirst || !singleColumn) && <View style={theme.showcaseDivider} />}
        <Padding vertical={theme.largeSpace} />
        {children}
        <Padding vertical={theme.largeSpace} />
      </Flex>
    </Flex>
  );
}

// This component shows off a project/app/job/etc
// It displays a title, description, image, and links
export const ShowcaseRow: FunctionComponent<ShowcaseRowProps> = ({
  title,
  description,
  tech,
  image,
  horizontalImage = false,
  sharpEdges = false,
  android,
  apple,
  link,
  customImageDimensions,
  isFirst = false,
}) => {
  const theme = useContext(ThemeContext);
  const imageWidth = customImageDimensions
    ? customImageDimensions.width
    : horizontalImage
    ? theme.showcaseImageLong
    : theme.showcaseImageShort;
  const imageHeight = customImageDimensions
    ? customImageDimensions.height
    : horizontalImage
    ? theme.showcaseImageShort
    : theme.showcaseImageLong;
  // we dont need a listener since the theme listens for us
  const singleColumn = isScreenSmall();

  const buttons = (
    <Flex row style={{ marginTop: "auto" }}>
      {apple && (
        <ShowcaseButton
          link={apple}
          name={"Apple"}
          singleColumn={singleColumn}
        />
      )}
      {android && (
        <ShowcaseButton
          link={android}
          name={"Android"}
          singleColumn={singleColumn}
        />
      )}
      {link && (
        <ShowcaseButton link={link} name={"Link"} singleColumn={singleColumn} />
      )}
    </Flex>
  );
  const titleComponent = (
    <StyledText
      type={"body"}
      style={{
        width: singleColumn ? undefined : theme.showcaseTextWidth,
        textAlign: singleColumn ? "center" : undefined,
        paddingRight: singleColumn ? theme.smallSpace : undefined,
      }}
    >
      {title}
    </StyledText>
  );
  const descriptionComponent = (
    <>
      <StyledText
        type={"caption"}
        style={{
          width: singleColumn ? undefined : theme.showcaseTextWidth,
          textAlign: singleColumn ? "center" : undefined,
        }}
      >
        {description}
      </StyledText>
      {tech && <StyledText
        type={"subscript"}
        style={{
          width: singleColumn ? undefined : theme.showcaseTextWidth,
          textAlign: singleColumn ? "center" : undefined,
        }}
      >
        {tech}
      </StyledText>}
    </>
  );
  const imageComponent = (
    <FadeInImage
      spinner
      source={image}
      style={{
        width: imageWidth,
        height: imageHeight,
        resizeMode: "stretch",
        borderRadius: sharpEdges ? 5 : 20,
        position: singleColumn ? undefined : "absolute",
        left: singleColumn ? undefined :
              customImageDimensions?.left ? customImageDimensions.left :
              imageHeight / 2,
      }}
    />
  );

  // on larger screens, we have 2 columns. in the left is the title, description, and buttons. in the right is the image
  // on smaller screens, we have 1 column. This is then split based on the orientation of the image:
  // if the image is vertical, we have the title and buttons to the left of the image, then the description below both of them
  // if the image is horizontal, we have them all stacked: title above image above description above buttons
  return (
    <ShowcaseRowCustom isFirst={isFirst}>
      {singleColumn ? (
        <Flex centered>
          {horizontalImage || customImageDimensions ? (
            <>
              {titleComponent}
              <Padding vertical={theme.mediumSpace} />
              {imageComponent}
              <Padding vertical={theme.mediumSpace} />
              {descriptionComponent}
              <Padding vertical={theme.smallSpace} />
              {buttons}
            </>
          ) : (
            <>
              <Flex row centered>
                <Flex centered full>
                  {titleComponent}
                  <Padding vertical={theme.smallSpace} />
                  {buttons}
                </Flex>
                <Padding horizontal={theme.smallSpace} />
                <Flex full>{imageComponent}</Flex>
              </Flex>
              <Padding vertical={theme.mediumSpace} />
              {descriptionComponent}
            </>
          )}
        </Flex>
      ) : (
        <Flex row>
          <Flex>
            {titleComponent}
            <Padding vertical={theme.mediumSmallSpace} />
            {descriptionComponent}
            <Padding vertical={theme.smallSpace} />
            {buttons}
          </Flex>
          <View
            style={{ width: theme.showcaseImageLong, height: imageHeight }}
          >
            {imageComponent}
          </View>
        </Flex>
      )}
  </ShowcaseRowCustom>
  );
};
