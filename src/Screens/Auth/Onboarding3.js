import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { setOnboarding } from '../../Redux/OnboardingSlice';
import { useDispatch } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Onboarding3 = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white,paddingTop: Platform.OS === 'ios' ? 10 : 0 }}>

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
            paddingTop: wp(5),
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>
          <Text></Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
              marginRight: wp(7),
            }}
          >Onboardings</Text>
          <Text onPress={() => dispatch(setOnboarding())}>Skip</Text>
        </View>
       <View style={{ flex: 1, marginHorizontal: wp(3) }}>
      
          <Image
        source={images.onboard3}
        resizeMode="contain"
        style={{
          width: wp(95),
          height: wp(100),
       
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
            Color-Coded, Focused, and Built for Flow
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
            We’ll help you design your perfect day: block time for each task,
            color-coordinate your calendar, and turn chaos into clarity. Every
            completed task fuels your growth.
          </Text>
        </View>
      </View>
      <View style={{position:'absolute',bottom:wp(20),width:"90%",alignSelf:'center',justifyContent:'space-between',alignItems:'center',flexDirection:"row"}}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor: Colors.white, width: wp(10),alignItems:"center",justifyContent:"center", height: wp(10), borderRadius: wp(5), elevation:3 }}>
        <AntDesign name={'left'} color={Colors.black} size={20}/>
      </TouchableOpacity>
      <View style={{flexDirection:"row",justifyContent:'space-around',alignItems:'center',}}>

     
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2', elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:Colors.mainColor,marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      </View>
      <TouchableOpacity  onPress={() => navigation.navigate('Onboarding4')} style={{backgroundColor: Colors.white, width: wp(10),alignItems:"center",justifyContent:"center", height: wp(10), borderRadius: wp(5), elevation:3 }}>
        <AntDesign name={'right'} color={Colors.black} size={20}/>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default Onboarding3;
