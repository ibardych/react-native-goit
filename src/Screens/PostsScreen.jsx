import { StyleSheet, View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getPosts } from '../redux/post/operations';
import Author from '../components/Author';
import Post from '../components/Post';
import { ActivityIndicator } from 'react-native';

const PostsScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const posts = useSelector(state => state.post.posts);
  const isLoading = useSelector(state => state.post.postsLoading);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await dispatch(getPosts());
      })();
    }
  }, [isFocused]);

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator color="#d7d7d7" />
        </View>
      )}
      {!!posts.length && (
        <FlatList
          ListHeaderComponent={Author}
          data={posts}
          renderItem={post => <Post post={post} />}
          keyExtractor={post => post.id}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.flatList}
        />
      )}
    </View>
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  flatList: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  separator: {
    height: 32,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
});
