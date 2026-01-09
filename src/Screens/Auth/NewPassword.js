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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import * as yup from 'yup';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const NewPassword = ({ navigation, route }) => {
  const { email, value } = route.params;
  // State to manage input values
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  // Function to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [conshowPassword, setConShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const toggleSecureText = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmSecureText = () => {
    setConShowPassword(!conshowPassword);
  };

  const _validationSchema = yup.object({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    repassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const ResetPassApi = (password, repassword) => {
    const formdata = new FormData();
    formdata.append('password', password);
    formdata.append('password_confirmation', repassword);

    formdata.append('email', email);
    formdata.append('pin', value);
    setIsLoading(true);
    PostAPiwithToken({ url: 'reset' }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate('AllSet');
        }
        console.log('res of update ', res);
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
        password: '',
        repassword: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        ResetPassApi(values.password, values.repassword);
      }}
      validationSchema={_validationSchema}
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
            { paddingHorizontal: 20,  paddingTop:Platform.OS=='ios'?top: 20 },
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
                  label="New Password"
                  placeholder="Enter new password"
                  onChangeText={text => {
                    handleChange('password')(text);
                  }}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureText={showPassword ? false : true}
                  secureToggle={toggleSecureText}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={20}
                  image2={
                    <Icon
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={wp(6)}
                      color="#616161"
                    />
                  }
                />
                {errors.password && touched.password && (
                  <Text style={[styles.errortxt]}>{errors.password}</Text>
                )}
                <Input
                  label="Confirm New Password"
                  placeholder="Enter new password"
                  onChangeText={text => {
                    handleChange('repassword')(text);
                  }}
                  onBlur={handleBlur('repassword')}
                  value={values.repassword}
                  secureText={conshowPassword ? false : true}
                  secureToggle={toggleConfirmSecureText}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={20}
                  image2={
                    <Icon
                      name={conshowPassword ? 'visibility' : 'visibility-off'}
                      size={wp(6)}
                      color="#616161"
                    />
                  }
                />
                {errors.repassword && touched.repassword && (
                  <Text style={styles.errortxt}>{errors.repassword}</Text>
                )}
              </View>
              <View style={{ marginTop: wp(50), marginBottom: wp(10) }}>
                <MainButton
                  title="Save New Password"
                  // onPress={() => navigation.navigate('AllSet')}
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

export default NewPassword;
