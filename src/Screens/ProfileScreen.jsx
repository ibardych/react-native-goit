import { ImageBackground, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import AuthorProfile from '../components/AuthorProfile';
import Post from '../components/Post';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getPostsByUser } from '../redux/post/operations';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const postsByUser = useSelector(state => state.post.postsbyUser);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await dispatch(getPostsByUser(user.id));
      })();
    }
  }, [isFocused]);

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={styles.background}
        imageStyle={{
          resizeMode: 'cover',
          alignSelf: 'flex-start',
        }}
      />
      <FlatList
        ListHeaderComponent={AuthorProfile}
        data={postsByUser}
        renderItem={post => <Post post={post} />}
        keyExtractor={post => post.id}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Separator}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  separator: {
    height: 32,
    backgroundColor: '#fff',
  },
});
