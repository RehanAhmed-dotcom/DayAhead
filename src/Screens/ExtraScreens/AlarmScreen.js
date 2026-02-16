// import {
//   View,
//   Text,
//   ImageBackground,
//   Image,
//   KeyboardAvoidingView,
//   StatusBar,
//   Platform,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
// } from 'react-native';
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { Colors, fonts, images, styles } from '../../Constant/Index';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import ImagePicker from 'react-native-image-crop-picker'; // Import the library
// import { useRoute } from '@react-navigation/native';
// import notifee from '@notifee/react-native';
// import FastImage from 'react-native-fast-image';
// const AlarmScreen = ({ navigation }) => {
//   const route = useRoute();
//   const [alarmData, setAlarmData] = useState(route.params?.alarm || null);
//   const [image, setImage] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const loopIntervalRef = useRef(null);
//   console.log('Alarm new data', route.params?.alarm);
//   useEffect(() => {
//     if (route.params?.alarm) {
//       setAlarmData(route.params.alarm);
//     }
//   }, [route.params?.alarm]);

//   const repeatText = useMemo(() => {
//     if (!alarmData?.repeat || alarmData.repeat.length === 0) {
//       return 'One time alarm';
//     }
//     return `Repeats on ${alarmData.repeat.join(', ')}`;
//   }, [alarmData]);

//   const playAlarmNotification = useCallback(() => {
//     notifee.displayNotification({
//       id: `alarm-loop-${alarmData?.id ?? 'manual'}`,
//       title: alarmData?.title || 'Snap Alarm',
//       body: alarmData?.time
//         ? `It is ${alarmData.time} — selfie to stop`
//         : 'Selfie to stop this alarm',
//       data: { type: 'snapAlarmLoop' },
//       android: {
//         channelId: 'alarm2',
//         sound: 'alarm',
//         pressAction: { id: 'default' },
//       },
//       ios: {
//         sound: 'default',
//       },
//     });
//   }, [alarmData]);
//   const convertImageToBase64 = async url => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();

//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           // Remove the data:image/jpeg;base64, prefix
//           const base64 = reader.result.split(',')[1];
//           resolve(base64);
//         };
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });
//     } catch (error) {
//       console.error('Error converting image to base64:', error);
//       throw new Error('Failed to convert image to base64');
//     }
//   };
//   const startLoopingAlarm = useCallback(() => {
//     if (loopIntervalRef.current) {
//       return;
//     }
//     playAlarmNotification();
//     loopIntervalRef.current = setInterval(() => {
//       playAlarmNotification();
//     }, 6000);
//   }, [playAlarmNotification]);

//   const stopLoopingAlarm = useCallback(async () => {
//     if (loopIntervalRef.current) {
//       clearInterval(loopIntervalRef.current);
//       loopIntervalRef.current = null;
//     }
//     try {
//       await notifee.cancelNotification(
//         `alarm-loop-${alarmData?.id ?? 'manual'}`,
//       );
//     } catch (error) {
//       console.log('stop loop alarm error', error);
//     }
//   }, [alarmData]);

//   useEffect(() => {
//     startLoopingAlarm();
//     return () => {
//       stopLoopingAlarm();
//     };
//   }, [startLoopingAlarm, stopLoopingAlarm]);

//   const openCamera = () => {
//     ImagePicker.openCamera({
//       useFrontCamera: true, // Use front camera for selfie
//       cropping: true, // Enable cropping (optional; set to false if not needed)
//       width: 300, // Crop to this width (adjust as needed)
//       height: 400, // Crop to this height (adjust for aspect ratio)
//       cropperCircleOverlay: false, // Set to true for circular crop mask (selfie-friendly)
//       compressImageMaxWidth: 1024, // Optional: Compress for smaller file size
//       compressImageMaxHeight: 1024,
//       compressImageQuality: 0.8, // 0-1 scale
//     })
//       .then(image => {
//         console.log('Selfie captured:', image);
//         setImage(image.path);
//         setModalVisible(true);
//         stopLoopingAlarm();
//       })
//       .catch(error => {
//         console.log('Camera error:', error);
//         // Handle errors (e.g., user cancelled or permission denied)
//       });
//   };

