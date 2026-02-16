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
  Alert,
  StyleSheet,
  Share,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useFocusEffect } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskCompletionWithShare from './test';

const TaskDetails = ({ navigation, route }) => {
  const { data } = route.params;
  const user = useSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showSucc, setShowSucc] = useState(false);
  const [showfailure, setShowfailure] = useState(false);
  console.log('my item data', JSON.stringify(data));

  const [date, setDate] = useState(new Date());
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [completionImage, setCompletionImage] = useState(null); // Only one image (string path or null)
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [isBetween, setIsBetween] = useState(false);
  const [isEarly, setIsEarly] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const [title, setTitle] = useState(data?.title || '');
  const [selectedMembers, setSelectedMembers] = useState(
    data?.members?.map(m => m.member.id) || [],
  );
  const [allMembers, setAllMembers] = useState([]);

  const [selectedPriority, setSelectedPriority] = useState(
    data?.priority || '',
  );
  const [selectedTag, setSelectedTag] = useState(data?.tag || '');
  const [selectedDate, setSelectedDate] = useState(
    data ? parseDateTime(data.start_datetime) : null,
  );
  const [description, setDescription] = useState(data?.description || '');

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState('date');
  const [timeType, setTimeType] = useState('start');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modalVisiblemember, setModalVisibleMember] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibletag, setModalVisibletag] = useState(false);
  const [sheetOpened, setSheetOpened] = useState(false);

  const refRBSheet = useRef();
  const titleInputRef = useRef();
  const shareRef = useRef(null);

  const formatDateDisplay = date => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = time => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
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

  function parseDateTime(input) {
    console.log(input);
    const [datePart, timePart, meridiem] = input.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    let [hours, minutes] = timePart.split(':').map(Number);

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  }

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

  const showDateTimePicker = () => {
    setMode('date');
    setShowDatePicker(true);
  };

  const showTimePicker = () => {
    setMode('time');
    setShowDatePicker(true);
  };

  const handleChange = (event, pickedDate) => {
    // console.log(pickedDate.toLocaleDateString());
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    console.log('pickedDate: ', pickedDate);
    console.log('event type: ', event?.type);
    if (event?.type !== 'set' || !pickedDate) return;

    if (mode === 'date') {
      setSelectedDate(pickedDate);
      return;
    }

    if (mode === 'time') {
      if (timeType === 'start') {
        setStartTime(pickedDate);
      }

      if (timeType === 'end') {
        setEndTime(pickedDate);
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      AllGetAPI({ url: 'friends', Token: user?.api_token })
        .then(res => setAllMembers(res.data || []))
        .catch(err => console.log('api error friends', err));
      if (!data?.start_datetime || !data?.end_datetime) return;

      const startDate = parseDateTime(data.start_datetime);
      const endDate = parseDateTime(data.end_datetime);

      const currentDate = new Date();
      currentDate.setSeconds(0, 0);

      const result = currentDate >= startDate && currentDate <= endDate;
      const resultEarly = currentDate < startDate;
      const resultPass = currentDate > endDate;

      console.log('currentDate', currentDate.toISOString());
      console.log('startDate', startDate.toISOString());
      console.log('endDate', endDate.toISOString());
      setIsEarly(resultEarly);
      setIsBetween(result);
      setIsPassed(resultPass);
      console.log('isEarly:', resultEarly);
      console.log('isBetween:', result);

      return () => {};
    }, [data?.start_datetime, data?.end_datetime]),
  );

  const pickCompletionImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 0.8,
      });

      setCompletionImage(image.path); // Store only one
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Image pick error:', error);
      }
    }
  };

  const removeCompletionImage = () => {
    setCompletionImage(null);
  };

  const SuccessModal = () => (
    <Modal animationType="slide" transparent={true} visible={showSucc}>
      <View
        style={{
          flex: 1,
          // height: hp(100),
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          // position: 'absolute',
        }}
      >
        <View
          style={{
            height: 120,
            width: 120,

            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderRadius: 100,
            overflow: 'hidden',
          }}
        >
          <Image
            style={{ height: 200, width: 200 }}
            source={require('../../Assets/addreminderIcon.png')}
          />
        </View>
      </View>
    </Modal>
  );
  const FailureModal = () => (
    <Modal animationType="slide" transparent={true} visible={showfailure}>
      <View
        style={{
          flex: 1,
          // height: hp(100),
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          // position: 'absolute',
        }}
      >
        <View
          style={{
            height: 120,
            width: 120,

            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderRadius: 100,
            overflow: 'hidden',
          }}
        >
          <Image
            style={{ height: 200, width: 200 }}
            source={require('../../Assets/addreminderIcon.png')}
          />
        </View>
      </View>
    </Modal>
  );

  const AchievementCard = () => {
    return (
      <View>
        <ViewShot>
          <View>
            <View>
              <Text>DONE!</Text>
              <Text>🏆</Text>
            </View>

            <View>
              <Text>Focused Work</Text>
              <Text>Study & Coding</Text>
              <Text>8:30 AM - 10:00 AM</Text>
            </View>

            <View>
              <View>
                <Text>⭐</Text>
                <Text>30 points</Text>
              </View>

              <View>
                <Text>🔥</Text>
                <Text>* Day Streak</Text>
              </View>
            </View>

            <Text>#WinTheDay #StayFocuseds</Text>
            <Text>Shared via DayAhead</Text>
          </View>
        </ViewShot>
      </View>
    );
  };

  const shareFunction = async () => {};

  const getTaskStart = () => {
    setIsLoading(true);
    AllGetAPI({
      url: `start-task/${data?.id}`,
      Token: user?.api_token,
    })
      .then(res => {
        setIsLoading(false);
        console.log('my post details', JSON.stringify(res));
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          // navigation.navigate('IndexDrawer', {
          //   screen: 'IndexBottom',
          //   params: { screen: 'Tasks' },
          // });
          // navigation.goBack();
          navigation.navigate('FocusScreen', {
            start_time: data?.start_datetime,
            end_time: data?.end_datetime,
            task_id: data?.id,
          });
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
        console.log('api error tasks', err);
      });
  };

  const SaveEditTaskApi = () => {
    console.debug('pressed');
    if (!data?.title?.trim()) {
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
    if (startTime <= now) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Start Time',
        text2: 'Start time must be in the future',
      });
      return;
    }
    if (endTime <= startTime) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time Range',
        text2: 'End time must be after start time',
      });
      return;
    }

    const formdata = new FormData();
    formdata.append('id', data?.id);
    formdata.append('title', title);
    selectedMembers.forEach(id => formdata.append('members[]', id));
    formdata.append('start_datetime', formatDateTimeForAPI(startTime));
    formdata.append('end_datetime', formatDateTimeForAPI(endTime));
    formdata.append('description', description);
    formdata.append('priority', selectedPriority || '');
    formdata.append('tag', selectedTag || 'No tag');
    // formdata.append('color', selectedColor);

    selectedImages.forEach((img, index) => {
      if (img) {
        formdata.append(`attachment[${index}]`, {
          uri: img,
          type: 'image/jpeg',
          name: `image_${Date.now()}_${index}.jpg`,
        });
      }
    });

    setIsLoading(true);

    PostAPiwithToken({ url: 'edit-task', Token: user?.api_token }, formdata)
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
          refRBSheet.current.close();
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 4000);
          refRBSheet.current.close();
          getAllTasks();
          resetForm();
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
        console.log('Task save error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save task',
        });
      });
  };
  // const getTaskEnd = () => {
  //   if (!completionImage) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Required',
  //       text2: 'Please upload one photo as proof of completion',
  //     });
  //     return;
  //   }
  //   setIsLoading(true);
  //   AllGetAPI({
  //     url: `end-task/${data?.id}`,
  //     Token: user?.api_token,
  //   })
  //     .then(res => {
  //       setIsLoading(false);
  //       console.log('my post details', JSON.stringify(res));
  //       if (res.status === 'success') {
  //         Toast.show({
  //           type: 'success',
  //           text1: 'Success',
  //           text2: res.message,
  //           topOffset: Platform.OS === 'ios' ? 20 : 0,
  //           visibilityTime: 3000,
  //           autoHide: true,
  //         });
  //         navigation.navigate('IndexDrawer', {
  //           screen: 'IndexBottom',
  //           params: { screen: 'Tasks' },
  //         });
  //       } else {
  //         setIsLoading(false);
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error',
  //           text2: res.message,
  //           topOffset: Platform.OS === 'ios' ? 20 : 0,
  //           visibilityTime: 3000,
  //           autoHide: true,
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //       console.log('api error tasks', err);
  //     });
  // };

  const getTaskEnd = () => {
    if (!completionImage) {
      Toast.show({
        type: 'error',
        text1: 'Required',
        text2: 'Please upload one photo as proof of completion',
      });
      return;
    }

    const formdata = new FormData();

    formdata.append('task_id', data?.id);
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
          setShowImagePickerModal(false);
          setCompletionImage(null);
          navigation.goBack();
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

  const triggerShare = () => {
    shareRef.current?.share();
  };

  return (
    <>
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
            <TouchableOpacity
              style={{
                backgroundColor: Colors.white,
                borderRadius: 50,
                padding: 8,
              }}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="left" size={15} color={Colors.black} />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.white,
                // marginRight: wp(7),
              }}
            >
              Task Detail
            </Text>

            {/* Empty View to balance the row */}
            <View style={{ width: 20 }} />
          </View>
          <View contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ marginHorizontal: wp(5) }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: wp(5),
                  marginTop: wp(3),
                }}
              >
                {data?.attachments.length > 0 ? (
                  <>
                    {data?.attachments.map(item => (
                      <Image
                        source={
                          item.attachment
                            ? { uri: item.attachment }
                            : images.taskpic1
                        }
                        resizeMode="contain"
                        style={{
                          width: wp(28),
                          height: wp(28),
                          borderRadius: wp(3),
                        }}
                      />
                    ))}
                  </>
                ) : null}
              </View>
              <View
                style={{
                  marginBottom: wp(5),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}
                >
                  {data?.members.map((member, index) => (
                    <Image
                      key={index}
                      source={{ uri: member.member?.image }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20,
                        marginLeft: index === 0 ? 0 : -10, // overlapping effect
                        borderWidth: 2,
                        borderColor: 'white',
                      }}
                      resizeMode="cover"
                    />
                  ))}
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      marginStart: 8,
                      fontFamily: fonts.medium,
                    }}
                  >
                    <Text>
                      {data?.members.length}{' '}
                      {data?.members.length === 1 ? 'Member' : 'Members'}
                    </Text>
                  </Text>
                </View>
                {/* <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                  // width:wp(34)
                }}
              >
                {data?.title}
              </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    // width:wp(34)
                  }}
                >
                  Created: {moment(data?.created_at).format('MMM D, YYYY')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.white,
                    }}
                  >
                    Priority
                  </Text>
                  <View
                    style={{
                      width: 64,
                      height: 24,
                      backgroundColor:
                        data?.priority == 'High Priority'
                          ? '#F95555'
                          : data?.priority == 'Medium Priority'
                          ? 'blue'
                          : Colors.mainColor,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: wp(1),
                      flexDirection: 'row',
                    }}
                  >
                    <Image
                      source={images.flag}
                      style={{ width: 12, height: 12, marginRight: 2 }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                      }}
                    >
                      {data?.priority === 'High Priority'
                        ? 'High'
                        : data?.priority === 'Medium Priority'
                        ? 'Medium'
                        : 'Low'}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    {data?.tag}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: wp(5),
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    Start Time
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.white,
                    }}
                  >
                    {moment(data?.start_datetime, 'YYYY-MM-DD hh:mm A').format(
                      'hh:mm A',
                    )}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    End Time
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.white,
                    }}
                  >
                    {moment(data?.end_datetime, 'YYYY-MM-DD hh:mm A').format(
                      'hh:mm A',
                    )}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: wp(5) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Task Title
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    lineHeight: 18,
                    // width:wp(34)
                  }}
                >
                  {data?.title}
                </Text>
              </View>
              <View style={{ marginTop: wp(5) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                    // width:wp(34)
                  }}
                >
                  Description
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    lineHeight: 18,
                    // width:wp(34)
                  }}
                >
                  {data?.description}
                </Text>
              </View>

              {/* <View style={{ marginTop: wp(5), marginBottom: wp(4) }}>
              {data?.members.map(item => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Conversation', { item: item.member })
                  }
                  // key={member}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingVertical: wp(3),
                    backgroundColor: Colors.lightgreen,
                    marginBottom: wp(3),
                    paddingHorizontal: wp(3),
                    borderRadius: wp(2),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.white,
                    }}
                  >
                    {item?.member?.name}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: '#96B4AA',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: wp(2),
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#96B4AA',
                      }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (data?.status === 'Pending') {
                      // getTaskStart();
                      if (isEarly) {
                        Alert.alert(
                          'Too Early',
                          `Please try again at the scheduled time.`,
                        );
                      } else if (isBetween) {
                        getTaskStart();
                        navigation.navigate('FocusScreen', {
                          start_time: data?.start_datetime,
                          end_time: data?.end_datetime,
                        });
                      } else if (isPassed) {
                        Alert.alert(
                          'Task Expired',
                          'The scheduled time has passed. Please create or select a new task.',
                        );
                      }
                    } else if (data?.status === 'Inprogress') {
                      // setShowImagePickerModal(true);
                    } else if (data?.status == 'Completed') {
                      // Alert.alert(
                      //   'Task Completed',
                      //   'This task has already been completed.',
                      // );
                      Alert.alert(
                        'Task Completed',
                        'This task has already been completed.',
                        [{ text: 'OK' }],
                      );
                    } else if (data?.status == 'In Complete') {
                      Alert.alert(
                        'Task Incomplete',
                        'This task is not yet completed. Please edit the task to complete it.',
                        [
                          {
                            text: 'Edit Task',
                            onPress: () => {
                              refRBSheet.current?.open();
                            },
                          },
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                        ],
                      );
                    }
                  }}
                  disabled={data?.status == 'Completed'}
                  style={{
                    width: data?.status == 'Completed' ? '48%' : wp(88),
                    // width: '48%',
                    height: wp(13),
                    borderRadius: wp(3),
                    backgroundColor: '#BD2BAF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: wp(4),
                    marginBottom: wp(14),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    {data?.status == 'Pending'
                      ? 'Start Task'
                      : data?.status === 'In Complete'
                      ? 'Incomplete'
                      : data?.status == 'Inprogress'
                      ? 'End Task'
                      : 'Completed'}
                  </Text>
                </TouchableOpacity>
                {data?.status === 'Completed' && (
                  <TouchableOpacity
                    style={{
                      width: '48%',
                      height: wp(13),
                      borderRadius: wp(3),
                      backgroundColor: '#BD2BAF',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      marginTop: wp(4),
                      marginBottom: wp(14),
                    }}
                    onPress={triggerShare}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <AntDesign name="sharealt" size={24} color="#fff" />
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.bold,
                          color: Colors.white,
                          marginLeft: 6,
                        }}
                      >
                        Share
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <TaskCompletionWithShare
              ref={shareRef}
              taskData={data}
              onClose={() => navigation.goBack()}
            />
          </View>
          <RBSheet
            ref={refRBSheet}
            height={hp(88)}
            closeOnDragDown={true}
            // draggable={true}
            // openDuration={650}
            // closeDuration={280}
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
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}
          >
            <ImageBackground
              source={images.mainImage}
              style={styless.bg}
              imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            >
              {/* Dark overlay */}

              <View style={styless.overlay}>
                {/* Header */}
                <View style={styless.header}>
                  <Text style={styless.title}>Select Option</Text>
                  <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                    <AntDesign name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: hp(keyboardVisible ? 32 : 3),
                  }}
                >
                  <View style={{ paddingHorizontal: wp(5) }}>
                    {/* Image Upload */}
                    {[0].map(index => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => upload(index)}
                        style={{
                          backgroundColor: 'transparent',
                          alignSelf: 'center',
                          width: wp(29),
                          height: wp(29),
                          // borderWidth: 1,
                          // borderColor: '#667085',
                          // borderStyle: 'dotted',
                          borderRadius: wp(3),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#00000040',
                        }}
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
                        marginTop: wp(4),
                        marginBottom: wp(6),
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        height: wp(13),
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TextInput
                        ref={titleInputRef}
                        placeholder="Tap to write task title"
                        placeholderTextColor="#9E9E9E"
                        value={title}
                        // onFocus={() => title.length === 0 && setTitle('')}
                        onChangeText={setTitle}
                        style={{
                          width: '100%',
                          height: '100%',
                          fontSize: 16,
                          fontFamily: fonts.regular,
                          color: Colors.white,
                          textAlign: 'center',
                          paddingHorizontal: wp(4),
                        }}
                      />
                    </View>

                    {/* Options List */}
                    <View
                      style={{
                        width: wp(90),
                        alignSelf: 'center',
                        // backgroundColor: Colors.white,
                        borderRadius: wp(3),
                        padding: wp(4),
                      }}
                    >
                      <TouchableOpacity
                        style={styless.optionButton}
                        onPress={() => setModalVisibleMember(true)}
                      >
                        <Text style={{ color: Colors.white }}>
                          {selectedMembers.length > 0
                            ? 'Members'
                            : 'Add Members'}
                        </Text>
                        {selectedMembers.length > 0 ? (
                          <Text style={{ color: Colors.white }}>
                            {
                              allMembers.filter(m =>
                                selectedMembers.includes(m.id),
                              ).length
                            }{' '}
                            {allMembers.filter(m =>
                              selectedMembers.includes(m.id),
                            ).length === 1
                              ? 'member'
                              : 'members'}
                          </Text>
                        ) : (
                          <AntDesign name="right" color="#EFEFEF" size={18} />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styless.optionButton}
                        onPress={() => setModalVisible(true)}
                      >
                        <Text style={{ color: Colors.white }}>
                          {selectedPriority ? 'Priority' : 'Add priority'}
                        </Text>
                        {selectedPriority ? (
                          <Text style={{ color: Colors.white }}>
                            {selectedPriority}
                          </Text>
                        ) : (
                          <AntDesign name="right" color="#EFEFEF" size={18} />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styless.optionButton}
                        onPress={() => setModalVisibletag(true)}
                      >
                        <Text style={{ color: Colors.white }}>
                          {selectedTag ? 'Tags' : 'Add Tags'}
                        </Text>
                        {selectedTag ? (
                          <Text style={{ color: Colors.white }}>
                            {selectedTag}
                          </Text>
                        ) : (
                          <AntDesign name="right" color="#EFEFEF" size={18} />
                        )}
                        {/* <AntDesign name="right" color="#EFEFEF" size={18} /> */}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styless.optionButton}
                        onPress={showDateTimePicker}
                      >
                        <Text style={{ color: Colors.white }}>
                          {selectedDate ? 'Date' : 'Select date'}
                        </Text>
                        {selectedDate ? (
                          <Text style={{ color: Colors.white }}>
                            {formatDateDisplay(selectedDate)}
                          </Text>
                        ) : (
                          <AntDesign name="right" color="#EFEFEF" size={18} />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styless.optionButton}
                        onPress={() => {
                          setTimeType('start');
                          showTimePicker();
                        }}
                      >
                        <Text style={{ color: Colors.white }}>
                          {startTime ? 'Start time' : 'Select start time'}
                        </Text>
                        {startTime ? (
                          <Text style={{ color: Colors.white }}>
                            {formatTime(startTime)}
                          </Text>
                        ) : (
                          <AntDesign name="right" color="#EFEFEF" size={18} />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styless.optionButton}
                        onPress={() => {
                          setTimeType('end');
                          showTimePicker();
                        }}
                      >
                        <Text style={{ color: Colors.white }}>
                          {endTime ? 'End time' : 'Select end time'}
                        </Text>
                        {endTime ? (
                          <Text style={{ color: Colors.white }}>
                            {formatTime(endTime)}
                          </Text>
                        ) : (
                          <AntDesign name="right" color="#EFEFEF" size={18} />
                        )}
                      </TouchableOpacity>

                      <TextInput
                        placeholder="Description here..."
                        placeholderTextColor="#9E9E9E"
                        value={description}
                        onFocus={() =>
                          description.length === 0 && setDescription('')
                        }
                        onChangeText={text => setDescription(text)}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={[
                          styless.optionButton,
                          {
                            paddingVertical: 8,
                            height: 200,
                          },
                        ]}
                      />

                      <TouchableOpacity
                        style={styless.nextBtn}
                        onPress={() => {
                          console.debug('SaveEditTaskApi');
                          SaveEditTaskApi();
                        }}
                      >
                        <Text style={styless.nextBbtnText}>Create</Text>
                      </TouchableOpacity>
                      {/* Show DateTimePicker inline */}
                      {showDatePicker && (
                        <DateTimePicker
                          value={date}
                          mode={mode}
                          display={
                            Platform.OS === 'ios' ? 'spinner' : 'default'
                          }
                          onChange={handleChange}
                          minimumDate={new Date()}
                        />
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </ImageBackground>
          </RBSheet>

          {/* Member Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisiblemember}
            onRequestClose={() => setModalVisibleMember(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <ImageBackground
                source={images.mainImage}
                style={{
                  // backgroundColor: Colors.white,
                  // flex: 1,
                  borderRadius: 10,

                  width: wp(100),
                  height: hp(82),
                  alignSelf: 'center',
                  marginBottom: wp(5),
                }}
                imageStyle={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <View style={styless.overlay}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                      marginBottom: wp(4),
                      textAlign: 'center',
                    }}
                  >
                    Add Members
                  </Text>

                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 25,
                      right: 15,
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: Colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setModalVisibleMember(false)}
                  >
                    <AntDesign name="close" size={16} color={Colors.black} />
                  </TouchableOpacity>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {allMembers.length === 0 ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 18, fontFamily: fonts.bold }}>
                          No Friends available
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisibleMember(false);
                            navigation.navigate('AddMembers');
                          }}
                        >
                          <Text
                            style={{
                              color: 'blue',
                              textDecorationLine: 'underline',
                              marginTop: 10,
                            }}
                          >
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
                            backgroundColor: '#BD2BAF20',
                            borderRadius: wp(2),
                            marginBottom: wp(3),
                          }}
                          onPress={() => {
                            if (selectedMenu === 'task') {
                              handleMemberSelect(member.id);
                            } else {
                              handleMeetingMemberSelect(member.id);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.bold,
                              color: Colors.white,
                            }}
                          >
                            {member.name}
                          </Text>
                          {/* {selectedMembers.includes(member.id) && (
                                <AntDesign
                                  name="checkcircle"
                                  size={22}
                                  color={Colors.mainColor}
                                />
                              )} */}
                          <View style={styless.radioOuter}>
                            {selectedMembers.includes(member.id) && (
                              <View style={styless.radioInner} />
                            )}
                          </View>
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
                    <Text
                      style={{
                        color: Colors.white,
                        fontFamily: fonts.bold,
                        fontSize: 15,
                      }}
                    >
                      Add Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>

          {/* Priority Modal */}
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
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <ImageBackground
                source={images.mainImage}
                style={{
                  borderRadius: 10,
                  width: wp(100),
                  height: wp(60),
                  alignSelf: 'center',
                  marginBottom: wp(5),
                }}
                imageStyle={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <View style={styless.overlay}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                      marginBottom: wp(4),
                      textAlign: 'center',
                    }}
                  >
                    Select Priorities
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 25,
                      right: 15,
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: Colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <AntDesign name="close" size={16} color={Colors.black} />
                  </TouchableOpacity>

                  {['Low Priority', 'Medium Priority', 'High Priority'].map(
                    priority => (
                      <TouchableOpacity
                        key={priority}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: wp(3),
                          paddingHorizontal: wp(3),
                          backgroundColor: '#BD2BAF20',
                          borderRadius: wp(2),
                          marginBottom: wp(3),
                        }}
                        onPress={() => handlePrioritySelect(priority)}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: fonts.bold,
                            color: Colors.white,
                          }}
                        >
                          {priority}
                        </Text>

                        <View style={styless.radioOuter}>
                          {selectedPriority === priority && (
                            <View style={styless.radioInner} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </ImageBackground>
            </View>
          </Modal>

          {/* Tag Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibletag}
            onRequestClose={() => setModalVisibletag(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <ImageBackground
                source={images.mainImage}
                style={{
                  borderRadius: 10,
                  width: wp(100),
                  height: wp(120),
                  alignSelf: 'center',
                  marginBottom: wp(5),
                }}
                imageStyle={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <View style={styless.overlay}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                      marginBottom: wp(4),
                      textAlign: 'center',
                    }}
                  >
                    Select Tag
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 25,
                      right: 15,
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: Colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setModalVisibletag(false)}
                  >
                    <AntDesign name="close" size={16} color={Colors.black} />
                  </TouchableOpacity>

                  {[
                    'No tag',
                    'Room Cleaning',
                    'Healthy Lifestyle',
                    'Morning Routine',
                    'Relationship',
                    'Sleep Better',
                    'Workout',
                  ].map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: wp(3),
                        paddingHorizontal: wp(3),
                        backgroundColor: '#BD2BAF20',
                        borderRadius: wp(2),
                        marginBottom: wp(3),
                      }}
                      onPress={() => handlePriorityTag(tag)}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.bold,
                          color: Colors.white,
                        }}
                      >
                        {tag}
                      </Text>

                      <View style={styless.radioOuter}>
                        {selectedTag === tag && (
                          <View style={styless.radioInner} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ImageBackground>
            </View>
          </Modal>

          {/* Completion Proof Modal - Only One Image */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showImagePickerModal}
            onRequestClose={() => {
              setShowImagePickerModal(false);
              setCompletionImage(null);
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
                      color: Colors.white,
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
                    <AntDesign name="close" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{ color: '#666', fontSize: 14, marginBottom: wp(5) }}
                >
                  Please upload one photo showing the task is completed.
                </Text>

                {/* Image Preview or Upload Box */}
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

                {/* Submit Button */}
                <MainButton
                  title="Submit & Complete Task"
                  onPress={getTaskEnd}
                  disabled={!completionImage} // Enabled only when image is selected
                />
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
        {SuccessModal()}
        {FailureModal()}
      </ImageBackground>
    </>
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
export default TaskDetails;
