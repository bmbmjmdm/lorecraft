// @ts-ignore-next-line
import { Text, TextStyle } from "react-native";
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react";
import {
  Flex,
  Padding,
  StyledText,
  Typewriter,
  TypewriterProps,
} from "../Components";
import { ThemeContext } from "../Theme";
import { CAT_MODE_KEY } from "./HomeScreen";
import { isScreenSmall } from "../Helpers";

export const CAT_CAPTION = 12;
const CAT_CLARIFICATION_DELAY = 60 * 1000;

type HomeScreenMessageProps = {
  setCatMode: (mode: boolean) => void;
  catMode: boolean;
};

// This component is used to display the home screen messages. These are typed onto the screen one at a time,
// changing to the next one after a short delay. Eventually, the final message will cause the homescreen to
// switch to showing a cat-themed product
export const HomeScreenMessage: FunctionComponent<HomeScreenMessageProps> = ({
  setCatMode,
  catMode,
}) => {
  const theme = useContext(ThemeContext);
  // lookup if we're already in cat mode from previous sessions
  const [curCaption, setCurCaption] = useState(catMode ? CAT_CAPTION : 0);
  const [deleteTitle, setDeleteTitle] = useState(catMode);
  const [changeTitle, setChangeTitle] = useState(false);
  const titleFinish = deleteTitle
    ? () => {
        setCatMode(true);
        setChangeTitle(true);
      }
    : undefined;
  const nextCaption = () => setCurCaption(curCaption + 1);
  // when we change to cat mode, change the title and pictures.
  // also setup a 20sec timer to show the extended cat caption
  const changeProduct = () => {
    setDeleteTitle(true);
    setCurCaption(curCaption + 1);
    setTimeout(() => {
      setCurCaption((cur) => cur + 1);
    }, CAT_CLARIFICATION_DELAY);
  };
  // if we start in cat mode, setup a 20sec timer to show the extended cat caption
  useEffect(() => {
    if (catMode) {
      setTimeout(() => {
        setCurCaption(curCaption + 1);
      }, CAT_CLARIFICATION_DELAY);
    }
  }, []);

  // we use a placeholder to make sure the view remains the same size as the typewriter text even when its empty
  const placeholder = () => <StyledText type={"header"}>{"\u200A"}</StyledText>;

  return (
    <>
      <Flex row>
        {placeholder()}
        {!changeTitle && (
          <Typewriter
            type={"header"}
            startFull
            deleteAfter={deleteTitle}
            onFinish={titleFinish}
          >
            LoreCraft
          </Typewriter>
        )}
        {changeTitle && <Typewriter type={"header"}>LoreCat :3</Typewriter>}
      </Flex>
      <Padding vertical={15} />
      <Flex row style={{ height: theme.messageHeightHolder }}>
        {placeholder()}
        {getCaption(curCaption, nextCaption, changeProduct)}
      </Flex>
    </>
  );
};

// this allows us to step through our list of captions simply
export const getCaption = (
  curCaption: number,
  nextCaption: Function,
  changeProduct: Function
) => {
  const smallScreen = isScreenSmall();
  const style: TextStyle = {
    textAlign: smallScreen ? "center" : undefined,
  };
  let counter = 0;

  // all captions share the same default props, but some are overriden to change speed, etc for certain captions
  const defaultProps = (): Omit<TypewriterProps, "children"> & {
    key: number;
  } => {
    counter++;
    return {
      key: counter,
      deleteAfter: true,
      speed: 50,
      deleteSpeed: 20,
      pauseTime: 500,
      onFinish: nextCaption,
      type: "caption",
      style,
    };
  };

  return [
    <Typewriter {...defaultProps()} pauseTime={1000}>
      This is a caption that I'll make informative and interesting and
      everything :). Not that you're reading it. Oh, you are? Ok, here we go!
    </Typewriter>,

    <Typewriter {...defaultProps()} pauseTime={1000}>
      This site is dedicated to LoreCraft (well, I guess that's obvious), a fun little party/story/co-op card game that I've been working on for a couple years! Wanna hear a couple taglines?
    </Typewriter>,

    <Typewriter {...defaultProps()} pauseTime={1000}>
      "Cards come alive, but never in the way you expect!" One cool thing is how cards interact naturally in this game, as if they were real! However because you don't control your own story (the other players do), things often take twists and turns that you didn't plan for...
    </Typewriter>,

    <Typewriter {...defaultProps()} pauseTime={1000}>
      "LoreCraft lets players get deeply creative in a casual setting with unique and memorable payoffs." Anyone can be creative, and this game lets you unleash your imagination as much or as little as you like, getting rewarded either way!
    </Typewriter>,

    // We use hairs here for consistent spacing and speed
    <Typewriter {...defaultProps()} pauseTime={1000}>
      "Takes free association to a whole new level as players scramble to predict each other." Or don't bother predicting! Set your story up however you think is best; leave the rest up to your friends! {twentyHairs} . . . Happy?
    </Typewriter>,

    <Typewriter {...defaultProps()} pauseTime={1000}>
      . . . You're still here? I mean, it's just a landing page. Not much to see
      . . .
    </Typewriter>,

    <Typewriter {...defaultProps()}>Navigate to Cool Stuff in the menu, wierdo.</Typewriter>,

    <Typewriter {...defaultProps()}>FOR REAL NOW</Typewriter>,

    <Typewriter {...defaultProps()}>I CANT KEEP DOING THIS FOREVER</Typewriter>,

    <Typewriter {...defaultProps()}>Or can I?</Typewriter>,

    // Once the user sees the next caption (the meows), we assume they've made it to cat mode on subsequent visits
    <Typewriter
      {...defaultProps()}
      onFinish={() => {
        nextCaption();
        localStorage.setItem(CAT_MODE_KEY, "yes");
      }}
    >
      Jk I can't. But I can refuse to cooperate.
    </Typewriter>,

    <Typewriter {...defaultProps()} speed={25}>
      Meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow
      meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow
      meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow
      meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow
      meow meow meow meow
    </Typewriter>,

    <Typewriter
      {...defaultProps()}
      deleteAfter={false}
      onFinish={changeProduct}
    >
      I like cats.
    </Typewriter>,

    // We have a duplicate of the caption here so that we can show the extended caption appropriately on subsequent loads
    <StyledText type={"caption"} style={style}>
      I like cats.
    </StyledText>,
  ][curCaption];
};

const twentyHairs =
  "\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A\u200A";
