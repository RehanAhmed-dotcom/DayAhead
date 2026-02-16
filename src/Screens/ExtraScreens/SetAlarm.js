import {
  View,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainButton from '../../Components/MainButton';
import Input from '../../Components/Input/Index';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Input1 from '../../Components/Input1';
const SetAlarm = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [showAlarm, setShowAlarm] = useState(false);
  const [AlarmName, setAlarmName] = useState('');
  const [selectedTime, setSelectedTime] = useState(''); // Stores "7:30 PM"
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log('my time', selectedTime);
  useEffect(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];

    setSelectedDays([today]);
  }, []);
  // Convert Date → "7:30 PM" format
  const handleConfirm = date => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 → 12
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const time12 = `${hours}:${minutes} ${ampm}`;
    setSelectedTime(time12); // Saves exactly "7:30 PM"
    hideTimePicker();
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const toggleDay = day => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const CreateAlarmApi = () => {
    // Validation
    // if (selectedDays.filter(day => day).length === 0) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Error',
    //     text2: 'At least one day is required',
    //     topOffset: Platform.OS === 'ios' ? 20 : 0,
    //     visibilityTime: 3000,
    //     autoHide: true,
    //   });
    //   return;
    // }
    if (!AlarmName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Alarm Name is required',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (!selectedTime) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Time is required',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const formdata = new FormData();

    formdata.append('title', AlarmName);
    selectedDays.forEach(days => formdata.append('repeat[]', days));
    formdata.append('time', selectedTime);

    setIsLoading(true);
    PostAPiwithToken({ url: 'add-alaram', Token: user?.api_token }, formdata)
      .then(res => {
        console.log('Alarm created: dfdfdefd', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          setShowAlarm(true);
          setTimeout(() => {
            setShowAlarm(false);
            navigation.goBack();
          }, 4000);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err.message,
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };

  const translateXValue = useSharedValue(0);

  useEffect(() => {
    if (showAlarm) {
      translateXValue.value = withSequence(
        withTiming(-20, { duration: 1200 }),
        withTiming(20, { duration: 1200 }),
        withTiming(-15, { duration: 1200 }),
        withTiming(15, { duration: 1200 }),
        withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        }),
      );
    }
  }, [showAlarm]);

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXValue.value }],
    };
  });
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
      resizeMode="cover"
    >
      {isLoading && <Loader />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
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
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
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
            Set Alarm
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: wp(20) }}>
          {/* Alarm Name */}
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: wp(5),
              // elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}
          >
            <Input1
              // label="Alarm Name"
              placeholder="e.g. Wake Up, Gym"
              value={AlarmName}
              onChangeText={setAlarmName}
              // showBorder
              inputColor="#00000066"
              labelColor="#333"
              color="white"
            />
          </View>

          {/* Time Display */}
          <View style={{ marginTop: wp(12), alignItems: 'center' }}>
            {/* <Text
              style={{
                color: '#333',
                fontFamily: fonts.medium,
                fontSize: 16,
                marginBottom: wp(4),
              }}
            >
              Select Time
            </Text> */}

            <TouchableOpacity
              onPress={showTimePicker}
              style={{
                width: wp(85),
                height: wp(30),
                backgroundColor: '#00000070',
                borderRadius: wp(5),
                justifyContent: 'center',
                alignItems: 'center',
                // elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                  letterSpacing: 2,
                }}
              >
                {selectedTime || 'Tap to set'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Repeat Days */}
          <View>
            <Text
              style={{
                color: Colors.white,
                fontFamily: fonts.medium,
                fontSize: 16,
                marginLeft: wp(5),
                marginTop: wp(15),
              }}
            >
              Repeat
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: wp(5),
              marginTop: wp(3),
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <View
                key={day}
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    width: wp(10),
                    height: wp(8),
                    borderRadius: 8,
                    backgroundColor: selectedDays.includes(day)
                      ? Colors.mainColor
                      : '#BD2BAF15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: wp(1),
                  }}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.white,
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Set Alarm Button */}
          <View style={{ marginTop: wp(25), marginHorizontal: wp(5) }}>
            <MainButton title="Set Alarm" onPress={CreateAlarmApi} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        transparent={true}
        visible={showAlarm}
        animationType="fade"
        onRequestClose={() => {
          setShowAlarm(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animated.View style={animatedStyle2}>
            <View
              style={{
                backgroundColor: '#00000070',
                borderRadius: 50,
                padding: wp(8),
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 15,
              }}
            >
              <Image
                source={require('../../Assets/Complete.png')}
                style={{
                  width: wp(60),
                  height: wp(60),
                  resizeMode: 'contain',
                }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
      {/* Time Picker */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        confirmTextIOS="Done"
        cancelTextIOS="Cancel"
        headerTextIOS="Pick Alarm Time"
      />
    </ImageBackground>
  );
};

export default SetAlarm;
