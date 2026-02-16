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
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ToastAndroid,
  Pressable,
  Dimensions,
} from 'react-native';
// import MaterialDesignIcons from 'react-native-vector-icons/MaterialDesignIcons';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageCropPicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import { CalendarList } from 'react-native-calendars';
import CalendarStrip from 'react-native-calendar-strip';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';

import moment from 'moment';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DailyMeetings from './DailyMeetings';

const { height } = Dimensions.get('window');

const TaskItem = ({ item, onPress, onDelete }) => {
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
    } else if (tag === 'LeaSocial & Relationships') {
      return '#CE8500';
    }
  };
  const formatCreatedTime = time => {
    const d = new Date(time);
    return d.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  console.log(item);

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
            // marginVertical: wp(2),
            padding: 8,
            marginVertical: 16,
            borderRadius: wp(2),
          },
        ]}
        onPress={() => onDelete(item.id)}
      >
        <Fontisto name="delete" color="white" size={35} />
      </TouchableOpacity>
    );
  };

  return (
    <ReanimatedSwipeable renderRightActions={() => renderRightActions(item.id)}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          // activeOpacity={0.85}
          onPress={onPress} // ← only non-completed tasks are clickable
          style={[
            // styles.flatView,
            {
              // backgroundColor: item.color || '#ECF7F3',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: wp(4),
              marginVertical: wp(2),
              padding: 8,
            },
          ]}
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
              // backgroundColor: item.color || '#ECF7F3',
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
              }}
            >
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
          </View>
        </TouchableOpacity>
      </Animated.View>
    </ReanimatedSwipeable>
  );
};

