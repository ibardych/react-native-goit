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

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (!user) {
        await dispatch(setIsLoggedIn(false));
        console.log('Logged out');
      }
    });
  }, []);

  return (
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
  );
};

export default App;

const styles = StyleSheet.create({
  headerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
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
