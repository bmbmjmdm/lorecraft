import {
  StyleSheet,
  TextStyle,
  Dimensions,
  ViewStyle,
  ScaledSize,
} from "react-native";
import React, { FunctionComponent, ReactNode, createContext } from "react";
import white_menu from "./assets/menu_white.png";
import black_menu from "./assets/menu_black.png";
import { useState } from "react";
import { useEffect } from "react";

// helper function to clamp a value between a min and max
const clamp = (min: number, max: number, val: number) => {
  return Math.round(Math.min(Math.max(val, min), max));
};

// theme-independent basic layout styling
export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  justifyCenter: {
    justifyContent: "center",
  },
  alignCenter: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  reverseRow: {
    flexDirection: "row-reverse",
  },
  reverseColumn: {
    flexDirection: "column-reverse",
  },
  slim: {
    width: "100%",
    maxWidth: 1500,
    paddingHorizontal: 50,
  },
  fullWidth: {
    width: "100%",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});

// the various theme options available
type ThemeName = "dark" | "broken";
type DimensionNames = "width" | "height";

// the styling options provided by each theme
export type Theme = {
  name: ThemeName;
  text: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  subscript: TextStyle;
  buttonText: TextStyle;
  header: TextStyle;
  navButton: ViewStyle;
  showcaseDivider: ViewStyle;
  menu: Object | Object[] | number;
  // these color strings are fed into our linear gradient background. if you want a solid background, just provide 1 color
  background: string[];
  linkBackground: string[];
  cardHeight: number;
  cardScaleInitial: number;
  cardScaleFinal: number;
  appScaleInitial: number;
  appCycleTime: number;
  mediumSpace: number;
  mediumSmallSpace: number;
  smallSpace: number;
  messageHeightHolder: number;
  screenAnimationY: number;
  screenAnimationSpeed: number;
  screenAnimationOutSpeed: number;
  largeSpace: number;
  showcaseImageLong: number;
  showcaseImageShort: number;
  showcaseTextWidth: number;
  appLinkSize: number;
  webLinkHeight: number;
  webLinkWidth: number;
  linearGradient: Object;
  sideMenuWidth: number;
  sideMenuSpeed: number;
  menuSize: number;
  sideMenuColor: string;
  floatingText: TextStyle;
};

// various properties that most themes will have in common, mostly things like component sizing/spacing/positioning
const defaultTheme = (scale: number, smallerDimension: DimensionNames) => ({
  header: {
    fontSize: clamp(45, 70, 100 * scale),
    fontWeight: "bold" as "bold",
  },
  body: {
    fontSize: clamp(30, 45, 75 * scale),
  },
  caption: {
    fontSize: clamp(20, 30, 45 * scale),
  },
  buttonText: {
    fontSize: clamp(14, 16, 30 * scale),
    paddingBottom: 2,
  },
  cardHeight: clamp(
    smallerDimension === "height" ? 400 : 600,
    933,
    smallerDimension === "height" ? 800 * scale : 1000 * scale
  ),
  cardScaleInitial: 1.25,
  cardScaleFinal: 0.65,
  appScaleInitial: 0.5,
  appCycleTime: 5,
  largeSpace: clamp(50, 100, 150 * scale),
  mediumSpace: clamp(25, 50, 75 * scale),
  mediumSmallSpace: clamp(17, 35, 55 * scale),
  smallSpace: clamp(8, 15, 25 * scale),
  messageHeightHolder: clamp(50, 100, 150 * scale),
  screenAnimationY: clamp(150, 200, 300 * scale),
  screenAnimationSpeed: 850,
  screenAnimationOutSpeed: 250,
  showcaseImageLong: clamp(250, 400, 600 * scale),
  showcaseImageShort: clamp(125, 200, 300 * scale),
  showcaseTextWidth: clamp(200, 500, 700 * scale),
  appLinkSize: clamp(40, 70, 100 * scale),
  webLinkHeight: clamp(30, 50, 75 * scale),
  webLinkWidth: clamp(60, 100, 150 * scale),
  linearGradient: {
    useAngle: true,
    angle: 135,
    angleCenter: { x: 0.5, y: 0.5 },
  },
  sideMenuWidth: 350,
  sideMenuSpeed: 450,
  menuSize: clamp(35, 50, 100 * scale),
});

// where our themes are defined
// these all accept a scale variable, which is used to scale the theme's styling to different screen sizes
// as such, they cannot be used without first providing scale
export const Themes: Record<
  ThemeName,
  (scale: number, smallerDimension: DimensionNames) => Theme
