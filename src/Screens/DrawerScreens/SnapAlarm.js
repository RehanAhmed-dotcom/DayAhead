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
  Modal,
  StyleSheet,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import SendIntentAndroid from 'react-native-send-intent';
import notifee, { AndroidNotificationSetting } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SnapAlarm = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [myAlarms, setMyAlarms] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  console.log('my alarmas', JSON.stringify(myAlarms));
  const [showModal, setShowModal] = useState(false);
  const [alarmId, setAlarmId] = useState(0);

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
      return true;
    }
    console.log('Second Console RUn');
    const settings = await notifee.getNotificationSettings();
    console.log('thi;rd', settings);
    if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
      console.log('Already granted');
      return true; // Already granted
    }
    console.log('No Granted');
    // Show explanation to user
    Alert.alert(
      'Permission Required',
      'For reliable snap alarms (even when app is closed or phone in Doze mode), please allow "Alarms & reminders" access.',
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
  };
  useFocusEffect(
    useCallback(() => {
      if (checkRequest) {
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
  const deleteAlarm = id => {
    const formData = new FormData();

    formData.append('id', id);
    setIsLoading(true);
    PostAPiwithToken({ url: 'delete-alaram', Token: user?.api_token }, formData)
      .then(res => {
        console.log('error in ddelete alarm', res);
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
  const renderRightActions = item => (
    <TouchableOpacity
      onPress={() => {
        setAlarmId(item.id);
        setShowModal(true);
      }}
      style={{
        backgroundColor: '#BD2BAF80',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(20),
        marginRight: 10,
        borderRadius: 16,
        marginBottom: 20,
      }}
    >
      <AntDesign name={'delete'} size={25} color={'red'} />
      <Text style={{ color: '#fff', marginTop: 5, fontFamily: fonts.bold }}>
        Delete
      </Text>
    </TouchableOpacity>
  );
  const renderAlarmItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
    >
      <TouchableOpacity
        disabled={true}
        activeOpacity={0.8}
        style={{
          marginBottom: 20,
          backgroundColor: '#BD2BAF80',
          width: '90%',
          alignSelf: 'center',
          borderRadius: 16,
        }}
      >
        {/* <ImageBackground
        source={item.status == 1 ? images.alarmImg : images.alarmImgoff}
        style={{ width: wp(90), height: hp(20), alignSelf: 'center' }}
        resizeMode="contain"
      > */}
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
                  ? ['#BD2BAF', '#BD2BAF']
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
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 5,
                  backgroundColor: 'transparent',
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
              </View>
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
        {/* </ImageBackground> */}
      </TouchableOpacity>
    </Swipeable>
  );
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
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
            // backgroundColor: '#FAFAFA',s
            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
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
            style={{ width: 80 }}
            onPress={() => navigation.openDrawer()}
          >
            <Image
              source={images.menuIcon}
              style={{ width: 26, height: 26 }}
              tintColor="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
            }}
          >
            Snap Alarms
          </Text>
          <TouchableOpacity
            style={{
              height: 50,
              width: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('SetAlarm')}
          >
            <Text
              style={{ color: 'white', fontSize: 10, fontFamily: fonts.medium }}
            >
              Add Snap
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {myAlarms.length < 0 ? (
            <View>
              <View>
                <Image
                  source={require('../../Assets/SleepOwl.png')}
                  resizeMode="contain"
                  style={{
                    width: wp(70),
                    height: wp(90),
                    backgroundColor: '#BD2BAF15',
                    alignSelf: 'center',
                  }}
                />
              </View>
              <View style={{ marginTop: wp(10) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    textAlign: 'center',
                  }}
                >
                  Welcome to snap alarm
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    textAlign: 'center',
                    lineHeight: 20,
                  }}
                >
                  If you want set an snap alarm {'\n'} click on add snap
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <FlatList
                data={myAlarms}
                inverted
                renderItem={renderAlarmItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: hp(2) }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </ScrollView>

        {/* Plus Button */}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('SetAlarm')}
          style={{ position: 'absolute', bottom: hp(8), right: wp(10) }}
        >
          <ImageBackground
            source={images.plusButton}
            style={{ width: wp(15), height: wp(15), justifyContent: 'center', alignItems: 'center' }}
            tintColor={Colors.mainColor}
            resizeMode="contain"
          >
            
            <AntDesign name={'plus'} size={22} color={Colors.white} />
          </ImageBackground>
        </TouchableOpacity> */}
        <Modal
          transparent
          animationType="fade"
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styless.overlay}>
            <View style={styless.container}>
              <Text style={styless.title}>Delete Snap sAlarm</Text>
              <Text style={styless.message}>
                Are you sure you want to delete this snap alarm?
              </Text>

              <View style={styless.buttonRow}>
                <TouchableOpacity
                  style={styless.cancelButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styless.cancelText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styless.confirmButton}
                  onPress={() => {
                    setShowModal(false);
                    deleteAlarm(alarmId);
                  }}
                >
                  <Text style={styless.confirmText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styless = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SnapAlarm;
