import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import SwitchToggle from 'react-native-switch-toggle';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import { setup, scheduleAlarmForItem, cancelAlarmById } from '../Notifee';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign'
import SendIntentAndroid from 'react-native-send-intent';
import notifee, { AndroidNotificationSetting } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SnapAlarm = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [myAlarms, setMyAlarms] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  console.log('my alarmas', JSON.stringify(myAlarms))
  // Har 30 second mein update karega time left
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setRefresh(prev => prev + 1), 30000);
    return () => clearInterval(interval);
  }, []);


  // YEH SABSE IMPORTANT FUNCTION HAI - Perfect Time Left Nikalta Hai
  // Sirf ek hi baar declare kar rahe hain
  const getNextAlarmTimeLeft = (timeStr, repeatDays) => {
    if (!repeatDays || repeatDays.length === 0) return 'One time';

    // Step 1: "4:30 PM" ya "09:15 AM" ko parse karo
    const trimmed = timeStr.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/i);
    if (!match) return 'Invalid time';

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3] ? match[3].toUpperCase() : '';

    // 12-hour to 24-hour conversion
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const now = new Date();
    const today = now.getDay();

    const dayMap = {
      sun: 0,
      sunday: 0,
      mon: 1,
      monday: 1,
      tue: 2,
      tuesday: 2,
      wed: 3,
      wednesday: 3,
      thu: 4,
      thursday: 4,
      thr: 4,
      fri: 5,
      friday: 5,
      sat: 6,
      saturday: 6,
    };

    let candidates = [];

    repeatDays.forEach(dayStr => {
      const key = dayStr.trim().toLowerCase().slice(0, 3);
      const targetDay = dayMap[key];
      if (targetDay === undefined) return;

      // Kitne din aage hai ye day?
      let daysAhead = (targetDay - today + 7) % 7;

      const candidate = new Date();
      candidate.setDate(now.getDate() + daysAhead);
      candidate.setHours(hours, minutes, 0, 0);

      // Agar aaj ka din hai aur time guzar chuka hai → agle hafte ka le lo
      if (daysAhead === 0 && candidate <= now) {
        candidate.setDate(candidate.getDate() + 7);
      }

      candidates.push(new Date(candidate));
    });

    if (candidates.length === 0) return 'No repeat';

    // Sabse jaldi wala alarm chuno
    const nextAlarm = candidates.sort((a, b) => a - b)[0];
    const diffMs = nextAlarm - now;
    const totalMinutes = Math.floor(diffMs / 60000);

    if (totalMinutes <= 0) return 'Ringing now!';

    const days = Math.floor(totalMinutes / 1440);
    const remainingMins = totalMinutes % 1440;
    const h = Math.floor(remainingMins / 60);
    const m = remainingMins % 60;

    if (days === 0) {
      if (h === 0) return `${m}m`;
      return `${h}h ${m}m`;
    }
    if (days === 1) return 'Tomorrow';
    if (days <= 6) return `In ${days} days`;

    return `${days} days`;
  };
  const getAllAlarms = () => {
    setIsLoading(true);
    AllGetAPI({
      url: 'view-all-alaram',
      Token: user?.api_token,
    })
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          setMyAlarms(res.data);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    setup();
  }, []);
  const checkAndRequestExactAlarmPermission = async () => {
    console.log('Function Run');
    if (Platform.OS !== 'android') {
      console.log('No This is Android Device');
      return true
    };
    console.log('Second Console RUn');
    const settings = await notifee.getNotificationSettings();
    console.log("thi;rd",settings)
    if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
      console.log('Already granted');
      return true; // Already granted   
    }
    console.log('No Granted');
    // Show explanation to user   
    Alert.alert('Permission Required', 'For reliable snap alarms (even when app is closed or phone in Doze mode), please allow "Alarms & reminders" access.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: async () => {
            await notifee.openAlarmPermissionSettings();
          },
        },
      ],
    );
    return false;
  };
  const checkRequest = async () => {
    const settings = notifee.getNotificationSettings();
    if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
      return true;
    }
    return false;
  }
  useFocusEffect(
    useCallback(() => {
      if(checkRequest){
        getAllAlarms();
      }
      checkAndRequestExactAlarmPermission();
    }, []),
  );

  const activeAlarms = useMemo(
    () => myAlarms.filter(item => item.status == 1),
    [myAlarms],
  );

  useEffect(() => {
    activeAlarms.forEach(alarm => {
      scheduleAlarmForItem(alarm).catch(err =>
        console.log('schedule error', err),
      );
    });
  }, [activeAlarms]);

  const toggleAlarm = async (id, currentStatus) => {
    const alarm = myAlarms.find(a => a.id === id);
    if (!alarm) {
      return;
    }

    try {
      if (currentStatus === 0) {
        await scheduleAlarmForItem(alarm);
      } else {
        await cancelAlarmById(id);
      }
    } catch (error) {
      console.log('toggle schedule error', error);
    }

    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('status', currentStatus == 1 ? 0 : 1);
    setIsLoading(true);
    PostAPiwithToken(
      { url: 'alaram-status-change', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          getAllAlarms();
          Toast.show({ type: 'success', text1: 'Success', text2: res.message });
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: res.message });
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const renderAlarmItem = ({ item }) => (
    <TouchableOpacity
      disabled={true}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={item.status == 1 ? images.alarmImg : images.alarmImgoff}
        style={{ width: wp(90), height: hp(20), alignSelf: 'center' }}
        resizeMode="contain"
      >
        <View
          style={{ justifyContent: 'space-between', padding: wp(7), flex: 1 }}
        >
          {/* Title + Switch */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.white,
              }}
            >
              {item.title}
            </Text>
            <LinearGradient
              colors={
                item.status == 1
                  ? ['#C847F4', '#2CA57B']
                  : ['#CCCCCC', '#CCCCCC']
              }
              style={{
                width: wp(13),
                height: wp(7),
                borderRadius: wp(6),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SwitchToggle
                switchOn={item.status == 1}
                onPress={() => toggleAlarm(item.id, item.status)}
                circleColorOff="#FFFFFF"
                circleColorOn="#FFFFFF"
                backgroundColorOn="transparent"
                backgroundColorOff="#CCCCCC"
                containerStyle={{
                  width: wp(12),
                  height: wp(7),
                  borderRadius: wp(6),
                }}
                circleStyle={{
                  width: wp(6),
                  height: wp(6),
                  borderRadius: wp(5),
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
              />
            </LinearGradient>
          </View>

          {/* Time */}
          <Text
            style={{
              fontSize: 26,
              fontFamily: fonts.bold,
              color: Colors.white,
            }}
          >
            {item.time}
          </Text>

          {/* Days + Time Left */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(80),
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: wp(60),
                justifyContent: 'flex-start',
              }}
            >
              {item.repeat?.map((day, i) => (
                <Text
                  key={i}
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    marginRight: 8,
                  }}
                >
                  {day.trim().slice(0, 3)},
                </Text>
              ))}
            </View>

            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                color: Colors.white,
                textAlign: 'center',
                minWidth: wp(20),
              }}
            >
              {item.status == 1
                ? getNextAlarmTimeLeft(item.time, item.repeat)
                : 'Off'}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 35 : 0, }}
      resizeMode="cover"
    >
      {isloading && <Loader />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
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
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 3,

          }}
        >
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
            }}
          >
            Snap Alarms
          </Text>
          <View />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {myAlarms.length < 0 ? (
            <View>
              <View>
                <Image
                  source={require('../../Assets/completesub.png')}
                  resizeMode="contain"
                  style={{ width: wp(70), height: wp(90), alignSelf: 'center' }}
                />
              </View>
              <View style={{ marginTop: wp(10) }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black, textAlign: 'center' }}>Welcome to snap alarm</Text>
                <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black, textAlign: 'center', lineHeight: 20 }}>If you want set an snap alarm {'\n'} click on plus button</Text>
              </View>
            </View>
          ) : (
            <View>
              <FlatList
                data={myAlarms}
                inverted
                renderItem={renderAlarmItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: hp(5) }}
                showsVerticalScrollIndicator={false}
              />

              <Text
                style={{
                  fontSize: 22,
                  fontFamily: fonts.medium,
                  color: 'black',
                  textAlign: 'center',
                  marginTop: hp(5),
                }}
              >
                Your selfie is the snooze{'\n'}button
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Plus Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SetAlarm')}
          style={{ position: 'absolute', bottom: hp(8), right: wp(10) }}
        >
          <ImageBackground
            source={images.plusButton}
            style={{ width: wp(15), height: wp(15), justifyContent: 'center', alignItems: 'center' }}
            tintColor={Colors.mainColor}
            resizeMode="contain"
          >
            {/* <Text style={{fontSize: 24, fontFamily: fonts.bold, color:Colors.white, textAlign: 'center'}}>+</Text> */}
            <AntDesign name={'plus'} size={22} color={Colors.white} />
          </ImageBackground>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SnapAlarm;
