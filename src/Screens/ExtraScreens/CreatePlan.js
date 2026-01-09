import {
  View,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainButton from '../../Components/MainButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreatePlan = ({ navigation }) => {
  const user = useSelector(state => state.user.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [modalVisibleMember, setModalVisibleMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Date & Time Picker States
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  // Format Date for Display: 19 Nov, 2025
  const formatDisplayDate = date => {
    if (!date) return 'Select Date';
    return moment(date).format('DD MMM, YYYY');
  };

  // Format Date for API: 2025-11-19
  const formatDateForAPI = date => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
  };

  // Format Time for Display & API: 10:30 AM
  const formatTime = date => {
    if (!date) return 'Select time';
    return moment(date).format('hh:mm A'); // 10:30 AM
  };

  // Date Picker Handlers
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleDateConfirm = date => {
    setSelectedDate(date);
    hideDatePicker();
  };

  // Start Time Picker
  const showStartTimePicker = () => setStartTimePickerVisibility(true);
  const hideStartTimePicker = () => setStartTimePickerVisibility(false);
  const handleStartTimeConfirm = date => {
    setStartTime(date);
    hideStartTimePicker();
  };

  // End Time Picker
  const showEndTimePicker = () => setEndTimePickerVisibility(true);
  const hideEndTimePicker = () => setEndTimePickerVisibility(false);
  const handleEndTimeConfirm = date => {
    setEndTime(date);
    hideEndTimePicker();
  };

  // Toggle member selection
  const handleMemberSelect = memberId => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId],
    );
  };

  // Fetch all friends/members
  const getAllMembers = () => {
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => {
        if (res.data) {
          setAllMembers(res.data);
        }
      })
      .catch(err => {
        console.log('Friends API error:', err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllMembers();
    }, []),
  );

  // Create Plan API Call
  const CreatePlanApi = () => {
    // Validation
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Title is required' });
      return;
    }
    // if (selectedMembers.length === 0) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Error',
    //     text2: 'Select at least one member',
    //   });
    //   return;
    // }
    if (!selectedDate) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Date is required' });
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
    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Description is required',
      });
      return;
    }

    const formdata = new FormData();
    formdata.append('title', title);
    selectedMembers.forEach(id => formdata.append('member_ids[]', id));
    formdata.append('date', formatDateForAPI(selectedDate)); // 2025-11-19
    formdata.append('start_time', formatTime(startTime)); // 10:30 AM
    formdata.append('end_time', formatTime(endTime)); // 02:30 PM
    formdata.append('description', description);

    setIsLoading(true);

    PostAPiwithToken({ url: 'add-planner', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('Plan Response:', res);

        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: res.message || 'Plan created successfully',
          });
          navigation.goBack();
          setTitle(''),
            setSelectedMembers(null),
            setSelectedDate(null),
            setStartTime(null),
            setEndTime(null),
            setDescription(null);
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
        console.log('API Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create plan. Please try again.',
        });
      });
  };
const {top}=useSafeAreaInsets()
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1,paddingTop:Platform.OS === 'ios' ?30: 0, }}
      resizeMode="cover"
    >
      {isLoading && <Loader />}

     

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(5) : 0}
      >
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
              <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
              // marginRight: wp(7),
            }}
          >
            Add/Create Plan
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: wp(20) }}>
          <View style={{ paddingHorizontal: wp(5), marginTop: wp(4) }}>
            {/* Title */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
              }}
            >
              Add title
            </Text>
            <View
              style={{
                backgroundColor: '#FAFAFA',
                paddingVertical: wp(2),
                borderRadius: 8,
                marginTop: wp(2),
                elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
                
              }}
            >
              <TextInput
                placeholder="Enter plan title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#888"
                style={{
                  paddingHorizontal: wp(4),
                  fontSize: 14,
                  color: Colors.black,
                }}
              />
            </View>

            {/* Members */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(5),
              }}
            >
              Add member
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisibleMember(true)}
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 8,
                padding: wp(4),
                marginTop: wp(2),
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: selectedMembers.length > 0 ? Colors.black : '#888',
                  fontSize: 14,width:wp(74)
                }}
              >
                {selectedMembers.length > 0
                  ? allMembers
                      .filter(m => selectedMembers.includes(m.id))
                      .map(m => m.name)
                      .join(', ')
                  : 'Select members'}
              </Text>
              <AntDesign name="down" size={18} color={Colors.mainColor} />
            </TouchableOpacity>

            {/* Date */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(5),
              }}
            >
              Select Date
            </Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={{
                backgroundColor: '#FAFAFA',
                padding: wp(4),
                borderRadius: 8,
                marginTop: wp(2),
                elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: selectedDate ? Colors.black : '#888',
                }}
              >
                {formatDisplayDate(selectedDate)}
              </Text>
              <AntDesign name="calendar" size={20} color={Colors.mainColor} />
            </TouchableOpacity>

            {/* Start & End Time */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: wp(5),
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  Start Time
                </Text>
                <TouchableOpacity
                  onPress={showStartTimePicker}
                  style={{
                    backgroundColor: '#FAFAFA',
                    width: wp(42),
                    padding: wp(4),
                    borderRadius: 8,
                    marginTop: wp(2),
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: startTime ? Colors.black : '#888' }}>
                    {formatTime(startTime)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  End Time
                </Text>
                <TouchableOpacity
                  onPress={showEndTimePicker}
                  style={{
                    backgroundColor: '#FAFAFA',
                    width: wp(42),
                    padding: wp(4),
                    borderRadius: 8,
                    marginTop: wp(2),
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: endTime ? Colors.black : '#888' }}>
                    {formatTime(endTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(5),
              }}
            >
              Description
            </Text>
            <View
              style={{
                backgroundColor: '#FAFAFA',
                height: wp(45),
                borderRadius: 12,
                marginTop: wp(3),
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                paddingHorizontal: wp(4),
                paddingTop: wp(3),
              }}
            >
              <TextInput
                multiline
                placeholder="Write here..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                style={{
                  textAlignVertical: 'top',
                  fontSize: 14,
                  color: Colors.black,
                }}
              />
            </View>

            {/* Create Button */}
            <View style={{ alignItems: 'center', marginTop: wp(10) }}>
              <MainButton title="Create Plan" onPress={CreatePlanApi} />
            </View>
          </View>
        </ScrollView>

        {/* Members Modal */}
        <Modal
          transparent
          visible={modalVisibleMember}
          animationType="slide"
          onRequestClose={() => setModalVisibleMember(false)}
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
                backgroundColor: '#fff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: wp(6),
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
                <Text style={{ fontSize: 18, fontFamily: fonts.bold }}>
                  Select Members
                </Text>
                <TouchableOpacity onPress={() => setModalVisibleMember(false)}>
                  <AntDesign name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {allMembers?.map(member => (
                <TouchableOpacity
                  // key={member.id}
                  onPress={() => handleMemberSelect(member.id)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: wp(3),
                    paddingHorizontal: wp(2),
                    backgroundColor: '#f0f8f0',
                    borderRadius: 10,
                    marginBottom: wp(2),
                  }}
                >
                  <Text style={{ fontSize: 15, color: Colors.black }}>
                    {member.name}
                  </Text>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: Colors.mainColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {selectedMembers?.includes(member.id) && (
                      <View
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 7,
                          backgroundColor: Colors.mainColor,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setModalVisibleMember(false)}
                style={{
                  marginTop: wp(6),
                  backgroundColor: Colors.mainColor,
                  paddingVertical: wp(4),
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: fonts.bold,
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date & Time Pickers */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}
        />
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default CreatePlan;
