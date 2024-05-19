import { Dimensions } from 'react-native';

export const isScreenSmall = () => {
  return Dimensions.get("window").width < 650;
}