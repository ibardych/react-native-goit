import {
  AntDesign,
  Feather,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import PostsScreen from './PostsScreen';
import ProfileScreen from './ProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import CreatePostsScreen from './CreatePostsScreen';
import { View } from 'react-native';
import { Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { logOut } from '../redux/user/operations';
import { setIsLoggedIn } from '../redux/user/slice';

const Tabs = createBottomTabNavigator();

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const toToTab = () => {
    navigation.navigate('Posts');
  };

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(setIsLoggedIn(false));
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          if (route.name === 'Posts') {
            return <SimpleLineIcons name="grid" size={24} color={color} />;
          }
          if (route.name === 'CreatePosts') {
            return (
              <View style={styles.AddIconWrapper}>
                <AntDesign name="plus" size={24} color={'#fff'} />
              </View>
            );
          }
          if (route.name === 'Profile') {
            return <Feather name="user" size={24} color={color} />;
          }
        },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'grey',
        headerShown: route.name === 'Profile' ? false : true,
        headerTitle: () => {
          return (
            <View style={styles.header}>
              {route.name === 'CreatePosts' ? (
                <Feather
                  name="arrow-left"
                  size={20}
                  onPress={() => toToTab('Posts')}
                />
              ) : (
                <View />
              )}
              <Text style={styles.headerTitle}>
                {route.name === 'Posts' && 'Publications'}
                {route.name === 'CreatePosts' && 'Create publication'}
              </Text>
              <MaterialIcons
                style={styles.logoutIcon}
                name={'logout'}
                size={24}
                color="#BDBDBD"
                onPress={handleLogOut}
              />
            </View>
          );
        },
        headerTitleContainerStyle: styles.headerTitleContainer,
      })}
    >
      <Tabs.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          tabBarLabel: '',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
        }}
      />
    </Tabs.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerTitleContainer: {
    height: 56,
  },
  header: {
    width: screenWidth,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerTitle: {
    color: '#212121',
    fontFamily: 'primary500',
    fontSize: 17,
  },
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 9,
  },
  tabIcon: {},
  AddIconWrapper: {
    backgroundColor: '#FF6C00',
    width: 70,
    height: 40,
    borderRadius: 22,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
