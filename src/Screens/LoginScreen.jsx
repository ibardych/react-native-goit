import { useState } from 'react';
import { KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { Platform, Text, TextInput, View } from 'react-native';
import { StyleSheet, ImageBackground, Keyboard } from 'react-native';
import Button from '../components/Button';
import Link from '../components/Link';
import { Ionicons } from '@expo/vector-icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/user/operations';

const LoginScreen = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const togglePasswordShown = () => {
    setPasswordShown(!passwordShown);
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password should be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      dispatch(logIn(values));
    },
  });

  const handleEmailChange = text => {
    formik.setFieldValue('email', text.trim());
  };
  const handlePasswordChange = text => {
    formik.setFieldValue('password', text.trim());
  };

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
          <Text style={styles.title}>Sign in</Text>

          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={formik.values.email}
                placeholder={'E-Mail'}
                placeholderTextColor="#BDBDBD"
                onChangeText={handleEmailChange}
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
                onChangeText={handlePasswordChange}
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
          <Button onPress={formik.handleSubmit}>Sign in</Button>
          <Link onPress={() => navigation.navigate('Registration')}>
            {`You don't have an account? Sign up.`}
          </Link>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

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
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 144,
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
});
