import { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { ImageBackground, Keyboard, Platform, StyleSheet } from 'react-native';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import Link from '../components/Link';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/user/operations';
import * as ImagePicker from 'expo-image-picker';
import { unsetAuthError } from '../redux/user/slice';
// import * as MediaLibrary from 'expo-media-library';

const RegistrationScreen = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [image, setImage] = useState();
  const navigation = useNavigation();
  const authError = useSelector(state => state.user.authError);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch(unsetAuthError());
    }
  }, [isFocused]);

  const togglePasswordShown = () => {
    setPasswordShown(!passwordShown);
  };

  const choosePhoto = async () => {
    try {
      // Pick a photo
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!assets[0]?.uri) return;

      const image = assets[0]?.uri;
      setImage(image);

      // Take a Photo
      /*
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        return console.log('Permission not granted');
      }
      const { assets } = await ImagePicker.launchCameraAsync();

      if (!assets[0]?.uri) return;

      const image = assets[0]?.uri;
      setImage(image);
      */
    } catch (error) {
      console.log('error:', error);
    }
  };

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(2, 'Username should be at least 2 characters')
      .required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password should be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      dispatch(register({ ...values, image }));
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <ImageBackground
          source={require('../../assets/images/bg.png')}
          style={styles.background}
          imageStyle={{
            resizeMode: 'cover',
            alignSelf: 'flex-start',
          }}
        />
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity style={styles.image} onPress={choosePhoto}>
              <ImageBackground
                source={{ uri: image }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <AntDesign
              style={styles[image ? 'deleteIcon' : 'plusIcon']}
              name={image ? 'closecircleo' : 'pluscircleo'}
              size={24}
              color="black"
            />
          </View>
          <Text style={styles.title}>Register</Text>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={formik.values.username}
                placeholder={'Username'}
                placeholderTextColor="#BDBDBD"
                onChangeText={formik.handleChange('username')}
                autoCapitalize={'none'}
              />
              <Text style={styles.error}>
                {formik.touched.username && formik.errors.username}
              </Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={formik.values.email}
                placeholder={'E-Mail'}
                placeholderTextColor="#BDBDBD"
                onChangeText={formik.handleChange('email')}
              />
              <Text style={styles.error}>
                {formik.touched.email && formik.errors.email}
              </Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={formik.values.password}
                placeholder={'Password'}
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!passwordShown}
                onChangeText={formik.handleChange('password')}
              />
              <Ionicons
                style={styles.eye}
                name={passwordShown ? 'eye-off' : 'eye'}
                size={20}
                color="#555"
                onPress={togglePasswordShown}
              />
              <Text style={styles.error}>
                {formik.touched.password && formik.errors.password}
              </Text>
            </View>
          </KeyboardAvoidingView>

          <Button onPress={formik.handleSubmit}>Sign up</Button>
          <Link onPress={() => navigation.navigate('Login')}>
            Already have an account? Sign in.
          </Link>
          {authError && <Text style={styles.authError}>{authError}</Text>}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: `100%`,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 78,
  },
  avatar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  plusIcon: {
    position: 'absolute',
    right: -12.5,
    bottom: 16,
    width: 25,
    height: 25,
    color: '#FF6C00',
  },
  deleteIcon: {
    position: 'absolute',
    right: -12.5,
    bottom: 16,
    width: 25,
    height: 24,
    color: '#BDBDBD',
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
  },
  title: {
    color: '#212121',
    fontSize: 30,
    fontFamily: 'primary500',
    marginBottom: 32,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 50,
    marginBottom: 26,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E8E8E8',
  },
  imageWrapper: {
    width: 120,
    height: 120,
    position: 'relative',
    backgroundColor: '#F6F6F6',
    marginBottom: 32,
    marginTop: -60,
    borderRadius: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  eye: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  error: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    fontSize: 12,
    color: 'red',
  },
  authError: {
    fontSize: 12,
    color: '#333',
    height: 30,
    marginBottom: -30,
    position: 'relative',
    top: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 7,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 7,
    borderColor: 'red',
    borderWidth: 1,
    fontFamily: 'primary500',
  },
});
