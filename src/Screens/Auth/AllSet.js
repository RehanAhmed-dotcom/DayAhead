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
import MainButton from '../../Components/MainButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AllSet = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            // marginTop: wp(7),
           
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation:4,
            width:wp(100),
            height:wp(25),
            backgroundColor:'#fff',
            paddingHorizontal:wp(4),
            paddingTop: wp(5)
          }}
        >
           <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
          {/* <TouchableOpacity onPress={() =>}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity> */}
          <Text></Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
            }}
          >All Set</Text>
          <Text></Text>
        </View>
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
              source={require('../../Assets/completesub.png')}
              resizeMode="contain"
              style={{ width: wp(70), height: wp(90), alignSelf: 'center' }}
            />
          </View>
          <Text
            style={{
              fontSize: 14,
              color: '#000',
              fontFamily: fonts.medium,
              lineHeight: 18,
              textAlign: 'center',
            }}
          >
            You password has been successfully {'\n'}
            updated
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
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AllSet;
