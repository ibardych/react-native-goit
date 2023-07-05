import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import App from './components/App';

const Main = () => {
  const [fontsLoaded] = useFonts({
    primary100: require('../assets/fonts/roboto/Roboto-Thin.ttf'),
    primary400: require('../assets/fonts/roboto/Roboto-Regular.ttf'),
    primary500: require('../assets/fonts/roboto/Roboto-Medium.ttf'),
    primary700: require('../assets/fonts/roboto/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

export default Main;
