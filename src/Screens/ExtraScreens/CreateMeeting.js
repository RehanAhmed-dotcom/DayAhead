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
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  Calendar,
  LocaleConfig,
  CalendarList,
  Agenda,
} from 'react-native-calendars';
import moment from 'moment';
import ArrowBack from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const CreateMeetingPage = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [title, setTitle] = useState('');
  const [allMembers, setAllMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);

  console.log('my meeting period', selectedPriority);
  const [modalUpcomingDate, setModalUpcomingDate] = useState(false);

  // const [currentMonth, setCurrentMonth] = useState(
  //   moment().locale('en-gb').format('MMMM YYYY'),
  // );
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisiblemember, setModalVisibleMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]); // Changed to array
  const [modalVisibleperiod, setModalVisibleperiod] = useState(false);
  const [selectedTaskPeriod, setSelectedTaskPeriod] = useState(null);
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startNewTime, setStartNewTime] = useState(null);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };
  const formatDateForAPI = date => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
  };

  // Format Time for Display & API: 10:30 AM
  const formatTime = date => {
    if (!date) return 'Select time';
    return moment(date).format('hh:mm A'); // 10:30 AM
  };

  const handleStartTimeConfirm = date => {
    setStartTime(date);
    hideStartTimePicker();
  };
  const handleEndTimeConfirm = date => {
    setEndTime(date);
    hideEndTimePicker();
  };

  // Function to handle priority selection
  const handlePrioritySelect = priority => {
    setSelectedPriority(priority);
    setModalVisible(false);
  };

  // Function to handle multiple member selection
  const handleMemberSelect = member => {
    setSelectedMembers(
      prev =>
        prev.includes(member)
          ? prev.filter(m => m !== member) // Remove if already selected
          : [...prev, member], // Add if not selected
    );
  };

  const handleMemberTaskPeriod = period => {
    setSelectedTaskPeriod(period);
    setModalVisibleperiod(false);
  };

  const combinedMarkedDates = () => {
    const marked = schedules?.reduce((acc, date) => {
      acc[date] = {
        marked: true,
        dotColor: '#FFA633',
      };
      return acc;
    }, {});

    const combined = { ...marked };
    Object.keys(selectedDates).forEach(date => {
      combined[date] = {
        ...combined[date],
        ...selectedDates[date],
      };
    });

    return combined;
  };

  const getMarkedDates = () => {
    const today = moment().format('YYYY-MM-DD');
    const marked = {
      [today]: {
        customStyles: {
          container: {
            backgroundColor: Colors.mainColor,
            borderRadius: 10,
          },
          text: {
            color: 'white',
          },
        },
      },
    };

    // Add selected date styling if a date is selected
    if (selectedDate) {
      marked[selectedDate] = {
        customStyles: {
          container: {
            backgroundColor: Colors.mainColor,
            borderRadius: 10,
          },
          text: {
            color: 'white',
          },
        },
      };
    }

    return marked;
  };
  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

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
    if (!selectedPriority) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Meeting duration is required',
      });
      return;
    }
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
    formdata.append('duration', selectedPriority);
    formdata.append('date', formatDateForAPI(selectedDate));
    formdata.append('start_time', formatTime(startTime));
    formdata.append('end_time', formatTime(endTime));
    formdata.append('description', description);

    setIsLoading(true);

    PostAPiwithToken(
      { url: 'create-meeting', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        console.log('Meeting Response:', JSON.stringify(res));

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
          setSelectedPriority(null);
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
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?30: 0, }}
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
            marginBottom:wp(3)
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
            Schedule Meeting
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ marginTop: wp(3), paddingHorizontal: wp(5) }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
              }}
            >
              Meeting Title
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: wp(2),
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
            >
              <TextInput
                placeholder="Enter meeting title"
                onChangeText={text => setTitle(text)}
                value={title}
                placeholderTextColor={'#616161'}
                style={{
                  width: wp(80),
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: Colors.black,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Add member
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: 13,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: selectedMembers.length > 0 ? Colors.black : '#616161',
                  width: wp(70),
                }}
              >
                {selectedMembers.length > 0
                  ? allMembers
                      .filter(m => selectedMembers.includes(m.id))
                      .map(m => m.name)
                      .join(', ')
                  : 'Select members'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisibleMember(true)}>
                <AntDesign name="down" color={Colors.mainColor} size={18} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Meeting Duration
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: 13,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: selectedPriority ? Colors.black : '#616161',
                }}
              >
                {selectedPriority || 'Select duration'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <AntDesign name="down" color={Colors.mainColor} size={18} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: wp(3),
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
                  style={{
                    backgroundColor: '#FAFAFA',
                    width: wp(42),
                    height: wp(13),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: wp(2),
                    marginTop: wp(2),
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                  }}
                  onPress={showStartTimePicker}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.lightblack,
                    }}
                  >
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
                  style={{
                    backgroundColor: '#FAFAFA',
                    width: wp(42),
                    height: wp(13),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: wp(2),
                    marginTop: wp(2),
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                  }}
                  onPress={showEndTimePicker}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.lightblack,
                    }}
                  >
                    {formatTime(endTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Meeting Date
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: 13,
                elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
              }}
            >
              <View style={{ width: wp(63) }}>
                <Text style={styles.descText}>
                  {selectedDate ? selectedDate : 'Select Date'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalUpcomingDate(true)}>
                <AntDesign name="down" size={22} color={Colors.mainColor} />
              </TouchableOpacity>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Description
            </Text>
            <View
              style={{
                width: wp(90),
                height: wp(45),
                borderRadius: wp(3),
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                backgroundColor: '#FAFAFA',
                alignSelf: 'center',
                marginBottom: wp(3),
                marginTop: wp(3),
              }}
            >
              <TextInput
                style={{
                  paddingHorizontal: wp(3),
                  color: Colors.black,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  width: wp(85),
                  marginHorizontal: wp(2),
                }}
                multiline
                placeholder="Write here..."
                placeholderTextColor={Colors.lightgrey}
                value={description}
                onChangeText={text => setDescription(text)}
              />
            </View>
          </View>
          <View
            style={{
              //   position: 'absolute',
              //   bottom: wp(45),
              alignSelf: 'center',
              marginBottom: wp(20),
              marginTop: wp(4),
            }}
          >
            <MainButton
              title={'Create Now'}
              // onPress={() => navigation.navigate('AlltaskSet')}
              onPress={() => CreatePlanApi()}
            />
          </View>
        </ScrollView>

       
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
                }}
              >
                Select Meeting Period
              </Text>
              <View
                style={{ position: 'absolute', top: 15, right: 15, padding: 5 }}
                onTouchEnd={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={18} color={Colors.black} />
              </View>
              {[
                '1 hour',
                '2 hours',
                '3 hours',
                '4 hours',
                '5 hours',
                '6 hours',
                '7 hours',
                '8 hours',
              ].map(priority => (
                <TouchableOpacity
                  key={priority}
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
                  onPress={() => handlePrioritySelect(priority)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    {priority}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: Colors.mainColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: wp(2),
                    }}
                  >
                    {selectedPriority === priority && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: Colors.mainColor,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
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
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        
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
                }}
              >
                Add Friends/Members
              </Text>
              <View
                style={{ position: 'absolute', top: 15, right: 15, padding: 5 }}
                onTouchEnd={() => setModalVisibleMember(false)}
              >
                <AntDesign name="close" size={18} color={Colors.black} />
              </View>
              {allMembers.map(member => (
                <TouchableOpacity
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
                  onPress={() => handleMemberSelect(member.id)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    {member.name}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: Colors.mainColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: wp(2),
                    }}
                  >
                    {selectedMembers.includes(member.id) && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: Colors.mainColor,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
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
                onPress={() => setModalVisibleMember(false)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Add Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

       
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleperiod}
          onRequestClose={() => setModalVisibleperiod(false)}
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
                }}
              >
                Add Task Period
              </Text>
              <View
                style={{ position: 'absolute', top: 15, right: 15, padding: 5 }}
                onTouchEnd={() => setModalVisibleperiod(false)}
              >
                <AntDesign name="close" size={18} color={Colors.black} />
              </View>
              {[
                'Today',
                '24 Hour (a full day)',
                '3 days',
                '5 days',
                'A whole week',
              ].map(period => (
                <TouchableOpacity
                  key={period}
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
                  onPress={() => handleMemberTaskPeriod(period)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    {period}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: Colors.mainColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: wp(2),
                    }}
                  >
                    {selectedTaskPeriod === period && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: Colors.mainColor,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
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
                onPress={() => setModalVisibleperiod(false)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Add Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalUpcomingDate}
          onRequestClose={() => setModalUpcomingDate(false)}
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
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  // marginBottom: wp(4),
                  textAlign: 'center',
                }}
              >
                Upcoming Due Date
              </Text>
              <View
                style={{
                  borderRadius: 10,
                  // marginTop: 10,
                  backgroundColor: 'white',
                  // marginHorizontal: 16,
                  overflow: 'hidden',
                }}
              >
                <Calendar
                  key={'light'}
                  markingType="custom"
                  markedDates={getMarkedDates()}
                  onDayPress={onDayPress}
                  onMonthChange={month => {
                    // setCurrentMonth(
                    //   moment(month.dateString).locale('en').format('MMMM YYYY'),
                    // );
                  }}
                  renderArrow={direction => (
                    <View
                      style={{
                        height: 32,
                        width: 32,
                        alignItems: 'center',
                        borderRadius: 10,
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowBack
                        name={direction === 'left' ? 'left' : 'right'}
                        color={'black'}
                        size={22}
                      />
                    </View>
                  )}
                  // renderHeader={() => (
                  //   <Text
                  //     style={{
                  //       fontSize: 16,
                  //       fontFamily: fonts.bold,
                  //       textAlign: 'center',
                  //       color: 'black',
                  //       textTransform: 'capitalize',
                  //     }}
                  //   >
                  //     {currentMonth}
                  //   </Text>
                  // )}
                  theme={{
                    backgroundColor: 'white',
                    calendarBackground: 'white',
                    selectedDayBackgroundColor: Colors.mainColor,
                    selectedDayTextColor: 'white',
                    todayTextColor: Colors.mainColor,
                    arrowColor: '#4A90E2',
                    textSectionTitleColor: '#151515',
                    textDayFontSize: 16,
                    dayTextColor: '#000',
                    textDisabledColor: '#D3D3D3',
                  }}
                />
              </View>
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
                  setModalUpcomingDate(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

export default CreateMeetingPage;
