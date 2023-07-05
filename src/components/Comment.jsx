import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
import { PropTypes } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const containerPadding = 16;
const screenWidth = Dimensions.get('window').width;

const Comment = props => {
  const navigation = useNavigation();
  const comment = props.comment.item;

  const commentWrapperStyles = comment.owner
    ? {
        ...styles.commentWrapper,
        ...styles.commentWrapperAuthor,
      }
    : styles.commentWrapper;

  const commentStyles = comment.owner
    ? { ...styles.comment, ...styles.commentAuthor }
    : styles.comment;

  return (
    <View style={commentWrapperStyles}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <ImageBackground
          style={styles.authorPhoto}
          source={
            comment.avatar
              ? { uri: comment.avatar }
              : require('../../assets/images/avatar.png')
          }
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={commentStyles}>
        <Text style={styles.commentText}>{comment.text}</Text>
        <Text style={styles.date}>{comment.date}</Text>
      </View>
    </View>
  );
};

export default Comment;

Comment.propTypes = {
  comment: PropTypes.object,
};

const styles = StyleSheet.create({
  commentWrapper: {
    flexDirection: 'row',
    gap: 16,
  },
  commentWrapperAuthor: {
    flexDirection: 'row-reverse',
  },
  authorPhoto: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  comment: {
    width: screenWidth - containerPadding * 2 - 28 - 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  commentAuthor: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 0,
  },
  commentText: {
    fontSize: 13,
    color: '#212121',
    fontFamily: 'primary400',
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    textAlign: 'right',
    fontSize: 10,
    color: '#BDBDBD',
    fontFamily: 'primary400',
  },
});
