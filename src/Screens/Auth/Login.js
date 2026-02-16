import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
  ImageBackground,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, { useState, useEffect } from 'react';
import Input from '../../Components/Input/Index';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Circle from 'react-native-vector-icons/Entypo';
import Check from 'react-native-vector-icons/EvilIcons';
import { Formik } from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import { setUser, setCredentials, clearCredentials } from '../../Redux/Auth';
import Loader from '../../Components/Loader';
import { PostAPiwithFrom, PostAPiwithToken } from '../../Components/ApiRoot';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    email: savedEmail,
    password: savedPassword,
    rememberMe,
  } = useSelector(state => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [check, setcheck] = useState(rememberMe);
  const [isloading, setIsLoading] = useState(false);

  // Animated values
  const logoOpacity = useState(new Animated.Value(0))[0];
  const titleOpacity = useState(new Animated.Value(0))[0];
  const titleY = useState(new Animated.Value(40))[0];
  const subtitleOpacity = useState(new Animated.Value(0))[0];
  const formY = useState(new Animated.Value(80))[0];
  const formOpacity = useState(new Animated.Value(0))[0];

  const toggleSecureText = () => setShowPassword(!showPassword);
  const toglecheck = () => setcheck(!check);

  useEffect(() => {
    GoogleSignin.configure({
      androidClientId:
        '365885584898-aeden87h6iaukq6psj3kbvd6jnonk4e5.apps.googleusercontent.com',
      iosClientId:
        '365885584898-o29d2kn3ebbh6dejmcdqqcvsf3jgsbua.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });
  }, []);

  // Trigger entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          // delay: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
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

  const _validation = yup.object({
    email: yup
      .string()
      .email(`well that's not an email`)
      .required('please! enter your email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\-_\s])[A-Za-z\d@$!%*#?&\-_\s]{8,}$/,
        'Must contain at least 8 characters, one letter, one number, and one special character',
      ),
  });

  // Your existing API functions (unchanged)
  const socialRegisterApi = userData => {
    const formdata = new FormData();
    formdata.append('name', `${userData.givenName}`);
    formdata.append('socialLogin', 1);
    formdata.append('email', userData.email);
    formdata.append('password', userData.email);
    formdata.append('password_confirmation', userData.email);
    if (userData?.photo) {
      formdata.append('image', {
        uri: userData.photo,
        type: 'image/jpeg',
        name: `image${new Date()}.jpg`,
      });
    }

    setIsLoading(true);
    PostAPiwithToken({ url: 'register' }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          dispatch(setUser(res.userdata));
        } else {
          Alert.alert(
            'Error',
            res.message?.email ? 'Email already exist' : 'error',
          );
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('err in login', err);
      });
  };

  const loginApi1 = (email, password) => {
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('password', password);
    setIsLoading(true);
    PostAPiwithToken({ url: 'login' }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          dispatch(setUser(res.userdata));
        } else {
          Alert.alert('Error', res.message);
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const socialFunction = user => {
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append('email', user?.email);
    PostAPiwithFrom({ url: 'google-login' }, formdata)
      .then(res => {
        if (res.status === 'success') {
          if (res.login === 0) {
            socialRegisterApi(user);
          } else if (res.login === 1) {
            loginApi1(user?.email, user?.email);
          } else {
            setIsLoading(false);
            Alert.alert(
              'Error',
              'The email address already exists. Please sign in with your password.',
            );
          }
        } else {
          setIsLoading(false);
          Alert.alert('Error', res.message);
        }
      })
      .catch(err => {
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

  const LoginApi = (email, password) => {
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('password', password);

    setIsLoading(true);
    PostAPiwithToken({ url: 'login' }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: 80,
          });
          dispatch(setUser(res.userdata));
          if (check) {
            dispatch(setCredentials({ email, password, rememberMe: check }));
          } else {
            dispatch(clearCredentials());
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: 80,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const { top } = useSafeAreaInsets();

  return (
    <Formik
      initialValues={{
        email: savedEmail || '',
        password: savedPassword || '',
      }}
      validateOnMount={true}
      onSubmit={values => LoginApi(values.email, values.password)}
      validationSchema={_validation}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        setValues,
      }) => {
        useEffect(() => {
          if (rememberMe) {
            setValues({ email: savedEmail, password: savedPassword });
          }
        }, [rememberMe, savedEmail, savedPassword, setValues]);

        return (
          // <View style={[styles.mainContainer, { paddingTop: Platform.OS === 'ios' ? top : 0 }]}>
          <ImageBackground
            source={images.mainImage}
            style={{
              flex: 1,
              paddingTop: Platform.OS === 'ios' ? 30 : 0,
            }}
            resizeMode="cover"
          >
            {isloading && <Loader />}

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <StatusBar
                  translucent
                  backgroundColor="transparent"
                  barStyle="light-content"
                />

                {/* <View>
                  <Image
                    source={require('../../Assets/logintop.png')}
                    style={{
                      width: wp(100),
                      height: wp(80),
                      alignSelf: 'center',
                    }}
                    resizeMode="cover"
                  />
                </View> */}
                <Animated.View
                  style={{
                    marginTop: wp(14),
                    marginHorizontal: wp(6),
                    opacity: titleOpacity,
                    transform: [{ translateY: titleY }],
                  }}
                >
                  <Text
                    style={{
                      fontSize: 40,
                      color: Colors.white,
                      textAlign: 'center',
                      fontFamily: fonts.bold,

                      // textAlign: 'center',
                    }}
                  >
                    Welcome back
                  </Text>
                  <Animated.View style={{ opacity: subtitleOpacity }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.white,
                        fontFamily: fonts.medium,
                        lineHeight: 22,
                        textAlign: 'center',
                      }}
                    >
                      Login to access your goal, habits and progress
                    </Text>
                  </Animated.View>
                </Animated.View>

                <Animated.View style={{ opacity: logoOpacity }}>
                  <Image
                    source={require('../../Assets/mymainlogo.png')}
                    style={{
                      width: wp(90),
                      height: wp(45),
                      alignSelf: 'center',
                      // paddingVertical:20,
                      backgroundColor: '#BD2BAF15',
                      borderRadius: 20,
                      marginTop: wp(10),
                    }}
                    resizeMode="contain"
                  />
                </Animated.View>

                <View style={{ paddingHorizontal: 20 }}>
                  {/* Animated Welcome Text */}

                  {/* Animated Form Content */}
                  <Animated.View
                    style={{
                      opacity: formOpacity,
                      transform: [{ translateY: formY }],
                    }}
                  >
                    {/* <Input
                      placeholder="Enter email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      type="default"
                      showBorder
                      inputColor="#FFFFFF"
                      labelColor="#212121"
                      elevation
                      elevationNumber={3}
                      placeFontSize={16}
                      maxLength={50}
                    /> */}

                    <TextInput
                      placeholder="Enter email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholderTextColor={'white'}
                      placeFontSize={16}
                      value={values.email}
                      type="default"
                      maxLength={50}
                      style={{
                        fontSize: 14,
                        height: 46,
                        color: Colors.white,
                        borderRadius: 10,
                        paddingHorizontal: 20,
                        marginTop: wp(10),
                        backgroundColor: '#00000066',
                      }}
                    />
                    {errors.email && touched.email && (
                      <Text style={[styles.errortxt]}>{errors.email}</Text>
                    )}

                    {/* <Input
                      placeholder="Enter password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureText={!showPassword}
                      secureToggle={toggleSecureText}
                      type="default"
                      showBorder
                      inputColor="#FFFFFF"
                      labelColor="#212121"
                      elevation={true}
                      elevationNumber={3}
                      placeFontSize={16}
                      maxLength={20}
                      image2={
                        <Icon
                          name={showPassword ? 'visibility' : 'visibility-off'}
                          size={wp(6)}
                          color="#616161"
                        />
                      }
                    /> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        height: 46,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: wp(5),
                        backgroundColor: '#00000066',
                      }}
                    >
                      <TextInput
                        placeholder="Enter password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry={!showPassword}
                        placeholderTextColor={Colors.white}
                        type="default"
                        maxLength={20}
                        style={{
                          fontSize: 14,
                          color: Colors.white,
                          width: wp(65),
                        }}
                      />
                      <TouchableOpacity onPress={() => toggleSecureText()}>
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

                    <View style={styles.checkrow}>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={toglecheck}>
                          {/* <Ionicons
                            name={check ? 'checkmark-circle' : 'checkmark-circle-outline'}
                            size={18}
                            color={check ? Colors.mainColor : Colors.white}
                          /> */}
                          {!check ? (
                            <Circle name={'circle'} size={16} color={'white'} />
                          ) : (
                            <Check
                              name={'check'}
                              size={20}
                              color={Colors.mainColor}
                            />
                          )}
                          {/* <Fontisto
                              name={check ? 'checkbox-active' : 'checkbox-passive'}
                              size={16}
                              color={check ? Colors.mainColor : Colors.white}
                            /> */}
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 12,
                            color: check ? Colors.mainColor : Colors.white,
                            fontFamily: fonts.medium,
                            paddingLeft: wp(1),
                          }}
                        >
                          Remember Me
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Forget')}
                      >
                        <Text
                          style={{
                            color: Colors.white,
                            fontSize: 12,
                            fontFamily: fonts.medium,
                          }}
                        >
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        marginTop: wp(25),
                        marginBottom: wp(5),
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      }}
                    >
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                          width: wp(70),
                          height: wp(13),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.mainColor,
                          borderRadius: wp(2),
                        }}
                      >
                        {/* <ImageBackground
                          source={require('../../Assets/loginbuttonback.png')}
                          borderRadius={wp(3)}
                          style={{
                            width: wp(70),
                            height: wp(13),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          resizeMode="cover"
                        > */}
                        <Text
                          style={{
                            fontFamily: fonts.bold,
                            fontSize: 16,
                            color: Colors.white,
                          }}
                        >
                          Log In
                        </Text>
                        {/* </ImageBackground> */}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={signIn}
                        style={{
                          width: wp(15),
                          alignSelf: 'center',
                          borderWidth: 1,
                          borderColor: Colors.white,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: wp(3),
                          height: wp(13),
                        }}
                      >
                        <Image
                          source={images.google}
                          resizeMode="contain"
                          style={{ width: wp(7), height: wp(7) }}
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: wp(2),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.medium,
                          color: Colors.white,
                        }}
                      >
                        Don’t have an account?
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                      >
                        <Text
                          style={{
                            color: Colors.white,
                            fontFamily: fonts.bold,
                            fontSize: 14,
                          }}
                        >
                          {' '}
                          Create Account
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            {/* <MorningModal /> */}
          </ImageBackground>
        );
      }}
    </Formik>
  );
};

export default Login;
