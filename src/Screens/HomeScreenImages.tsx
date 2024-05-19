import React, {
  FunctionComponent,
  useState,
  MutableRefObject,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Animated, Image } from "react-native";
import { PlayfulCard, SlideshowCard, StyledText } from "../Components";
import card0 from "../assets/card0.png";
import card1 from "../assets/card1.png";
import card2 from "../assets/card2.png";
import card3 from "../assets/card3.png";
import card4 from "../assets/card4.png";
import card5 from "../assets/card5.png";
import card6 from "../assets/card6.png";
import card7 from "../assets/card7.png";
import card8 from "../assets/card8.png";
import card9 from "../assets/card9.png";
import card10 from "../assets/card10.png";
import card11 from "../assets/card11.png";
import card12 from "../assets/card12.png";
import card13 from "../assets/card13.png";
import card14 from "../assets/card14.png";
import cat1 from "../assets/cat1.png";
import cat2 from "../assets/cat2.png";
import cat3 from "../assets/cat3.png";
import cat4 from "../assets/cat4.png";
import cat5 from "../assets/cat5.png";
import cat6 from "../assets/cat6.png";
import cat7 from "../assets/cat7.png";
import cat8 from "../assets/cat8.png";
import cat9 from "../assets/cat9.png";
import cat10 from "../assets/cat10.png";
import cat11 from "../assets/cat11.png";
import cat12 from "../assets/cat12.png";
import cat13 from "../assets/cat13.png";
import cat14 from "../assets/cat14.png";
import cat15 from "../assets/cat15.png";
import { ThemeContext } from "../Theme";

type HomeScreenImagesProps = {
  catMode: MutableRefObject<boolean>;
  showTitle?: boolean;
};

// This component is responsible for animating in the card (PlayfulCard half) and then cycling through
// the various gifs or images (SlideshowCard half). It does the handoff using two different state variables to assure no flickering
// It accepts a ref to determine which list of assets to use
// If catmode is enabled (1), it'll show cat pictures. Otherwise it'll show app gifs
export const HomeScreenImages: FunctionComponent<HomeScreenImagesProps> = ({
  catMode,
  showTitle = false,
}) => {
  const cardPictures = useRef([
    card1,
    card2,
    card3,
    card8,
    card10,
    card6,
    card12,
    card5,
    card13,
    card7,
    card11,
    card9,
    card14,
    card4,
    card0,
  ]).current;

  const catPictures = useRef([
    cat14,
    cat15,
    cat1,
    cat2,
    cat3,
    cat4,
    cat5,
    cat6,
    cat7,
    cat8,
    cat9,
    cat10,
    cat11,
    cat12,
    cat13,
  ]).current;

  const [cardDone, setCardDone] = useState(false);
  const [cardCycling, setCardCycling] = useState(false);
  const opacityRef = useRef(new Animated.Value(1)).current;
  const theme = useContext(ThemeContext);

  useEffect(() => {
    // prefetch all images
    const catFetch = () => {
      catPictures.forEach((image) => {
        Image.prefetch(image);
      });
    };
    if (catMode.current) {
      // if we're starting in cat mode, we only need the cats
      catFetch();
    } else {
      // otherwise, grab the apps first, then the cats afterwards
      const promises = cardPictures.map((image) => {
        return Image.prefetch(image);
      });
      Promise.all(promises).then(() => {
        catFetch();
      });
    }

    // make the title disappear right as the card moves over it
    // on small screens only
    setTimeout(() => {
      Animated.timing(opacityRef, {
        toValue: 0,
        duration: 1,
        useNativeDriver: false,
      }).start();
    }, 7600);
  }, []);

  return (
    <>
      {showTitle && (
        <StyledText
          animated
          style={{
            position: "absolute",
            opacity: opacityRef,
            paddingBottom: theme.largeSpace,
          }}
          type={"header"}
        >
          {catMode.current ? "LaCat Apps :3" : "LaPlante Apps"}
        </StyledText>
      )}
      {!cardCycling && (
        <PlayfulCard
          onAnimationComplete={() => setCardDone(true)}
          fast={showTitle}
        />
      )}
      {cardDone && (
        <SlideshowCard
          pictureLists={[cardPictures, catPictures]}
          curListRef={catMode}
          onFirstCycleComplete={() => setCardCycling(true)}
        />
      )}
    </>
  );
};
