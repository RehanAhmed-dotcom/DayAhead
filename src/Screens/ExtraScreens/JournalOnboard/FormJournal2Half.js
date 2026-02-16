import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, fonts, images, styles } from '../../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Input from '../../../Components/Input/Index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Input1 from '../../../Components/Input1';
import Toast from 'react-native-toast-message';
const FormJournal2Half = ({ navigation, route }) => {
  const { gratitudedata, believesdata } = route.params;
  console.log('my gratitudedata', gratitudedata);
  const [showInput, setShowInput] = useState(true);
  const [otherValue, setOtherValue] = useState('');
  const [lettingGo, setLettingGo] = useState('');

  // Handle navigation to next screen with only filled entries
  const handleNext = () => {
    if (!lettingGo) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please choose one option or write your thoughts.',
      });
      return;
    }

    navigation.navigate('FormJournal3', {
      gratitudedata, // from previous screen
      believesdata, // newly collected, only non-empty
      lettingGo,
    });
  };
  const { top } = useSafeAreaInsets();
  const data = [
    {
      id: 1,
      title: 'Need for control',
      image: require('../../../Assets/Solid mood happy.png'),
    },
    {
      id: 2,
      title: 'Fear of outcome',
      image: require('../../../Assets/Solid mood neutral.png'),
    },
    {
      id: 3,
      title: 'Distraction',
      image: require('../../../Assets/Solid mood sad.png'),
    },
    {
      id: 4,
      title: 'Stress',
      image: require('../../../Assets/Solid mood depressed.png'),
    },
  ];
  return (
    <ImageBackground
      source={require('../../../Assets/LettingGoImage.png')}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 10 : 0 }}
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
                Letting Go
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.white,
                  textAlign: 'center',
                  marginTop: 10,
                  fontFamily: fonts.medium,
                  lineHeight: 26,
                }}
              >
                What do I release to move through today with ease?
              </Text>
              {/* <Text
                style={{
                  fontSize: 10,
                  color: Colors.white,
                  textAlign: 'center',
                  marginTop: 10,
                  fontFamily: fonts.bold,
                  lineHeight: 26,
                }}
              >
                {`(1-3 things is perfect)`}
              </Text> */}
            </View>

            {/* Subtitle */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp(7),
                marginHorizontal: wp(3),
              }}
            ></View>

            {/* Image */}
            {/* <Image
              source={images.jnlonboard2}
              resizeMode="contain"
              style={{
                width: wp(50),
                height: wp(50),
                alignSelf: 'center',
                marginVertical: wp(5),
              }}
            /> */}

            {/* Input Fields */}
            <View style={{ marginHorizontal: wp(2), marginTop: hp(5) }}>
              {data.map(item => (
                <TouchableOpacity
                  onPress={() => {
                    setLettingGo(item.title);
                    setShowInput(false);
                  }}
                  style={{
                    height: 70,
                    backgroundColor:
                      item.title == lettingGo ? '#BD2BAF' : '#BD2BAF33',
                    borderWidth: 1,
                    borderColor: '#BD2BAF',
                    borderRadius: 15,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20,
                    flexDirection: 'row',

                    //
                  }}
                >
                  <Text style={{ color: Colors.white, marginLeft: 20 }}>
                    {item.title}
                  </Text>
                  <Image
                    source={item.image}
                    resizeMode="contain"
                    style={{ width: 50, marginRight: 20, height: 50 }}
                  />
                </TouchableOpacity>
              ))}

              {/*  */}
            </View>
            {/* <Text
              style={{
                color: 'white',
                marginTop: 20,
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              This sets your mindset before the day begins
            </Text> */}
            {showInput ? (
              <TextInput
                placeholder="Write here"
                placeholderTextColor={'white'}
                value={otherValue}
                onChangeText={text => {
                  setOtherValue(text);
                  setLettingGo(text);
                }}
                textAlignVertical="top"
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: '#00000040',
                  paddingTop: 10,
                  paddingLeft: 10,
                  height: 75,
                  width: '90%',
                  alignSelf: 'center',
                  color: 'white',
                  borderRadius: 12,
                  marginTop: 20,
                }}
              />
            ) : null}
            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.btnView,
                {
                  backgroundColor: Colors.mainColor,
                  marginTop: wp(15),
                  marginBottom: wp(4),
                  alignSelf: 'center',
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

export default FormJournal2Half;
