import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    Platform,
  } from 'react-native';
  import React from 'react';
  import { Colors, fonts, images,styles } from '../../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import { useDispatch, useSelector } from 'react-redux';
import { setJnlOnboard } from '../../../Redux/OnboardingSlice';
import IndexDrawer from '../../../DrawerNav/IndexDrawer';

  
  const JnlOnboard7 = ({ navigation }) => {

    const dispatch = useDispatch();
    const OnboardStatus = useSelector(state => state.onboarding.jnlBoardingStatus);
console.log('my journal sttatus',OnboardStatus)
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white,paddingTop:Platform.OS === 'ios' ?40: 20 }}>
       <StatusBar
        translucent={false}
        backgroundColor={Colors.white}
        barStyle="dark-content"
        />
        <ScrollView>
        <View style={{ flex: 1, marginTop: wp(30), marginHorizontal: wp(3) }}>

       
      
          <Image
          source={images.jnlonboard7}
          resizeMode="contain"
          style={{
            width: wp(80),
            marginTop:wp(5),
            height: wp(80),
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
            You Are All Set
            </Text>
          </View>
        <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: wp(4),
              marginHorizontal: wp(3),
              alignSelf:'center'
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
Be honest. Keep it simple.{'\n'}
If you miss a day, just come back{'\n'} tomorrow            </Text>
          </View>
      
        <TouchableOpacity  onPress={() => {dispatch(setJnlOnboard(),navigation.navigate('IndexDrawer',{screen:'MyJournal'}))}}  style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(20)}]}  activeOpacity={0.7}>
    <Text style={styles.titleText}>Finish</Text>
</TouchableOpacity>
    
        </View>
        </ScrollView>
      
      </View>
    );
  };
  
  export default JnlOnboard7;
  