import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Input from '../../Components/Input/Index';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainButton from '../../Components/MainButton';
import * as yup from 'yup';
import { Formik } from 'formik';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Forget = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const _validation = yup.object({
    // phone: yup.string().required('Phone number is required'),
    email: yup
      .string()
      .email(`well that's not an email`)
      .required('Please! enter your email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  });

  const _apiforgot = email => {
    const formdata = new FormData();
    formdata.append('email', email);
    setIsLoading(true);

    PostAPiwithToken({ url: 'forgot' }, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('first,', res);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate('Verify', { email });
          console.log('first,', res);
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'email error!',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };
  const { top } = useSafeAreaInsets();
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        // console.log('values', values);
        _apiforgot(values.email);
      }}
      validationSchema={_validation}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
      }) => (
        <View
          style={[
            styles.mainContainer,
            { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? top : 20  },
          ]}
        >
          {isloading && <Loader />}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <StatusBar
                translucent
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
              />
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginTop: wp(6) }}
              >
                <Entypo
                  name="chevron-thin-left"
                  color={Colors.black}
                  size={20}
                />
              </TouchableOpacity>
              <View style={{ marginTop: wp(10) }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.black,
                    fontFamily: fonts.bold,
                  }}
                >
                  Forgot Your Password?
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#616161',
                    fontFamily: fonts.medium,
                    lineHeight: 20,
                  }}
                >
                  Enter your registered email below. We’ll send {'\n'}you a
                  one-time password (OTP) to reset{'\n'}your password
                </Text>
              </View>
              <View style={{ marginTop: wp(15) }}>
                <Input
                  label="Email"
                  placeholder="Enter email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={50}
                />
                {errors.email && touched.email && (
                  <Text style={[styles.errortxt]}>{errors.email}</Text>
                )}
              </View>
              <View style={{ marginTop: wp(80), marginBottom: wp(10) }}>
                <MainButton
                  title="Send OTP Code"
                  onPress={() => handleSubmit()}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default Forget;
