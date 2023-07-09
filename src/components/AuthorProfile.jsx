import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { logOut } from '../redux/user/operations';
import { setIsLoggedIn } from '../redux/user/slice';
import { PropTypes } from 'prop-types';
import { ActivityIndicator } from 'react-native';

const AuthorProfile = ({ author }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const isLoading = useSelector(state => state.post.postsLoading);

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(setIsLoggedIn(false));
  };

  return (
    <>
      {author && (
        <View style={styles.container}>
          <View style={styles.image}>
            <ImageBackground
              source={
                author.avatar
                  ? { uri: author.avatar }
                  : require('../../assets/images/avatar.png')
              }
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          {author.id === user.id && (
            <MaterialIcons
              style={styles.logoutIcon}
              name={'logout'}
              size={24}
              color="#BDBDBD"
              onPress={handleLogOut}
            />
          )}

          <Text style={styles.title}>{author.username}</Text>

          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator color="#d7d7d7" />
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default AuthorProfile;

AuthorProfile.propTypes = {
  author: PropTypes.object,
};

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
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: -40,
    position: 'relative',
    top: 20,
  },
});
