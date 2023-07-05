import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { logOut } from '../redux/user/operations';
import { setIsLoggedIn } from '../redux/user/slice';

const AuthorProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(setIsLoggedIn(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <ImageBackground
          source={
            user.avatar
              ? { uri: user.avatar }
              : require('../../assets/images/avatar.jpg')
          }
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      <MaterialIcons
        style={styles.logoutIcon}
        name={'logout'}
        size={24}
        color="#BDBDBD"
        onPress={handleLogOut}
      />

      <Text style={styles.title}>{user.username}</Text>
    </View>
  );
};

export default AuthorProfile;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 43,
    marginTop: 133,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 32,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    marginTop: -60,
  },
  avatar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  title: {
    color: '#212121',
    fontSize: 30,
    fontFamily: 'primary500',
    marginBottom: 33,
  },
  topTitle: { fontFamily: 'primary500', fontSize: 17 },
  logoutIcon: {
    position: 'absolute',
    top: 22,
    right: 16,
  },
});
