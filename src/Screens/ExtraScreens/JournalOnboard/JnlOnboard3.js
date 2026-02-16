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
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
import { Colors, fonts, images, styles } from '../../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const JnlOnboard3 = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../../Assets/Daily Affirmation.png')}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 10 : 0 }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          // backgroundColor: Colors.white,
          paddingTop: Platform.OS === 'ios' ? 40 : 10,
        }}
      >
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // elevation: 4,
              width: wp(100),
              height: wp(25),
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
          <View style={{ flex: 1, marginTop: wp(0), marginHorizontal: wp(3) }}>
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
                Daily Affirmation
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
                How do I choose to show up today?
              </Text>
            </View>
            {/* <Image
              source={images.jnlonboard3}
              resizeMode="contain"
              style={{
                width: wp(50),
                marginTop: wp(5),
                height: wp(50),
                // position: 'absolute',
                // bottom: wp(10),
                alignSelf: 'center',
              }}
            /> */}
            <View
              style={{
                backgroundColor: '#00000066',
                marginTop: wp(5),
                // elevation: 1,
                marginTop: hp(25),
                // alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 13,
                width: wp(90),
                alignSelf: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>I am calm</Text>
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
              <Text style={{ color: 'white' }}>I can handle today</Text>
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
              <Text style={{ color: 'white' }}>I deserve peace</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('JnlOnboard4')}
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
      </View>
    </ImageBackground>
  );
};

export default JnlOnboard3;
