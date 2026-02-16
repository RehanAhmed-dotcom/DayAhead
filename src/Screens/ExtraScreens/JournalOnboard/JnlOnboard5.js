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
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, fonts, images, styles } from '../../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const JnlOnboard4 = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../../Assets/Top Intention or Goal.png')}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
      resizeMode="cover"
    >
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
          paddingTop: wp(5),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 }, // push shadow down
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginTop: wp(5), marginHorizontal: wp(3) }}>
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
              Today's Goal
            </Text>
          </View>
          <Text
            style={{
              color: 'white',
              marginTop: hp(30),
              fontFamily: fonts.bold,
            }}
          >
            For Example:{' '}
            <Text style={{ fontFamily: fonts.light }}>
              To finish my practice exam and make it to the gym
            </Text>
          </Text>
          <View
            style={{
              width: wp(90),
              height: wp(45),
              borderRadius: wp(3),
              // elevation: 2,
              marginTop: 10,
              shadowOffset: { height: 2, width: 4 },
              shadowOpacity: 0.2,
              shadowColor: 'grey',
              shadowRadius: 8,
              backgroundColor: '#00000040',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingHorizontal: wp(3),
                paddingTop: wp(3),
              }}
            >
              I want to progress best in my day
            </Text>
            {/* <TextInput
                  style={{
                    paddingHorizontal: wp(3),
                    color: Colors.white,
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    textAlignVertical: 'top',
                    paddingTop: wp(3),
                  }}
                  multiline
                  placeholder="Description here..."
                  placeholderTextColor={Colors.white}
                  value={goals}
                  onChangeText={setGoals}
                /> */}
          </View>
          {/* <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: wp(9),
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
            On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même.

            </Text>
          </View> */}

          <TouchableOpacity
            onPress={() => navigation.navigate('JnlOnboard6')}
            style={[
              styles.btnView,
              {
                backgroundColor: Colors.mainColor,
                marginTop: wp(15),
                marginBottom: wp(4),
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.titleText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default JnlOnboard4;
