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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Animated Task Item ──
const TaskItem = ({ item, onPress, onCompletePress }) => {
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
    }
    else if (isPending) {
      translateXValue.value = withSequence(
        withTiming(-20, { duration: 1000 }),
        withTiming(20, { duration: 1000 }),
        withTiming(-15, { duration: 1000 }),
        withTiming(15, { duration: 1000 }),
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) })
      );
    }
  }, [isCompleted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXValue.value }],
  }));

  const formatTimeRange = (start, end) => {
    const getTime = dateTime => dateTime.split(' ')[1] + ' ' + dateTime.split(' ')[2];
    return `${getTime(start)} - ${getTime(end)}`;
  };

  return (
    <Animated.View style={animatedStyle}>
      {/* ── Changed: Conditional TouchableOpacity ── */}
      {isCompleted ? (
        <View
          style={[
            styles.flatView,
            {
              backgroundColor: item.color || '#ECF7F3',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: wp(4),
              marginVertical: wp(2),
              opacity: 0.75,           // ← visual feedback: slightly faded
              shadowOffset: { height: 2, width: 2 },
              shadowOpacity: 0.2,
              shadowColor: '#4686D4',
              elevation: 2,
            },
          ]}
        >
          {/* Same content as below, but without touch */}
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
                  textDecorationLine: 'line-through',
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
                    item?.priority === 'High Priority' ? '#F95555' :
                      item?.priority === 'Medium Priority' ? '#3498DB' :
                        Colors.mainColor,
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
                  {item?.priority === 'High Priority' ? 'High' :
                    item?.priority === 'Medium Priority' ? 'Medium' : 'Low'}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ padding: wp(3) }}>
            <Fontisto
              name="checkbox-active"
              color={Colors.mainColor}
              size={20}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}           // ← only non-completed tasks are clickable
          style={[
            styles.flatView,
            {
              backgroundColor: item.color || '#ECF7F3',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: wp(4),
              marginVertical: wp(2),
              shadowOffset: { height: 2, width: 2 },
              shadowOpacity: 0.2,
              shadowColor: '#4686D4',
              elevation: 2,
            },
          ]}
        >
          {/* Same content as above */}
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
                    item?.priority === 'High Priority' ? '#F95555' :
                      item?.priority === 'Medium Priority' ? '#3498DB' :
                        Colors.mainColor,
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
                  {item?.priority === 'High Priority' ? 'High' :
                    item?.priority === 'Medium Priority' ? 'Medium' : 'Low'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onCompletePress(item);
            }}
            style={{ padding: wp(3) }}
          >
            <Fontisto
              name="checkbox-passive"
              color="white"
              size={20}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// ── Main Screen ──
const Tasks = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const titleInputRef = useRef(null);
  const [myTasks, setMyTasks] = useState([]);
  console.log('my taskss',JSON.stringify(myTasks))
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

  const [showPendingYesterdayModal, setShowPendingYesterdayModal] = useState(false);
const [hasShownYesterdayReminderToday, setHasShownYesterdayReminderToday] = useState(false);

