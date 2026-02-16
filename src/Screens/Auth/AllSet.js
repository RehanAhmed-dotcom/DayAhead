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
import Entypo from 'react-native-vector-icons/Entypo';
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
      <ImageBackground  source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 35 : 0 }}
      resizeMode="cover">

    
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity
                onPress={() =>  navigation.navigate('Login')}
                style={{ marginTop: wp(Platform.OS=="ios"?6: 6),backgroundColor:'white',marginLeft:20, width:30,height:30,borderRadius:30,alignItems:'center',justifyContent:"center" ,}}
              >
                <Entypo
                  name="chevron-thin-left"
                  color={Colors.black}
                  size={20}
                />
              </TouchableOpacity>
        <View
          style={{
            // marginTop: wp(7),
           
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation:4,
            width:wp(100),
            // height:wp(25),
            // backgroundColor:'#fff',
            paddingHorizontal:wp(4),
            paddingTop: wp(0)
          }}
        >
           <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
     
          {/* <TouchableOpacity onPress={() =>}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity> */}
          <Text></Text>
          <Text
            style={{
              fontSize: 24,
              fontFamily: fonts.bold,
              color: Colors.white,
            }}
          >You’re All Set</Text>
          <Text></Text>
        </View>
          <View
            style={{
              marginTop: wp(20),
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            {/* <Text
              style={{
                fontSize: 20,
                color: Colors.black,
                fontFamily: fonts.bold,
              }}
            >
              You’re All Set
            </Text> */}
          </View>
          <View>
            <Image
              source={require('../../Assets/Complete.png')}
              resizeMode="contain"
              style={{ width: wp(70),borderRadius:10, height: hp(30),backgroundColor:"#BD2BAF15", alignSelf: 'center' }}
            />
          </View>
          <Text
            style={{
              fontSize: 14,
              color: 'white',
              marginTop:30,
              fontFamily: fonts.medium,
              lineHeight: 16,
              textAlign: 'center',
            }}
          >
           Your account has been created
          {'\n'}
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
              title="Go To Login"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default AllSet;
