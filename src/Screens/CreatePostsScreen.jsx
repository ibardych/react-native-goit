import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  Dimensions,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StyleSheet, Text } from 'react-native';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Button from '../components/Button';
import { ScrollView } from 'react-native-gesture-handler';
import { Pressable } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { KeyboardAvoidingView } from 'react-native';
import { Image } from 'react-native';
import * as Location from 'expo-location';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { createPost } from '../redux/post/operations';
import * as ImagePicker from 'expo-image-picker';

const containerPadding = 16;

const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

const CreatePostsScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState('');
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scrollToTop();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null) {
    // return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  useEffect(() => {
    if (isFocused) {
      setIsCameraReady(true);
    } else {
      setIsCameraReady(false);
    }
  }, [isFocused]);

  const validationSchema = yup.object().shape({
    image: yup.string().required('Photo is required'),
    title: yup
      .string()
      .min(2, 'Title should be at least 2 characters')
      .required('Title is required'),
    location: yup
      .string()
      .min(2, 'Location should be at least 2 characters')
      .required('Location is required'),
  });

  const formik = useFormik({
    initialValues: {
      image: '',
      title: '',
      location: '',
    },
    validationSchema,
    onSubmit: async values => {
      let coords = { latitude: '', longitude: '' };
      if (hasLocationPermission) {
        const location = await Location.getCurrentPositionAsync({});
        coords.latitude = location.coords.latitude;
        coords.longitude = location.coords.longitude;
      }

      await dispatch(createPost({ ...values, coords }));

      formik.resetForm();
      setPhoto('');
      navigation.navigate('Posts');
    },
  });

  const hasErrors = Object.keys(formik.errors).length > 0;

  const handleDelete = () => {
    resetPhoto();
    formik.resetForm();
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        await MediaLibrary.createAssetAsync(uri);
        setPhoto(uri);
        formik.setFieldValue('image', uri);
      } catch {
        error => {
          console.log(error);
        };
      }
    }
  };

  const pickPhoto = async () => {
    if (cameraRef.current) {
      try {
        // Pick a photo
        const { assets } = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!assets[0]?.uri) return;

        const image = assets[0]?.uri;
        setPhoto(image);
        formik.setFieldValue('image', image);
      } catch {
        error => {
          console.log(error);
        };
      }
    }
  };

  const resetPhoto = () => {
    formik.setFieldValue('image', '');
    setPhoto('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <View style={styles.container}>
            <View style={styles.publication}>
              <View style={styles.photoWrapper}>
                {photo ? (
                  <>
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: photo }} style={styles.image} />
                    </View>
                    <TouchableOpacity
                      style={styles.changePhoto}
                      onPress={resetPhoto}
                    >
                      <Feather name={'edit-2'} color={'#BDBDBD'} size={18} />
                      <Text style={styles.photoText}>Change photo</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.cameraWrapper}>
                      {isCameraReady && (
                        <Camera ratio={'4:3'} type={type} ref={cameraRef}>
                          <View style={styles.photoView}>
                            <TouchableOpacity
                              style={styles.flipContainer}
                              onPress={() => {
                                setType(
                                  type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                                );
                              }}
                            >
                              <MaterialIcons
                                name={'flip-camera-ios'}
                                size={34}
                                color="#fff"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.takePhotoIcon}
                              onPress={takePhoto}
                            >
                              <MaterialIcons
                                style={styles.photoIcon}
                                name={'photo-camera'}
                                size={34}
                                color="#fff"
                              />
                              <View style={styles.circle}></View>
                            </TouchableOpacity>
                          </View>
                        </Camera>
                      )}
                    </View>
                    <Text style={styles.photoText} onPress={pickPhoto}>
                      Pick photo
                    </Text>
                    <Text style={styles.error}>{formik.errors.image}</Text>
                  </>
                )}
              </View>

              <View>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                  style={{ width: '100%' }}
                >
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formik.values.title}
                      placeholder={'Enter title'}
                      placeholderTextColor="#BDBDBD"
                      onChangeText={formik.handleChange('title')}
                    />
                    <Text style={styles.error}>
                      {formik.touched.title && formik.errors.title}
                    </Text>
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={{ ...styles.input, ...styles.inputLocation }}
                      value={formik.values.location}
                      placeholder={'Location'}
                      placeholderTextColor="#BDBDBD"
                      onChangeText={formik.handleChange('location')}
                    />
                    <Ionicons
                      style={styles.locationIcon}
                      name={'location-outline'}
                      size={22}
                      color="#BDBDBD"
                    />
                    <Text style={styles.error}>
                      {formik.touched.location && formik.errors.location}
                    </Text>
                  </View>
                </KeyboardAvoidingView>
              </View>

              <View style={styles.button}>
                <Button
                  type={hasErrors ? 'disabled' : ''}
                  onPress={formik.handleSubmit}
                >
                  Publish
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomTab}>
          <Pressable style={styles.deleteIconWrapper} onPress={handleDelete}>
            <Feather name={'trash-2'} size={24} color="#BDBDBD" />
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
    paddingBottom: 32,
    minHeight: '100%',
    backgroundColor: '#fff',
    position: 'relative',
  },
  photoWrapper: {
    marginBottom: 32,
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: ((screenWidth - 16 * 2) / 3) * 4,
  },
  changePhoto: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  photoText: {
    fontSize: 16,
    color: '#BDBDBD',
  },
  cameraWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  photoView: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    height: ((screenWidth - 16 * 2) / 3) * 4,
    position: 'relative',
  },
  flipContainer: {
    position: 'absolute',
    top: 10,
    right: 12,
    opacity: 0.9,
  },
  takePhotoIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: 50,
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {},
  circle: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    height: 74,
    width: 74,
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderRadius: 50,
    position: 'absolute',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#E8E8E8',
    marginBottom: 16,
  },
  input: {
    height: 50,
    fontSize: 16,
    fontFamily: 'primary500',
  },
  inputLocation: {
    paddingLeft: 30,
  },
  locationIcon: {
    position: 'absolute',
    left: 0,
    top: 13,
  },
  error: {
    position: 'absolute',
    bottom: -19,
    left: 0,
    fontSize: 12,
    color: 'red',
  },
  button: {
    marginTop: 16,
  },
  bottomTab: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  deleteIconWrapper: {
    backgroundColor: '#F6F6F6',
    width: 70,
    height: 40,
    borderRadius: 22,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
