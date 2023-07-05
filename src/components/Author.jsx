import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';

const Author = () => {
  const user = useSelector(state => state.user.user);

  return (
    <View style={styles.author}>
      <ImageBackground
        source={
          user.avatar
            ? { uri: user.avatar }
            : require('../../assets/images/avatar.jpg')
        }
        style={styles.avatar}
        resizeMode={'cover'}
      />
      <View>
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
};

export default Author;

const styles = StyleSheet.create({
  author: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 32,
    paddingLeft: 16,
    paddingRight: 16,
  },
  name: {
    fontFamily: 'primary700',
    color: '#212121',
    fontSize: 13,
  },
  email: {
    fontFamily: 'primary400',
    color: 'rgba(33, 33, 33, 0.8)',
    fontSize: 11,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
