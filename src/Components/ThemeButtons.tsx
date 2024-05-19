import { TouchableOpacity, View, Animated } from "react-native";
import React, { FunctionComponent, useContext, useRef, useEffect } from "react";
import { SetThemeContext, Theme, ThemeContext, Themes } from "../Theme";
import { v4 as uuid } from "uuid";
import { isScreenSmall } from "../Helpers";

type FloatingTextObj = { [key: string]: JSX.Element | null };

// we keep this global so that our floating text helper function can easily gain access to updated themes
let themeContainer: Theme | undefined = undefined;

// These are the three buttons in the header which can be used to change the theme if pressed in the correct order
export const ThemeButtons: FunctionComponent<{}> = () => {
  const smallScreen = isScreenSmall();
  const theme = useContext(ThemeContext);
  useEffect(() => {
    themeContainer = theme;
  }, [theme]);
  const setTheme = useContext(SetThemeContext);
  const [isBroken, setIsBroken] = React.useState(
    themeContainer?.name === "broken"
  );
  const [floatingTextOne, setFloatingTextOne] = React.useState<FloatingTextObj>(
    {}
  );
  const [floatingTextTwo, setFloatingTextTwo] = React.useState<FloatingTextObj>(
    {}
  );
  const [floatingTextThree, setFloatingTextThree] =
    React.useState<FloatingTextObj>({});
  const notAcceptingPressesRightNow = useRef(false);

  // cute math trick to watch the order of the 3 buttons pressed
  // if theyre presed left-to-right, then the theme will change
  const curButtonsVal = useRef(0);
  const onPressOne = () => {
    if (notAcceptingPressesRightNow.current) return;
    curButtonsVal.current = 1;
    addFloatingText(setFloatingTextOne, isBroken ? "Please" : "Do");
  };
  const onPressTwo = () => {
    if (notAcceptingPressesRightNow.current) return;
    curButtonsVal.current = curButtonsVal.current / 2;
    addFloatingText(setFloatingTextTwo, isBroken ? "Fix" : "Not");
  };
  const onPressThree = () => {
    if (notAcceptingPressesRightNow.current) return;
    if (curButtonsVal.current === 0.5) {
      toggleTheme();
    }
    curButtonsVal.current = 0;
    addFloatingText(setFloatingTextThree, isBroken ? "Me" : "Touch");
  };

  const toggleTheme = () => {
    const newTheme = isBroken ? "dark" : "broken";
    setTheme(() => Themes[newTheme]);
    setIsBroken(!isBroken);
    notAcceptingPressesRightNow.current = true;
    let delay = 400;
    addFloatingText(setFloatingTextOne, "Oh", delay);
    delay += 100;
    addFloatingText(setFloatingTextTwo, "My", delay);
    delay += 100;
    addFloatingText(setFloatingTextThree, "God", delay);
    delay += 750;
    addFloatingText(setFloatingTextOne, "You", delay);
    addFloatingText(setFloatingTextTwo, isBroken ? "Fixed" : "Broke", delay);
    delay += 100;
    addFloatingText(setFloatingTextThree, "It", delay);
    delay += 500;
    for (let i = 0; i < 20; i++) {
      addFloatingText(setFloatingTextOne, isBroken ? "Yaaa" : "Aaaa", delay);
      addFloatingText(setFloatingTextTwo, "aaaa", delay);
      addFloatingText(setFloatingTextThree, isBroken ? "aaay" : "aaaa", delay);
      delay += 200;
    }
    delay += 800;
    setTimeout(() => {
      notAcceptingPressesRightNow.current = false;
    }, delay);
  };

  return (
    <>
      <View style={{marginLeft: smallScreen ? "auto" : undefined}}>
        <TouchableOpacity style={theme.navButton} onPress={onPressOne} />
        {Object.values(floatingTextOne)}
      </View>
      <View>
        <TouchableOpacity style={theme.navButton} onPress={onPressTwo} />
        {Object.values(floatingTextTwo)}
      </View>
      <View>
        <TouchableOpacity style={theme.navButton} onPress={onPressThree} />
        {Object.values(floatingTextThree)}
      </View>
    </>
  );
};

const addFloatingText = (
  setFloatingText: React.Dispatch<React.SetStateAction<FloatingTextObj>>,
  text: string,
  delay = 0
) => {
  setTimeout(() => {
    // get an up-to-date mutable copy of the state so we set it right
    setFloatingText((lastState: FloatingTextObj) => {
      const textCopy = { ...lastState };
      const id = uuid();
      const anim = new Animated.Value(0);

      // This effectively centers us based on the width and margins of our nav button
      const width = themeContainer
        ? (themeContainer.navButton.width as number) +
          2 * (themeContainer.navButton.marginLeft as number)
        : 0;

      // add the text to our list of animations
      textCopy[id] = (
        <Animated.View
          key={id}
          style={{
            position: "absolute",
            top: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            width,
            alignItems: "center",
          }}
        >
          <Animated.Text style={themeContainer?.floatingText}>
            {text}
          </Animated.Text>
        </Animated.View>
      );
      // kick off the animation
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        // remove animation from our list after animation finishes
        // get an up-to-date copy
        setFloatingText((lastState2: FloatingTextObj) => {
          const textCopy2 = { ...lastState2 };
          textCopy2[id] = null;
          return textCopy2;
        });
      });
      // finish setting state
      return textCopy;
    });
  }, delay);
};