const REMINDER_STORAGE_KEY = 'YESTERDAY_TASK_REMINDER_SHOWN_DATE';

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
const isTaskFromYesterday = (task) => {
  const taskDate = moment(task.start_datetime, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  return taskDate === yesterday;
};

// Check if there are pending tasks from yesterday
const hasPendingYesterdayTasks = () => {
  return myTasks.some(task => 
    task.status !== 'Completed' && isTaskFromYesterday(task)
  );
};




  const [showSuccessModal, setShowSuccessModal] = useState(false);
const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  console.log('my mode',isEditMode)
  const [editingTaskId, setEditingTaskId] = useState(null);

  const dotOptions = [
    // { label: 'All', value: 'All' },
    { label: 'In Progress', value: 'Inprogress' },
    { label: 'Completed', value: 'Completed' },
  ];

  const getAllTasks = () => {
    AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
      .then(res => {
        setMyTasks(res.data || []);
      })
      .catch(err => console.log('api error tasks', err));
  };

  const refRBSheet = useRef();

  useFocusEffect(
    useCallback(() => {
      getAllTasks();
      checkIfReminderShownToday();
    }, []),
  );

  useEffect(() => {
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => setAllMembers(res.data || []))
      .catch(err => console.log('api error friends', err));
  }, []);


  const openEditSheet = (task) => {
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
    setSelectedImages(task.attachments?.map(a => a.attachment) || [null, null, null]);

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
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => {
    reopenBottomSheet()
    setDatePickerVisibility(false)
  };

  const handleDateConfirm = date => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    if (selected.getTime() !== todayStart.getTime()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date',
        text2: 'You can only select today’s date',
      });
      return;
    }
    setSelectedDate(date);
    hideDatePicker();
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
    reopenBottomSheet(),
      setStartPickerVisibility(false)
  };
  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => {
    reopenBottomSheet(),
      setEndPickerVisibility(false)
  };

  const handleStartConfirm = time => {
    const now = new Date();
    now.setSeconds(0, 0);
    time.setSeconds(0, 0);
    if (time <= now) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Start Time',
        text2: 'Start time must be in the future',
      });
      hideStartPicker();
      return;
    }
    setStartTime(time);
    hideStartPicker();
    if (endTime && endTime <= time) setEndTime(null);
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
  const SaveTaskApi = () => {
    if (!title?.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Title is required' });
      return;
    }
    if (!selectedDate) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please select date' });
      return;
    }
    if (!startTime) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Start time is required' });
      return;
    }
    if (!endTime) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'End time is required' });
      return;
    }

    const now = new Date();
    now.setSeconds(0, 0);
    if (startTime <= now) {
      Toast.show({ type: 'error', text1: 'Invalid Start Time', text2: 'Start time must be in the future' });
      return;
    }
    if (endTime <= startTime) {
      Toast.show({ type: 'error', text1: 'Invalid Time Range', text2: 'End time must be after start time' });
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
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 4000);
          refRBSheet.current.close();
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
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save task' });
      });
  };
  const handleCompletePress = (task) => {
    setCurrentTask(task);
    setShowImagePickerModal(true);
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
        Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong' });
      });
  };

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setIsDropdownVisible(false);
  };

  const handleBackdropPress = () => {
    setIsDropdownVisible(false);
  };



   const translateXValue = useSharedValue(0);
      