//   return (
//     <FastImage
//       source={image ? { uri: image } : images.myalarmbg}
//       style={{ flex: 1, paddingTop: 20 }}
//       resizeMode={image ? 'contain' : 'cover'}
//     >
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
//       >
//         <StatusBar
//           translucent
//           backgroundColor={'transparent'}
//           barStyle={'light-content'}
//         />
//         {!image ? (
//           <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: 'space-evenly',
//                 alignItems: 'center',
//               }}
//             >
//               {/* <Image
//                 source={images.whiteLogo}
//                 style={{ width: wp(40), height: wp(40), alignSelf: 'center' }}
//                 resizeMode="contain"
//               /> */}
//               <View>
//                 <Text
//                   style={{
//                     fontSize: 22,
//                     fontFamily: fonts.bold,
//                     color: Colors.white,
//                     textAlign: 'center',
//                   }}
//                 >
//                   {alarmData?.title || 'Rise and Shine!'}
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 44,
//                     fontFamily: fonts.bold,
//                     color: Colors.white,
//                     textAlign: 'center',
//                   }}
//                 >
//                   {alarmData?.time || '05:30 AM'}
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontFamily: fonts.medium,
//                     color: Colors.white,
//                     textAlign: 'center',
//                     marginTop: wp(2),
//                   }}
//                 >
//                   {repeatText}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: 'transparent',
//                   width: wp(90),
//                   height: wp(13),
//                   borderRadius: wp(10),
//                   alignSelf: 'center',
//                   marginTop: wp(30),
//                   borderWidth: 1,
//                   borderColor: Colors.white,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//                 onPress={openCamera}
//               >
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontFamily: fonts.bold,
//                     color: Colors.white,
//                   }}
//                 >
//                   Take selfie, stop alarm
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         ) : null}

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'flex-end',
//               alignItems: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               paddingBottom: wp(5),
//             }}
//           >
//             <View
//               style={{
//                 backgroundColor: '#BD2BAF33',
//                 borderRadius: 10,
//                 padding: wp(5),
//                 width: wp(90),
//                 alignItems: 'center',
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 16,
//                   fontFamily: fonts.bold,
//                   color: Colors.white,
//                   marginBottom: wp(4),
//                   textAlign: 'center',
//                   lineHeight: 22,
//                 }}
//               >
//                 Send your selfie image to AI
//               </Text>

//               <TouchableOpacity
//                 style={{
//                   marginTop: wp(4),
//                   paddingVertical: wp(2),
//                   paddingHorizontal: wp(5),
//                   backgroundColor: Colors.mainColor,
//                   borderRadius: wp(8),
//                   width: wp(80),
//                   height: wp(13),
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//                 onPress={() => {
//                   // navigation.navigate('ShareWithMembers', {
//                   //   image: image,
//                   //   alarmData: alarmData,
//                   // }),
//                   navigation.navigate('AllSetAlarm'), setModalVisible(false);
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontFamily: fonts.bold,
//                     color: Colors.white,
//                   }}
//                 >
//                   Send
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </KeyboardAvoidingView>
//     </FastImage>
//   );
// };

