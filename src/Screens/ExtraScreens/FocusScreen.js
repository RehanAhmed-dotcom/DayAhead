import {
  View,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';

const FocusScreen = ({ navigation, route }) => {
  const { start_time, end_time, task_id } = route.params;
  const user = useSelector(state => state.user.user);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [endTimeLabel, setEndTimeLabel] = useState('');

  const parseTime = dateTimeStr => {
    // Example: "2026-11-02 12:30 PM"
    const [datePart, timePart, meridian] = dateTimeStr.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hourStr, minuteStr] = timePart.split(':');
    let hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (meridian === 'PM' && hour < 12) hour += 12;
    if (meridian === 'AM' && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute, 0);
  };

  useEffect(() => {
    const now = new Date(); // Local time of the device
    console.log('Local time:', now.toString());

    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Are you sure you want to leave? Your focus session will be lost.',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => setTaskIncomplete() },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // 🔹 LOAD DATA FROM DB
  useEffect(() => {
    const start = parseTime(start_time).getTime();
    const end = parseTime(end_time).getTime();
    const now = new Date().getTime();
    console.log({
      now: now,
      start_time: start_time,
      end_time: end_time,
    });
    console.log('Time::');
    console.log(new Date(start).toLocaleString());
    console.log(new Date(end).toLocaleString());
    console.log(new Date(now).toLocaleString());

    const total = Math.max(Math.floor((end - start) / 1000), 0);

    let remaining = 0;
    if (now < start) {
      remaining = total;
    } else if (now >= end) {
      remaining = 0;
    } else {
      remaining = Math.floor((end - now) / 1000);
    }

    setTotalSeconds(total);
    setRemainingSeconds(remaining);

    setEndTimeLabel(
      new Date(end).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    );
  }, []);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remainingSeconds]);

  // 🔹 TIME CALC
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const progress =
    totalSeconds > 0
      ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
      : 0;

  const setTaskIncomplete = () => {
    console.log(task_id);
    setIsLoading(true);
    const formdata = new FormData();
    console.log('task_id', task_id);
    formdata.append('task_id', task_id);
    PostAPiwithToken(
      { url: 'incomplete-task', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        console.log('response data-------', res);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          // navigation.goBack();
          navigation.navigate('Home');
          console.log('mydata', res);
        } else {
          setIsLoading(false);
          console.log(res);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        console.log('res of register ', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setTaskEnd = () => {
    const formdata = new FormData();

    formdata.append('task_id', task_id);
    setIsLoading(true);

    PostAPiwithToken({ url: 'end-task', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message || 'Task completed successfully!',
          });
          // navigation.goBack();
          navigation.navigate('Home');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Failed to complete task',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Complete task error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      });
  };

  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? top : 0 }}
      resizeMode="cover"
    >
      {isLoading && <Loader />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: wp(100),
            height: wp(25),
            backgroundColor: 'transparent',
            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            marginBottom: wp(3),
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          {isPaused && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
            }}
          >
            Focus Screen
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <View
          style={{
            marginHorizontal: wp(5),
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Timer */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: Colors.mainColor + 20,
                    borderColor: Colors.mainColor,
                    borderWidth: 1,
                    borderRadius: wp(3),
                    width: wp(25),
                    height: wp(35),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: Colors.white, fontSize: wp(16) }}>
                    {String(hours).padStart(2, '0')}
                  </Text>
                </View>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: wp(3),
                    marginTop: 12,
                  }}
                >
                  HOURS
                </Text>
              </View>
              <Text style={{ color: Colors.white, fontSize: wp(16) }}>:</Text>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: Colors.mainColor + 20,
                    borderColor: Colors.mainColor,
                    borderWidth: 1,
                    borderRadius: wp(3),
                    width: wp(25),
                    height: wp(35),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: Colors.white, fontSize: wp(16) }}>
                    {String(minutes).padStart(2, '0')}
                  </Text>
                </View>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: wp(3),
                    marginTop: 12,
                  }}
                >
                  MINUTES
                </Text>
              </View>
              <Text style={{ color: Colors.white, fontSize: wp(16) }}>:</Text>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: Colors.mainColor + 20,
                    borderColor: Colors.mainColor,
                    borderWidth: 1,
                    borderRadius: wp(3),
                    width: wp(25),
                    height: wp(35),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: Colors.white, fontSize: wp(16) }}>
                    {String(seconds).padStart(2, '0')}
                  </Text>
                </View>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: wp(3),
                    marginTop: 12,
                  }}
                >
                  SECONDS
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: Colors.white,
                fontSize: wp(4),
                textAlign: 'center',
                marginTop: wp(6),
                fontFamily: fonts.bold,
              }}
            >
              Focusing until {endTimeLabel}
            </Text>
          </View>

          {/* Progress */}
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: wp(4),
                  textAlign: 'center',
                  marginTop: wp(6),
                  fontFamily: fonts.bold,
                }}
              >
                Task Progress
              </Text>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: wp(4),
                  textAlign: 'center',
                  marginTop: wp(6),
                  fontFamily: fonts.bold,
                }}
              >
                {Math.round(progress)}%
              </Text>
            </View>
            <View
              style={{
                height: wp(1),
                backgroundColor: Colors.white + 30,
                borderRadius: 50,
                // overflow: 'hidden',
              }}
            >
              <Text
                style={{
                  height: wp(1),
                  width: `${progress}%`,
                  backgroundColor: Colors.white,
                  borderRadius: 50,
                }}
              ></Text>
            </View>
            <View
              style={{
                marginTop: 50,
              }}
            >
              {remainingSeconds !== 0 ? (
                <TouchableOpacity
                  onPress={() => setIsPaused(prev => !prev)}
                  style={{
                    backgroundColor: Colors.mainColor + 20,
                    borderRadius: 10,
                    alignContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: fonts.bold,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignContent: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      width: wp(40),
                    }}
                  >
                    <AntDesign
                      name={isPaused ? 'caretright' : 'pause'}
                      size={20}
                      color={Colors.white}
                    />{' '}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={setTaskEnd}
                  style={{
                    backgroundColor: Colors.mainColor,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: fonts.bold,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      width: wp(40),
                      textAlign: 'center',
                    }}
                  >
                    End Task
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default FocusScreen;
