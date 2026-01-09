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
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../Components/MainButton';

const AlltaskSet = ({ navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <StatusBar
            translucent
            backgroundColor={'transparent'}
            barStyle={'dark-content'}
          />
          <View
            style={{
              marginTop: wp(20),
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: Colors.black,
                fontFamily: fonts.bold,
              }}
            >
              You’re All Set
            </Text>
          </View>
          <View>
            <Image
              source={images.finaltick}
              resizeMode="contain"
              style={{ width: wp(70), height: wp(90), alignSelf: 'center' }}
            />
          </View>
          <Text
            style={{
              fontSize: 13,
              color: '#616161',
              fontFamily: fonts.medium,
              lineHeight: 18,
              textAlign: 'center',
            }}
          >
            You Task has been sent to your friends members {'\n'}
            successfully
          </Text>
          <View
            style={{
              position: 'absolute',
              bottom: wp(30),
              alignSelf: 'center',
            }}
          >
            <MainButton
              title="Go To Home"
              onPress={() => navigation.navigate('IndexDrawer')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AlltaskSet;
