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
  Modal,
  Linking,
  TouchableWithoutFeedback,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import { CalendarList } from 'react-native-calendars';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import messaging from '@react-native-firebase/messaging';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setUser } from '../../Redux/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AheadChallengeModal from '../../Components/AheadChallengeModal';
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
import DailyMeetings from './DailyMeetings';
import { Dropdown } from 'react-native-element-dropdown';

// ── Animated Task Item ──
const TaskItem = ({ item, navigation, onDelete }) => {
  const isCompleted = item.status === 'Completed';
  const isInCompleted = item.status === 'In Complete';
  const isPending = item.status === 'Pending';
  const translateXValue = useSharedValue(0);

  useEffect(() => {
    if (isCompleted) {
      translateXValue.value = withSequence(
        withTiming(-20, { duration: 800 }),
        withTiming(20, { duration: 800 }),
        withTiming(-15, { duration: 800 }),
        withTiming(15, { duration: 800 }),
        withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) }),
      );
    } else if (isPending) {
      translateXValue.value = withSequence(
        withTiming(-20, { duration: 1000 }),
        withTiming(20, { duration: 1000 }),
        withTiming(-15, { duration: 1000 }),
        withTiming(15, { duration: 1000 }),
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
      );
    }
  }, [isCompleted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXValue.value }],
  }));

  const formatTimeRange = (start, end) => {
    const getTime = dateTime =>
      dateTime.split(' ')[1] + ' ' + dateTime.split(' ')[2];
    return `${getTime(start)} - ${getTime(end)}`;
  };

  const formatCreatedTime = time => {
    const d = new Date(time);
    return d.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getbackgroundColor = tag => {
    if (tag === 'Learning & Growth') {
      return '#004FD1';
    } else if (tag === 'Urgent Tasks') {
      return '#DC1318';
    } else if (tag === 'Creativity & Inspiration') {
      // return '#FFD300';
      return '#D6AC00';
    } else if (tag === 'Productivity Task') {
      return '#00C400';
    } else if (tag === 'Self-Improvement') {
      return '#AE1FFF';
    } else if (tag === 'Social & Relationships') {
      return '#CE8500';
    }
  };
  const renderRightActions = id => {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: '#BD2BAF',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginr: 12,
            padding: 8,
            marginVertical: 16,
            borderRadius: wp(2),
          },
        ]}
        onPress={() => onDelete(id)}
      >
        <Fontisto name="delete" color="white" size={35} />
      </TouchableOpacity>
    );
  };

  return (
    <ReanimatedSwipeable renderRightActions={() => renderRightActions(item.id)}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={() => {
            console.log(item);
            navigation.navigate('TaskDetails', {
              data: item,
            });
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: wp(4),
            marginVertical: wp(2),
            padding: 8,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.bold,
                color: Colors.white,
                marginRight: wp(5),
                flexShrink: 1,
              }}
            >
              {formatCreatedTime(item.created_at)}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: getbackgroundColor(item.tag),
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: wp(2),
            }}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.white,
                  fontFamily: fonts.bold,
                }}
              >
                {item?.title}
              </Text>
              <View
                style={{
                  paddingVertical: wp(1),
                  paddingHorizontal: wp(2),
                  borderRadius: wp(1),
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

                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  {item?.priority === 'High Priority'
                    ? 'High'
                    : item?.priority === 'Medium Priority'
                    ? 'Medium'
                    : 'Low'}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp(1),
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text>
                  <Fontisto name="access-time" color="white" size={12} />{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    marginRight: wp(2),
                    flexShrink: 1,
                  }}
                  numberOfLines={2}
                >
                  {formatTimeRange(item.start_datetime, item.end_datetime)}
                </Text>
              </View>

              <Text style={{ fontSize: 10, color: Colors.white }}>
                {item.status}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </ReanimatedSwipeable>
  );
};

