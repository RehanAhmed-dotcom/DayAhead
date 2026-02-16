import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, fonts, images, styles } from '../../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const JnlOnboard2 = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../../Assets/Gratitude.png')}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 10 : 0 }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          // backgroundColor: Colors.white,
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
        }}
      >
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
          <ScrollView>
            {/* <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ position: 'absolute', top: wp(10), left: wp(7) }}
            >
              <MaterialIcons
                name={'arrow-back-ios'}
                size={20}
                color={Colors.black}
              />
            </TouchableOpacity> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // elevation: 4,
                width: wp(100),
                height: wp(25),
                // marginTop: wp(10),
                // backgroundColor: '#FAFAFA',
                paddingHorizontal: wp(4),
                // paddingTop: wp(5),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 }, // push shadow down
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              {/* <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
              /> */}
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="left" size={20} color={Colors.black} />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                  // marginRight: wp(7),
                }}
              >
                Journal
              </Text>

              {/* Empty View to balance the row */}
              <View style={{ width: 20 }} />
            </View>
            <View style={{ flex: 1, marginHorizontal: wp(3) }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: wp(3),
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.white,
                    textAlign: 'center',
                    fontFamily: fonts.bold,
                    lineHeight: 26,
                  }}
                >
                  Gratitude
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: wp(3),
                  marginHorizontal: wp(3),
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.white,
                    textAlign: 'center',
                    fontFamily: fonts.medium,
                    lineHeight: 22,
                  }}
                >
                  3 things I am grateful for:
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: wp(3),
                  marginHorizontal: wp(3),
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: Colors.white,
                    textAlign: 'center',
                    fontFamily: fonts.medium,
                    lineHeight: 22,
                  }}
                >
                  {`(1–3 things is perfect)`}
                </Text>
              </View>
              {/* <Image
                source={images.jnlonboard2}
                resizeMode="contain"
                style={{
                  width: wp(50),
                  height: wp(50),
                  // position: 'absolute',
                  // bottom: wp(10),
                  alignSelf: 'center',
                }}
              /> */}
              <View
                style={{
                  backgroundColor: '#00000066',
                  marginTop: hp(25),
                  // elevation: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 13,
                  width: wp(90),
                  alignSelf: 'center',
                }}
              >
                <Text style={{ color: 'white' }}>Morning Coffee</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#00000066',
                  marginTop: wp(4),
                  // elevation: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 13,
                  width: wp(90),
                  alignSelf: 'center',
                }}
              >
                <Text style={{ color: 'white' }}>Good Health</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#00000066',
                  marginTop: wp(4),
                  // elevation: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 13,
                  width: wp(90),
                  alignSelf: 'center',
                }}
              >
                <Text style={{ color: 'white' }}>Peaceful Evening</Text>
              </View>
              <Text
                style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
              >
                This sets your mindset before the day begins
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('JnlOnboard3')}
                style={[
                  styles.btnView,
                  { backgroundColor: Colors.mainColor, marginTop: wp(20) },
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.titleText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default JnlOnboard2;
