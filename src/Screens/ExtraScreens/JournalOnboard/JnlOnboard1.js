import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
    KeyboardAvoidingView
  } from 'react-native';
  import React from 'react';
  import { Colors, fonts, images,styles } from '../../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import { useDispatch, useSelector } from 'react-redux';
import FormJournal1 from './FormJournal1';
import { setJnlOnboardFalse } from '../../../Redux/OnboardingSlice';
  
//   import { useDispatch } from 'react-redux';
//   import { setOnboarding } from '../../Redux/OnboardingSlice';
  
  const JnlOnboard1 = ({ navigation }) => {

    const OnboardStatus = useSelector(state => state.onboarding.jnlBoardingStatus);
    console.log('my journal sttatus',OnboardStatus)
    const dispatch = useDispatch();
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white, }}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : 0}
      >
        <View style={{ flex: 1, marginTop: wp(10), marginHorizontal: wp(3) }}>
            {/* <TouchableOpacity onPress={()=>dispatch(setJnlOnboardFalse())}>
<Text style={{fontSize:14,color:Colors.black}}>Forms</Text>
</TouchableOpacity> */}
        <Image
          source={images.jnlonboard1}
          resizeMode="contain"
          style={{
            width: wp(60),
            height: wp(100),
            // position: 'absolute',
            // bottom: wp(10),
            alignSelf: 'center',
          }}
        />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: wp(3),
            }}
          >
            <Text
              style={{
                fontSize: 22,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: fonts.bold,
                lineHeight: 26,
              }}
            >
              Welcome to your journal
            </Text>
          </View>
  
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: wp(5),
              marginHorizontal: wp(3),
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: fonts.medium,
                lineHeight: 22,
              }}
            >
             This journal is a few quiet minutes
             with yourself 

            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: fonts.medium,
                lineHeight: 22,
                marginTop:wp(3)
              }}
            >

             No pressure{'\n'}
No perfection{'\n'}
Just honesty
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // marginHorizontal: wp(5),
              alignSelf:'center',
              marginTop: wp(10),
            }}
          >
        <TouchableOpacity onPress={()=>{navigation.navigate('JnlOnboard2')}} style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(20)}]}  activeOpacity={0.7}>
    <Text style={styles.titleText}>Start</Text>
</TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default JnlOnboard1;
  