import { ImageBackground, KeyboardAvoidingView } from 'react-native';
import { Dimensions, Platform, TextInput, View } from 'react-native';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import Comment from '../components/Comment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, getComments } from '../redux/comment/operations';

const containerPadding = 16;
const screenWidth = Dimensions.get('window').width;

const CommentsScreen = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const comments = useSelector(state => state.comment.comments);
  const route = useRoute();
  const { id: postid, imageURL } = route.params.post;
  const newComment = useSelector(state => state.comment.comment);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await dispatch(getComments(postid));
      })();
    }
  }, [isFocused, newComment]);

  const sendComment = async () => {
    if (comment) {
      await dispatch(createComment({ postid, comment }));
      setComment('');
    }
  };

  const PostImage = () => {
    return (
      <ImageBackground
        style={styles.image}
        source={{ uri: imageURL }}
        resizeMode="cover"
      />
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View>
      <View style={{ minHeight: '100%' }}>
        <FlatList
          ListHeaderComponent={PostImage}
          data={comments}
          renderItem={comment => <Comment comment={comment} />}
          keyExtractor={post => post.id}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.flatList}
          style={{ marginTop: insets.top + 56, bottom: 84 }}
        />
      </View>

      <View style={styles.bottomTab}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ width: '100%' }}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={comment}
              placeholder={'Comment'}
              placeholderTextColor="#BDBDBD"
              onChangeText={value => setComment(value)}
            />
            <TouchableOpacity style={styles.sendIcon} onPress={sendComment}>
              <AntDesign name={'arrowup'} size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.bottomShadow}></View>
      </View>
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
  },
  flatList: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 32,
  },
  image: {
    borderRadius: 8,
    width: screenWidth - containerPadding * 2,
    height: ((screenWidth - containerPadding * 2) * 3) / 4,
    marginBottom: 32,
    overflow: 'hidden',
  },

  bottomTab: {
    height: 84,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomShadow: {
    flex: 1,
    position: 'absolute',
    top: -2,
    left: 0,
    right: 0,
    width: screenWidth,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderTopColor: 'rgba(0,0,0,0.01)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderColor: '#E8E8E8',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#F6F6F6',
    borderRadius: 25,
    height: 50,
    fontSize: 14,
    fontFamily: 'primary400',
    color: '#333',
    padding: 16,
  },
  sendIcon: {
    backgroundColor: '#FF6C00',
    borderRadius: 17,
    width: 34,
    height: 34,
    position: 'absolute',
    top: 8,
    right: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
