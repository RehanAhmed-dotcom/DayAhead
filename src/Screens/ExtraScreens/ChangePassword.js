import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import Input from '../../Components/Input/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../Redux/Auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import staticTexts from '../../locales/staticTexts';
import { useTranslate } from '../../Components/hooks/useTranslate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Toast from 'react-native-toast-message';

const ChangePassword = ({ navigation }) => {
  const user = useSelector(state => state.user.user);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      console.log('All fields are required');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required',
      });
      return;
    }

    if (newPassword.length < 8) {
      console.log('New password must be at least 8 characters');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      console.log('New passwords do not match');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New passwords do not match',
      });
      return;
    }
    const formdata = new FormData();
    formdata.append('old_password', oldPassword);
    formdata.append('password', newPassword);
    formdata.append('password_confirmation', confirmPassword);
    PostAPiwithToken(
      { url: 'change-password', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        if (res.status === 'success') {
          console.log(res);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Password changed successfully!',
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
        console.log('Change password error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
        });
      });
  };
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        {/* Header */}
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            elevation: 4,
            width: wp(100),
            height: wp(25),

            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <TouchableOpacity
            style={{
              width: 25,
              height: 25,
              backgroundColor: Colors.white,
              borderRadius: 50,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="left" color="black" size={20} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{ color: 'white', fontSize: 20, fontFamily: fonts.bold }}
            >
              Change Password
            </Text>
          </View>
          ,
        </View>
        <View style={{ flex: 1, padding: 12 }}>
          {/* Old Password */}
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            Enter Old Password
          </Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            style={inputStyle}
          />
          {/* New Password */}
          <Text style={{ fontSize: 16, marginTop: 16, marginBottom: 8 }}>
            Enter New Password
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={inputStyle}
          />
          {/* Confirm Password */}
          <Text
            style={{
              fontSize: 16,
              marginTop: 16,
              marginBottom: 8,
              color: Colors.white,
            }}
          >
            Confirm New Password
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={inputStyle}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
            style={{
              backgroundColor: '#4CAF50',
              padding: 16,
              borderRadius: 10,
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const inputStyle = {
  paddingVertical: 18,
  backgroundColor: '#00000020',
  paddingHorizontal: 12,
  borderRadius: 12,
};
export default ChangePassword;
