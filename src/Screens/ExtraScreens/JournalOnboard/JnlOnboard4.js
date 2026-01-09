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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
  
  const JnlOnboard4 = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white,paddingTop:Platform.OS === 'ios' ?40: 20 }}>
       <StatusBar
        translucent={false}
        backgroundColor={Colors.white}
        barStyle="dark-content"
        />
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
            Bigger Goal
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
          Something i want to achieve
            </Text>
          </View>
          <Image
          source={images.jnlonboard4}
          resizeMode="contain"
          style={{
            width: wp(50),
            marginTop:wp(5),
            height: wp(50),
            // position: 'absolute',
            // bottom: wp(10),
            alignSelf: 'center',
          }}
        />
       <View
              style={{
                width: wp(90),
                // height: wp(45),
                borderRadius: wp(3),
                elevation: 3,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'grey',
                shadowRadius: 8,
                backgroundColor: '#FAFAFA',
                alignSelf: 'center',
                marginTop: wp(10),
                paddingHorizontal:wp(3),
                paddingVertical:wp(3)
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
            On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même.

            </Text>
          </View>
      
        <TouchableOpacity onPress={()=>navigation.navigate('JnlOnboard5')} style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(20)}]}  activeOpacity={0.7}>
    <Text style={styles.titleText}>Next</Text>
</TouchableOpacity>
    
        </View>
        </ScrollView>
      
      </View>
    );
  };
  
  export default JnlOnboard4;
  