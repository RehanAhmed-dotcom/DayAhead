import {
  View,
  Text,
  ImageBackground,
  Image,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// import MaterialDesignIcons from 'react-native-vector-icons/MaterialDesignIcons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageCropPicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

import moment from 'moment';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const AddTaskMeeting = ({ navigation, route }) => {
  const type = route?.params?.type;
  const user = useSelector(state => state.user.user);
  const titleInputRef = useRef(null);
  // console.log('my taskss',JSON.stringify(myTasks))
  const [title, setTitle] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ECF7F3');
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
  const [selectedImages, setSelectedImages] = useState([null, null, null]);

  // Meeting States
  const [meetingtitle, setMeetingTitle] = useState('');
  const [meetingSelectedDate, setMeetingSelectedDate] = useState(null);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [meetingEndTime, setMeetingEndTime] = useState(null);
  const [meetingDescription, setMeetingDescription] = useState('');

  const date = new Date();
  const [mode, setMode] = useState('date');
  const [timeType, setTimeType] = useState('start');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const translateXValue = useSharedValue(0);
  const [inputHeight, setInputHeight] = useState(40);

  useFocusEffect(
    useCallback(() => {
      AllGetAPI({ url: 'friends', Token: user?.api_token })
        .then(res => setAllMembers(res.data || []))
        .catch(err => console.log('api error friends', err));
      return () => {};
    }, []),
  );

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXValue.value }],
    };
  });

  useEffect(() => {
    if (showSuccessModal) {
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
  }, [showSuccessModal]);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.selectedMembers) {
        setSelectedMembers(route.params.selectedMembers);
      }
      console.log(route.params?.selectedMembers);
    }, [route.params?.selectedMembers]),
  );

  const SaveTaskApi = () => {
    if (!title?.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Title is required',
      });
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
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 4000);
          navigation.goBack();
          //   resetForm();
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
  const handleMemberSelect = memberId => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(m => m !== memberId)
        : [...prev, memberId],
    );
  };
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

    const isTask = type === 'tasks';

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

          navigation.goBack();
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
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.black} />
      {type === 'tasks' ? (
        <ImageBackground
          source={images.mainImage}
          style={styless.bg}
          // imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        >
          {/* Dark overlay */}

          <View style={styless.overlay}>
            {/* Header */}
            <View style={[styless.header, { marginTop: 30 }]}>
              <Text style={styless.title}>Select Option</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
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
                      textAlign: 'left',
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
                      {selectedMembers.length > 0 ? 'Members' : 'Add Members'}
                    </Text>
                    {selectedMembers.length > 0 ? (
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.white, marginRight: 10 }}>
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
                        <AntDesign name="right" color="#EFEFEF" size={18} />
                      </View>
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
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.white, marginRight: 10 }}>
                          {selectedPriority}
                        </Text>
                        <AntDesign name="right" color="#EFEFEF" size={18} />
                      </View>
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
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.white, marginRight: 10 }}>
                          {selectedTag}
                        </Text>

                        <AntDesign name="right" color="#EFEFEF" size={18} />
                      </View>
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
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.white, marginRight: 10 }}>
                          {formatDateDisplay(selectedDate)}
                        </Text>
                        <AntDesign name="right" color="#EFEFEF" size={18} />
                      </View>
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
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.white, marginRight: 10 }}>
                          {formatTime(startTime)}
                        </Text>
                        <AntDesign name="right" color="#EFEFEF" size={18} />
                      </View>
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
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.white, marginRight: 10 }}>
                          {formatTime(endTime)}
                        </Text>
                        <AntDesign name="right" color="#EFEFEF" size={18} />
                      </View>
                    ) : (
                      <AntDesign name="right" color="#EFEFEF" size={18} />
                    )}
                  </TouchableOpacity>

                  <TextInput
                    placeholder="Description here..."
                    placeholderTextColor="#9E9E9E"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                    onContentSizeChange={e =>
                      setInputHeight(e.nativeEvent.contentSize.height)
                    }
                    style={[
                      styless.optionButton,
                      {
                        paddingVertical: 8,
                        minHeight: 40,
                        height: Math.max(40, inputHeight),
                      },
                    ]}
                  />

                  <TouchableOpacity
                    style={styless.nextBtn}
                    onPress={async () => {
                      SaveTaskApi();
                    }}
                  >
                    <Text style={styless.nextBbtnText}>Create</Text>
                  </TouchableOpacity>
                  {/* Show DateTimePicker inline */}
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode={mode}
                      //   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      ) : (
        <ImageBackground source={images.mainImage} style={styless.bg}>
          {/* Dark overlay */}

          <View style={styless.overlay}>
            {/* Header */}
            <View style={[styless.header, { marginTop: 30 }]}>
              <Text style={[styless.title]}>Create Meeting</Text>

              <TouchableOpacity onPress={() => navigation.goBack()}>
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
                {/* Title Input */}
                <TextInput
                  placeholder="Enter meeting title"
                  placeholderTextColor="#9E9E9E"
                  value={meetingtitle}
                  onFocus={() =>
                    meetingtitle.length === 0 && setMeetingTitle('')
                  }
                  onChangeText={text => setMeetingTitle(text)}
                  style={styless.optionButton}
                />

                <TouchableOpacity
                  style={styless.optionButton}
                  onPress={showDateTimePicker}
                >
                  <Text style={{ color: Colors.white }}>
                    {meetingSelectedDate ? 'Date' : 'Select date'}
                  </Text>
                  {meetingSelectedDate ? (
                    <Text style={{ color: Colors.white }}>
                      {formatDateDisplay(meetingSelectedDate)}
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
                    {meetingStartTime ? 'Start time' : 'Select start time'}
                  </Text>
                  {meetingStartTime ? (
                    <Text style={{ color: Colors.white }}>
                      {formatTime(meetingStartTime)}
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
                    {meetingEndTime ? 'End time' : 'Select end time'}
                  </Text>
                  {meetingEndTime ? (
                    <Text style={{ color: Colors.white }}>
                      {formatTime(meetingEndTime)}
                    </Text>
                  ) : (
                    <AntDesign name="right" color="#EFEFEF" size={18} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styless.optionButton}
                  onPress={() => setModalVisibleMember(true)}
                >
                  <Text style={{ color: Colors.white }}>
                    {selectedMembers.length > 0 ? 'Members' : 'Add Members'}
                  </Text>
                  {selectedMembers.length > 0 ? (
                    <Text style={{ color: Colors.white }}>
                      {
                        allMembers.filter(m => selectedMembers.includes(m.id))
                          .length
                      }{' '}
                      {allMembers.filter(m => selectedMembers.includes(m.id))
                        .length === 1
                        ? 'member'
                        : 'members'}
                    </Text>
                  ) : (
                    <AntDesign name="right" color="#EFEFEF" size={18} />
                  )}
                </TouchableOpacity>

                <TextInput
                  placeholder="Description here..."
                  placeholderTextColor="#9E9E9E"
                  value={meetingDescription}
                  onFocus={() =>
                    meetingDescription.length === 0 && setMeetingDescription('')
                  }
                  onChangeText={text => setMeetingDescription(text)}
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
                  onPress={async () => {
                    console.log('Create plan Api');
                    CreateMeetingApi();
                  }}
                >
                  <Text style={styless.nextBbtnText}>Create</Text>
                </TouchableOpacity>

                {/* Show DateTimePicker inline */}
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      )}
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
                      alignSelf: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.bold,
                        color: Colors.white,
                      }}
                    >
                      No Friends available
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisibleMember(false);
                        // navigation.navigate('AddMembers');
                        // Navigate to current screen with callback
                        navigation.navigate('AddMembers', {
                          onSave: data => {
                            // Handle the returned data
                            setSelectedMembers(data);
                          },
                        });
                      }}
                    >
                      <Text
                        style={{
                          color: 'blue',
                          textDecorationLine: 'underline',
                          marginTop: 10,
                          height: 30,
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
                        if (type === 'tasks') {
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
                'Learning & Growth',
                'Urgent Tasks',
                'Creativity & Inspiration',
                'Productivity Task',
                'Self-Improvement',
                'Social & Relationships',
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
                    {selectedTag === tag && <View style={styless.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ImageBackground>
        </View>
      </Modal>

      {/* Success Celebration Modal */}
      <Modal
        transparent={true}
        visible={showSuccessModal}
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
                source={images.happy}
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
    </View>
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
    // backgroundColor: 'rgba(0,0,0,0.5)', // adjust darkness here
    padding: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
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

export default AddTaskMeeting;