// ── Main Screen ──
const Tasks = ({ navigation }) => {
  const DAY_WIDTH = 70;
  const DAY_HEIGHT = 85; // a bit taller than width
  const user = useSelector(state => state.user.user);
  const titleInputRef = useRef(null);
  const [myTasks, setMyTasks] = useState([]);
  // console.log('my taskss',JSON.stringify(myTasks))
  const [title, setTitle] = useState('');
  const [onchangeTab, setOnChangeTab] = useState('1');
  const [isloading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ECF7F3');
  const [sheetOpened, setSheetOpened] = useState(false);
  const [description, setDescription] = useState('');
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [modalVisiblemember, setModalVisibleMember] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [modalVisibletag, setModalVisibletag] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStripDate, setSelectedStripDate] = useState(moment());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [completionImage, setCompletionImage] = useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const today = new Date().toISOString().split('T')[0];
  const [AllTaskDates, setAllTaskDates] = useState([]);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);

  // Meeting States
  const [meetingtitle, setMeetingTitle] = useState('');
  const [meetingSelectedDate, setMeetingSelectedDate] = useState(null);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [meetingEndTime, setMeetingEndTime] = useState(null);
  const [meetingAllMembers, setMeetingAllMembers] = useState([]);
  const [meetingDescription, setMeetingDescription] = useState('');
  const [allMeetings, setAllMeeting] = useState([]);
  const [addMeetingModal, setAddMeetingModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState('');
  const [dropDownValue, setDropDownValue] = useState('weekly');
  const [isFocus, setIsFocus] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [timeType, setTimeType] = useState('start');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPendingYesterdayModal, setShowPendingYesterdayModal] =
    useState(false);
  const [hasShownYesterdayReminderToday, setHasShownYesterdayReminderToday] =
    useState(false);

  const REMINDER_STORAGE_KEY = 'YESTERDAY_TASK_REMINDER_SHOWN_DATE';
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('tasks');

  useEffect(() => {
    const showEvent =
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent =
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates?.height || 0);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const markedDates = AllTaskDates.map(item => ({
    date: moment(item), // IMPORTANT
    dots: [
      {
        color: 'white',
        selectedColor: 'white',
      },
    ],
  }));

  console.log('markedDates', markedDates);

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

  console.log('calendarListMarkedDates', calendarListMarkedDates);

  // Check if we already showed the reminder today
  const checkIfReminderShownToday = async () => {
    try {
      const storedDate = await AsyncStorage.getItem(REMINDER_STORAGE_KEY);
      const today = moment().format('YYYY-MM-DD');

      if (storedDate === today) {
        setHasShownYesterdayReminderToday(true);
      } else {
        setHasShownYesterdayReminderToday(false);
      }
    } catch (error) {
      console.log('AsyncStorage error:', error);
      setHasShownYesterdayReminderToday(false);
    }
  };

  // Mark that we have shown the reminder today
  const markReminderAsShownToday = async () => {
    try {
      const today = moment().format('YYYY-MM-DD');
      await AsyncStorage.setItem(REMINDER_STORAGE_KEY, today);
      setHasShownYesterdayReminderToday(true);
    } catch (error) {
      console.log('Failed to save reminder date:', error);
    }
  };

  // Check if a task is from yesterday
  const isTaskFromYesterday = task => {
    const taskDate = moment(task.start_datetime, 'YYYY-MM-DD hh:mm A').format(
      'YYYY-MM-DD',
    );
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    return taskDate === yesterday;
  };

  // Check if there are pending tasks from yesterday
  const hasPendingYesterdayTasks = () => {
    return myTasks.some(
      task => task.status !== 'Completed' && isTaskFromYesterday(task),
    );
  };

  const filteredTasks = useMemo(() => {
    console.log(selectedStripDate);
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
          2: 'Learning & Growth',
          3: 'Urgent Tasks',
          4: 'Creativity & Inspiration',
          5: 'Productivity Task',
          6: 'Self-Improvement',
          7: 'Social & Relationships',
        };

        matchesTag = task.tag === tagMap[onchangeTab];
      }
      console.log(matchesTag);

      return matchesDate && matchesTag;
    });
  }, [myTasks, selectedStripDate, onchangeTab]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] =
    useState(false);
  const [showSadCelebration, setShowSadCelebration] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  console.log('my mode', isEditMode);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const dotOptions = [
    // { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Inprogress' },
    { label: 'Completed', value: 'Completed' },
  ];

  const getAllTasks = () => {
    AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
      .then(res => {
        setMyTasks(res.data || []);
        setAllTaskDates(res.alldates);
      })
      .catch(err => console.log('api error tasks', err));
  };

  const getAllMeetings = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'view-all-meeting', Token: user?.api_token })
      .then(res => {
        console.log('Metting response:', res.data);
        setIsLoading(false);
        if (res.status === 'success') setAllMeeting(res.data || []);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('meeting API error:', err);
      });
  };
  const refRBSheet = useRef();
  const refRBSheetMeeting = useRef();

  useFocusEffect(
    useCallback(() => {
      getAllTasks();
      getAllMeetings();
      checkIfReminderShownToday();
    }, []),
  );

  useEffect(() => {
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => setAllMembers(res.data || []))
      .catch(err => console.log('api error friends', err));
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AllGetAPI({ url: 'friends', Token: user?.api_token })
        .then(res => setAllMembers(res.data || []))
        .catch(err => console.log('api error friends', err));
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const formatDateForAPI = date => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
  };

  const CreateMeetingApi = () => {
    console.log('Function start');
    if (!meetingtitle?.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Title is required' });
      return;
    }

    if (!meetingSelectedDate) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Date is required' });
      return;
    }

    if (!meetingStartTime) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Start time is required',
      });
      return;
    }

    if (!meetingEndTime) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'End time is required',
      });
      return;
    }

    if (!meetingDescription?.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Description is required',
      });
      return;
    }
    console.log('After Validation');
    const formdata = new FormData();
    formdata.append('title', meetingtitle);
    selectedMembers?.forEach(id => formdata.append('member_ids[]', id));
    formdata.append('duration', selectedPriority);
    formdata.append('date', formatDateForAPI(meetingSelectedDate));
    formdata.append('start_time', formatTime(meetingStartTime));
    formdata.append('end_time', formatTime(meetingEndTime));
    formdata.append('description', meetingDescription);

    setIsLoading(true);
    console.log('After Form data');

    PostAPiwithToken(
      { url: 'create-meeting', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);

        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: res.message || 'Plan created successfully',
          });

          setAddMeetingModal(false);

          setMeetingTitle('');
          setSelectedMembers([]);
          setMeetingSelectedDate(null);
          setMeetingStartTime(null);
          setMeetingEndTime(null);
          setMeetingDescription('');
          setSelectedPriority(null);
          getAllMeetings();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: res.message || 'Something went wrong',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create plan. Please try again.',
        });
      });
  };

  const openEditSheet = task => {
    setIsEditMode(true);
    setEditingTaskId(task.id);

    setTitle(task.title || '');
    setDescription(task.description || '');
    setSelectedColor(task.color || '#ECF7F3');
    setSelectedPriority(task.priority || null);
    setSelectedTag(task.tag || null);

    // Parse dates & times
    if (task.start_datetime) {
      const start = moment(task.start_datetime, 'YYYY-MM-DD hh:mm A');
      if (start.isValid()) {
        setSelectedDate(start.toDate());
        setStartTime(start.toDate());
      }
    }

    if (task.end_datetime) {
      const end = moment(task.end_datetime, 'YYYY-MM-DD hh:mm A');
      if (end.isValid()) {
        setEndTime(end.toDate());
      }
    }

    // Assuming task.members is array of objects with id
    setSelectedMembers(task.members?.map(m => Number(m.member_id)) || []);

    // If you want to show existing attachments (optional)
    setSelectedImages(
      task.attachments?.map(a => a.attachment) || [null, null, null],
    );

    setTimeout(() => {
      refRBSheet.current?.open();
    }, 100);
  };

  // ── Reset form for new task / after save ──
  const resetForm = () => {
    setIsEditMode(false);
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setSelectedColor('#ECF7F3');
    setSelectedPriority(null);
    setSelectedTag(null);
    setSelectedDate(null);
    setStartTime(null);
    setEndTime(null);
    setSelectedMembers([]);
    setSelectedImages([null, null, null]);
  };

  const handleMemberSelect = memberId => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(m => m !== memberId)
        : [...prev, memberId],
    );
  };

  const handleMeetingMemberSelect = memberId => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(m => m !== memberId)
        : [...prev, memberId],
    );
  };

  const handlePrioritySelect = priority => {
    setSelectedPriority(priority);
    setModalVisible(false);
  };

  const handlePriorityTag = tag => {
    setSelectedTag(tag);
    setModalVisibletag(false);
  };
  const reopenBottomSheet = () => {
    setTimeout(() => {
      if (refRBSheet.current) {
        refRBSheet.current.open();
      }
    }, 400);
  };

  const formatDateDisplay = date => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (sheetOpened) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 400);
    }
  }, [sheetOpened]);

  const showStartPicker = () => setStartPickerVisibility(true);
  const hideStartPicker = () => {
    reopenBottomSheet(), setStartPickerVisibility(false);
  };
  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => {
    reopenBottomSheet(), setEndPickerVisibility(false);
  };

  const handleStartConfirm = time => {
    // const now = new Date();
    // now.setSeconds(0, 0);
    // time.setSeconds(0, 0);
    // if (time <= now) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Invalid Start Time',
    //     text2: 'Start time must be in the future',
    //   });
    //   hideStartPicker();
    //   return;
    // }
    setStartTime(time);
    hideStartPicker();
    // if (endTime && endTime <= time) setEndTime(null);
  };

  const handleEndConfirm = time => {
    if (!startTime) {
      Toast.show({
        type: 'error',
        text1: 'Select Start Time First',
        text2: 'Please choose start time before end time',
      });
      hideEndPicker();
      return;
    }
    if (time <= startTime) {
      Toast.show({
        type: 'error',
        text1: 'Invalid End Time',
        text2: 'End time must be after start time',
      });
      hideEndPicker();
      return;
    }
    setEndTime(time);
    hideEndPicker();
  };

  const formatTime = time => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const my_COlors = [
    { id: 1, colorT: '#FCCABD' },
    { id: 2, colorT: '#C5DBFC' },
    { id: 3, colorT: '#DDBDE5' },
    { id: 4, colorT: '#E2E2E2' },
    { id: 5, colorT: '#FFE0B2' },
    { id: 6, colorT: '#B39DDB' },
    { id: 7, colorT: '#FCCABD' },
  ];

  const upload = async index => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 1,
      });
      const updatedImages = [...selectedImages];
      updatedImages[index] = image.path;
      setSelectedImages(updatedImages);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Error picking image:', error);
      }
    }
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

  const removeCompletionImage = () => setCompletionImage(null);

  const formatDateTimeForAPI = time => {
    if (!time) return null;
    const date = selectedDate || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const strHours = String(hours).padStart(2, '0');
    return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
  };

  // const CreateTasApi = () => {
  //   if (!title?.trim()) {
  //     Toast.show({ type: 'error', text1: 'Error', text2: 'Title is required' });
  //     return;
  //   }
  //   if (!selectedDate) {
  //     Toast.show({ type: 'error', text1: 'Error', text2: 'Please select date' });
  //     return;
  //   }
  //   if (!startTime) {
  //     Toast.show({ type: 'error', text1: 'Error', text2: 'Start time is required' });
  //     return;
  //   }
  //   if (!endTime) {
  //     Toast.show({ type: 'error', text1: 'Error', text2: 'End time is required' });
  //     return;
  //   }

  //   const now = new Date();
  //   now.setSeconds(0, 0);
  //   if (startTime <= now) {
  //     Toast.show({ type: 'error', text1: 'Invalid Start Time', text2: 'Start time must be in the future' });
  //     return;
  //   }
  //   if (endTime <= startTime) {
  //     Toast.show({ type: 'error', text1: 'Invalid Time Range', text2: 'End time must be after start time' });
  //     return;
  //   }

  //   const formdata = new FormData();
  //   formdata.append('title', title);
  //   selectedMembers.forEach(id => formdata.append('members[]', id));
  //   formdata.append('start_datetime', formatDateTimeForAPI(startTime));
  //   formdata.append('end_datetime', formatDateTimeForAPI(endTime));
  //   formdata.append('description', description);
  //   formdata.append('priority', selectedPriority);
  //   formdata.append('tag', selectedTag);
  //   formdata.append('color', selectedColor);

  //   selectedImages.forEach(img => {
  //     if (img) {
  //       formdata.append('attachment[]', {
  //         uri: img,
  //         type: 'image/jpeg',
  //         name: `image_${Date.now()}.jpg`,
  //       });
  //     }
  //   });

  //   setIsLoading(true);
  //   PostAPiwithToken({ url: 'add-task', Token: user?.api_token }, formdata)
  //     .then(res => {
  //       setIsLoading(false);
  //       if (res.status === 'success') {
  //         Toast.show({ type: 'success', text1: 'Success', text2: res.message });
  //         refRBSheet.current.close();
  //         getAllTasks();
  //         setTitle('');
  //         setSelectedMembers([]);
  //         setSelectedPriority(null);
  //         setDescription('');
  //         setStartTime(null);
  //         setEndTime(null);
  //         setSelectedDate(null);
  //         setSelectedTag(null);
  //         setSelectedImages([null, null, null]);
  //       } else {
  //         Toast.show({ type: 'error', text1: 'Error', text2: res.message || 'Something went wrong' });
  //       }
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //       console.log('API error:', err);
  //       Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to create task' });
  //     });
  // };

  const handleDayPress = day => {
    setSelectedStripDate(day);
    // Your date selection logic here
    console.log('Selected:', day.dateString);
  };

  const SaveTaskApi = () => {
    if (!title?.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Title is required' });
      return;
    }
    if (!selectedDate) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select date',
      });
      return;
    }
    if (!startTime) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Start time is required',
      });
      return;
    }
    if (!endTime) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'End time is required',
      });
      return;
    }

    const now = new Date();
    now.setSeconds(0, 0);
    // if (startTime <= now) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Invalid Start Time',
    //     text2: 'Start time must be in the future',
    //   });
    //   return;
    // }
    if (endTime <= startTime) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time Range',
        text2: 'End time must be after start time',
      });
      return;
    }

    const formdata = new FormData();
    formdata.append('title', title);
    selectedMembers.forEach(id => formdata.append('members[]', id));
    formdata.append('start_datetime', formatDateTimeForAPI(startTime));
    formdata.append('end_datetime', formatDateTimeForAPI(endTime));
    formdata.append('description', description);
    formdata.append('priority', selectedPriority || '');
    formdata.append('tag', selectedTag || 'No tag');
    formdata.append('color', selectedColor);

    selectedImages.forEach((img, index) => {
      if (img) {
        formdata.append(`attachment[${index}]`, {
          uri: img,
          type: 'image/jpeg',
          name: `image_${Date.now()}_${index}.jpg`,
        });
      }
    });

    if (isEditMode) {
      formdata.append('id', editingTaskId);
    }

    setIsLoading(true);

    const url = isEditMode ? 'edit-task' : 'add-task';

    PostAPiwithToken({ url, Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('apiresponse', JSON.stringify(res));
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: isEditMode ? 'Task updated successfully' : res.message,
          });
          setAddTaskModal(false);
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 4000);
          getAllTasks();
          resetForm();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Task save error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save task',
        });
      });
  };
  const handleCompletePress = task => {
    setCurrentTask(task);
    setShowImagePickerModal(true);
  };
  const handleInCompletePress = task => {
    setCurrentTask(task);
  };
  const getTaskEnd = () => {
    if (!completionImage) {
      Toast.show({
        type: 'error',
        text1: 'Required',
        text2: 'Please upload one photo as proof of completion',
      });
      return;
    }

    if (!currentTask?.id) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No task selected' });
      return;
    }

    const formdata = new FormData();
    formdata.append('image', {
      uri: completionImage,
      type: 'image/jpeg',
      name: `proof_${Date.now()}.jpg`,
    });
    formdata.append('task_id', currentTask.id);
    // formdata.append("current_time",moment().format("YYYY-MM-DD HH;mm A"))
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
          setShowCompletionCelebration(true);
          setTimeout(() => {
            setShowCompletionCelebration(false);
          }, 4000);
          setShowImagePickerModal(false);
          setCompletionImage(null);
          setCurrentTask(null);
          getAllTasks();
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

  const handleFilterSelect = value => {
    setSelectedFilter(value);
    setIsDropdownVisible(false);
  };

  const handleBackdropPress = () => {
    setIsDropdownVisible(false);
  };

  const translateXValue = useSharedValue(0);

  useEffect(() => {
    if (
      showSuccessModal ||
      showCompletionCelebration ||
      showPendingYesterdayModal
    ) {
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
  }, [showSuccessModal, showCompletionCelebration, showPendingYesterdayModal]);

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXValue.value }],
    };
  });
  const { top } = useSafeAreaInsets();

  const showTimePicker = () => {
    setMode('time');
    setShowDatePicker(true);
  };
  const showDateTimePicker = () => {
    setMode('date');
    setShowDatePicker(true);
  };

  const handleChange = (event, pickedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event?.type !== 'set' || !pickedDate) return;

    const isTask = selectedMenu === 'tasks';

    if (mode === 'date') {
      isTask ? setSelectedDate(pickedDate) : setMeetingSelectedDate(pickedDate);
      return;
    }

    if (mode === 'time') {
      if (timeType === 'start') {
        isTask ? setStartTime(pickedDate) : setMeetingStartTime(pickedDate);
      }

      if (timeType === 'end') {
        isTask ? setEndTime(pickedDate) : setMeetingEndTime(pickedDate);
      }
    }
  };

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
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        {/* Header */}

        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 4,
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
          <TouchableOpacity
            style={{ zIndex: 100 }}
            onPress={() => navigation.openDrawer()}
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
              {selectedMenu === 'tasks' ? 'Tasks' : 'Meetings'}{' '}
            </Text>
          </View>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                      <Image
                        source={images.menuIcon}
                        style={{ width: 26, height: 26, marginRight: wp(2) }}
                        tintColor={Colors.mainColor}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                      onPress={() =>
                        navigation.navigate('IndexBottom', { screen: 'Profile' })
                      }
                    >
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
                  </View> */}
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
                  // marginRight: wp(2),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                }}
                resizeMode="cover"
              >
                <Fontisto name="search" color="white" size={25} />
                {/* <Image
                          source={images.useraddIcon}
                          style={{ width: 18, height: 18 }}
                          resizeMode="contain"
                          tintColor={Colors.mainColor}
                        /> */}
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
                      // navigation.navigate('AddMembers');
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
                        // textAlign: 'right',
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

            {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
          </View>
        </View>

        {selectedMenu === 'tasks' ? (
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
                    fontFamily: fonts.medium,
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
                // <Calendar
                //   style={{
                //     borderWidth: 1,
                //     borderColor: 'gray',
                //     // height: 350,
                //   }}
                //   horizontal
                //   // theme={{
                //   //   backgroundColor: '#ffffff',
                //   //   calendarBackground: '#ffffff',
                //   //   textSectionTitleColor: '#b6c1cd',
                //   //   selectedDayBackgroundColor: '#00adf5',
                //   //   selectedDayTextColor: '#ffffff',
                //   //   todayTextColor: '#00adf5',
                //   //   dayTextColor: '#2d4150',
                //   //   textDisabledColor: '#dd99ee',
                //   // }}
                // />
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
                {[
                  'All',
                  'Learning & Growth',
                  'Urgent Tasks',
                  'Creativity & Inspiration',
                  'Productivity Task',
                  'Self-Improvement',
                  'Social & Relationships',
                ].map((tab, index, array) => (
                  <TouchableOpacity
                    key={tab}
                    activeOpacity={0.8}
                    onPress={() => setOnChangeTab((index + 1).toString())}
                    style={{
                      marginLeft: index === 0 ? wp(4) : 0,
                      marginRight: index === array.length - 1 ? wp(4) : 0,
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
                ))}
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
                  // Tab filter (tags)
                  const tagMatch =
                    onchangeTab === '1' ||
                    (onchangeTab === '2' && item.tag === 'Learning & Growth') ||
                    (onchangeTab === '3' && item.tag === 'Urgent Tasks') ||
                    (onchangeTab === '4' &&
                      item.tag === 'Creativity & Inspiration') ||
                    (onchangeTab === '5' && item.tag === 'Productivity Task') ||
                    (onchangeTab === '6' && item.tag === 'Self-Improvement') ||
                    (onchangeTab === '7' &&
                      item.tag === 'Social & Relationships');

                  if (!tagMatch) return null;

                  // Dropdown status filter
                  let statusMatch = true;
                  if (selectedFilter === 'Inprogress') {
                    statusMatch = item.status !== 'Completed';
                  } else if (selectedFilter === 'Completed') {
                    statusMatch = item.status === 'Completed';
                  }
                  // 'All' shows everything

                  if (!statusMatch) return null;

                  return (
                    <TaskItem
                      item={item}
                      // onPress={() => openEditSheet(item)}
                      onPress={() => {
                        navigation.navigate('TaskDetails', {
                          data: item,
                        });
                      }}
                      onDelete={deleteTask}
                    />
                  );
                }}
                ListEmptyComponent={
                  <View
                    style={{
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
                      There is no task added yet{'\n'}Click the button (+)
                      bellow to add the task
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
          <DailyMeetings navigation={navigation} />
        )}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={async () => {
            if (selectedMenu === 'tasks') {
              const hasPending = hasPendingYesterdayTasks();
              const alreadyShownToday = hasShownYesterdayReminderToday;

              if (hasPending && !alreadyShownToday) {
                setShowPendingYesterdayModal(true);
                await markReminderAsShownToday(); // Save that we showed it today
              } else {
                resetForm();
                setOptionModal(true);
              }
            } else {
              navigation.navigate('AddTaskMeeting', {
                type: selectedMenu,
              });
            }
          }}
        >
          <AntDesign name="plus" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={async () => {
            if (selectedMenu === 'tasks') {
              const hasPending = hasPendingYesterdayTasks();
              const alreadyShownToday = hasShownYesterdayReminderToday;

              if (hasPending && !alreadyShownToday) {
                setShowPendingYesterdayModal(true);
                await markReminderAsShownToday(); // Save that we showed it today
              } else {
                resetForm();
                setOptionModal(true);
              }
            } else {
              navigation.navigate('AddTaskMeeting', {
                type: selectedMenu,
              });
            }
          }}
        >
          <AntDesign name="plus" size={25} color="white" />
        </TouchableOpacity>

        {/* Options Bottom Sheet */}
        <Modal
          isVisible={optionModal}
          // coverScreen={false}
          onBackdropPress={() => {
            setOptionModal(false);
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            margin: 'auto',
            // backgroundColor: 'red',
            width: '100%',
          }}
        >
          <ImageBackground
            source={images.mainImage}
            // style={{ height: 200 }}
            imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          >
            {/* Dark overlay */}

            <View style={styless.overlay}>
              {/* Header */}
              <View style={styless.header}>
                <Text style={styless.title}>Select Option</Text>
                <TouchableOpacity onPress={() => setOptionModal(false)}>
                  <AntDesign name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              {/* Buttons */}
              <TouchableOpacity
                style={styless.radioRow}
                onPress={() => setSelectedOption('AI')}
                activeOpacity={0.7}
              >
                <Text style={styless.radioText}>
                  Create task with Dayahead AI
                </Text>
                <View style={styless.radioOuter}>
                  {selectedOption === 'AI' && (
                    <View style={styless.radioInner} />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styless.radioRow}
                onPress={() => setSelectedOption('Myself')}
                activeOpacity={0.7}
              >
                <Text style={styless.radioText}>Create task manually</Text>
                <View style={styless.radioOuter}>
                  {selectedOption === 'Myself' && (
                    <View style={styless.radioInner} />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styless.nextBtn}
                onPress={async () => {
                  if (selectedOption == 'Myself') {
                    const hasPending = hasPendingYesterdayTasks();
                    const alreadyShownToday = hasShownYesterdayReminderToday;

                    if (hasPending && !alreadyShownToday) {
                      setShowPendingYesterdayModal(true);
                      await markReminderAsShownToday(); // Save that we showed it today
                    } else {
                      resetForm();
                      setOptionModal(false);
                      navigation.navigate('AddTaskMeeting', {
                        type: selectedMenu,
                      });
                    }
                  } else if (selectedOption == 'AI') {
                    setOptionModal(false);
                    navigation.navigate('ChatAI');
                  }
                }}
              >
                <Text style={styless.nextBbtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Modal>

        {/* Dropdown Menu Modal - WORKING */}
        <Modal
          transparent
          visible={isDropdownVisible}
          animationType="fade"
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    position: 'absolute',
                    top: wp(15),
                    right: wp(5),
                    width: wp(38),
                    backgroundColor: Colors.white,
                    borderRadius: wp(4),
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                  }}
                >
                  {dotOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleFilterSelect(option.value)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: wp(38),
                        paddingVertical: wp(3),
                        paddingHorizontal: wp(4),
                        borderBottomWidth:
                          index === dotOptions.length - 1 ? 0 : 0.5,
                        borderBottomColor: '#E0E0E0',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: Colors.black,
                          fontFamily: fonts.bold,
                          flex: 1,
                        }}
                      >
                        {option.label}
                      </Text>
                      <View>
                        <AntDesign
                          name={'right'}
                          color={Colors.black}
                          size={16}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Success Celebration Modal */}
        <Modal
          transparent={true}
          visible={showSuccessModal || showCompletionCelebration}
          animationType="fade"
          onRequestClose={() => {
            setShowSuccessModal(false);
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
                  source={
                    showCompletionCelebration
                      ? images.completeT // ← Your completion GIF/image
                      : images.happy // ← Existing happy image
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

        <Modal
          transparent={true}
          visible={showSadCelebration}
          animationType="fade"
          onRequestClose={() => {
            setShowSadCelebration(false);
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
                  source={
                    images.sad // ← Existing happy image
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

        {/* Sad Reminder Modal for Pending Yesterday Tasks */}
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

        <DateTimePickerModal
          isVisible={isStartPickerVisible}
          mode="time"
          onConfirm={handleStartConfirm}
          onCancel={hideStartPicker}
          date={startTime || new Date()}
          minimumDate={new Date()}
        />

        <DateTimePickerModal
          isVisible={isEndPickerVisible}
          mode="time"
          onConfirm={handleEndConfirm}
          onCancel={hideEndPicker}
          date={endTime || new Date()}
          minimumDate={
            startTime ? new Date(startTime.getTime() + 60000) : new Date()
          }
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styless = StyleSheet.create({
  openBtn: {
    backgroundColor: '#7A2A73',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 50,
  },
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // adjust darkness here
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#BD2BAF20',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#BD2BAF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#BD2BAF',
  },
  radioText: {
    color: '#fff',
    fontSize: 16,
  },
  actionBtn: {
    backgroundColor: '#BD2BAF20',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  nextBtn: {
    backgroundColor: '#BD2BAF',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
  },
  nextBbtnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  optionButton: {
    paddingVertical: 18,
    backgroundColor: '#00000050',
    color: '#EFEFEF',
    flex: 1,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Tasks;
