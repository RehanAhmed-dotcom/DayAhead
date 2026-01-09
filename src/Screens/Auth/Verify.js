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
const CELL_COUNT = 4;
const Verify = ({ navigation, route }) => {
  const { email } = route.params;
  const [counter, setcounter] = useState(60);
  const [isloading, setIsLoading] = useState(false);

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setcounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const _apiverifyotp = () => {
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('pin', value);
    setIsLoading(true);
    PostAPiwithToken({ url: 'confirm-code' }, formdata)
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
          navigation.navigate('NewPassword', { value, email });
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
    <View
      style={[styles.mainContainer, { paddingHorizontal: 20, paddingTop:Platform.OS=='ios'?top: 20 }]}
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
            <Entypo name="chevron-thin-left" color={Colors.black} size={20} />
          </TouchableOpacity>
          <View style={{ marginTop: wp(10) }}>
            <Text
              style={{
                fontSize: 20,
                color: Colors.black,
                fontFamily: fonts.bold,
              }}
            >
              Verification
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#616161',
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
            <MainButton
              title="Verify OTP"
              // onPress={() => navigation.navigate('NewPassword')}
              onPress={() => _apiverifyotp()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Verify;
