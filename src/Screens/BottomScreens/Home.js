import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import messaging from '@react-native-firebase/messaging';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto'; // ← ADDED
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useFocusEffect } from '@react-navigation/native';
import { setup } from '../Notifee';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setUser } from '../../Redux/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AheadChallengeModal from '../../Components/AheadChallengeModal';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ImageCropPicker from 'react-native-image-crop-picker';
import MainButton from '../../Components/MainButton';
import Toast from 'react-native-toast-message';

// ── Animated Task Item ──
const TaskItem = ({ item, navigation, onCompletePress }) => {
  const isCompleted = item.status === 'Completed';
  const isPending = item.status === 'Pending';
 



  const translateXValue = useSharedValue(0);

  useEffect(() => {
    if (isCompleted) {
      translateXValue.value = withSequence(
        withTiming(-20, { duration: 800 }),
        withTiming(20, { duration: 800 }),
        withTiming(-15, { duration: 800 }),
        withTiming(15, { duration: 800 }),
        withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) })
      );
    }else if(isPending){
      translateXValue.value = withSequence(
        withTiming(-20, { duration: 1000 }),
        withTiming(20, { duration: 1000 }),
        withTiming(-15, { duration: 1000 }),
        withTiming(15, { duration: 1000 }),
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) })
      );
    }
   
  }, [isCompleted,isPending]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXValue.value }],
  }));

  const formatTimeRange = (start, end) => {
    const getTime = dateTime => dateTime.split(' ')[1] + ' ' + (dateTime.split(' ')[2] || '');
    return `${getTime(start)} - ${getTime(end)}`;
  };

  return (
    <Animated.View style={animatedStyle}>
      <View
        // activeOpacity={0.85}
        // onPress={() => navigation.navigate('TaskDetails', { data: item })}
        style={[
          styles.flatView,
          {
            backgroundColor: item.color || '#ECF7F3',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: wp(4),
            marginVertical: wp(2),
            opacity: isCompleted ? 0.9 : 1,
            shadowOffset: {height: 2, width: 2},
            shadowOpacity: 0.2,
            shadowColor: '#4686D4',
            elevation:2

          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: Colors.black, fontFamily: fonts.bold }}>
            {formatTimeRange(item.start_datetime, item.end_datetime)}
          </Text>

          <View style={{ marginTop: wp(1), flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginRight: wp(2),
                flexShrink: 1,
                textDecorationLine: isCompleted ? 'line-through' : 'none',
              }}
              numberOfLines={2}
            >
              {item?.title}
            </Text>

            <View
              style={{
                paddingVertical: wp(1),
                paddingHorizontal: wp(2),
                borderRadius: wp(3),
                backgroundColor:
                  item?.priority === 'High Priority'
                    ? '#F95555'
                    : item?.priority === 'Medium Priority'
                      ? '#3498DB'
                      : Colors.mainColor,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                source={images.flag}
                resizeMode="contain"
                style={{ width: wp(4), height: wp(4), marginRight: wp(1) }}
              />
              <Text style={{ fontSize: 8, fontFamily: fonts.bold, color: Colors.white }}>
                {item?.priority === 'High Priority' ? 'High' : item?.priority === 'Medium Priority' ? 'Medium' : 'Low'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            if (isCompleted) return;
            onCompletePress(item);
          }}
          disabled={isCompleted}
          style={{ padding: wp(3) }}
        >
          <Fontisto
            name={isCompleted ? 'checkbox-active' : 'checkbox-passive'}
            color={isCompleted ? Colors.mainColor : 'white'}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const { top } = useSafeAreaInsets();

  const [usersuspened, setuserSuspended] = useState(false);
  const [onchangeTab, setOnChangeTab] = useState('1');
  const [selectedDate, setSelectedDate] = useState(moment());
  const today = moment();
  

  const [myTasks, setMyTasks] = useState([]);
  console.log('my tasks', JSON.stringify(myTasks))
  const [myReminders, setMyReminders] = useState([]);
  const [myNotes, setMyNotes] = useState([]);
  const [mySubscription, setmySubscription] = useState(0);
  // console.log('my current stattus',mySubscription)

  const [completionImage, setCompletionImage] = useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // ← ADDED

  const [visible, setVisible] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [timeImage, setTimeImage] = useState(null);
  const [colorTime, setTime] = useState("");
  const [showExtra, setShowExtra] = useState(false);
  const [oracleCard, setOracleCard] = useState(null);

  const [showAheadChallenge, setShowAheadChallenge] = useState(false);

  const data = [
    {
      id: 1,
      Oracle: "Today doesn’t ask you to rush or force outcomes. What is meant for you is already aligning, even if you can’t see it yet. Trust the pace of the day.",
      Expand: "This card appears when urgency or pressure is influencing your mindset. Angelic guidance reminds you that alignment happens through cooperation, not control. When you allow things to unfold naturally, clarity and ease follow.",
      image: require("../../Assets/Group 1272628560.jpg"),
    },
    {
      id: 2,
      Oracle: "You are not doing this alone, even if it feels quiet right now. Support surrounds you in visible and invisible ways. Allow yourself to lean into it.",
      Expand: "Angel oracle traditions often emphasize unseen support as reassurance. This card invites you to notice where help, encouragement, or ease is already present. You don’t have to carry everything by yourself today.",
      image: require("../../Assets/Group 1272628561.jpg"),
    },
    {
      id: 3, Oracle: "You don’t need to start today at full speed. Gentle beginnings create steadier momentum. Ease can be a strength.",
      Expand: "This message aligns with angelic guidance around self-compassion and balance. Moving gently helps you conserve energy and stay present. Today favors pacing over pushing.",
      image: require("../../Assets/Group 1272628562.jpg"),
    },
    {
      id: 4, Oracle: "You don’t need all the answers before the day begins. Some understanding arrives through experience. Let clarity meet you naturally.",
      Expand: "This card reassures you that uncertainty is not a failure. Angel guidance reminds you that insight unfolds in stages. Trust that today will reveal what you need, when you need it.",
      image: require("../../Assets/Group 1272628564.jpg"),
    },
    {
      id: 5, Oracle: "Come back to the present moment. Stability is available when you slow down and notice what’s real. You are here.",
      Expand: "Grounding is a core angelic theme for emotional steadiness. This card suggests reconnecting with your body and breath. From grounded awareness, better choices follow.",
      image: require("../../Assets/Group 1272628564.jpg"),
    },
    {
      id: 6, Oracle: "Your words will shape the tone of your day. Choose honesty guided by compassion. Begin with kindness toward yourself.",
      Expand: "Angel guidance often centers communication as a healing tool. This card reminds you that words carry energy. Gentle truth creates safety and connection.",
      image: require("../../Assets/Group 1272628565.jpg"),
    },
    {
      id: 7, Oracle: "Not everything today needs your management. Some things respond better to trust than effort. Letting go can create ease.",
      Expand: "This card reflects angel teachings around surrender. Control often comes from fear, while trust opens flow. Notice where effort is unnecessary and allow space for support.",
      image: require("../../Assets/Group 1272628585.jpg"),
    },
    {
      id: 8, Oracle: "Your energy is valuable and limited. You are allowed to choose where it goes. Boundaries today are an act of wisdom.",
      Expand: "Protection is a frequent angel oracle theme. This card encourages discernment around people, tasks, and emotions. Preserving energy supports clarity and balance.",
      image: require("../../Assets/Group 1272628566.jpg"),
    },
    {
      id: 9, Oracle: "You don’t need to prove your worth today. Your value is not tied to productivity or perfection. Showing up honestly is enough.",
      Expand: "Angel guidance often reassures worthiness. This card gently counters self-judgment and pressure. Resting in enoughness brings peace and confidence.",
      image: require("../../Assets/Group 1272628584.jpg"),
    },
    {
      id: 10, Oracle: "Goodness is available to you today. You don’t need to deflect or brace against it. Allow yourself to receive.",
      Expand: "Angel cards frequently remind us that receiving is as important as giving. This message invites openness to ease, kindness, and small moments of joy. Let the day be lighter than expected.",
      image: require("../../Assets/Group 1272628567.jpg"),
    },

    {
      id: 11, Oracle: "You don’t need the whole path, just the next step. Progress happens through small, aligned actions. Begin where you are.",
      Expand: "Angel guidance often emphasizes forward motion without overwhelm. This card reassures you that clarity grows with movement. One step is enough for today.",
      image: require("../../Assets/Group 1272628568.jpg"),
    },
    {
      id: 12, Oracle: "What you feel today matters. Emotions are signals, not obstacles. Allow them space.",
      Expand: "This card reflects angel teachings around emotional awareness. When feelings are acknowledged, they soften. Listening inward creates clarity and balance.",
      image: require("../../Assets/Group 1272628569.jpg"),
    },
    {
      id: 13, Oracle: "Something helpful may arrive in an unexpected way. Openness creates opportunity.Release rigid expectations.",
      Expand: "Angel oracle themes often highlight openness as a doorway to guidance. This card encourages flexibility and curiosity. What you need may arrive differently than planned.",
      image: require("../../Assets/Group 1272628570.jpg"),
    },
    {
      id: 14, Oracle: "Slowing down supports progress. Rest restores clarity and energy. You’re allowed to pause.",
      Expand: "This card counters the belief that constant effort is required. Angel guidance reminds you that rest strengthens insight and resilience. Pausing today benefits what comes next.",
      image: require("../../Assets/Group 1272628571.jpg"),
    },
    {
      id: 15, Oracle: "Let your actions reflect what truly matters to you. Alignment brings peace, even when it’s uncomfortable. Choose honesty.",
      Expand: "Angel cards often emphasize integrity as inner alignment. Acting from values creates steadiness and self-trust. Today favors choices that feel true.",
      image: require("../../Assets/Group 1272628572.jpg"),
    },
    {
      id: 16, Oracle: "You already know more than you think. Your intuition is quiet but reliable. Listen inward.",
      Expand: "Angel guidance frequently affirms inner wisdom. This card encourages confidence in your own insight. Trust grows when you act on what feels right.",
      image: require("../../Assets/Group 1272628573.jpg"),
    },
    {
      id: 17, Oracle: "This moment is enough. Presence improves everything that follows. Come fully here.",
      Expand: "Angel teachings often emphasize presence as grounding and clarifying. When attention returns to now, stress softens. Today benefits from mindful awareness.",
      image: require("../../Assets/Group 1272628574.jpg"),
    },
    {
      id: 18, Oracle: "Complexity is optional today. Simplicity brings clarity and ease. Focus on what matters most.",
      Expand: "This card reflects angel guidance around reducing mental noise. When you simplify, energy returns. Let go of unnecessary effort.",
      image: require("../../Assets/Group 1272628575.jpg"),
    },
    {
      id: 19, Oracle: "You are being nudged in the right direction. Guidance may appear subtly. Pay attention.",
      Expand: "Angel oracle traditions often describe guidance as intuitive signals. This card invites awareness of signs, instincts, and gentle confirmations. Trust what you notice.",
      image: require("../../Assets/Group 1272628576.jpg"),
    },
    {
      id: 20, Oracle: "Gratitude changes how you experience the day. Appreciation softens perspective. Begin with thanks.",
      Expand: "Angel cards frequently highlight gratitude as a grounding practice. What you acknowledge grows in importance. Gratitude brings steadiness and calm.",
      image: require("../../Assets/Group 1272628577.jpg"),
    },
    {
      id: 21, Oracle: "One conscious breath can shift everything. Pause before reacting. Calm creates clarity.",
      Expand: "Angel guidance often encourages breath as a reset. This card reminds you to slow the nervous system before responding. Presence begins with breath.",
      image: require("../../Assets/Group 1272628578.jpg"),
    },
    {
      id: 22, Oracle: "Peace is available, even in challenge. You can choose calm over conflict. Let peace guide your responses.",
      Expand: "This card reflects angelic reassurance around emotional choice. Not every situation requires defense. Peace conserves energy and clarity.",
      image: require("../../Assets/Group 1272628579.jpg"),
    },
    {
      id: 23, Oracle: "Growth is happening, even when it feels messy. Learning often looks imperfect. Be patient with yourself.",
      Expand: "Angel oracle themes frequently normalize growth through experience. This card reframes mistakes as part of expansion. Compassion accelerates learning.",
      image: require("../../Assets/Group 1272628580.jpg"),
    },
    {
      id: 24, Oracle: "Something is shifting for your benefit. Change clears space for alignment. Trust the movement.",
      Expand: "Angel guidance often frames change as preparation. This card encourages openness rather than resistance. What’s shifting supports growth.",
      image: require("../../Assets/Group 1272628581.jpg"),
    },
    {
      id: 25, Oracle: "Guidance speaks softly. Answers may arrive through subtle feelings or quiet moments. Slow down enough to hear.",
      Expand: "Angel oracle traditions emphasize listening over forcing. This card invites attunement to intuition and subtle cues. Stillness reveals direction.",
      image: require("../../Assets/Group 1272628582.jpg"),
    },
  ]
  const handleEmailPress = () => {
    Linking.openURL(
      'mailto:saaday7@gmail.com?subject=Account Suspended – Assistance Needed&body=Hi Support Team, I noticed that my account has been suspended.Kindly guide me regarding the issue and what steps I need to take to reactivate my account.Thank you!',
    );
  };
  const removeCompletionImage = () => setCompletionImage(null);
const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const recentNotes = myNotes?.slice(0, 3) || [];

  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const recentReminder = myReminders?.slice(0, 3) || [];

  const swiperRef2 = useRef(null);
  const [currentIndexR, setCurrentIndexR] = useState(0);
  const checkModalStatus = async () => {
    try {
      const lastShown = await AsyncStorage.getItem('modalLastShown');
      const todayStr = new Date().toDateString();

      if (lastShown !== todayStr) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setOracleCard(data[randomIndex]);
        checkTime();

        await AsyncStorage.setItem('modalLastShown', todayStr);

        setVisible(true);

        setTimeout(() => {
          setShowOracle(true);
        }, 4000);
      }
    } catch (error) {
      console.log('Error checking modal status:', error);
    }
  };

  const checkTime = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setTimeImage(require('../../Assets/screen 1.png'));
      setTime("Morning");
    } else if (hour >= 12 && hour < 17) {
      setTimeImage(require('../../Assets/screen 2.png'));
      setTime("Noon");
    } else {
      setTimeImage(require('../../Assets/screen 3.png'));
      setTime("Night");
    }
  };



  const getAllTasks = () => {
    AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
      .then(res => setMyTasks(res.data || []))
      .catch(err => console.log('api error tasks', err));
  };
  const getAllNotes = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'view-all-note', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          const notifications = res.data || [];
          setMyNotes(notifications);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Notification API error:', err);
      });
  };
  const getAllReminders = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'view-all-reminder', Token: user?.api_token })
        .then(res => {
            setIsLoading(false);
            if (res.status === 'success') {
                const notifications = res.data || [];
                setMyReminders(notifications);
            }
        })
        .catch(err => {
            setIsLoading(false);
            console.log('Notification API error:', err);
        });
};

  const CheckSubscription = () => {
    AllGetAPI({ url: 'check-subscription', Token: user?.api_token })
      .then(res => {
        console.log('check subscription', JSON.stringify(res));
        setmySubscription(res.subscription);
      })
      .catch(err => console.log('api error subscription', err));
  };

    useEffect(() => {
        let timer;
    const init = async () => {
      await checkModalStatus();
        if (mySubscription === 0) {
      timer = setTimeout(() => {
        setShowAheadChallenge(true);
      }, 3000)
     } else {
        setShowAheadChallenge(false);
      }
    };
    init();
    return () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
  }, [mySubscription]);
  const getToken = async () => {

    let fcmToken = await messaging().getToken();
    console.log("i called onn setup", fcmToken)
    const formData = new FormData();
    formData.append('fcm_token', fcmToken);
    PostAPiwithToken({ url: 'update-fcm', Token: user?.api_token }, formData)
      .then(res => {
        console.log('FCM token update----- runner', JSON.stringify(res));
        if (res.suspend === 1) {
          // console.log('FCM token update----- runner', res);
          setuserSuspended(true);
        } else {
          // setuserSuspended(true);
        }
      })
      .catch(err => console.log('error in update', err));

    messaging().onTokenRefresh(token => {
      const formData = new FormData();
      formData.append('fcm_token', token);
      PostAPiwithToken(
        { url: 'update-fcm', Token: user?.api_token },
        formData,
      ).catch(() => { });
    });
  };
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        console.log("avigwation done ");
        getToken();
        // The screen is focused
        // Call any action
      })

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, [navigation]))

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!user?.api_token) return;
  //     getAllTasks();
  //     CheckSubscription();
  //     getAllNotes()
  //     getAllReminders()
  //   }, [user?.api_token])
  // );
  useFocusEffect(
    useCallback(() => {
      getAllTasks();
      CheckSubscription();
      getAllNotes()
      getAllReminders()
    }, []),
  );
  const handleCompletePress = (task) => {
    setCurrentTask(task);
    setShowImagePickerModal(true);
  };

  const pickCompletionImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 0.8,
      });
      setCompletionImage(image.path);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Image pick error:', error);
      }
    }
  };