useEffect(() => {
  if (showSuccessModal||showCompletionCelebration||showPendingYesterdayModal) {
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
}, [showSuccessModal,showCompletionCelebration,showPendingYesterdayModal]);

const animatedStyle2 = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: translateXValue.value }],
  };
});
  const { top } = useSafeAreaInsets();

  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 35 : 0 }}
      resizeMode="cover"
    >
      {isloading && <Loader />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        {/* Header */}
        {/* <View
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
          }}
        > */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

            width: wp(100),
            height: wp(25),
            backgroundColor: '#FAFAFA',
            paddingHorizontal: wp(4),
            paddingTop: wp(5),

            // ✅ iOS shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,


            // ✅ Android shadow
            elevation: 4,
          }}
        >

          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black }}>
            Tasks
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              style={{ padding: wp(2) }}
            >
              <Entypo name="dots-three-vertical" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Tabs */}
          <View style={{ marginTop: wp(5) }}>
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
                      marginRight: index === array.length - 1 ? wp(4) : 0,
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
                        shadowOffset: { height: 2, width: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: '#4686D4',
                      }}
                    >
                      <Text style={{ fontSize: 12, fontFamily: fonts.bold, color: Colors.black }}>
                        {tab}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
          </View>

          {/* Tasks List */}
          <View style={{ marginTop: wp(3), marginBottom: wp(80) }}>
            <FlatList
              data={myTasks}
              keyExtractor={item => item?.id?.toString()}
              inverted
              renderItem={({ item }) => {
                // Tab filter (tags)
                const tagMatch =
                  onchangeTab === '1' ||
                  (onchangeTab === '2' && item.tag === 'Room Cleaning') ||
                  (onchangeTab === '3' && item.tag === 'Healthy Lifestyle') ||
                  (onchangeTab === '4' && item.tag === 'Morning Routine') ||
                  (onchangeTab === '5' && item.tag === 'Relationship') ||
                  (onchangeTab === '6' && item.tag === 'Sleep Better') ||
                  (onchangeTab === '7' && item.tag === 'Workout');

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
                    onPress={() => openEditSheet(item)}
                    onCompletePress={handleCompletePress}
                  />
                );
              }}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: hp(10),
                    color: 'gray',
                    fontSize: 16,
                  }}
                >
                  No tasks found
                </Text>
              }
            />
          </View>
        </ScrollView>

        {/* Floating Buttons */}
        <View
          style={{
            position: 'absolute',
            bottom: wp(28),
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatAI')}
            style={{
              width: wp(70),
              height: wp(13),
              borderRadius: wp(3),
              backgroundColor: Colors.mainColor,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 2,
              marginRight: wp(3),
            }}
          >
            <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 16 }}>AI Suggested Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => {
            //   resetForm();
            //   refRBSheet.current.open();
            // }}
            onPress={async () => {
    const hasPending = hasPendingYesterdayTasks();
    const alreadyShownToday = hasShownYesterdayReminderToday;

    if (hasPending && !alreadyShownToday) {
      setShowPendingYesterdayModal(true);
      await markReminderAsShownToday(); // Save that we showed it today
    } else {
      resetForm();
      refRBSheet.current.open();
    }
  }}
            style={{
              width: wp(14),
              height: wp(13),
              borderRadius: wp(3),
              backgroundColor: Colors.mainColor,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 2,
            }}
          >
            <AntDesign name="plus" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Create Task Bottom Sheet */}
        <RBSheet
          ref={refRBSheet}
          height={hp(88)}
          closeOnDragDown={true}
          draggable={true}
          openDuration={650}
          closeDuration={280}
          onOpen={() => {
            setSheetOpened(true);
            setTimeout(() => {
              titleInputRef.current?.focus();
            }, 720);
          }}
          onClose={() => {
            setSheetOpened(false);
            titleInputRef.current?.blur();
            // resetForm(); 
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              backgroundColor: selectedColor || '#fff',
              maxHeight: hp(88),
            },
            draggableIcon: {
              width: 42,
              height: 5,
              borderRadius: 4,
              backgroundColor: '#666',
              marginTop: 8,
            }
          }}
        >
          {/* <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 24 })}
            enabled
          > */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: hp(30),
              }}
            >
              {/* Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: wp(5),
                paddingBottom: wp(2),
              }}>
                <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                  <AntDesign name="close" size={24} color={Colors.black} />
                </TouchableOpacity>
                <Text></Text>
                {/* <TouchableOpacity onPress={CreateTasApi}>
                  <Text style={{ fontSize: 14, fontFamily: fonts.bold }}>Add Task</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={SaveTaskApi}>
                  <Text style={{ fontSize: 14, fontFamily: fonts.bold }}>
                    {isEditMode ? 'Update Task' : 'Add Task'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Main Content */}
              <View style={{ paddingHorizontal: wp(5) }}>
                {/* Image Upload */}
                {[0].map(index => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => upload(index)}
                    style={[styles.uploadpicView, { backgroundColor: 'transparent', alignSelf: 'center' }]}
                  >
                    {selectedImages[index] ? (
                      <Image
                        source={{ uri: selectedImages[index] }}
                        resizeMode="cover"
                        style={{
                          width: wp(28),
                          height: wp(28),
                          borderRadius: wp(3),
                        }}
                      />
                    ) : (
                      <Image
                        source={images.uploadIcon}
                        resizeMode="contain"
                        style={{ width: 40, height: 40 }}
                        tintColor={'#999999'}
                      />
                    )}
                  </TouchableOpacity>
                ))}

                {/* Title Input */}
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: wp(4),
                    marginBottom: wp(6),
                  }}
                >
                  <TextInput
                    ref={titleInputRef}
                    placeholder="Tap to write task title"
                    onChangeText={setTitle}
                    value={title}
                    placeholderTextColor={'#616161'}
                    style={{
                      width: wp(80),
                      fontSize: 16,
                      fontFamily: fonts.regular,
                      color: Colors.black,
                      textAlign: 'center',
                      paddingVertical: wp(2),
                    }}
                  />
                </View>

                {/* Color Picker */}
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    paddingVertical: hp(2),
                  }}
                >
                  {my_COlors.map((item) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={item.id}
                      onPress={() => setSelectedColor(item.colorT)}
                      style={{ alignItems: 'center', marginBottom: hp(2) }}
                    >
                      <View
                        style={{
                          width: wp(11),
                          height: wp(11),
                          borderRadius: wp(3),
                          backgroundColor: item.colorT,
                          borderWidth: 3,
                          borderColor: '#fff',
                          justifyContent: 'center',
                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.5,
                          elevation: 4,
                        }}
                      >
                        {selectedColor === item.colorT && (
                          <AntDesign name="check" size={22} color="white" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Options List */}
                <View
                  style={{
                    width: wp(90),
                    alignSelf: 'center',
                    backgroundColor: Colors.white,
                    borderRadius: wp(3),
                    padding: wp(4),
                  }}
                >
                  <TouchableOpacity style={styles.optionRowStyle} onPress={() => setModalVisibleMember(true)}>
                    <Text style={[styles.optionTextStyle, { color: selectedMembers.length > 0 ? 'black' : '#555' }]}>
                      {selectedMembers.length > 0
                        ? allMembers
                          .filter(m => selectedMembers.includes(m.id))
                          .map(m => m.name)
                          .join(', ')
                        : 'Add members'}
                    </Text>
                    <AntDesign name="right" color="#333" size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRowStyle} onPress={() => setModalVisible(true)}>
                    <Text style={[styles.optionTextStyle, { color: selectedPriority ? 'black' : '#555' }]}>
                      {selectedPriority || 'Add priority'}
                    </Text>
                    <AntDesign name="right" color="#333" size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRowStyle} onPress={() => setModalVisibletag(true)}>
                    <Text style={[styles.optionTextStyle, { color: selectedTag ? 'black' : '#555' }]}>
                      {selectedTag || 'Add Tags'}
                    </Text>
                    <AntDesign name="right" color="#333" size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRowStyle} onPress={() => {
                    refRBSheet.current.close();
                    setTimeout(() => showDatePicker(), 300);
                  }} >
                    <Text style={[styles.optionTextStyle, { color: selectedDate ? 'black' : '#555' }]}>
                      {selectedDate ? formatDateDisplay(selectedDate) : 'Select date'}
                    </Text>
                    <AntDesign name="right" color="#333" size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRowStyle} onPress={() => {
                    refRBSheet.current.close();
                    setTimeout(() => showStartPicker(), 300);
                  }}>
                    <Text style={[styles.optionTextStyle, { color: startTime ? 'black' : '#555' }]}>
                      {startTime ? formatTime(startTime) : 'Select start time'}
                    </Text>
                    <AntDesign name="right" color="#333" size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.optionRowStyle, { borderBottomWidth: 0 }]} onPress={() => {
                    refRBSheet.current.close();
                    setTimeout(() => showEndPicker(), 300);
                  }} >
                    <Text style={[styles.optionTextStyle, { color: endTime ? 'black' : '#555' }]}>
                      {endTime ? formatTime(endTime) : 'Select end time'}
                    </Text>
                    <AntDesign name="right" color="#333" size={18} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: wp(90),
                    height: wp(30),
                    borderRadius: wp(3),
                    elevation: 2,
                    shadowOffset: { height: 2, width: 4 },
                    shadowOpacity: 0.2,
                    shadowColor: 'grey',
                    shadowRadius: 8,
                    backgroundColor: '#FAFAFA',
                    alignSelf: 'center',
                    marginTop: wp(3),
                  }}
                >
                  <TextInput
                    style={{
                      paddingHorizontal: wp(3),
                      color: Colors.black,
                      fontFamily: fonts.regular,
                      fontSize: 14,
                      textAlignVertical: 'top',
                      paddingTop: wp(3),
                    }}
                    multiline
                    placeholder="Description..."
                    placeholderTextColor={Colors.lightgrey}
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
              </View>

              {/* Member Modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisiblemember}
                onRequestClose={() => setModalVisibleMember(false)}
              >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                      padding: wp(5),
                      width: wp(90),
                      height: hp(80),
                      alignSelf: 'center',
                      marginBottom: wp(5),
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginBottom: wp(4) }}>
                      Add Friends/Members
                    </Text>
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 15, right: 15 }}
                      onPress={() => setModalVisibleMember(false)}
                    >
                      <AntDesign name="close" size={20} color={Colors.black} />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                      {allMembers.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ fontSize: 18, fontFamily: fonts.bold }}>
                            No Friends available
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setModalVisibleMember(false);
                              navigation.navigate('AddMembers');
                            }}
                          >
                            <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>
                              Click Here to add
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        allMembers.map(member => (
                          <TouchableOpacity
                            key={member.id}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingVertical: wp(3),
                              paddingHorizontal: wp(3),
                              backgroundColor: Colors.lightgreen,
                              borderRadius: wp(2),
                              marginBottom: wp(3),
                            }}
                            onPress={() => handleMemberSelect(member.id)}
                          >
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>
                              {member.name}
                            </Text>
                            {selectedMembers.includes(member.id) && (
                              <AntDesign name="checkcircle" size={22} color={Colors.mainColor} />
                            )}
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>

                    <TouchableOpacity
                      style={{
                        marginTop: wp(4),
                        backgroundColor: Colors.mainColor,
                        paddingVertical: wp(3.5),
                        borderRadius: wp(3),
                        alignItems: 'center',
                      }}
                      onPress={() => setModalVisibleMember(false)}
                    >
                      <Text style={{ color: Colors.white, fontFamily: fonts.bold, fontSize: 15 }}>
                        Add Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Priority Modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                      padding: wp(5),
                      width: wp(90),
                      alignSelf: 'center',
                      marginBottom: wp(5),
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginBottom: wp(4) }}>
                      Select Priorities
                    </Text>
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 15, right: 15 }}
                      onPress={() => setModalVisible(false)}
                    >
                      <AntDesign name="close" size={20} color={Colors.black} />
                    </TouchableOpacity>

                    {['Low Priority', 'Medium Priority', 'High Priority'].map(priority => (
                      <TouchableOpacity
                        key={priority}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: wp(3),
                          paddingHorizontal: wp(3),
                          backgroundColor: Colors.lightgreen,
                          borderRadius: wp(2),
                          marginBottom: wp(3),
                        }}
                        onPress={() => handlePrioritySelect(priority)}
                      >
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>
                          {priority}
                        </Text>
                        {selectedPriority === priority && (
                          <AntDesign name="checkcircle" size={22} color={Colors.mainColor} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>

              {/* Tag Modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibletag}
                onRequestClose={() => setModalVisibletag(false)}
              >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                      padding: wp(5),
                      width: wp(90),
                      alignSelf: 'center',
                      marginBottom: wp(5),
                    }}
                  >
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginBottom: wp(4) }}>
                      Select Tag
                    </Text>
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 15, right: 15 }}
                      onPress={() => setModalVisibletag(false)}
                    >
                      <AntDesign name="close" size={20} color={Colors.black} />
                    </TouchableOpacity>

                    {['No tag', 'Room Cleaning', 'Healthy Lifestyle', 'Morning Routine', 'Relationship', 'Sleep Better', 'Workout'].map(tag => (
                      <TouchableOpacity
                        key={tag}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: wp(3),
                          paddingHorizontal: wp(3),
                          backgroundColor: Colors.lightgreen,
                          borderRadius: wp(2),
                          marginBottom: wp(3),
                        }}
                        onPress={() => handlePriorityTag(tag)}
                      >
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>
                          {tag}
                        </Text>
                        {selectedTag === tag && (
                          <AntDesign name="checkcircle" size={22} color={Colors.mainColor} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>
            </ScrollView>
          {/* </KeyboardAvoidingView> */}
        </RBSheet>

        {/* Completion Proof Modal */}
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
                        borderBottomWidth: index === dotOptions.length - 1 ? 0 : 0.5,
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
                        <AntDesign name={'right'} color={Colors.black} size={16} />
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
            showCompletionCelebration 
              ? images.completeT   // ← Your completion GIF/image
              : images.happy       // ← Existing happy image
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
  <TouchableWithoutFeedback onPress={() => setShowPendingYesterdayModal(false)}>
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <TouchableWithoutFeedback>
        <Animated.View style={[animatedStyle2, {
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
        }]}>
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

          <Text style={{
            fontSize: 20,
            fontFamily: fonts.bold,
            color: Colors.black,
            textAlign: 'center',
            marginBottom: wp(3),
          }}>
            Oh no! You have Incomplete tasks from yesterday 😔
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
              // Optional: Open bottom sheet anyway, or just close
              // refRBSheet.current.open(); // Uncomment if you want to allow creating task anyway
            }}
            style={{ width: wp(60),height:wp(13),backgroundColor:Colors.mainColor,borderRadius:wp(2),justifyContent:'center',alignItems:'center',alignSelf:'center' }}
          >
            <Text style={{fontFamily:fonts.bold,color:Colors.white,fontSize:16}}>Okay</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>

        {/* Date & Time Pickers */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          date={selectedDate || new Date()}
          minimumDate={new Date()}
          maximumDate={new Date()}
        />

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
          minimumDate={startTime ? new Date(startTime.getTime() + 60000) : new Date()}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Tasks;