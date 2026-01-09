import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    StatusBar,
    ScrollView,
    Platform
  } from 'react-native';
  import React from 'react';
  import { Colors, fonts, images,styles } from '../../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import { useDispatch, useSelector } from 'react-redux';
  import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//   import { useDispatch } from 'react-redux';
//   import { setOnboarding } from '../../Redux/OnboardingSlice';
  
  const FormJournal = ({ navigation }) => {
const {top}=useSafeAreaInsets()
    return (
        <ImageBackground
        source={images.myallbackbg}
        style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?30: 0 }}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : 0}
      >
       <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 4,
            width: wp(100),
            height: wp(25),
            backgroundColor: '#FAFAFA',
            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
              <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
              // marginRight: wp(7),
            }}
          >
            Journal
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginTop: wp(10), marginHorizontal: wp(3) }}>
            {/* <TouchableOpacity onPress={()=>dispatch(setJnlOnboardFalse())}>
<Text style={{fontSize:14,color:Colors.black}}>Forms</Text>
</TouchableOpacity> */}
        <Image
          source={images.jnlonboard1}
          resizeMode="contain"
          style={{
            width: wp(60),
            height: wp(70),
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
        <TouchableOpacity onPress={()=>{navigation.navigate('FormJournal1')}} style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(15),marginBottom:wp(4),alignSelf:'center'}]}  activeOpacity={0.7}>
    <Text style={styles.titleText}>Start</Text>
</TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      </ImageBackground>
    );
  };
  
  export default FormJournal;
  