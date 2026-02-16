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
} from 'react-native';
import React, { useState } from 'react';
import { Colors, fonts, images, styles } from '../../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainButton from '../../../Components/MainButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const FormJournal4 = ({ navigation, route }) => {
  const { gratitudedata, believesdata, lettingGo, goals } = route.params;
  const [oneStep, setOneStep] = useState('');
  const [lettingGo1, setLettingGo1] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [otherValue, setOtherValue] = useState('');
  const { top } = useSafeAreaInsets();
  const data = [
    {
      id: 1,
      title: 'Calm',
      image: require('../../../Assets/Group 1272628626.png'),
    },
    {
      id: 2,
      title: 'Energized',
      image: require('../../../Assets/34468531.png'),
    },
    {
      id: 3,
      title: 'Present',
      image: require('../../../Assets/Group.png'),
    },
    {
      id: 4,
      title: 'Confident',
      image: require('../../../Assets/34468531.png'),
    },
  ];

  const handleNext = () => {
    if (!lettingGo1) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please choose one option or write your thoughts.',
      });
      return;
    }

    navigation.navigate('FormJournal6', {
      gratitudedata,
      believesdata,
      goals,
      lettingGo,
      oneStep: lettingGo1,
    });
  };
  return (
    <ImageBackground
      source={require('../../../Assets/LettingGo1.png')}
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
                How I want to feel today
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
                What do I release to move through today with ease?
              </Text>
            </View>
            {data.map(item => (
              <TouchableOpacity
                onPress={() => {
                  setLettingGo1(item.title);
                  setShowInput(false);
                }}
                style={{
                  height: 70,
                  backgroundColor:
                    item.title == lettingGo1 ? '#BD2BAF' : '#BD2BAF33',
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

            {showInput ? (
              <TextInput
                placeholder="Write here"
                placeholderTextColor={'white'}
                value={otherValue}
                onChangeText={text => {
                  setOtherValue(text);
                  setLettingGo1(text);
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
                  borderRadius: 10,
                  marginTop: 20,
                }}
              />
            ) : null}
            {/* </View> */}

            <TouchableOpacity
              onPress={handleNext}
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default FormJournal4;