> = {
  dark: (scale, smallerDimension) => ({
    ...defaultTheme(scale, smallerDimension),
    name: "dark",
    text: {
      color: "#FFFFFF",
    },
    subscript: {
      fontSize: clamp(14, 16, 30 * scale),
      paddingTop: 10,
      color: "#AAAAAA",
    },
    sideMenuColor: "#000000",
    background: ["#000000", "#000000", "#1a1a1a", "#3d3d3d"],
    navButton: {
      backgroundColor: "#DDDDDD",
      borderRadius: 999,
      width: clamp(35, 50, 100 * scale),
      height: clamp(35, 50, 100 * scale),
      marginLeft: clamp(35, 50, 100 * scale),
    },
    menu: white_menu,
    showcaseDivider: {
      width: "50%",
      height: 2,
      backgroundColor: "#FFFFFF",
    },
    linkBackground: ["#ffb0fb", "#19344d"],
    floatingText: {
      fontSize: clamp(20, 30, 45 * scale),
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  }),
  broken: (scale, smallerDimension) => ({
    name: "broken",
    text: {
      color: "#000000",
    },
    sideMenuColor: "#FFFFFF",
    background: ["#FFFFFF", "#FFFFFF", "#EEEEEE", "#CCCCCC"],
    navButton: {
      backgroundColor: "#333333",
      borderRadius: 0,
      width: clamp(70, 100, 200 * scale),
      height: clamp(35, 50, 100 * scale),
      marginLeft: clamp(0, 0, 0 * scale),
    },
    menu: black_menu,
    showcaseDivider: {
      width: "100%",
      height: 600,
      backgroundColor: "#000000",
    },
    linkBackground: ["#84ff0a", "#5a4c5c"],
    floatingText: {
      fontSize: clamp(20, 30, 45 * scale),
      color: "#000000",
      fontWeight: "bold",
    },
    header: {
      fontSize: clamp(20, 40, 100 * scale),
      fontWeight: "bold",
    },
    body: {
      fontSize: clamp(15, 30, 50 * scale),
    },
    caption: {
      fontSize: clamp(50, 75, 100 * scale),
    },
    subscript: {
      textDecorationLine: "underline",
      textDecorationStyle: "dotted",
      fontSize: 2
    },
    buttonText: {
      fontSize: clamp(7, 8, 15 * scale),
      paddingBottom: 2,
    },
    cardHeight: clamp(1000, 1300, 1600 * scale),
    cardScaleInitial: 1.5,
    cardScaleFinal: 0.65,
    appScaleInitial: 1.5,
    appCycleTime: 0.5,
    largeSpace: clamp(150, 400, 500 * scale),
    mediumSpace: clamp(75, 200, 300 * scale),
    mediumSmallSpace: clamp(0, 0, 0 * scale),
    smallSpace: clamp(0, 0, 0 * scale),
    messageHeightHolder: clamp(50, 100, 150 * scale),
    screenAnimationY: clamp(-300, -100, -300 * scale),
    screenAnimationSpeed: 1500,
    screenAnimationOutSpeed: 1,
    showcaseImageShort: clamp(250, 400, 600 * scale),
    showcaseImageLong: clamp(125, 200, 300 * scale),
    showcaseTextWidth: clamp(150, 350, 500 * scale),
    appLinkSize: clamp(15, 250, 25 * (1 / scale)),
    webLinkWidth: clamp(30, 50, 75 * scale),
    webLinkHeight: clamp(60, 100, 150 * scale),
    linearGradient: {},
    sideMenuWidth: 75,
    sideMenuSpeed: 5000,
    menuSize: clamp(35, 50, 100 * scale),
  }),
};

// the theme provider/context used to provide the theme to all components/screens
type ThemeProviderProps = {
  children: ReactNode;
};

// set the initial context using the dark theme and starting window width
export const ThemeContext = createContext<Theme>(
  Themes["dark"](Dimensions.get("window").width / 1984, "width")
);

// setup context for changing the theme
const DEFAULT_VAL_FOR_TS = (
  // this is simply an empty theme state setter
  setter:
    | ((scale: number, smallerDimension: DimensionNames) => Theme)
    | (() => (scale: number, smallerDimension: DimensionNames) => Theme)
) => {};
export const SetThemeContext = React.createContext(DEFAULT_VAL_FOR_TS);

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
}) => {
  // scaling operations for different screen sizes
  // we normalize around 1984 and 1003 because those are my monitor's dimensions :P
  const window = Dimensions.get("window");
  const getThemeVariables = (window: ScaledSize) => {
    const height = Math.pow(window.height / 1003, 1.2);
    const width = window.width / 1984;
    const scale = Math.min(height, width);
    const smallerDimension: DimensionNames =
      height < width ? "height" : "width";
    return {
      scale,
      smallerDimension,
    };
  };
  const themeVariables = getThemeVariables(window);
  const [scale, setScale] = useState(themeVariables.scale);
  const [smallerDimension, setSmallerDimension] = useState<DimensionNames>(
    themeVariables.smallerDimension
  );

  // we handle the current theme state here so that we can also change it from any component via SetThemeContext
  const [curTheme, setCurTheme] = useState<
    (scale: number, smallerDimension: DimensionNames) => Theme
  >(() => Themes["dark"]);

  // when the size of the window changes, update our scaling
  useEffect(() => {
    const unsub = Dimensions.addEventListener("change", ({ window }: any) => {
      const themeVariables = getThemeVariables(window);
      setScale(themeVariables.scale);
      setSmallerDimension(themeVariables.smallerDimension);
    });
    return unsub.remove;
  }, []);

  return (
    <SetThemeContext.Provider value={setCurTheme}>
      <ThemeContext.Provider value={curTheme(scale, smallerDimension)}>
        {children}
      </ThemeContext.Provider>
    </SetThemeContext.Provider>
  );
};
