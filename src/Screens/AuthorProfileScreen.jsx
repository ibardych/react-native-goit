import { ImageBackground, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import AuthorProfile from '../components/AuthorProfile';
import Post from '../components/Post';
import { useEffect, useState } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { getPostsByUser } from '../redux/post/operations';

const AuthorProfileScreen = () => {
  const [author, setAuthor] = useState();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const postsByUser = useSelector(state => state.post.postsbyUser);
  const route = useRoute();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (isFocused) {
      const author = route.params ? route.params.user : user;
      setAuthor(author);
      (async () => {
        await dispatch(getPostsByUser(author.id));
      })();
    }
  }, [isFocused]);

  const Separator = () => <View style={styles.separator} />;

  return (
    <>
      <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={styles.background}
        imageStyle={{
          resizeMode: 'cover',
          alignSelf: 'flex-start',
        }}
      />
      <View style={styles.bg}></View>
      <FlatList
        ListHeaderComponent={<AuthorProfile author={author} />}
        data={postsByUser}
        renderItem={post => <Post post={post} />}
        keyExtractor={post => post.id}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Separator}
      />
    </>
  );
};

export default AuthorProfileScreen;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  bg: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
  },
  separator: {
    height: 32,
    backgroundColor: '#fff',
  },
});
