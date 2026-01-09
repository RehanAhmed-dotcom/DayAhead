import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Alert,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainButton from '../../Components/MainButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Formik } from 'formik';
import * as yup from 'yup';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import { PostAPiwithFrom, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { setUser } from '../../Redux/Auth';
import { useDispatch } from 'react-redux';

const SignUp = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [conshowPassword, setConShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  // Animated values
  const titleOpacity = useState(new Animated.Value(0))[0];
  const titleY = useState(new Animated.Value(40))[0];
  const subtitleOpacity = useState(new Animated.Value(0))[0];
  const formY = useState(new Animated.Value(80))[0];
  const formOpacity = useState(new Animated.Value(0))[0];

  // Enhanced avatar animation values
  const avatarOpacity = useState(new Animated.Value(0))[0];
  const avatarScale = useState(new Animated.Value(0.8))[0]; // Start slightly smaller

  const toggleSecureText = () => setShowPassword(!showPassword);
  const toggleConfirmSecureText = () => setConShowPassword(!conshowPassword);

  useEffect(() => {
    GoogleSignin.configure({
      androidClientId:
        '365885584898-aeden87h6iaukq6psj3kbvd6jnonk4e5.apps.googleusercontent.com',
      iosClientId:
        '365885584898-o29d2kn3ebbh6dejmcdqqcvsf3jgsbua.apps.googleusercontent.com',
    });
  }, []);

  // Entrance Animation with enhanced avatar effect
  useEffect(() => {
    Animated.sequence([
      // 1. Title + Avatar appear together with special avatar bounce
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        // Avatar: fade in + scale up with bounce
        Animated.parallel([
          Animated.timing(avatarOpacity, {
            toValue: 1,
            duration: 1000,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.spring(avatarScale, {
            toValue: 1,
            friction: 6,
            tension: 100,
            delay: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // 2. Subtitle fade in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),

      // 3. Form slides up
      Animated.parallel([
        Animated.timing(formY, {
          toValue: 0,
          duration: 800,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const upload = async (setFieldValue) => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 1,
      });
      setFieldValue('image', image.path);
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const _validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup
      .string()
      .email(`well that's not an email`)
      .required('Please! enter your email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\-_\s])[A-Za-z\d@$!%*#?&\-_\s]{8,}$/,
        'Must contain at least 8 characters, one letter, one number, and one special character',
      ),
    repassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const socialRegisterApi = (userData) => {
    const formdata = new FormData();
    formdata.append('name', `${userData.givenName}`);
    formdata.append('socialLogin', 1);
    formdata.append('email', userData.email);
    formdata.append('password', userData.email);
    formdata.append('password_confirmation', userData.email);

    setIsLoading(true);
    PostAPiwithToken({ url: 'register' }, formdata)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 'success') {
          dispatch(setUser(res.userdata));
        } else {
          Alert.alert('Error', res.message?.email ? 'Email already exist' : 'error');
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const loginApi1 = (email, password) => {
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('password', password);
    setIsLoading(true);
    PostAPiwithToken({ url: 'login' }, formdata)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 'success') {
          dispatch(setUser(res.userdata));
        } else {
          Alert.alert('Error', res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const socialFunction = (user) => {
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append('email', user?.email);
    PostAPiwithFrom({ url: 'google-login' }, formdata)
      .then((res) => {
        if (res.status === 'success') {
          if (res.login === 0) {
            socialRegisterApi(user);
          } else if (res?.userData?.socialLogin === 1) {
            loginApi1(user?.email, user?.email);
          } else {
            setIsLoading(false);
            Alert.alert('Error', 'The email address already exists. Please sign in with your password.');
          }
        } else {
          setIsLoading(false);
          Alert.alert('Error', res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.data?.user?.email) {
        socialFunction(userInfo.data.user);
      }
    } catch (error) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google SignIn Error:', error);
      }
    }
  };

  const _registerAPI = (username, email, password, repassword, image) => {
    const formdata = new FormData();
    formdata.append('name', username);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('password_confirmation', repassword);
    if (image) {
      formdata.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: `image${new Date()}.jpg`,
      });
    }

    setIsLoading(true);
    PostAPiwithToken({ url: 'register' }, formdata)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: 80,
          });
          dispatch(setUser(res.userdata));
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: 80,
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const { top } = useSafeAreaInsets();

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        repassword: '',
        image: '',
      }}
      validateOnMount={true}
      onSubmit={(values) =>
        _registerAPI(values.username, values.email, values.password, values.repassword, values.image)
      }
      validationSchema={_validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
        <ImageBackground
          source={images.mySplash3}
          style={[
            styles.mainContainer,
            { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? top : 20 },
          ]}
          resizeMode="cover"
        >
          {isloading && <Loader />}

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

              {/* Animated Title Section */}
              <Animated.View
                style={{
                  marginTop: wp(4),
                  opacity: titleOpacity,
                  transform: [{ translateY: titleY }],
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.white,
                    fontFamily: fonts.bold,
                  }}
                >
                  Register To Continue
                </Text>
                <Animated.View style={{ opacity: subtitleOpacity }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.white,
                      fontFamily: fonts.medium,
                    }}
                  >
                    Register your account for better experience
                  </Text>
                </Animated.View>
              </Animated.View>

              {/* Enhanced Animated Avatar */}
              <Animated.View
                style={{
                  opacity: avatarOpacity,
                  transform: [{ scale: avatarScale }],
                  marginTop: wp(10),
                  alignSelf: 'center',
                }}
              >
                <TouchableOpacity onPress={() => upload(setFieldValue)}>
                  <Image
                    source={values.image ? { uri: values.image } : images.avatarpic}
                    style={{
                      width: wp(30),
                      height: wp(30),
                      borderRadius: wp(15),
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </Animated.View>

              {/* Animated Form Fields */}
              <Animated.View
                style={{
                  opacity: formOpacity,
                  transform: [{ translateY: formY }],
                }}
              >
                <TextInput
                  placeholder="Enter username"
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  placeholderTextColor="white"
                  style={{
                    fontSize: 14,
                    color: Colors.white,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.white,
                    marginTop: wp(10),
                    backgroundColor: 'transparent',
                  }}
                />
                {errors.username && touched.username && (
                  <Text style={[styles.errortxt]}>{errors.username}</Text>
                )}

                <TextInput
                  placeholder="Enter email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholderTextColor="white"
                  style={{
                    fontSize: 14,
                    color: Colors.white,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.white,
                    marginTop: wp(6),
                    backgroundColor: 'transparent',
                  }}
                />
                {errors.email && touched.email && (
                  <Text style={[styles.errortxt]}>{errors.email}</Text>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.white,
                    marginTop: wp(5),
                    backgroundColor: 'transparent',
                  }}
                >
                  <TextInput
                    placeholder="Enter password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="white"
                    style={{ fontSize: 14, color: Colors.white, flex: 1 }}
                  />
                  <TouchableOpacity onPress={toggleSecureText}>
                    <Icon
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={wp(6)}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={[styles.errortxt]}>{errors.password}</Text>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.white,
                    marginTop: wp(5),
                    backgroundColor: 'transparent',
                  }}
                >
                  <TextInput
                    placeholder="Enter confirm password"
                    onChangeText={handleChange('repassword')}
                    onBlur={handleBlur('repassword')}
                    value={values.repassword}
                    secureTextEntry={!conshowPassword}
                    placeholderTextColor="white"
                    style={{ fontSize: 14, color: Colors.white, flex: 1 }}
                  />
                  <TouchableOpacity onPress={toggleConfirmSecureText}>
                    <Icon
                      name={conshowPassword ? 'visibility' : 'visibility-off'}
                      size={wp(6)}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </View>
                {errors.repassword && touched.repassword && (
                  <Text style={[styles.errortxt]}>{errors.repassword}</Text>
                )}

                <View
                  style={{
                    marginTop: wp(8),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.white,
                    }}
                  >
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text
                      style={{
                        color: Colors.mainColor,
                        fontFamily: fonts.bold,
                        fontSize: 14,
                        marginLeft: 5,
                      }}
                    >
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ marginTop: wp(5), marginBottom: wp(5) }}>
                  <TouchableOpacity
                    style={[styles.btnView, { backgroundColor: Colors.white }]}
                    onPress={handleSubmit}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.titleText, { color: Colors.black }]}>Sign Up</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={signIn}
                  style={{
                    flexDirection: 'row',
                    width: wp(87),
                    marginBottom: wp(10),
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderColor: Colors.mainColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: wp(10),
                    height: wp(13),
                  }}
                >
                  <Image
                    source={images.google}
                    resizeMode="contain"
                    style={{ width: wp(5), height: wp(5), marginRight: wp(2) }}
                  />
                  <Text style={{ color: Colors.white, fontSize: 16, fontFamily: fonts.bold }}>
                    Google
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      )}
    </Formik>
  );
};

export default SignUp;