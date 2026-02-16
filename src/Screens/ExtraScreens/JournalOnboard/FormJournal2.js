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
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { AllGetAPI, PostAPiwithFrom } from '../../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
const FormJournal2 = ({ navigation, route }) => {
  const { gratitudedata } = route.params;
  console.log('Received gratitudedata:', gratitudedata);
  const user = useSelector(state => state.user.user);
  // Dynamic array for believes — starts empty, grows as user types
  const [believesdata, setBelievesdata] = useState([]);
  const [affirm, setAffirm] = useState('');
  console.log('my data', believesdata);
  useEffect(() => {
    AllGetAPI({ url: 'affirmation', Token: user?.api_token }).then(res => {
      // setBelievesdata()
      console.log('res', res);
      setBelievesdata(res.data);
    });
  }, []);
  // Update believes entry at specific index
  const updateBelieve = (text, index) => {
    setBelievesdata(prev => {
      const newData = [...prev];

      // Extend array if needed (e.g., typing in 3rd field first)
      while (newData.length <= index) {
        newData.push('');
      }

      newData[index] = text;
      return newData;
    });
  };

  // Handle Next button press
  const handleNext = () => {
    if (!affirm) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please choose one option.',
      });
      return;
    }
    // Filter out empty entries
    // const filledBelieves = believesdata
    //   .map(item => item.trim())
    //   .filter(item => item !== '');
    // const filledBelieves = believesdata.map(item => item.trim());

    // Navigate and pass both gratitude and believes data
    // navigation.navigate('FormJournal3', {
    //   gratitudedata, // from previous screen
    //   believesdata: filledBelieves, // newly collected, only non-empty
    // });
    navigation.navigate('FormJournal2Half', {
      gratitudedata, // from previous screen
      believesdata: affirm,
    });
  };
  const { top } = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('../../../Assets/Daily Affirmation.png')}
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
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 6 }, // push shadow down
            // shadowOpacity: 0.2,
            // shadowRadius: 3,
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
              width: 30,
              height: 30,
              borderRadius: 30,
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

            {/* Image */}
            {/* <Image
              source={images.jnlonboard3}
              resizeMode="contain"
              style={{
                width: wp(50),
                height: wp(50),
                alignSelf: 'center',
                marginTop: wp(5),
                marginVertical: wp(5),
              }}
            /> */}

            {/* Input Fields */}
            <View style={{ marginHorizontal: wp(2), marginTop: hp(25) }}>
              {believesdata?.map(item => (
                <TouchableOpacity
                  onPress={() => setAffirm(item.affirmation)}
                  style={{
                    width: '90%',
                    height: 50,
                    backgroundColor:
                      affirm == item.affirmation
                        ? Colors.mainColor
                        : '#00000066',
                    marginTop: 20,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: 'white' }}>{item.affirmation}</Text>
                </TouchableOpacity>
              ))}
              {/* <Input1
                placeholder="Write here..."
                value={believesdata[0] || ''}
                onChangeText={text => updateBelieve(text, 0)}
                type="default"
                showBorder
                inputColor="#00000066"
                color="white"
                labelColor="#212121"
                placeFontSize={16}
                maxLength={50}
              />

              <Input1
                placeholder="Write here..."
                value={believesdata[1] || ''}
                onChangeText={text => updateBelieve(text, 1)}
                type="default"
                showBorder
                inputColor="#00000066"
                color="white"
                labelColor="#212121"
                placeFontSize={16}
                maxLength={50}
                marginTop={wp(-2)}
              />

              <Input1
                placeholder="Write here..."
                value={believesdata[2] || ''}
                onChangeText={text => updateBelieve(text, 2)}
                type="default"
                showBorder
                inputColor="#00000066"
                color="white"
                labelColor="#212121"
                placeFontSize={16}
                maxLength={50}
                marginTop={wp(-2)}
              /> */}
            </View>

            {/* Next Button */}
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

export default FormJournal2;