//     const pickCompletionImage = async () => {
//   try {
//     const image = await ImageCropPicker.openCamera({
//       width: 400,
//       height: 400,
//       cropping: true,
//       compressImageQuality: 0.8,
//       cropperCircleOverlay: false,
//       useFrontCamera: false, // set true if you want selfie camera by default
//       includeBase64: false,
//     });

//     setCompletionImage(image.path);
//   } catch (error) {
//     if (error.code === 'E_PICKER_CANCELLED') {
//       // User cancelled the camera
//       console.log('Camera cancelled');
//     } else {
//       console.error('Camera error:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Camera Error',
//         text2: 'Unable to open camera. Please try again.',
//       });
//     }
//   }
// };

  const getTaskEnd = () => {
    if (!completionImage) {
      // Add your toast here
      console.log('Please upload proof photo');
      return;
    }

    const formdata = new FormData();
    formdata.append('image', {
      uri: completionImage,
      type: 'image/jpeg',
      name: `proof_${Date.now()}.jpg`,
    });
    formdata.append('task_id', currentTask.id);

    setIsLoading(true);

    PostAPiwithToken({ url: 'end-task', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          // Toast success
  Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message || 'Task completed successfully!',
          });
                setShowCompletionCelebration(true);
  setTimeout(() => {
    setShowCompletionCelebration(false); 
  }, 4000);
          setShowImagePickerModal(false);
          setCompletionImage(null);
          setCurrentTask(null);
          getAllTasks();
        }

      })
      .catch(err => {
        setIsLoading(false);
        console.log('Complete task error:', err);
      });
  };
  const filteredTasks = useMemo(() => {
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');
    console.log('Selected Date:', selectedDateStr);

    return myTasks.filter(task => {
      // Parse the custom format: "2025-12-29 06:30 PM"
      const taskMoment = moment(task.start_datetime, 'YYYY-MM-DD hh:mm A');

      if (!taskMoment.isValid()) {
        console.warn('Invalid date:', task.start_datetime, task.id);
        return false;
      }

      const taskDateStr = taskMoment.format('YYYY-MM-DD');
      const matchesDate = taskDateStr === selectedDateStr;

      // Tag filtering
      let matchesTag = onchangeTab === '1';
      if (!matchesTag) {
        const tagMap = {
          '2': 'Room Cleaning',
          '3': 'Healthy Lifestyle',
          '4': 'Morning Routine',
          '5': 'Relationship',
          '6': 'Sleep Better',
          '7': 'Workout',
        };
        matchesTag = task.tag === tagMap[onchangeTab];
      }

      return matchesDate && matchesTag;
    });
  }, [myTasks, selectedDate, onchangeTab]);
  const MorningModal = () => (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
    >
      {!showOracle ? (
        <Image
          source={timeImage}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#FFF8E5', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: "90%", backgroundColor: '#FFF8E5', borderRadius: 20, padding: 20 }}>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}
            >
              <AntDesign name={'close'} size={24} color={Colors.black} />
            </TouchableOpacity>

            <Image
              resizeMode='stretch'
              source={oracleCard?.image}
              style={{ width: "100%", height: 250, borderRadius: 10 }}
            />

            <Text style={{ marginTop: 20, fontSize: 16 }}>
              {oracleCard?.Oracle}
            </Text>

            {showExtra && (
              <Text style={{ marginTop: 20 }}>
                {oracleCard?.Expand}
              </Text>
            )}

            <TouchableOpacity onPress={() => showExtra ? setVisible(false) : setShowExtra(true)}>
              <Text style={{ alignSelf: "center", marginTop: 20, color: "#00BF63" }}>
                {showExtra ? "Go To Home" : "Read More"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );
  const truncateToThreeWords = (text = '') => {
    const words = text.trim().split(/\s+/);
    return words.length <= 3 ? text : `${words.slice(0, 3).join(' ')}…`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

     const translateXValue = useSharedValue(0);
        
  useEffect(() => {
    if (showCompletionCelebration) {
      translateXValue.value = withSequence(
        withTiming(-20, { duration: 1200 }),
        withTiming(20, { duration: 1200 }),
        withTiming(-15, { duration: 1200 }),
        withTiming(15, { duration: 1200 }),
        withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        })
      );
    }
  }, [showCompletionCelebration]);
  
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXValue.value }],
    };
  });

  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
      }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        {/* Header */}
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
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={images.menuIcon}
                style={{ width: 26, height: 26, marginRight: wp(2) }}
                tintColor={Colors.mainColor}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Profile')}>
              <Image
                source={user?.image ? { uri: user?.image } : images.avatarpic}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: wp(1),
                  borderRadius: 18,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}
              >
                {user?.name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('AddMembers')}>
              <Image
                source={images.useraddIcon}
                style={{ width: 18, height: 18, marginRight: wp(2) }}
                resizeMode="contain"
                tintColor={Colors.mainColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                mySubscription === 0
                  ? navigation.navigate('Subscription')
                  : navigation.navigate('ChatAI')
              }
            >
              <Image
                source={images.aiIcon}
                style={{ width: 18, height: 18, marginRight: wp(1) }}
                resizeMode="contain"
                tintColor={Colors.mainColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          
          <CalendarStrip
            style={{ height: 180, paddingTop: 20, paddingBottom: 10 }}
            selectedDate={selectedDate}
            // onDateSelected={handleDateSelected}
            onDateSelected={date => setSelectedDate(moment(date))}
            dayComponentHeight={118}
            minDayComponentSize={wp(18)}
            // customDayComponent={CustomDayComponent}
            dateNameStyle={{
              color: 'black',
              fontSize: wp(3.5),
              fontFamily: fonts.regular,
            }}
            dateNumberStyle={{
              color: '#1E293B',
              fontSize: wp(4),
              fontFamily: fonts.semibold,
            }}
            highlightDateNumberStyle={{
              color: Colors.white,
              fontSize: wp(5.5),
              fontFamily: fonts.semibold,
            }}
            highlightDateNameStyle={{
              color: 'white',
              fontSize: wp(3.5),
              fontFamily: fonts.regular,
            }}
            // highlightDateContainerStyle={{
            //   backgroundColor: Colors.mainColor,
            //   borderRadius: wp(3),
            //   height: 118,
            // }}
            // dayContainerStyle={{
            //   backgroundColor: 'white',
            //   borderWidth: 0.5,
            //   borderColor: '#E9F1FF',
            //   borderRadius: wp(3),
            //   // elevation: 1,
            // }}
            scrollable
            startingDate={moment()}
            scrollToOnSetSelectedDate={true}
            showArrows={false}
            iconStyle={{ display: 'none' }}
            highlightDateContainerStyle={{
              backgroundColor: Colors.mainColor,
              borderRadius: wp(3),
              height: 118,
            }}
            dayContainerStyle={{
              backgroundColor: 'white',
              borderWidth: 0.5,
              borderColor: '#E9F1FF',
              borderRadius: wp(3),
            }}
          />
          {/* Your tabs horizontal scroll */}
          <View style={{ marginTop: wp(2) }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp(1),
                gap: wp(2.5),
              }}
            >
              {['All', 'Room Cleaning', 'Healthy Lifestyle', 'Morning Routine', 'Relationship', 'Sleep Better', 'Workout'].map(
                (tab, index, array) => (
                  <TouchableOpacity
                    key={tab}
                    activeOpacity={0.8}
                    onPress={() => setOnChangeTab((index + 1).toString())}
                    style={{
                      marginLeft: index === 0 ? wp(4) : 0,
                      marginRight: index === array.length - 1 ? wp(4) : 0, marginBottom: wp(3)
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: wp(3),
                        paddingVertical: wp(3),
                        borderRadius: wp(2),
                        backgroundColor: onchangeTab === (index + 1).toString() ? '#ECF7F3' : Colors.white,
                        elevation: 2,
                        marginVertical: wp(1),
                        shadowOffset: {height: 2, width: 2},
                        shadowOpacity: 0.2,
                        shadowColor: '#4686D4',
                      }}
                    >
                      <Text style={{ fontSize: 12, fontFamily: fonts.bold, color: Colors.black }}>
                        {tab}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
          <View style={{ height: wp(70) }}>
            <FlatList
              data={filteredTasks}
              keyExtractor={item => item.id.toString()}
              nestedScrollEnabled={true}
    scrollEnabled={true}
              renderItem={({ item }) => (
                <TaskItem
                  item={item}
                  navigation={navigation}
                  onCompletePress={handleCompletePress}
                />
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: hp(10),
                    color: 'gray',
                    fontSize: 16,
                  }}
                >
                  No tasks found for {selectedDate.format('MMMM D, YYYY')}
                </Text>
              }
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5) }}>
            <Text style={{ color: 'black',fontSize:16,fontFamily:fonts.bold }}>My Notes</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('IndexDrawer',{screen:'MyNotes'})}>
            <Text style={{ color: 'black',fontSize:14,fontFamily:fonts.medium,textDecorationLine:'underline' }}>See All</Text>
            </TouchableOpacity>

          </View>
          <View style={{ marginTop: wp(2) }}>
            <SwiperFlatList
            ref={swiperRef}
            data={recentNotes}
            onChangeIndex={({ index }) => setCurrentIndex(index)}
              index={0}
              paginationActiveColor={Colors.mainColor}     // red example
              paginationDefaultColor="#EBEAE2"
              showPagination={true}
              paginationStyleItem={{ width: 9, height: 9, marginHorizontal: 6, }}
              paginationStyle={{ bottom: -wp(10) }}
              renderItem={({ item, index }) => {
                const isSecondItem = index === 1; // Check if the item is the second one

                return (
                  <View
                    style={{
                      width: wp(85),
                      paddingHorizontal: wp(3),
                      paddingVertical: wp(2),
                      backgroundColor: '#FAFAFA',
                      borderWidth: 1,
                      borderColor: '#BBBBBB',
                      borderRadius: wp(3),
                      alignSelf: 'center',
                      // marginTop: wp(3),
                      height: wp(30),
                      // marginRight:wp(3),
                      marginHorizontal: isSecondItem ? wp(1) : wp(3),
                      marginLeft:index===0?wp(5):null,
                      elevation: 2,

                      // iOS
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    }}
                  >

                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DEDEDE', paddingBottom: wp(3) }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: fonts.medium,
                          color: Colors.black,
                          flex: 1,
                        }}
                      >
                        {truncateToThreeWords(item.title)}
                      </Text>
                      <View style={{ backgroundColor: '#ECF7F3', paddingHorizontal: wp(2), paddingVertical: wp(1), borderRadius: wp(2) }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: fonts.medium,
                            color: '#616161',
                          }}
                        >
                          {formatDate(item.created_at)}
                        </Text>
                      </View>


                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        color: Colors.black,
                        lineHeight: 18,
                        marginTop: wp(3)
                      }}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5),marginTop:wp(10) }}>
            <Text style={{ color: 'black',fontSize:16,fontFamily:fonts.bold }}>My Reminder</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('IndexDrawer',{screen:'MyReminder'})}>
            <Text style={{ color: 'black',fontSize:14,fontFamily:fonts.medium,textDecorationLine:'underline' }}>See All</Text>
            </TouchableOpacity>

          </View>
          <View style={{ marginTop: wp(2),marginBottom:wp(35) }}>
            <SwiperFlatList
            ref={swiperRef2}
            data={recentReminder}
            onChangeIndex={({ index }) => setCurrentIndexR(index)}
              index={0}
              paginationActiveColor={Colors.mainColor}     // red example
              paginationDefaultColor="#EBEAE2"
              showPagination={true}
              paginationStyleItem={{ width: 9, height: 9, marginHorizontal: 6, }}
              paginationStyle={{ bottom: -wp(10) }}
              renderItem={({ item, index }) => {
                const isSecondItem = index === 1; 

                return (
                  // <View
                  //   style={{
                  //     width: wp(80),
                  //     paddingHorizontal: wp(3),
                  //     paddingVertical: wp(2),
                  //     backgroundColor: '#FAFAFA',
                  //     borderWidth: 1,
                  //     borderColor: '#BBBBBB',
                  //     borderRadius: wp(3),
                  //     alignSelf: 'center',
                  //     // marginTop: wp(3),
                  //     height: wp(30),
                  //     // marginRight:wp(3),
                  //     marginHorizontal: isSecondItem ? wp(1) : wp(3),
                  //     marginLeft:index===0?wp():null,
                  //     elevation: 2,

                  //     // iOS
                  //     shadowColor: '#000',
                  //     shadowOffset: { width: 0, height: 2 },
                  //     shadowOpacity: 0.2,
                  //     shadowRadius: 4,
                  //   }}
                  // >

                  //   <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DEDEDE', paddingBottom: wp(3) }}>
                  //     <Text
                  //       style={{
                  //         fontSize: 16,
                  //         fontFamily: fonts.medium,
                  //         color: Colors.black,
                  //         flex: 1,
                  //       }}
                  //     >
                  //       {truncateToThreeWords(item.title)}
                  //     </Text>
                  //     <View style={{ backgroundColor: '#ECF7F3', paddingHorizontal: wp(2), paddingVertical: wp(1), borderRadius: wp(2) }}>
                  //       <Text
                  //         style={{
                  //           fontSize: 10,
                  //           fontFamily: fonts.medium,
                  //           color: '#616161',
                  //         }}
                  //       >
                  //         {formatDate(item.created_at)}
                  //       </Text>
                  //     </View>


                  //   </View>
                  //   <Text
                  //     style={{
                  //       fontSize: 14,
                  //       fontFamily: fonts.medium,
                  //       color: Colors.black,
                  //       lineHeight: 18,
                  //       marginTop: wp(3)
                  //     }}
                  //     numberOfLines={2}
                  //   >
                  //     {item.description}
                  //   </Text>
                  // </View>
                  <View
                  style={{
                      width: wp(85),
                      paddingHorizontal: wp(3),
                      paddingVertical: wp(2),
                      backgroundColor: '#FAFAFA',
                      borderWidth: 0.7,
                      borderColor: '#BBBBBB',
                      borderRadius: wp(3),
                      alignSelf: 'center',
                      // marginTop: wp(3),
                      marginHorizontal: isSecondItem ? wp(1) : wp(3),
                      marginLeft:index===0?wp(5):null,
                      //     marginLeft:index===0?wp():null,
                      elevation: 2,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                  }}
              >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DEDEDE', paddingBottom: wp(3) }}>
                      <Text
                          style={{
                              fontSize: 16,
                              fontFamily: fonts.medium,
                              color: Colors.black,
                              flex: 1,
                          }}
                      >
                          {truncateToThreeWords(item.title)}
                      </Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                              source={images.calendarIcon}
                              resizeMode="contain"
                              style={{
                                  width: wp(4.5),
                                  height: wp(4.5),
                                  marginRight: wp(1),
                              }}
                              tintColor={Colors.mainColor}
                          />
                          <Text
                              style={{
                                  fontSize: 12,
                                  fontFamily: fonts.medium,
                                  color: Colors.black,
                              }}
                          >
                              {item.date}
                          </Text>
                      </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(3) }}>
                      <Text
                          style={{
                              fontSize: 14,
                              fontFamily: fonts.medium,
                              color: '#999999',
                              lineHeight: 18,
                          }}
                      >
                          Start Time
                      </Text>
                      <Text
                          style={{
                              fontSize: 14,
                              fontFamily: fonts.medium,
                              color: '#999999',
                              lineHeight: 18,
                          }}
                      >
                          End Time
                      </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(1) }}>
                      <Text
                          style={{
                              fontSize: 14,
                              fontFamily: fonts.medium,
                              color: Colors.black,
                              lineHeight: 18,
                          }}
                      >
                          {item.start_time}
                      </Text>
                      <Text
                          style={{
                              fontSize: 14,
                              fontFamily: fonts.medium,
                              color: Colors.black,
                              lineHeight: 18,
                          }}
                      >
                          {item.end_time}
                      </Text>
                  </View>
              </View>
                );
              }}
            />
          </View>

        </ScrollView>

        <MorningModal />

        {/* Image Upload Modal for Task Completion */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showImagePickerModal}
          onRequestClose={() => {
            setShowImagePickerModal(false);
            setCompletionImage(null);
            setCurrentTask(null);
          }}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: wp(5),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wp(4) }}>
                <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black }}>
                  Upload Proof of Completion
                </Text>
                <TouchableOpacity onPress={() => {
                  setShowImagePickerModal(false);
                  setCompletionImage(null);
                }}>
                  <AntDesign name="close" size={24} color={Colors.black} />
                </TouchableOpacity>
              </View>

              <Text style={{ color: '#666', fontSize: 14, marginBottom: wp(5) }}>
                Please upload one photo showing the task is completed.
              </Text>

              <View style={{ alignItems: 'center', marginBottom: wp(6) }}>
                {completionImage ? (
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: completionImage }}
                      style={{ width: wp(70), height: wp(70), borderRadius: 12 }}
                    />
                    <TouchableOpacity
                      onPress={removeCompletionImage}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        borderRadius: 20,
                        padding: 8,
                      }}
                    >
                      <AntDesign name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickCompletionImage}
                    style={{
                      width: wp(70),
                      height: wp(70),
                      borderRadius: 12,
                      backgroundColor: '#f5f5f5',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: '#ddd',
                      borderStyle: 'dashed',
                    }}
                  >
                    <Feather name="camera" size={40} color="#999" />
                    <Text style={{ marginTop: 10, color: '#999', fontSize: 14 }}>
                      Tap to take/upload photo
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <MainButton
                title="Submit & Complete Task"
                onPress={getTaskEnd}
                disabled={!completionImage}
              />
            </View>
          </View>
        </Modal>
        <Modal transparent={true} visible={usersuspened} animationType="none">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: wp(6),
                width: wp(90),
                maxHeight: hp(80),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 20,
              }}
            >
              <View>
                <Image
                  source={images.avatarpic}
                  resizeMode="contain"
                  style={{ width: wp(20), height: wp(20), alignSelf: 'center' }}
                />
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginHorizontal: wp(3),
                  marginTop: wp(5),
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    lineHeight: 22,
                    textAlign: 'center',
                  }}
                >
                  Oops! It looks like your account is currently suspended by the
                  admin. You won’t be able to access your tasks or communities
                  until your account is reactivated. Please reach out to support
                  if you think this is a mistake.{' '}
                  {/* <TouchableOpacity onPress={handleEmailPress}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: Colors.buttoncolor,
                          textDecorationLine: 'underline',
                          paddingTop: wp(2),
                        }}
                      >
                        saaday7@gmail.com
                      </Text>
                    </TouchableOpacity> */}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: wp(7),
                  marginTop: wp(5),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleEmailPress(),
                      dispatch(setUser(null)),
                      setuserSuspended(false);
                  }}
                  style={[
                    {
                      width: wp(60),
                      height: wp(12),
                      borderRadius: wp(20),
                      backgroundColor: Colors.mainColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: 14,
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Support Team
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
       <Modal
  transparent={true}
  visible={ showCompletionCelebration}
  animationType="fade"
  onRequestClose={() => {
    setShowCompletionCelebration(false);
  }}
>
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Animated.View style={animatedStyle2}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 50,
        padding: wp(8),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 15,
      }}>
        <Image
          source={
           images.completeT
          }
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
        <AheadChallengeModal
          visible={showAheadChallenge}
          navigation={navigation}
          onClose={()=>setShowAheadChallenge(false)}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Home;