const Home = ({ navigation }) => {
  const DAY_WIDTH = 70;
  const DAY_HEIGHT = 85; // a bit taller than width
  console.log(new Date().toISOString());
  console.log(new Date().toUTCString());
  console.log(new Date().toDateString);
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const [usersuspened, setuserSuspended] = useState(false);
  const [onchangeTab, setOnChangeTab] = useState('1');
  const [selectedStripDate, setSelectedStripDate] = useState(moment());
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [myTasks, setMyTasks] = useState([]);
  const [nextTask, setNextTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);
  const taskStartRef = useRef(null);
  const taskStartTimeRef = useRef(null);

  const [AllTaskDates, setAllTaskDates] = useState([]);

  const [myReminders, setMyReminders] = useState([]);
  const [myNotes, setMyNotes] = useState([]);
  const [mySubscription, setmySubscription] = useState(0);
  // console.log('my current stattus',mySubscription)

  const [completionImage, setCompletionImage] = useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // ← ADDED
  const [showPendingYesterdayModal, setShowPendingYesterdayModal] =
    useState(false);
  const [visible, setVisible] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [timeImage, setTimeImage] = useState(null);
  const [colorTime, setTime] = useState('');
  const [showExtra, setShowExtra] = useState(false);
  const [oracleCard, setOracleCard] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [showAheadChallenge, setShowAheadChallenge] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState('tasks');
  // navigation.navigate('ChatAI');
  const [dropDownValue, setDropDownValue] = useState('weekly');
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    {
      id: 1,
      Oracle:
        'Today doesn’t ask you to rush or force outcomes. What is meant for you is already aligning, even if you can’t see it yet. Trust the pace of the day.',
      Expand:
        'This card appears when urgency or pressure is influencing your mindset. Angelic guidance reminds you that alignment happens through cooperation, not control. When you allow things to unfold naturally, clarity and ease follow.',
      image: require('../../Assets/Trust the Timing.png'),
      name: 'Trust the Timing',
    },
    {
      id: 2,
      Oracle:
        'You are not doing this alone, even if it feels quiet right now. Support surrounds you in visible and invisible ways. Allow yourself to lean into it.',
      Expand:
        'Angel oracle traditions often emphasize unseen support as reassurance. This card invites you to notice where help, encouragement, or ease is already present. You don’t have to carry everything by yourself today.',
      image: require('../../Assets/You Are Supported.png'),
      name: 'You Are Supported',
    },
    {
      id: 3,
      Oracle:
        'You don’t need to start today at full speed. Gentle beginnings create steadier momentum. Ease can be a strength.',
      Expand:
        'This message aligns with angelic guidance around self-compassion and balance. Moving gently helps you conserve energy and stay present. Today favors pacing over pushing.',
      image: require('../../Assets/Begin Gently.png'),
      name: 'Begin Gently',
    },
    {
      id: 4,
      Oracle:
        'You don’t need all the answers before the day begins. Some understanding arrives through experience. Let clarity meet you naturally.',
      Expand:
        'This card reassures you that uncertainty is not a failure. Angel guidance reminds you that insight unfolds in stages. Trust that today will reveal what you need, when you need it.',
      image: require('../../Assets/Clarity Will Come.png'),
      name: 'Clarity Will Come',
    },
    {
      id: 5,
      Oracle:
        'Come back to the present moment. Stability is available when you slow down and notice what’s real. You are here.',
      Expand:
        'Grounding is a core angelic theme for emotional steadiness. This card suggests reconnecting with your body and breath. From grounded awareness, better choices follow.',
      image: require('../../Assets/Ground Yourself.png'),
      name: 'Ground Yourself',
    },
    {
      id: 6,
      Oracle:
        'Your words will shape the tone of your day. Choose honesty guided by compassion. Begin with kindness toward yourself.',
      Expand:
        'Angel guidance often centers communication as a healing tool. This card reminds you that words carry energy. Gentle truth creates safety and connection.',
      image: require('../../Assets/Speak with Kindness.png'),
      name: 'Speak with Kindness',
    },
    {
      id: 7,
      Oracle:
        'Not everything today needs your management. Some things respond better to trust than effort. Letting go can create ease.',
      Expand:
        'This card reflects angel teachings around surrender. Control often comes from fear, while trust opens flow. Notice where effort is unnecessary and allow space for support.',
      image: require('../../Assets/Release Control.png'),
      name: 'Release Control',
    },
    {
      id: 8,
      Oracle:
        'Your energy is valuable and limited. You are allowed to choose where it goes. Boundaries today are an act of wisdom.',
      Expand:
        'Protection is a frequent angel oracle theme. This card encourages discernment around people, tasks, and emotions. Preserving energy supports clarity and balance.',
      image: require('../../Assets/Protect Your Energy.png'),
      name: 'Protect Your Energy',
    },
    {
      id: 9,
      Oracle:
        'You don’t need to prove your worth today. Your value is not tied to productivity or perfection. Showing up honestly is enough.',
      Expand:
        'Angel guidance often reassures worthiness. This card gently counters self-judgment and pressure. Resting in enoughness brings peace and confidence.',
      image: require('../../Assets/You Are Enough.png'),
      name: 'You are Enough',
    },
    {
      id: 10,
      Oracle:
        'Goodness is available to you today. You don’t need to deflect or brace against it. Allow yourself to receive.',
      Expand:
        'Angel cards frequently remind us that receiving is as important as giving. This message invites openness to ease, kindness, and small moments of joy. Let the day be lighter than expected.',
      image: require('../../Assets/Receive the Good.png'),
      name: 'Receive the Good',
    },

    {
      id: 11,
      Oracle:
        'You don’t need the whole path, just the next step. Progress happens through small, aligned actions. Begin where you are.',
      Expand:
        'Angel guidance often emphasizes forward motion without overwhelm. This card reassures you that clarity grows with movement. One step is enough for today.',
      image: require('../../Assets/Take the Next Step.png'),
      name: 'Take the Next Step',
    },
    {
      id: 12,
      Oracle:
        'What you feel today matters. Emotions are signals, not obstacles. Allow them space.',
      Expand:
        'This card reflects angel teachings around emotional awareness. When feelings are acknowledged, they soften. Listening inward creates clarity and balance.',
      image: require('../../Assets/Honor Your Feelings.png'),
      name: 'Honor Your Feelings',
    },
    {
      id: 13,
      Oracle:
        'Something helpful may arrive in an unexpected way. Openness creates opportunity.Release rigid expectations.',
      Expand:
        'Angel oracle themes often highlight openness as a doorway to guidance. This card encourages flexibility and curiosity. What you need may arrive differently than planned.',
      image: require('../../Assets/Stay Open.png'),
      name: 'Stay Open',
    },
    {
      id: 14,
      Oracle:
        'Slowing down supports progress. Rest restores clarity and energy. You’re allowed to pause.',
      Expand:
        'This card counters the belief that constant effort is required. Angel guidance reminds you that rest strengthens insight and resilience. Pausing today benefits what comes next.',
      image: require('../../Assets/Rest Is Productive.png'),
      name: 'Rest Is Productive',
    },
    {
      id: 15,
      Oracle:
        'Let your actions reflect what truly matters to you. Alignment brings peace, even when it’s uncomfortable. Choose honesty.',
      Expand:
        'Angel cards often emphasize integrity as inner alignment. Acting from values creates steadiness and self-trust. Today favors choices that feel true.',
      image: require('../../Assets/Act with Integrity.png'),
      name: 'Act with Integrity',
    },
    {
      id: 16,
      Oracle:
        'You already know more than you think. Your intuition is quiet but reliable. Listen inward.',
      Expand:
        'Angel guidance frequently affirms inner wisdom. This card encourages confidence in your own insight. Trust grows when you act on what feels right.',
      image: require('../../Assets/Trust Yourself.png'),
      name: 'Trust Yourself',
    },
    {
      id: 17,
      Oracle:
        'This moment is enough. Presence improves everything that follows. Come fully here.',
      Expand:
        'Angel teachings often emphasize presence as grounding and clarifying. When attention returns to now, stress softens. Today benefits from mindful awareness.',
      image: require('../../Assets/Choose Presence.png'),
      name: 'Choose Presence',
    },
    {
      id: 18,
      Oracle:
        'Complexity is optional today. Simplicity brings clarity and ease. Focus on what matters most.',
      Expand:
        'This card reflects angel guidance around reducing mental noise. When you simplify, energy returns. Let go of unnecessary effort.',
      image: require('../../Assets/Let It Be Simple.png'),
      name: 'Let It Be Simple',
    },
    {
      id: 19,
      Oracle:
        'You are being nudged in the right direction. Guidance may appear subtly. Pay attention.',
      Expand:
        'Angel oracle traditions often describe guidance as intuitive signals. This card invites awareness of signs, instincts, and gentle confirmations. Trust what you notice.',
      image: require('../../Assets/You Are Guided.png'),
      name: 'You Are Guided',
    },
    {
      id: 20,
      Oracle:
        'Gratitude changes how you experience the day. Appreciation softens perspective. Begin with thanks.',
      Expand:
        'Angel cards frequently highlight gratitude as a grounding practice. What you acknowledge grows in importance. Gratitude brings steadiness and calm.',
      image: require('../../Assets/End with Gratitude.png'),
      name: 'End with Gratitude',
    },
    {
      id: 21,
      Oracle:
        'One conscious breath can shift everything. Pause before reacting. Calm creates clarity.',
      Expand:
        'Angel guidance often encourages breath as a reset. This card reminds you to slow the nervous system before responding. Presence begins with breath.',
      image: require('../../Assets/Breathe First.png'),
      name: 'Breathe First',
    },
    {
      id: 22,
      Oracle:
        'Peace is available, even in challenge. You can choose calm over conflict. Let peace guide your responses.',
      Expand:
        'This card reflects angelic reassurance around emotional choice. Not every situation requires defense. Peace conserves energy and clarity.',
      image: require('../../Assets/Choose Peace.png'),
      name: 'Choose Peace',
    },
    {
      id: 23,
      Oracle:
        'Growth is happening, even when it feels messy. Learning often looks imperfect. Be patient with yourself.',
      Expand:
        'Angel oracle themes frequently normalize growth through experience. This card reframes mistakes as part of expansion. Compassion accelerates learning.',
      image: require('../../Assets/You Are Learning.png'),
      name: 'You Are Learning',
    },
    {
      id: 24,
      Oracle:
        'Something is shifting for your benefit. Change clears space for alignment. Trust the movement.',
      Expand:
        'Angel guidance often frames change as preparation. This card encourages openness rather than resistance. What’s shifting supports growth.',
      image: require('../../Assets/Welcome Change.png'),
      name: 'Welcome Change',
    },
    {
      id: 25,
      Oracle:
        'Guidance speaks softly. Answers may arrive through subtle feelings or quiet moments. Slow down enough to hear.',
      Expand:
        'Angel oracle traditions emphasize listening over forcing. This card invites attunement to intuition and subtle cues. Stillness reveals direction.',
      image: require('../../Assets/Listen Closely.png'),
      name: 'Listen Closely',
    },
  ];
  const handleEmailPress = () => {
    Linking.openURL(
      'mailto:saaday7@gmail.com?subject=Account Suspended – Assistance Needed&body=Hi Support Team, I noticed that my account has been suspended.Kindly guide me regarding the issue and what steps I need to take to reactivate my account.Thank you!',
    );
  };
  const removeCompletionImage = () => setCompletionImage(null);
  const [showCompletionCelebration, setShowCompletionCelebration] =
    useState(false);

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
      setTimeImage(require('../../Assets/Start 7.png'));
      setTime('Morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeImage(require('../../Assets/Start 8.png'));
      setTime('Noon');
    } else {
      setTimeImage(require('../../Assets/Start 9.png'));
      setTime('Night');
    }
  };

  const getAllTasks = () => {
    AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
      .then(res => {
        console.log('My All Tasks: ', res);
        setMyTasks(res?.data?.reverse() || []);
        setAllTaskDates(res.alldates || []);
      })
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

  const calendarListMarkedDates = useMemo(() => {
    const marked = {};
    const todayStr = moment().format('YYYY-MM-DD');
    const selectedStr = selectedStripDate.format('YYYY-MM-DD');

    console.log('AllTaskDates', AllTaskDates);

    // Convert array to object for easier checking
    const taskDatesObj = {};
    AllTaskDates.forEach(date => {
      taskDatesObj[date] = true;
    });

    // Mark all days with tasks
    Object.keys(taskDatesObj).forEach(dateStr => {
      marked[dateStr] = {
        ...marked[dateStr],
        marked: true,
        dotColor: Colors.white,
      };
    });

    // Today's styling (always selected by default)
    marked[todayStr] = {
      ...marked[todayStr], // Preserve task marks if today has tasks
      selected: true,
      selectedColor: Colors.mainColor,
      selectedTextColor: Colors.white,
      marked: true,
      dotColor: Colors.white,
    };

    // If user selects a different date, mark it as selected
    if (selectedStr !== todayStr) {
      marked[selectedStr] = {
        ...marked[selectedStr], // Preserve task marks if selected date has tasks
        selected: true,
        selectedColor: Colors.mainColor,
        selectedTextColor: Colors.white,
      };

      // Remove selected from today if another date is selected
      if (marked[todayStr]) {
        delete marked[todayStr].selected;
        delete marked[todayStr].selectedColor;
        delete marked[todayStr].selectedTextColor;
      }
    }

    return marked;
  }, [AllTaskDates, selectedStripDate]);

  const deleteTask = id => {
    const formdata = new FormData();
    formdata.append('id', id);
    PostAPiwithToken({ url: 'delete-task', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('apiresponse', JSON.stringify(res));
        if (res.status === 'success') {
          console.log(res);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
          });
          getAllTasks();
        } else {
          console.log(res);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Task delete error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete task',
        });
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
        // console.log('check subscription', JSON.stringify(res));
        setmySubscription(res.subscription);
      })
      .catch(err => console.log('api error subscription', err));
  };
  // useEffect(() => {
  //   checkModalStatus();
  // }, []);
  useEffect(() => {
    let timer;
    const init = async () => {
      if (mySubscription === 0) {
        timer = setTimeout(() => {
          setShowAheadChallenge(true);
        }, 3000);
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

  function parseDateTime(str) {
    const match = str.match(/^(\d{4}-\d{2}-\d{2}) (\d{1,2}):(\d{2}) ([AP]M)$/);
    if (!match) {
      console.error('Invalid datetime format:', str);
      return new Date(NaN);
    }
    const [, date, hourStr, minuteStr, meridiem] = match;
    let hours = Number(hourStr);
    const minutes = Number(minuteStr);

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return new Date(
      `${date}T${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:00`,
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const nowDate = new Date(now);

      const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

      // 1️⃣ Find next upcoming task
      const upcomingTasks = myTasks
        .map(t => {
          const dateObj = parseDateTime(t.start_datetime);
          return { ...t, dateObj, time: dateObj.getTime() };
        })
        .filter(t => isSameDay(t.dateObj, nowDate) && t.time > now)
        .sort((a, b) => a.time - b.time);

      const next = upcomingTasks[0] || null;
      setNextTask(next);

      if (!next) {
        setTimeLeft('00:00:00');
        setProgress(0);
        return;
      }

      // 2️⃣ Set reference start time for new task
      // Use task ID or some unique identifier instead of timestamp
      if (taskStartRef.current !== next.id) {
        // Changed from next.time
        taskStartRef.current = next.id; // Store the task ID, not timestamp
        taskStartTimeRef.current = now; // You might need another ref for start time
        setProgress(0);
      }

      const totalDuration = next.time - (taskStartTimeRef?.current || now);
      const elapsed = now - (taskStartTimeRef?.current || now);
      const progressValue = Math.min(1, elapsed / totalDuration);
      setProgress(progressValue);

      // 3️⃣ Calculate countdown
      const diff = next.time - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:` +
          `${minutes.toString().padStart(2, '0')}:` +
          `${seconds.toString().padStart(2, '0')}`,
      );

      // 4️⃣ Handle task finished
      if (diff <= 0) {
        setProgress(1);
        setTimeLeft('00:00:00');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [myTasks]);

  const getToken = async () => {
    let fcmToken = await messaging().getToken();
    const formData = new FormData();
    formData.append('fcm_token', fcmToken);
    PostAPiwithToken({ url: 'update-fcm', Token: user?.api_token }, formData)
      .then(res => {
        console.log('FCM token update----- runner', JSON.stringify(res));
        if (res.suspend === 1) {
          setuserSuspended(true);
        }
      })
      .catch(err => console.log('error in update', err));

    messaging().onTokenRefresh(token => {
      const formData = new FormData();
      formData.append('fcm_token', token);
      PostAPiwithToken(
        { url: 'update-fcm', Token: user?.api_token },
        formData,
      ).catch(() => {});
    });
  };
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        console.log('avigwation done ');
        getToken();
      });
      return unsubscribe;
    }, [navigation]),
  );

  useFocusEffect(
    useCallback(() => {
      getAllTasks();
      CheckSubscription();
      getAllNotes();
      getAllReminders();
    }, []),
  );

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
  const markedDates = AllTaskDates.map(item => ({
    date: moment(item), // IMPORTANT
    dots: [
      {
        color: 'white',
        selectedColor: 'white',
      },
    ],
  }));

  const getcheck = () => {
    const formdata = new FormData();
    formdata.append('task_id', currentTask.id);
    setIsLoading(true);

    PostAPiwithToken(
      { url: 'incomplete-task', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        getAllTasks();
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Complete task error:', err);
        // Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong' });
      });
  };
  const filteredTasks = useMemo(() => {
    const selectedDateStr = selectedStripDate.format('YYYY-MM-DD');
    // console.log('Selected Date:', selectedDateStr);

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
          2: 'In Progress',
          3: 'Completed',
          4: 'Canceled',
        };
        matchesTag = task.status === tagMap[onchangeTab];
      }

      return matchesDate && matchesTag;
    });
  }, [myTasks, selectedStripDate, onchangeTab]);
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
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF8E5',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '90%',
              backgroundColor: '#FFF8E5',
              borderRadius: 20,
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                if (mySubscription === 0) {
                  timer = setTimeout(() => {
                    setShowAheadChallenge(true);
                  }, 3000);
                } else {
                  setShowAheadChallenge(false);
                }
              }}
              style={{
                position: 'absolute',
                top: 30,
                backgroundColor: 'white',
                borderRadius: 20,
                right: 30,
                zIndex: 1000,
              }}
            >
              <AntDesign name={'close'} size={24} color={Colors.black} />
            </TouchableOpacity>

            <Image
              resizeMode="cover"
              source={oracleCard?.image}
              style={{ width: '100%', height: 250, borderRadius: 10 }}
            />
            <View
              style={{
                backgroundColor: 'white',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ fontSize: 14, fontFamily: fonts.bold, color: 'black' }}
              >
                {oracleCard?.name}
              </Text>
            </View>

            <Text style={{ marginTop: 20, fontSize: 16 }}>
              {oracleCard?.Oracle}
            </Text>

            {showExtra && (
              <Text style={{ marginTop: 20 }}>{oracleCard?.Expand}</Text>
            )}

            <TouchableOpacity
              onPress={() =>
                showExtra ? setVisible(false) : setShowExtra(true)
              }
            >
              <Text
                style={{ alignSelf: 'center', marginTop: 20, color: '#00BF63' }}
              >
                {showExtra ? 'Go To Home' : 'Read More'}
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
  const formatDate = dateString => {
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
    if (showCompletionCelebration || showPendingYesterdayModal) {
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
  }, [showCompletionCelebration, showPendingYesterdayModal]);

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXValue.value }],
    };
  });
  // if (isLoading) {
  //   return <ActivityIndicator size="large" color="#7A2A73" />;
  // }
  const { height } = Dimensions.get('window');
  return (
    <ImageBackground
      source={images.mainImage}
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
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        {/* Header */}
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            elevation: 4,
            width: wp(100),
            height: wp(25),

            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <TouchableOpacity
            style={{ zIndex: 100 }}
            onPress={() => {
              console.log('Drawer Pressed');
              navigation.openDrawer();
            }}
          >
            <Image
              source={images.menuIcon2}
              style={{ width: 26, height: 26, marginRight: wp(2) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{ color: 'white', fontSize: 20, fontFamily: fonts.bold }}
            >
              {selectedMenu === 'tasks' ? 'Daily Task' : 'Daily Meetings'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchScreen')}
              style={{
                borderRadius: 19,
                overflow: 'hidden',
                marginRight: wp(2),
              }}
            >
              <ImageBackground
                source={images.mainImage}
                style={{
                  width: 38,
                  height: 38,

                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                }}
                resizeMode="cover"
              >
                <Fontisto name="search" color="white" size={25} />
              </ImageBackground>
            </TouchableOpacity>
            <View
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 20,
              }}
            >
              <Pressable onPress={() => setMenuOpen(true)}>
                <ImageBackground
                  source={images.mainImage}
                  style={{
                    width: 38,
                    height: 38,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Fontisto name="more-vert" color="white" size={26} />
                </ImageBackground>
              </Pressable>
            </View>
            <Modal
              visible={menuOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setMenuOpen(false)} // Android back button
            >
              {/* Backdrop */}
              <Pressable style={{ flex: 1 }} onPress={() => setMenuOpen(false)}>
                {/* Menu container */}
                <View
                  style={{
                    position: 'absolute',
                    top: 60, // adjust for header height
                    right: 16, // align to right
                    width: 100,
                    backgroundColor: '#7A2A73',
                    borderRadius: 6,
                    padding: 8,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setMenuOpen(false);
                      setSelectedMenu('tasks');
                      console.log('Tasks');
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        paddingBottom: 4,
                        borderBottomWidth: 0.5,
                        borderBottomColor: 'white',
                      }}
                    >
                      Tasks
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setMenuOpen(false);
                      setSelectedMenu('meetings');
                      console.log('Meetings');
                    }}
                  >
                    <Text style={{ color: 'white', paddingTop: 4 }}>
                      Meetings
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#7A2A73" />
        ) : selectedMenu === 'tasks' ? (
          // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          //   <View>
          //     <CalendarStrip
          //       style={{
          //         height: 140,
          //         width: '72%',
          //       }}
          //       calendarHeaderStyle={{
          //         color: 'white',
          //         fontSize: 14,
          //         alignSelf: 'flex-start',
          //         marginStart: 20,
          //       }}
          //       selectedDate={selectedStripDate}
          //       onDateSelected={date => setSelectedDate(moment(date))}
          //       dayComponentHeight={DAY_HEIGHT}
          //       minDayComponentSize={DAY_HEIGHT}
          //       scrollable
          //       startingDate={moment()}
          //       scrollToOnSetSelectedDate
          //       showArrows={false}
          //       iconStyle={{ display: 'none' }}
          //       dateNameStyle={{
          //         color: '#FF88F4',
          //         fontSize: wp(3.5),
          //         fontFamily: fonts.bold,
          //       }}
          //       dateNumberStyle={{
          //         color: '#FF88F4',
          //         fontSize: wp(4.5),
          //         fontFamily: fonts.bold,
          //       }}
          //       highlightDateNameStyle={{
          //         color: 'white',
          //         fontSize: wp(3.5),
          //         fontFamily: fonts.bold,
          //       }}
          //       highlightDateNumberStyle={{
          //         color: 'white',
          //         fontSize: wp(4.5),
          //         fontFamily: fonts.bold,
          //       }}
          //       // 🟪 Selected day (taller rectangle)
          //       highlightDateContainerStyle={{
          //         backgroundColor: '#BD2BAF',
          //         width: DAY_WIDTH,
          //         height: DAY_HEIGHT,
          //         borderRadius: wp(3),
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //       }}
          //       // ⬜ Normal day (taller rectangle)
          //       dateContainerStyle={{
          //         width: DAY_WIDTH,
          //         height: DAY_HEIGHT,
          //         borderRadius: wp(3),
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //         marginVertical: 0,
          //       }}
          //       markedDates={markedDates}
          //     />

          //     <Dropdown
          //       style={{
          //         backgroundColor: '#BD2BAF50',
          //         position: 'absolute',
          //         top: '50%',
          //         right: 10,
          //         height: 30,
          //         width: 90,
          //         paddingHorizontal: 8,
          //         borderRadius: 8,
          //         zIndex: 999,
          //         elevation: 10,
          //       }}
          //       placeholderStyle={{
          //         color: 'white',
          //         fontSize: 12,
          //         fontFamily: fonts.medium,
          //       }}
          //       itemTextStyle={{ fontSize: 12 }}
          //       selectedTextStyle={{
          //         color: 'white',
          //         fontSize: 12,
          //         fontFamily: fonts.bold,
          //       }}
          //       iconStyle={{ width: 15, height: 15, color: 'white' }}
          //       data={[
          //         { label: 'Weekly', value: 'weekly' },
          //         { label: 'Monthly', value: 'monthly' },
          //       ]}
          //       labelField="label"
          //       valueField="value"
          //       placeholder="..."
          //       value={dropDownValue}
          //       onFocus={() => setIsFocus(true)}
          //       onBlur={() => setIsFocus(false)}
          //       onChange={item => {
          //         setDropDownValue(item.value);
          //         setIsFocus(false);
          //       }}
          //       containerStyle={{
          //         borderRadius: 8,
          //         zIndex: 1000,
          //       }}
          //     />
          //   </View>

          //   {/* ACTIVE FOCUS SESSION */}
          //   <View
          //     style={{
          //       paddingHorizontal: wp(3),
          //       paddingVertical: 12,
          //       marginHorizontal: 12,
          //       marginBottom: 12,
          //       backgroundColor: '#BD2BAFB2',
          //       borderRadius: 12,
          //     }}
          //   >
          //     {nextTask ? (
          //       <>
          //         <View
          //           style={{
          //             flexDirection: 'row',
          //             justifyContent: 'space-between',
          //             alignItems: 'center',
          //             marginBottom: 5,
          //             marginTop: -4,
          //           }}
          //         >
          //           <Text
          //             style={{
          //               color: 'white',
          //               fontFamily: fonts.medium,
          //               fontSize: 14,
          //             }}
          //           >
          //             {/* ACTIVE FOCUS SESSION */}
          //             Upcoming Task
          //           </Text>
          //           <Text
          //             style={{
          //               color: 'white',
          //               fontFamily: fonts.bold,
          //               fontSize: 18,
          //             }}
          //           >
          //             {timeLeft}
          //           </Text>
          //         </View>
          //         <View
          //           style={{
          //             flexDirection: 'row',
          //             justifyContent: 'space-between',
          //             alignItems: 'center',
          //           }}
          //         >
          //           <Text
          //             style={{
          //               color: 'white',
          //               fontFamily: fonts.bold,
          //               fontSize: 18,
          //             }}
          //           >
          //             {nextTask?.title}
          //           </Text>
          //           <Text
          //             style={{
          //               color: 'white',
          //               fontFamily: fonts.medium,
          //               fontSize: 14,
          //             }}
          //           >
          //             remaining
          //           </Text>
          //         </View>

          //         <View
          //           style={{
          //             width: '100%',
          //             height: 8,
          //             backgroundColor: '#FFFFFF4D',
          //             borderRadius: 50,
          //             overflow: 'hidden',
          //             marginTop: 5,
          //           }}
          //         >
          //           <Text
          //             style={{
          //               width: `${Math.round(progress * 100)}%`,
          //               backgroundColor: '#FFFFFF',
          //             }}
          //           ></Text>
          //         </View>
          //       </>
          //     ) : (
          //       <Text
          //         style={{
          //           color: 'white',
          //           fontFamily: fonts.medium,
          //           fontSize: 14,
          //           textAlign: 'center',
          //         }}
          //       >
          //         No Upcoming Tasks
          //       </Text>
          //     )}
          //   </View>

          //   {/* Your tabs horizontal scroll */}
          //   <View style={{ marginTop: wp(2) }}>
          //     <ScrollView
          //       horizontal
          //       showsHorizontalScrollIndicator={false}
          //       contentContainerStyle={{
          //         flexDirection: 'row',
          //         alignItems: 'center',
          //         paddingHorizontal: wp(1),
          //         gap: wp(2.5),
          //       }}
          //     >
          //       {['All', 'In Progress', 'Completed', 'Canceled'].map(
          //         (tab, index, array) => (
          //           <TouchableOpacity
          //             key={tab}
          //             activeOpacity={0.8}
          //             onPress={() => setOnChangeTab((index + 1).toString())}
          //             style={{
          //               marginLeft: index === 0 ? wp(4) : 0,
          //               marginRight: index === array.length - 1 ? wp(4) : 0,
          //               marginBottom: wp(3),
          //             }}
          //           >
          //             <View
          //               style={{
          //                 paddingHorizontal: wp(3),
          //                 paddingVertical: wp(3),
          //                 borderRadius: wp(2),
          //                 backgroundColor:
          //                   onchangeTab === (index + 1).toString()
          //                     ? '#BD2BAF'
          //                     : '#BD2BAF20',

          //                 width: 'auto',
          //               }}
          //             >
          //               <Text
          //                 style={{
          //                   fontSize: 13,
          //                   fontFamily: fonts.bold,
          //                   color: Colors.white,
          //                   textAlign: 'center',
          //                 }}
          //               >
          //                 {tab}
          //               </Text>
          //             </View>
          //           </TouchableOpacity>
          //         ),
          //       )}
          //     </ScrollView>
          //   </View>
          //   <View style={{ flex: 1 }}>
          //     <FlatList
          //       data={filteredTasks}
          //       keyExtractor={item => item.id.toString()}
          //       nestedScrollEnabled
          //       scrollEnabled
          //       renderItem={({ item }) => (
          //         <TaskItem item={item} navigation={navigation} />
          //       )}
          //       ListEmptyComponent={() => (
          //         <View
          //           style={{
          //             flex: 1,
          //             justifyContent: 'center',
          //             alignItems: 'center',
          //             paddingVertical: hp(10),
          //           }}
          //         >
          //           <Text
          //             style={{
          //               color: 'gray',
          //               fontSize: 16,
          //               textAlign: 'center',
          //             }}
          //           >
          //             No tasks found for {selectedStripDate.format('MMMM D, YYYY')}
          //           </Text>
          //         </View>
          //       )}
          //       contentContainerStyle={
          //         filteredTasks.length === 0 ? { flexGrow: 1 } : {}
          //       }
          //     />
          //   </View>
          // </ScrollView>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View>
              {dropDownValue === 'weekly' ? (
                <CalendarStrip
                  scrollable
                  startingDate={moment()}
                  showArrows={false}
                  scrollToOnSetSelectedDate
                  style={{ height: 140 }}
                  calendarHeaderStyle={{
                    color: 'white',
                    fontFamily: fonts.bold,
                  }}
                  selectedDate={selectedStripDate}
                  onDateSelected={date => setSelectedStripDate(moment(date))}
                  dayComponentHeight={DAY_HEIGHT}
                  dateNameStyle={{
                    color: '#FF88F4',
                    fontSize: wp(3.5),
                    fontFamily: fonts.bold,
                  }}
                  dateNumberStyle={{
                    color: '#FF88F4',
                    fontSize: wp(3.5),
                    fontFamily: fonts.bold,
                  }}
                  highlightDateNameStyle={{
                    color: 'white',
                    fontSize: wp(3.5),
                    fontFamily: fonts.bold,
                  }}
                  highlightDateNumberStyle={{
                    color: 'white',
                    fontSize: wp(3.5),
                    fontFamily: fonts.bold,
                  }}
                  // 🟪 Selected day (taller rectangle)
                  highlightDateContainerStyle={{
                    backgroundColor: '#BD2BAF',
                    borderRadius: wp(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  // ⬜ Normal day (taller rectangle)
                  dateContainerStyle={{
                    borderRadius: wp(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  leftSelector={[]}
                  rightSelector={[]}
                  markedDates={markedDates}
                />
              ) : (
                <CalendarList
                  current={moment().format('YYYY-MM-DD')}
                  pastScrollRange={24}
                  futureScrollRange={24}
                  markedDates={calendarListMarkedDates}
                  horizontal
                  pagingEnabled
                  staticHeader
                  onDayPress={date => {
                    console.log('moment', moment(date));
                    setSelectedStripDate(moment(date.dateString));
                  }}
                  theme={{
                    backgroundColor: 'transparent',
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: Colors.mainColor,
                    dayTextColor: Colors.white,
                    textDisabledColor: '#dd99ee',
                    // Hide arrows completely
                    'stylesheet.calendar.header': {
                      header: {
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginTop: 6,
                        marginBottom: 10,
                      },
                      monthText: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: Colors.white,
                      },
                      arrow: {
                        width: 0, // Hide arrows by setting width to 0
                        height: 0,
                      },
                      week: {
                        marginTop: 7,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E7EB',
                        paddingBottom: 10,
                      },
                    },
                    // Alternative arrow hiding method
                    arrowColor: 'transparent',
                    arrowWidth: 0,
                    arrowHeight: 0,
                    // Header styling
                    monthTextColor: '#1F2937',
                    textMonthFontSize: 18,
                    textMonthFontWeight: '600',
                  }}
                  // Disable month change on arrow press
                  onPressArrowLeft={() => {}} // Empty function to disable
                  onPressArrowRight={() => {}} // Empty function to disable
                />
              )}

              {/* <Pressable
                                      style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#BD2BAF50',
                                        paddingHorizontal: 10,
                                        paddingVertical: 6,
                                        borderRadius: 8,
                                      }}
                                    > */}
              <Dropdown
                style={{
                  backgroundColor: '#BD2BAF50',
                  position: 'absolute',
                  top: 0,
                  right: 10,
                  height: 30,
                  width: 90,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  zIndex: 999,
                  elevation: 10,
                }}
                placeholderStyle={{
                  color: 'white',
                  fontSize: 12,
                  fontFamily: fonts.medium,
                }}
                itemTextStyle={{ fontSize: 12, color: Colors.white }}
                selectedTextStyle={{
                  color: 'white',
                  fontSize: 12,
                  fontFamily: fonts.medium,
                }}
                iconStyle={{
                  width: 15,
                  height: 15,
                  color: 'white',
                }}
                data={[
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="..."
                value={dropDownValue}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setDropDownValue(item.value);
                  setIsFocus(false);
                }}
                containerStyle={{
                  borderRadius: 8,
                  zIndex: 1000,
                  backgroundColor: Colors.mainColor,
                  borderWidth: 1,
                  overflow: 'hidden',
                }}
                activeColor={Colors.mainColor}
              />
            </View>

            {/* ACTIVE FOCUS SESSION */}
            <View
              style={{
                paddingHorizontal: wp(3),
                paddingVertical: 12,
                marginHorizontal: 12,
                marginBottom: 12,
                backgroundColor: '#BD2BAFB2',
                borderRadius: 12,
              }}
            >
              {nextTask ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 5,
                      marginTop: -4,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fonts.medium,
                        fontSize: 14,
                      }}
                    >
                      {/* ACTIVE FOCUS SESSION */}
                      Upcoming Task
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fonts.bold,
                        fontSize: 18,
                      }}
                    >
                      {timeLeft}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fonts.bold,
                        fontSize: 18,
                      }}
                    >
                      {nextTask?.title}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fonts.medium,
                        fontSize: 14,
                      }}
                    >
                      remaining
                    </Text>
                  </View>

                  <View
                    style={{
                      height: 8,
                      width: '100%',
                      backgroundColor: '#FFFFFF4D',
                      borderRadius: 50,
                      overflow: 'hidden',
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        width: `${Math.round(progress * 100)}%`,
                        backgroundColor: '#FFFFFF',
                      }}
                    ></Text>
                  </View>
                </>
              ) : (
                <Text
                  style={{
                    color: 'white',
                    fontFamily: fonts.medium,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  No Upcoming Task for Today
                </Text>
              )}
            </View>

            {/* Tabs */}
            <View style={{ marginTop: wp(0) }}>
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
                {['All', 'In Progress', 'Completed', 'Canceled'].map(
                  (tab, index, array) => (
                    <TouchableOpacity
                      key={tab}
                      activeOpacity={0.8}
                      onPress={() => setOnChangeTab((index + 1).toString())}
                      style={{
                        marginLeft: index === 0 ? wp(4) : 0,
                        marginRight: index === array.length - 1 ? wp(4) : 0,
                        marginBottom: wp(3),
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: wp(3),
                          paddingVertical: wp(3),
                          borderRadius: wp(2),
                          backgroundColor:
                            onchangeTab === (index + 1).toString()
                              ? '#BD2BAF'
                              : '#BD2BAF20',

                          width: 'auto',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily:
                              onchangeTab === (index + 1).toString()
                                ? fonts.bold
                                : fonts.medium,
                            color: Colors.white,
                            textAlign: 'center',
                          }}
                        >
                          {tab}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>
            </View>

            {/* Tasks List */}
            <View style={{ flex: 1 }}>
              <FlatList
                data={filteredTasks}
                keyExtractor={item => item?.id?.toString()}
                nestedScrollEnabled
                scrollEnabled
                renderItem={({ item }) => {
                  return (
                    <TaskItem
                      item={item}
                      navigation={navigation}
                      onDelete={deleteTask}
                    />
                  );
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      // flex: 1,
                      height: height * 0.6,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        textAlign: 'center',
                      }}
                    >
                      There are no tasks scheduled for{' '}
                      {selectedStripDate.format('MMMM D, YYYY')}
                    </Text>
                  </View>
                }
                contentContainerStyle={
                  filteredTasks.length === 0 ? { flexGrow: 1 } : {}
                }
              />
            </View>
          </ScrollView>
        ) : (
          <DailyMeetings />
        )}

        <Modal
          visible={visible}
          animationType="fade"
          presentationStyle="fullScreen"
        >
          {!showOracle ? (
            <ImageBackground
              source={timeImage}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            >
              <Image
                source={require('../../Assets/Ahead.png')}
                style={{
                  width: '80%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginTop: hp(15),
                  height: 160,
                  backgroundColor: '#BD2BAF33',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 30,
                  marginTop: hp(20),
                  fontFamily: fonts.bold,
                }}
              >
                Good {colorTime}
              </Text>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={images.mainImage}
              style={{
                flex: 1,
                backgroundColor: '#FFF8E5',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#00000099',
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    if (mySubscription === 0) {
                      timer = setTimeout(() => {
                        setShowAheadChallenge(true);
                      }, 3000);
                    } else {
                      setShowAheadChallenge(false);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 30,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: 30,
                    zIndex: 1000,
                  }}
                >
                  <AntDesign name={'close'} size={24} color={Colors.black} />
                </TouchableOpacity>

                <Image
                  resizeMode="cover"
                  source={oracleCard?.image}
                  style={{
                    width: '100%',
                    height: 250,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                />
                <View
                  style={{
                    backgroundColor: '#BD2BAF4D',
                    height: 50,
                    alignItems: 'center',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: 'white',
                    }}
                  >
                    {oracleCard?.name}
                  </Text>
                </View>

                <Text style={{ marginTop: 20, color: 'white', fontSize: 16 }}>
                  {oracleCard?.Oracle}
                </Text>

                {showExtra && (
                  <Text style={{ marginTop: 20, color: 'white' }}>
                    {oracleCard?.Expand}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() =>
                    showExtra ? setVisible(false) : setShowExtra(true)
                  }
                >
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 20,
                      color: Colors.mainColor,
                    }}
                  >
                    {showExtra ? 'Go To Home' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}
        </Modal>

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
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: wp(5),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: wp(4),
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  Upload Proof of Completion
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowImagePickerModal(false);
                    setCompletionImage(null);
                  }}
                >
                  <AntDesign name="close" size={24} color={Colors.black} />
                </TouchableOpacity>
              </View>

              <Text
                style={{ color: '#666', fontSize: 14, marginBottom: wp(5) }}
              >
                Please upload one photo showing the task is completed.
              </Text>

              <View style={{ alignItems: 'center', marginBottom: wp(6) }}>
                {completionImage ? (
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: completionImage }}
                      style={{
                        width: wp(70),
                        height: wp(70),
                        borderRadius: 12,
                      }}
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
                    <Text
                      style={{ marginTop: 10, color: '#999', fontSize: 14 }}
                    >
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
          visible={showCompletionCelebration}
          animationType="fade"
          onRequestClose={() => {
            setShowCompletionCelebration(false);
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
                  backgroundColor: 'white',
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
                  source={images.completeT}
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
        <Modal
          transparent={true}
          visible={showPendingYesterdayModal}
          animationType="fade"
          onRequestClose={() => setShowPendingYesterdayModal(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setShowPendingYesterdayModal(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    animatedStyle2,
                    {
                      backgroundColor: 'white',
                      borderRadius: 30,
                      padding: wp(8),
                      alignItems: 'center',
                      maxWidth: wp(85),
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.3,
                      shadowRadius: 20,
                      elevation: 20,
                    },
                  ]}
                >
                  {/* Replace with your sad image */}
                  <Image
                    source={images.sad || images.happy}
                    style={{
                      width: wp(55),
                      height: wp(55),
                      resizeMode: 'contain',
                      marginBottom: wp(4),
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                      textAlign: 'center',
                      marginBottom: wp(3),
                    }}
                  >
                    Oh no! You have Incomplete tasks 😔
                  </Text>

                  {/* <Text style={{
            fontSize: 15,
            color: '#666',
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: wp(6),
          }}>
            Let's complete them first before creating new ones!
          </Text> */}

                  <TouchableOpacity
                    onPress={() => {
                      setShowPendingYesterdayModal(false);
                      getcheck();
                      // Optional: Open bottom sheet anyway, or just close
                      // refRBSheet.current.open(); // Uncomment if you want to allow creating task anyway
                    }}
                    style={{
                      width: wp(60),
                      height: wp(13),
                      backgroundColor: Colors.mainColor,
                      borderRadius: wp(2),
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.bold,
                        color: Colors.white,
                        fontSize: 16,
                      }}
                    >
                      Okay
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <AheadChallengeModal
          visible={showAheadChallenge}
          navigation={navigation}
          onClose={() => setShowAheadChallenge(false)}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Home;
