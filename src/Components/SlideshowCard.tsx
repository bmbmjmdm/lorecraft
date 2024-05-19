import { Animated, View } from "react-native";
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useContext,
} from "react";
import { easeOutBack } from "../Components";
import card0 from "../assets/card0.png";
import { ThemeContext } from "../Theme";

type SlideshowCardProps = {
  pictureLists: any[][];
  curListRef: MutableRefObject<boolean>;
  onFirstCycleComplete: () => void;
};

// This component animates a card cycling through a list of images/gifs
// You'll see constants used in various equations below. These are relative sizes to ensure that all the images appear in the correct proportions
export const SlideshowCard: FunctionComponent<SlideshowCardProps> = ({
  pictureLists,
  curListRef,
  onFirstCycleComplete,
}) => {
  // we need to convert our boxed boolean into a boxed number
  const curListNum = () => (curListRef.current ? 1 : 0);
  const theme = useContext(ThemeContext);
  const prevListRef = useRef(curListNum());
  const [cardCycling, setCardCycling] = useState(false);
  const finalCardScale = theme.cardScaleFinal;
  const baseCardHeight = theme.cardHeight;
  const defaultCardHeight = 933;
  const cardHeightRatio = baseCardHeight / defaultCardHeight;
  const baseCardWidth = 600 * cardHeightRatio;
  const heightCardAtScale = baseCardHeight * finalCardScale;
  const widthCardAtScale = baseCardWidth * finalCardScale;

  // we use 2 app screens, one on top of the other, so we can animate the new one in and the old one out, then they swap roles
  const curApp = useRef(0);
  const [curPicOneState, setCurPicOneSetter] = useState(0);
  const [curPicTwoState, setCurPicTwoSetter] = useState(1);
  const innerCardOpacity = useRef(new Animated.Value(1)).current;
  const startingTopVal = 250 * cardHeightRatio;
  const startingScaleVal = theme.appScaleInitial;
  const appScreens = [
    {
      picList: useRef(pictureLists[curListNum()]),
      picOpacity: useRef(new Animated.Value(0)).current,
      picTop: useRef(new Animated.Value(startingTopVal)).current,
      picZ: useRef(new Animated.Value(1)).current,
      picScale: useRef(new Animated.Value(startingScaleVal)).current,
      curPic: curPicOneState,
      setCurPic: setCurPicOneSetter,
    },
    {
      picList: useRef(pictureLists[curListNum()]),
      picOpacity: useRef(new Animated.Value(0)).current,
      picTop: useRef(new Animated.Value(startingTopVal)).current,
      picZ: useRef(new Animated.Value(2)).current,
      picScale: useRef(new Animated.Value(startingScaleVal)).current,
      curPic: curPicTwoState,
      setCurPic: setCurPicTwoSetter,
    },
  ];

  // cycle through our apps
  useEffect(() => {
    const curAppScreen = appScreens[curApp.current];
    const nextAppScreen = appScreens[1 - curApp.current];
    // optionally fade out the inner card if we just started cycling
    const optionalAnimation = cardCycling
      ? []
      : [
          Animated.timing(innerCardOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ];
    Animated.parallel([
      ...optionalAnimation,
      // fade out old image
      Animated.timing(curAppScreen.picOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
      // fade in new image
      Animated.timing(nextAppScreen.picOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      // slide new image into position
      Animated.timing(nextAppScreen.picTop, {
        toValue: 0,
        easing: easeOutBack,
        duration: 600,
        useNativeDriver: false,
      }),
      // scale up new image to full size
      Animated.timing(nextAppScreen.picScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // now set them up to do it again next time
      setCardCycling(true);
      onFirstCycleComplete();
      setTimeout(() => {
        nextAppScreen.picZ.setValue(1);
        curAppScreen.picZ.setValue(2);
        curAppScreen.picScale.setValue(startingScaleVal);
        curAppScreen.picTop.setValue(startingTopVal);
      }, 500);
    });
    setTimeout(() => {
      // we switch over the picture lists here to ensure it doesnt conflict with the animation
      if (curListNum() !== prevListRef.current) {
        curAppScreen.picList.current = pictureLists[curListNum()];
      }
      // go to the next picture (by 2 so the 2 app screens leap frog each other)
      // if we go off the end of the list, reset to our original index
      if (curAppScreen.curPic + 2 > curAppScreen.picList.current.length - 1) {
        curAppScreen.setCurPic(curApp.current);
      } else {
        curAppScreen.setCurPic(curAppScreen.curPic + 2);
      }
      curApp.current = 1 - curApp.current;
      // every X seconds change the picture/gif
    }, theme.appCycleTime * 1000);
  }, [curPicOneState, curPicTwoState]);

  // render the card 
  return (
    <View
      style={{
        overflow: "hidden",
        zIndex: 1,
        width: widthCardAtScale,
        height: heightCardAtScale,
      }}
    >
      {!cardCycling && (
        <Animated.Image
          style={{
            position: "absolute",
            width: widthCardAtScale,
            zIndex: 0,
            opacity: innerCardOpacity,
            height: heightCardAtScale,
            resizeMode: "stretch",
          }}
          source={card0}
        />
      )}
      <Animated.Image
        style={{
          position: "absolute",
          width: widthCardAtScale,
          height: heightCardAtScale,
          zIndex: appScreens[0].picZ,
          opacity: appScreens[0].picOpacity,
          resizeMode: "stretch",
          transform: [
            { translateY: appScreens[0].picTop },
            { scale: appScreens[0].picScale },
          ],
        }}
        source={appScreens[0].picList.current[appScreens[0].curPic]}
      />
      <Animated.Image
        style={{
          position: "absolute",
          width: widthCardAtScale,
          height: heightCardAtScale,
          zIndex: appScreens[1].picZ,
          opacity: appScreens[1].picOpacity,
          resizeMode: "stretch",
          transform: [
            { translateY: appScreens[1].picTop },
            { scale: appScreens[1].picScale },
          ],
        }}
        source={appScreens[1].picList.current[appScreens[1].curPic]}
      />
    </View>
  );
};
