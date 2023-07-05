import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';
import { likePost } from '../redux/post/operations';

const Post = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const post = props.post.item;

  const handleLike = () => {
    dispatch(likePost(post.id));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: post.imageURL }}
        style={styles.image}
        resizeMode={'cover'}
      />
      <TouchableOpacity
        style={styles.author}
        onPress={() => navigation.navigate('Profile')}
      >
        <ImageBackground
          source={
            post.avatar
              ? { uri: post.avatar }
              : require('../../assets/images/avatar.png')
          }
          style={styles.authorImage}
          resizeMode={'cover'}
        />
        <Text style={styles.date}>{post.date}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.infos}>
        <View style={styles.likecomments}>
          <TouchableOpacity
            style={styles.comments}
            onPress={() => navigation.navigate('Comments', { post })}
          >
            <Ionicons name={'chatbubble-outline'} size={22} color="#BDBDBD" />
            <Text style={styles.commentsnumber}>{post.commentsNumber}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.comments} onPress={handleLike}>
            <AntDesign
              name={post.liked ? 'like1' : 'like2'}
              size={22}
              color={post.liked ? '#FF6C00' : '#BDBDBD'}
            />
            <Text
              style={{
                ...styles.commentsnumber,
                color: post.liked ? '#FF6C00' : '#BDBDBD',
              }}
            >
              {post.likes?.length || 0}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.location}
          onPress={() => navigation.navigate('Map', { coords: post.coords })}
        >
          <Ionicons name={'location-outline'} size={22} color="#BDBDBD" />
          <Text style={styles.locationname}>{post.location}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Post;

Post.propTypes = {
  post: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  author: {
    position: 'absolute',
    bottom: 70,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingLeft: 3,
    paddingRight: 12,
    paddingTop: 3,
    paddingBottom: 3,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 100,
    overflow: 'hidden',
  },
  date: {
    fontSize: 12,
    marginBottom: 2,
  },
  title: {
    fontFamily: 'primary500',
    color: '#212121',
    fontSize: 16,
    marginBottom: 8,
  },
  infos: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likecomments: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  comments: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentsnumber: {
    fontFamily: 'primary400',
    color: '#BDBDBD',
    fontSize: 14,
  },
  location: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  locationname: {
    fontFamily: 'primary400',
    color: '#212121',
    fontSize: 14,
  },
});