// export default AlarmScreen;
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
  Alert,
  ActivityIndicator,
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
import { PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import { OPEN_AI_KEY } from '../../Components/OpenAi_Key';
import axios from 'axios';
import Toast from 'react-native-toast-message';
const AlarmScreen = ({ navigation }) => {
  const route = useRoute();
  const user = useSelector(state => state.user.user);

  const [base64Image, setBase64Image] = useState('');
  const [alarmData, setAlarmData] = useState(route.params?.alarm || null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
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

  const uploadImage = async imagePath => {
    setIsLoading(true);
    setVerifyModalVisible(true);
    const formData = new FormData();
    formData.append('file', {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    console.log('Image', imagePath);
    try {
      const res = await PostAPiwithToken(
        { url: 'upload-files', Token: user.api_token },
        formData,
      );
      console.log('Result:', res?.data);
      const imageUrl = res?.data;
      const base64 = await convertImageToBase64(imageUrl);
      const result = await analyzeImage(base64, OPEN_AI_KEY);
      if (result.toLowerCase() === 'true') {
        console.log('Analysis Result: True');

        navigation.navigate('AllSetAlarm');
      } else {
        console.log('Analysis Result: False');

        setErrorModalVisible(true);
        // Alert.alert(
        //   'Error',
        //   'The image doesn’t match your alarm. Please retake the photo.',
        //   [
        //     {
        //       text: 'OK',
        //       onPress: () => {
        //         startLoopingAlarm();
        //         openCamera();
        //       },
        //     },
        //   ],
        //   { cancelable: false },
        // );
      }
    } catch (err) {
      console.log('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const convertImageToBase64 = async url => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to convert image to base64');
    }
  };
  const analyzeImage = async (base64Image, apiKey) => {
    // console.log(alarmData.title);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4.1-nano',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant named DayAhead.
              Your sole responsibility is to verify whether a user is performing the activity described in an alarm title, based only on a provided image.
              The user will provide:
              One image
              One alarm title describing an expected activity

              Your task is to:
              Analyze the image for visible actions, objects, and context.
              Determine whether the activity shown in the image clearly matches the activity described in the alarm title.
              
              Response rules (must be followed strictly):
              Respond with only one word: True or False.
              True → the image clearly shows the activity described in the alarm title.
              False → the activity does not match, is unclear, or cannot be verified.
              Do not provide explanations, comments, or additional text.
              Do not infer or assume information not visibly present in the image.
              Any uncertainty must result in False.`,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `My alarm title is ${alarmData.title}`,
                  // text: `My alarm title is coding`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                    detail: 'auto',
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 seconds timeout for image analysis
        },
      );

      const result = response.data.choices[0].message.content;
      return result;
    } catch (error) {
      console.error(
        'Axios error details:',
        error.response?.data || error.message,
      );

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const errorMessage =
            error.response.data?.error?.message || 'Unknown API error';
          throw new Error(`API Error: ${errorMessage}`);
        } else if (error.request) {
          // Request made but no response received
          throw new Error(
            'No response received from API. Please check your internet connection.',
          );
        } else {
          // Something happened in setting up the request
          throw new Error(`Request setup error: ${error.message}`);
        }
      } else {
        throw error;
      }
    }
  };

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
        // setImage(image.path);
        uploadImage(image.path);
        // setModalVisible(true);
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
      resizeMode={image ? 'contain' : 'cover'}
    >
      {isLoading && <Loader />}

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
                  Take selfie, stop alarm
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
                Send your selfie image to dayAhead AI
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
                  // navigation.navigate('ShareWithMembers', {
                  //   image: image,
                  //   alarmData: alarmData,
                  // });

                  uploadImage();
                  console.log('pressed');
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
        <Modal transparent={true} visible={verifyModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#111',
              paddingBottom: wp(5),
            }}
          >
            <ActivityIndicator size="large" color={Colors.mainColor} />
            <Text style={{ color: Colors.white }}>Verifying Image</Text>
          </View>
        </Modal>
        <Modal transparent={true} visible={successModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#111',
              paddingBottom: wp(5),
            }}
          >
            <ActivityIndicator size="large" color={Colors.mainColor} />
            <Text
              style={{ color: Colors.white, width: '80%', textAlign: 'center' }}
            >
              Tas
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.mainColor,
                width: wp(70),
                height: wp(13),
                borderRadius: 12,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
              }}
              onPress={() => {
                setErrorModalVisible(false);
                startLoopingAlarm();
                openCamera();
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                }}
              >
                Retake Image
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal transparent={true} visible={errorModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#111',
              paddingBottom: wp(5),
            }}
          >
            <ActivityIndicator size="large" color={Colors.mainColor} />
            <Text
              style={{ color: Colors.white, width: '80%', textAlign: 'center' }}
            >
              The image doesn’t match your alarm. Please retake the photo.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.mainColor,
                width: wp(70),
                height: wp(13),
                borderRadius: 12,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
              }}
              onPress={() => {
                setErrorModalVisible(false);
                startLoopingAlarm();
                openCamera();
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                }}
              >
                Retake Image
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </FastImage>
  );
};

export default AlarmScreen;
