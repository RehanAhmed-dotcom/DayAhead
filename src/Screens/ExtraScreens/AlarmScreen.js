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
  Modal,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker'; // Import the library
import { useRoute } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import FastImage from 'react-native-fast-image';
const AlarmScreen = ({ navigation }) => {
  const route = useRoute();
  const [alarmData, setAlarmData] = useState(route.params?.alarm || null);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const loopIntervalRef = useRef(null);

  useEffect(() => {
    if (route.params?.alarm) {
      setAlarmData(route.params.alarm);
    }
  }, [route.params?.alarm]);

  const repeatText = useMemo(() => {
    if (!alarmData?.repeat || alarmData.repeat.length === 0) {
      return 'One time alarm';
    }
    return `Repeats on ${alarmData.repeat.join(', ')}`;
  }, [alarmData]);

  const playAlarmNotification = useCallback(() => {
    notifee.displayNotification({
      id: `alarm-loop-${alarmData?.id ?? 'manual'}`,
      title: alarmData?.title || 'Snap Alarm',
      body: alarmData?.time
        ? `It is ${alarmData.time} — selfie to stop`
        : 'Selfie to stop this alarm',
      data: { type: 'snapAlarmLoop' },
      android: {
        channelId: 'alarm2',
        sound: 'alarm',
        pressAction: { id: 'default' },
      },
      ios: {
        sound: 'default',
      },
    });
  }, [alarmData]);

  const startLoopingAlarm = useCallback(() => {
    if (loopIntervalRef.current) {
      return;
    }
    playAlarmNotification();
    loopIntervalRef.current = setInterval(() => {
      playAlarmNotification();
    }, 6000);
  }, [playAlarmNotification]);

  const stopLoopingAlarm = useCallback(async () => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    try {
      await notifee.cancelNotification(
        `alarm-loop-${alarmData?.id ?? 'manual'}`,
      );
    } catch (error) {
      console.log('stop loop alarm error', error);
    }
  }, [alarmData]);

  useEffect(() => {
    startLoopingAlarm();
    return () => {
      stopLoopingAlarm();
    };
  }, [startLoopingAlarm, stopLoopingAlarm]);

  const openCamera = () => {
    ImagePicker.openCamera({
      useFrontCamera: true, // Use front camera for selfie
      cropping: true, // Enable cropping (optional; set to false if not needed)
      width: 300, // Crop to this width (adjust as needed)
      height: 400, // Crop to this height (adjust for aspect ratio)
      cropperCircleOverlay: false, // Set to true for circular crop mask (selfie-friendly)
      compressImageMaxWidth: 1024, // Optional: Compress for smaller file size
      compressImageMaxHeight: 1024,
      compressImageQuality: 0.8, // 0-1 scale
    })
      .then(image => {
        console.log('Selfie captured:', image);
        setImage(image.path);
        setModalVisible(true);
        stopLoopingAlarm();
      })
      .catch(error => {
        console.log('Camera error:', error);
        // Handle errors (e.g., user cancelled or permission denied)
      });
  };

  return (
    <FastImage
      source={image ? { uri: image } : images.myalarmbg}
      style={{ flex: 1, paddingTop: 20 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        {!image ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              {/* <Image
                source={images.whiteLogo}
                style={{ width: wp(40), height: wp(40), alignSelf: 'center' }}
                resizeMode="contain"
              /> */}
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                    textAlign: 'center',
                  }}
                >
                  {alarmData?.title || 'Rise and Shine!'}
                </Text>
                <Text
                  style={{
                    fontSize: 44,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                    textAlign: 'center',
                  }}
                >
                  {alarmData?.time || '05:30 AM'}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    textAlign: 'center',
                    marginTop: wp(2),
                  }}
                >
                  {repeatText}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'transparent',
                  width: wp(90),
                  height: wp(13),
                  borderRadius: wp(10),
                  alignSelf: 'center',
                  marginTop: wp(30),
                  borderWidth: 1,
                  borderColor: Colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={openCamera}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Selfie to Stop
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingBottom: wp(5),
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                padding: wp(5),
                width: wp(90),
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  marginBottom: wp(4),
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                Send your selfie image to your friends/memebers
              </Text>

              <TouchableOpacity
                style={{
                  marginTop: wp(4),
                  paddingVertical: wp(2),
                  paddingHorizontal: wp(5),
                  backgroundColor: Colors.mainColor,
                  borderRadius: wp(8),
                  width: wp(80),
                  height: wp(13),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  navigation.navigate('ShareWithMembers', { image: image , alarmData: alarmData }),
                    setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Save Alarm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </FastImage>
  );
};

export default AlarmScreen;
