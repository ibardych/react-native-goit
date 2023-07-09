import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { setIsLoggedIn } from '../redux/user/slice';
import RegistrationScreen from '../Screens/RegistrationScreen';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import CommentsScreen from '../Screens/CommentsScreen';
import MapScreen from '../Screens/MapScreen';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const isLoading = useSelector(state => state.loader.isLoading);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (!user) {
        await dispatch(setIsLoggedIn(false));
        console.log('Logged out');
      }
    });
  }, []);

  return (
    <>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF6C00" />
        </View>
      )}
      <NavigationContainer>
        {isLoggedIn ? (
          <MainStack.Navigator>
            <MainStack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <MainStack.Screen
              name="Comments"
              component={CommentsScreen}
              options={navigationOptions}
            />
            <MainStack.Screen
              name="Map"
              component={MapScreen}
              options={navigationOptions}
            />
          </MainStack.Navigator>
        ) : (
          <AuthStack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <AuthStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  headerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  loader: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.7)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const navigationOptions = {
  headerStyle: styles.headerStyle,
  headerTintColor: '#212121',
  headerTitleStyle: {
    fontFamily: 'primary500',
    fontSize: 17,
  },
  headerTitleAlign: 'center',
  headerBackImage: () => <Feather name="arrow-left" size={20} />,
};
