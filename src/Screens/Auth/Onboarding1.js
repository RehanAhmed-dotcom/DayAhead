import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import notifee, { AndroidNotificationSetting } from '@notifee/react-native';
import React, { useCallback } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { useDispatch } from 'react-redux';
import { setOnboarding } from '../../Redux/OnboardingSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';

const Onboarding1 = ({ navigation }) => {
   useFocusEffect(
      useCallback(() => {
       
        checkAndRequestExactAlarmPermission();
      }, []),
    );
   const checkAndRequestExactAlarmPermission = async () => {
    console.log('Function Run');
    if (Platform.OS !== 'android') {
      console.log('No This is Android Device');
      return true
    };
    console.log('Second Console RUn');
    const settings = await notifee.getNotificationSettings();
    console.log("thi;rd",settings)
    if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
      console.log('Already granted');
      return true; // Already granted   
    }
    console.log('No Granted');
    // Show explanation to user   
    Alert.alert('Permission Required', 'For reliable snap alarms (even when app is closed or phone in Doze mode), please allow "Alarms & reminders" access.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: async () => {
            await notifee.openAlarmPermissionSettings();
          },
        },
      ],
    );
    return false;
  };
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white, paddingTop: Platform.OS === 'ios' ? 10 : 0 }}>
  
      <View
          style={{
            // marginTop: wp(7),
           
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation:4,
            width:wp(100),
            height:wp(25),
            backgroundColor:'#FAFAFA',
            paddingHorizontal:wp(4),
            // paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
        
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
              marginLeft:wp(5)
            }}
          >Onboardings</Text>
          <Text onPress={() => dispatch(setOnboarding())}>Skip</Text>
        </View>
      <View style={{ flex: 1,  marginHorizontal: wp(3) }}>
      <Image
        source={images.onboard1}
        resizeMode="contain"
        style={{
          width: wp(95),
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
            Be a Day Ahead of Everyone Else
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
              color: '#616161',
              textAlign: 'center',
              fontFamily: fonts.medium,
              lineHeight: 20,
            }}
          >
            Join a community built to keep you one step ahead — in life, health,
            and goals. Together, we plan smarter, grow faster, and prove our
            progress every single day.
          </Text>
        </View>
      </View>
    <View style={{position:'absolute',bottom:wp(20),width:"90%",alignSelf:'center',justifyContent:'space-between',alignItems:'center',flexDirection:"row"}}>
      {/* <View style={{backgroundColor: Colors.white, width: wp(10),alignItems:"center",justifyContent:"center", height: wp(10), borderRadius: wp(5), elevation:3 }}>
        <AntDesign name={'left'} color={Colors.black} size={20}/>
      </View> */}
<View style={{width: wp(10), height:wp(10)}}/>
      <View style={{flexDirection:"row",justifyContent:'space-around',alignItems:'center',}}>

     
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:Colors.mainColor, elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      </View>
      <TouchableOpacity  onPress={() => navigation.navigate('Onboarding2')} style={{backgroundColor: Colors.white, width: wp(10),alignItems:"center",justifyContent:"center", height: wp(10), borderRadius: wp(5), elevation:3 }}>
        <AntDesign name={'right'} color={Colors.black} size={20}/>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default Onboarding1;
