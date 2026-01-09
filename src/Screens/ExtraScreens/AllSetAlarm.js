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
    BackHandler,
  } from 'react-native';
  import React, { useCallback, useState } from 'react';
  import { Colors, fonts, images, styles } from '../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import MainButton from '../../Components/MainButton';
import { useFocusEffect } from '@react-navigation/native';
const AllSetAlarm = ({navigation}) => {
 useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      return true; // block back button
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      subscription.remove(); // ✅ correct cleanup
    };
  }, []),
);
  return (
         <ImageBackground
           source={images.mainbackground}
           style={{ flex: 1, paddingTop: 20 }}
           resizeMode="cover"
         >
           <KeyboardAvoidingView
             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
             style={{ flex: 1 }}
             keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
           >
               <StatusBar
                 translucent
                 backgroundColor={'transparent'}
                 barStyle={'light-content'}
               />
             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            
                <View style={{ marginTop: wp(40),alignItems:'center',alignSelf:'center' }}>
                            
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
               <ImageBackground style={{width:wp(50),height:wp(80),alignSelf:'center',marginTop:wp(10),justifyContent:'center',alignItems:'center'}} source={images.alarmsetImg} resizeMode='contain'>
                <Image source={images.finaltick} resizeMode='contain' style={{width:wp(60),height:wp(90),alignSelf:'center'}}/>
               </ImageBackground>
                   <Text
                               style={{
                                 fontSize: 13,
                                 color: '#616161',
                                 fontFamily: fonts.medium,
                                   lineHeight:18,
                                   textAlign:'center'
                               }}
                             >
              Your selfie has been sent to your friends o{'\n'}
members successfylly
                             </Text>
                             <View style={{position:'absolute',bottom:wp(30),alignSelf:'center' }}>
              <MainButton title="Back Home"  onPress={()=>navigation.navigate('IndexDrawer',{screen:'SnapAlarm'})}/>
            </View>
               </ScrollView>
               </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default AllSetAlarm