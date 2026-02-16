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
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, fonts, images, styles } from '../../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
const FormJournal3 = ({ navigation, route }) => {
  const { gratitudedata, believesdata, lettingGo } = route.params;
  // console.log('muy gratuttedata',gratitudedata)
  const [goals, setGoals] = useState('');
  const { top } = useSafeAreaInsets();

  const handleNext = () => {
    if (!goals) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please complete the required fields.',
      });
      return;
    }

    navigation.navigate('FormJournal4', {
      believesdata,
      gratitudedata,
      lettingGo,
      goals,
    });
  };
  return (
    <ImageBackground
      source={require('../../../Assets/Top Intention or Goal.png')}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
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

            <View
              style={{
                width: wp(90),
                // height: wp(45),
                borderRadius: wp(3),
                // elevation: 2,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'grey',
                shadowRadius: 8,
                // backgroundColor:
                alignSelf: 'center',
                marginTop: hp(20),
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontFamily: fonts.bold,
                  marginBottom: 10,
                }}
              >
                For Example:{' '}
                <Text style={{ fontFamily: fonts.light }}>
                  To finish my practice exam and make it to the gym
                </Text>
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: wp(5),
                  color: Colors.white,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  textAlignVertical: 'top',
                  backgroundColor: '#00000040',
                  borderRadius: wp(3),
                  padding: 10,
                  height: 200,
                  paddingTop: wp(3),
                }}
                multiline
                placeholder="Description here..."
                placeholderTextColor={Colors.white}
                value={goals}
                onChangeText={setGoals}
              />
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
              onPress={handleNext}
              style={[
                {
                  width: wp(88),
                  height: wp(13),
                  borderRadius: 12,
                  backgroundColor: Colors.mainColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default FormJournal3;
