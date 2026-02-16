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
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Input from '../../Components/Input/Index';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainButton from '../../Components/MainButton';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setUser } from '../../Redux/Auth';
import { useDispatch, useSelector } from 'react-redux';
const CELL_COUNT = 4;
const VerificationCode = ({ navigation, route }) => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [counter, setcounter] = useState(60);
  const [isloading, setIsLoading] = useState(false);

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (counter === 0) return;

    const timer = setInterval(() => {
      setcounter(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const reSendCode = () => {
    setIsLoading(true);

    const formdata = new FormData();
    formdata.append('email', user?.email);
    PostAPiwithToken({ url: 'resend-code', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('apiresponse', JSON.stringify(res));
        if (res.status === 'success') {
          console.log(res);
          setcounter(60);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
          });
        } else {
          console.log(res);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Task delete error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete task',
        });
      });
  };

  const _apiverifyotp = () => {
    const formdata = new FormData();
    formdata.append('email', user.email);
    formdata.append('pin', value);
    setIsLoading(true);
    PostAPiwithToken({ url: 'verify' }, formdata)
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
          dispatch(setUser(res?.userdata));
          // navigation.replace('CompleteProfile');
          console.log('first,', res);
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'email error or invalid code!',
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
    <View
      style={[
        styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? 0 : 20 },
      ]}
    >
      <ImageBackground
        source={images.mainImage}
        style={{ flex: 1, paddingHorizontal: 20 }}
      >
        {isloading && <Loader />}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginTop: wp(6) }}
            >
              <Entypo name="chevron-thin-left" color={Colors.black} size={20} />
            </TouchableOpacity> */}
            <View style={{ marginTop: wp(10) }}>
              <Text
                style={{
                  fontSize: 20,
                  color: Colors.white,
                  marginTop: 30,
                  fontFamily: fonts.bold,
                }}
              >
                Verification
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  marginTop: 30,
                  fontFamily: fonts.medium,
                  lineHeight: 20,
                }}
              >
                Enter the security code we sent to{'\n'}
                your Email Address
              </Text>
            </View>
            <View style={{ marginTop: wp(15) }}>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            <View style={{ marginTop: wp(80), marginBottom: wp(10) }}>
              {counter === 0 ? (
                <TouchableOpacity onPress={reSendCode}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 14,
                      textAlign: 'center',
                      marginBottom: 12,
                      borderRadius: 12,
                      paddingVertical: 12,
                      width: 'auto',
                      backgroundColor: Colors.mainColor + 70,
                    }}
                  >
                    Resend Code
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 14,
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  Resend Code in 00:{counter}
                </Text>
              )}
              <MainButton
                title="Verify OTP"
                // onPress={() => navigation.navigate('NewPassword')}
                onPress={() => _apiverifyotp()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default VerificationCode;
