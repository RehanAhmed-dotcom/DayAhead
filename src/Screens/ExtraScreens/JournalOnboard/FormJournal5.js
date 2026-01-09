import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform
  } from 'react-native';
  import React, { useState } from 'react';
  import { Colors, fonts, images,styles } from '../../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
  const FormJournal5 = ({ navigation,route }) => {
    const {gratitudedata,believesdata,goals,oneStep}= route.params
    const [promise,setPromise]=useState('')
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
   
        <View style={{ flex: 1, marginTop: wp(7), marginHorizontal: wp(3) }}>

       
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
            A promise for today
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
         Today, I promise to give my best, no excuses, just progress
            </Text>
          </View>
          <Image
          source={images.jnlonboard6}
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
                height: wp(45),
                borderRadius: wp(3),
                elevation: 2,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'grey',
                shadowRadius: 8,
                backgroundColor: '#FAFAFA',
                alignSelf: 'center',
                marginTop: wp(10),
              }}
            >
              <TextInput
                style={{
                  paddingHorizontal: wp(3),
                  color: Colors.black,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  textAlignVertical: 'top',
                  paddingTop: wp(3),
                }}
                multiline
                placeholder="Write here..."
                placeholderTextColor={Colors.lightgrey}
                value={promise}
                onChangeText={setPromise}
              />
            </View>
      
        <TouchableOpacity onPress={()=>navigation.navigate('FormJournal6',{gratitudedata,believesdata,goals,oneStep,promise})} style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(15),marginBottom:wp(4)}]}  activeOpacity={0.7}>
    <Text style={styles.titleText}>Next</Text>
</TouchableOpacity>
    
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </ImageBackground>
    );
  };
  
  export default FormJournal5;
  