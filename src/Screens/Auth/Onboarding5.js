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
const Onboarding5 = ({ navigation }) => {
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
      <View style={{ flex: 1, marginTop: wp(15), marginHorizontal: wp(3) }}>
          <Image
        source={images.onboard5}
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
              fontSize: 20,
              color: Colors.black,
              textAlign: 'center',
              fontFamily: fonts.bold,
              lineHeight: 26,
            }}
          >
            There’s a Group for Everything You Want to Improve
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
            Want to wake up early, quit alcohol, start journaling, or get
            consistent at the gym? There’s a community for it. And if not —
            create your own. Inspire others with your journey and lead your
            tribe.
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
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:Colors.mainColor,marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      <View style={{width:wp(2),height:wp(2),borderRadius:wp(2),backgroundColor:'#EBEAE2',marginLeft:wp(3), elevation:3}}/>
      </View>
      <TouchableOpacity  onPress={() => navigation.navigate('Onboarding6')} style={{backgroundColor: Colors.white, width: wp(10),alignItems:"center",justifyContent:"center", height: wp(10), borderRadius: wp(5), elevation:3 }}>
        <AntDesign name={'right'} color={Colors.black} size={20}/>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default Onboarding5;
