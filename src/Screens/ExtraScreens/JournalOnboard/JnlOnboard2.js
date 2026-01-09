import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
  
  const JnlOnboard2 = ({ navigation }) => {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white,paddingTop:Platform.OS === 'ios' ?40: 20 }}>
       <StatusBar
        translucent={false}
        backgroundColor={Colors.white}
        barStyle="dark-content"
        />
         <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : 0}
      >
        <ScrollView>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{position:'absolute',top:wp(10),left:wp(7)}}>
        <MaterialIcons
        name={'arrow-back-ios'}
        size={20}
        color={Colors.black}
        />
        </TouchableOpacity>
        <View style={{ flex: 1, marginTop: wp(30), marginHorizontal: wp(3) }}>

       
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
             Start With Gratitude
            </Text>
          </View>
  
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: wp(7),
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
           Today i am grateful fo
            </Text>
          </View>
          <Image
          source={images.jnlonboard2}
          resizeMode="contain"
          style={{
            width: wp(50),
            height: wp(50),
            // position: 'absolute',
            // bottom: wp(10),
            alignSelf: 'center',
          }}
        />
          <View
        style={
          {
           
            backgroundColor: '#FAFAFA',
            marginTop:wp(5),
            elevation: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical:13,
            width:wp(90),
            alignSelf:'center'
          }}
      >
        <Text>Morning Coffee</Text>
        </View>
        <View
        style={
          {
           
            backgroundColor: '#FAFAFA',
            marginTop:wp(4),
            elevation: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical:13,
            width:wp(90),
            alignSelf:'center'
          }}
      >
        <Text>Good Health</Text>
        </View>
        <View
        style={
          {
           
            backgroundColor: '#FAFAFA',
            marginTop:wp(4),
            elevation: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical:13,
            width:wp(90),
            alignSelf:'center'
          }}
      >
        <Text>Peaceful Evening</Text>
        </View>
      
        <TouchableOpacity onPress={()=>navigation.navigate('JnlOnboard3')} style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(20)}]}  activeOpacity={0.7}>
    <Text style={styles.titleText}>Next</Text>
</TouchableOpacity>
    
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default JnlOnboard2;
  