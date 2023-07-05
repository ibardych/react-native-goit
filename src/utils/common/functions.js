import { Image } from 'react-native';
import { StatusBar, Platform } from 'react-native';

export const getTopBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 0;
  } else if (Platform.OS === 'ios') {
    return Platform.isPad ? 24 : 20;
  } else {
    return 0;
  }
};

export const scaleImageHeight = ({ source, desiredWidth }) => {
  const { width, height } = Image.resolveAssetSource(source);
  return (desiredWidth / width) * height;
};

export const formatDate = timestamp => {
  const dateTimestamp = timestamp.toDate();
  const dateString = dateTimestamp.toString();

  const date = new Date(dateString);

  const optionsDate = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formattedDate = date.toLocaleDateString('en', optionsDate);
  const formattedTime = date.toLocaleTimeString('en', optionsTime);

  return `${formattedDate} | ${formattedTime}`;
};
