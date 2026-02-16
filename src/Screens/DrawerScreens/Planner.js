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
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import React, { useCallback, useState, useMemo, useRef } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../Components/MainButton';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import SwitchToggle from 'react-native-switch-toggle';
import Entypo from 'react-native-vector-icons/Entypo';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Planner = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const startProgressAnimation = () => {
    progressAnim.setValue(0); // Reset

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setShowFullScreen(false);
      }
    });
  };
  const [selectedDate, setSelectedDate] = useState(moment());
  const [onchangeTab, setOnChangeTab] = useState('1');
  const [myPlans, setMyPlans] = useState([]);
  const [allMeetings, setAllMeeting] = useState([]);
  console.log('testinnggdataa', allMeetings);
  const [isloading, setIsLoading] = useState(false);
  const [liveStatusData, setLiveStatusData] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [checkingInId, setCheckingInId] = useState(null);

  const [fullScreenImage, setFullScreenImage] = useState(null); // stores the URI
  const [showFullScreen, setShowFullScreen] = useState(false);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const selectedDateFormatted = useMemo(
    () => moment(selectedDate).format('YYYY-MM-DD'),
    [selectedDate],
  );

  const filteredPlans = useMemo(
    () => myPlans.filter(plan => plan.date === selectedDateFormatted),
    [myPlans, selectedDateFormatted],
  );
  const filteredMeetings = useMemo(
    () => allMeetings.filter(meeting => meeting.date === selectedDateFormatted),
    [allMeetings, selectedDateFormatted],
  );

  const handleDateSelected = date => setSelectedDate(date);

  // const dotOptions = [
  //   { label: 'Join Meeting', value: 'Join Meeting' },
  //   { label: 'Cancel Meeting', value: 'Cancel Meeting' },
  // ];
  const dotOptions = meeting => {
    const isCreator = meeting?.created_by == user?.id; // Adjust field name if needed

    const options = [{ label: 'Join Meeting', value: 'Join Meeting' }];

    // Only show "Cancel Meeting" if the current user is the creator
    if (isCreator) {
      options.push({ label: 'Cancel Meeting', value: 'Cancel Meeting' });
    }

    return options;
  };

  const openDropdown = (event, meetingId) => {
    const { pageX, pageY } = event.nativeEvent;
    setDropdownPosition({
      x: pageX - wp(30),
      y: pageY - 20,
    });
    setSelectedMeetingId(meetingId);
    setIsDropdownVisible(true);
  };
  const CancelMeeting = () => {
    const formdata = new FormData();
    formdata.append('meeting_id', selectedMeeting.id);

    setIsLoading(true);
    PostAPiwithToken(
      { url: 'cancel-meeting', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        // console.log('Status change response:', JSON.stringify(res));

        if (res.status === 'success') {
          getAllMeetings();
          Toast.show({
            type: 'success',
            text1: 'Meeting cancel Successful!',
            text2: res.message || 'Live mode activated',
          });
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
        console.log('Toggle error:', err);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
      });
  };
  const handleOptionSelect = option => {
    setIsDropdownVisible(false);
    if (option === 'Join Meeting') {
      navigation.navigate('ZegoCloud', { item: selectedMeeting });
    } else {
      CancelMeeting();
    }
    console.log('option', option);
    console.log(`Selected: ${option} for Meeting ID: ${selectedMeetingId}`);
  };

  const handleToggleSwitch = (id, currentStatus, imagePath = null) => {
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('status', currentStatus === '1' ? '0' : '1');

    if (imagePath && currentStatus === '0') {
      formdata.append('image', {
        uri: imagePath,
        type: 'image/jpeg',
        name: `checkin_${Date.now()}.jpg`,
      });
    }

    setIsLoading(true);
    PostAPiwithToken(
      { url: 'planner-status-change', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        // console.log('Status change response:', JSON.stringify(res));

        if (res.status === 'success') {
          getAllPlans();
          Toast.show({
            type: 'success',
            text1: 'Check-in Successful!',
            text2: res.message || 'Live mode activated',
          });
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
        console.log('Toggle error:', err);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
      });
  };

  const openCameraForCheckIn = planId => {
    if (checkingInId) return;

    setCheckingInId(planId);

    ImagePicker.openCamera({
      useFrontCamera: true,
      cropping: true,
      width: 600,
      height: 800,
      cropperCircleOverlay: false,
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      compressImageQuality: 0.8,
    })
      .then(image => {
        const imageUri = image.path;
        handleToggleSwitch(planId, '0', imageUri);

        setCheckingInId(null);
      })
      .catch(error => {
        setCheckingInId(null);

        if (error.code === 'E_PICKER_CANCELLED') {
          Toast.show({
            type: 'info',
            text1: 'Cancelled',
            text2: 'Check-in cancelled. Try again.',
          });
        } else {
          console.log('Camera error:', error);
          Toast.show({
            type: 'error',
            text1: 'Camera Failed',
            text2: 'Please try again',
          });
        }
      });
  };

  const getAllPlans = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'view-all-planner', Token: user?.api_token })
      .then(res => {
        console.log('Plans response:', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') {
          setLiveStatusData(res.live_statuses);
          setMyPlans(res.data || []);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('plans API error:', err);
      });
  };

  const getAllMeetings = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'view-all-meeting', Token: user?.api_token })
      .then(res => {
        console.log('Metting response:', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') setAllMeeting(res.data || []);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('meeting API error:', err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllPlans();
      getAllMeetings();
    }, []),
  );

  const CustomDayComponent = ({ date, selected, style }) => {
    const isSelected = selected;
    const dayName = moment(date).format('ddd');
    const dateNumber = moment(date).format('D');

    return (
      <View
        style={[
          style,
          {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isSelected ? Colors.mainColor : 'white',
            borderRadius: wp(3),
            height: 118,
            borderWidth: isSelected ? 0 : 0.5,
            borderColor: isSelected ? undefined : '#E9F1FF',
            elevation: isSelected ? 0 : 1,
          },
        ]}
      >
        <Text
          style={
            isSelected
              ? {
                  color: Colors.white,
                  fontSize: wp(5.5),
                  fontFamily: fonts.semibold,
                }
              : {
                  color: '#1E293B',
                  fontSize: wp(4),
                  fontFamily: fonts.semibold,
                }
          }
        >
          {dateNumber}
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: wp(3.5),
            fontFamily: fonts.regular,
            marginTop: wp(2),
          }}
        >
          {dayName}
        </Text>
      </View>
    );
  };

  const CustomHeaderComponent = ({ date }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginHorizontal: wp(5),
      }}
    >
      <Image
        source={images.homepic}
        style={{
          width: wp(15),
          height: wp(15),
          marginRight: wp(2),
          tintColor: Colors.black,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: Colors.black,
          fontSize: wp(4.5),
          fontFamily: fonts.bold,
        }}
      >
        {moment(date).format('MMMM, D YYYY')}
      </Text>
    </View>
  );
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30 : 0 }}
      resizeMode="cover"
    >
      {isloading && <Loader />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
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
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={images.menuIcon}
              style={{ width: 26, height: 26 }}
              tintColor="black"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
              marginRight: wp(5),
            }}
          >
            Planner
          </Text>
          <View />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Tabs */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: wp(5),
              marginHorizontal: wp(5),
            }}
          >
            <TouchableOpacity onPress={() => setOnChangeTab('1')}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: wp(44),
                  height: 32,
                  borderRadius: 30,
                  backgroundColor:
                    onchangeTab === '1' ? Colors.mainColor : '#ECF7F3',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.bold,
                    color: onchangeTab === '1' ? Colors.white : Colors.black,
                  }}
                >
                  Plans
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOnChangeTab('2')}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: wp(44),
                  height: 32,
                  borderRadius: 30,
                  backgroundColor:
                    onchangeTab === '2' ? Colors.mainColor : '#ECF7F3',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.bold,
                    color: onchangeTab === '2' ? Colors.white : Colors.black,
                  }}
                >
                  Meetings
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Live Check-in Status */}
          {onchangeTab === '1' && (
            <View style={{ marginTop: wp(3), marginHorizontal: wp(5) }}>
              <Text style={{ fontSize: 14, fontFamily: fonts.bold }}>
                Live Check-in Status
              </Text>
              <FlatList
                data={liveStatusData}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item?.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setFullScreenImage(item?.live_status);
                      setShowFullScreen(true);
                      startProgressAnimation(); // Start animation
                    }}
                  >
                    <View
                      style={{
                        width: 55,
                        height: 55,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 28,
                        borderWidth: 2,
                        borderColor: Colors.mainColor,
                        marginRight: wp(2),
                        padding: 2,
                      }}
                    >
                      <Image
                        source={{ uri: item?.live_status }}
                        resizeMode="cover"
                        style={{ width: 49, height: 49, borderRadius: 25 }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Calendar Strip */}
          <CalendarStrip
            style={{ height: 180, paddingTop: 20, paddingBottom: 10 }}
            customDateHeader={CustomHeaderComponent}
            showArrows={false}
            dayComponentHeight={118}
            minDayComponentSize={wp(18)}
            selectedDate={selectedDate}
            onDateSelected={handleDateSelected}
            scrollToOnSetSelectedDate={true}
            startingDate={moment()}
            customDayComponent={CustomDayComponent}
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
            scrollable
            iconStyle={{ display: 'none' }}
          />

          {/* Content */}
          {onchangeTab === '1' ? (
            /* Plans Tab */
            <View style={{ marginTop: wp(3), marginBottom: wp(20) }}>
              {filteredPlans?.length === 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: wp(15),
                  }}
                >
                  <Image
                    source={images.nodata}
                    resizeMode="contain"
                    style={{ width: wp(40), height: wp(40) }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                      marginTop: wp(2),
                    }}
                  >
                    No plans for this date!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredPlans}
                  keyExtractor={item => item?.id.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: wp(4),
                        marginHorizontal: wp(5),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.bold,
                          color: Colors.black,
                          marginRight: wp(2),
                          width: wp(20),
                        }}
                      >
                        {item?.start_time}
                      </Text>
                      <View
                        style={[
                          styles.flatView,
                          {
                            width: wp(70),
                            borderRadius: wp(5),
                            backgroundColor:
                              item.status === '1' ? '#2CA57B' : '#FFB95C',
                            padding: wp(4),
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: fonts.bold,
                            color: Colors.white,
                          }}
                        >
                          {item?.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: fonts.medium,
                            color: Colors.white,
                          }}
                          numberOfLines={2}
                        >
                          {item?.description}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: fonts.medium,
                            color: Colors.white,
                            textAlign: 'right',
                            marginTop: wp(1),
                          }}
                        >
                          {item?.end_time}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTopWidth: 0.5,
                            borderTopColor: '#E7E7E7',
                            paddingTop: wp(2),
                            marginTop: wp(2),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: fonts.medium,
                              color: Colors.white,
                            }}
                          >
                            Live Check-in Mode
                          </Text>
                          <SwitchToggle
                            switchOn={item?.status === '1'}
                            onPress={() => {
                              if (item?.status === '0') {
                                openCameraForCheckIn(item?.id);
                              }
                              // No action when status is '1'
                            }}
                            disabled={
                              item?.status === '1' || checkingInId === item?.id
                            }
                            circleColorOff="#FFFFFF"
                            circleColorOn="#2CA57B"
                            backgroundColorOn={
                              item?.status === '1' ? '#A0E6C3' : 'white'
                            }
                            backgroundColorOff="#FFFFFF"
                            containerStyle={{
                              width: wp(8),
                              height: wp(4),
                              borderRadius: wp(6),
                              opacity: item?.status === '1' ? 0.9 : 1, // subtle disabled look
                            }}
                            circleStyle={{
                              width: wp(4),
                              height: wp(4),
                              borderRadius: wp(5),
                              elevation: item?.status === '1' ? 1 : 3,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.2,
                              shadowRadius: 4,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                />
              )}
              <View style={{ alignSelf: 'center', marginTop: wp(6) }}>
                <MainButton
                  title="Add Planning"
                  onPress={() => navigation.navigate('CreatePlan')}
                />
              </View>
            </View>
          ) : (
            /* Meetings Tab - unchanged */
            <View style={{ marginBottom: wp(20) }}>
              {filteredMeetings.length === 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: wp(15),
                  }}
                >
                  <Image
                    source={images.nodata}
                    resizeMode="contain"
                    style={{ width: wp(40), height: wp(40) }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                      marginTop: wp(2),
                    }}
                  >
                    No meetings on this date!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredMeetings}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.flatView}>
                      {/* ... rest of meeting item unchanged ... */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: wp(37),
                            paddingVertical: wp(1),
                            borderRadius: wp(3),
                            paddingHorizontal: wp(2),
                            backgroundColor: '#ECF7F3',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: wp(3),
                          }}
                        >
                          <Image
                            source={images.clockIcon}
                            resizeMode="contain"
                            style={{
                              width: wp(4),
                              height: wp(4),
                              marginRight: wp(1),
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: fonts.bold,
                              color: Colors.black,
                            }}
                          >
                            {item?.start_time} - {item?.end_time}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={e => {
                            openDropdown(e, item?.id);
                            setSelectedMeeting(item); // Save full meeting object
                          }}
                          style={{ padding: wp(3) }}
                        >
                          <Entypo
                            name="dots-three-horizontal"
                            size={20}
                            color={Colors.black}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Date + Title */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: wp(2),
                          marginTop: wp(4),
                        }}
                      >
                        <View
                          style={{
                            width: 70,
                            height: 70,
                            backgroundColor: 'white',
                            borderRadius: 16,
                            elevation: 3,

                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: wp(3),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: fonts.medium,
                              color: Colors.mainColor,
                              lineHeight: 18,
                            }}
                          >
                            {moment(item?.date).format('ddd')}
                          </Text>
                          <Text
                            style={{
                              fontSize: 22,
                              fontFamily: fonts.medium,
                              color: Colors.black,
                              lineHeight: 22,
                            }}
                          >
                            {moment(item?.date).format('D')}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.bold,
                              color: Colors.black,
                            }}
                            numberOfLines={2}
                          >
                            {item?.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: fonts.medium,
                              color: '#52525B',
                              marginTop: wp(1),
                            }}
                            numberOfLines={1}
                          >
                            Meeting ID: {item?.meeting_id}
                          </Text>
                        </View>
                      </View>

                      {/* Participants */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: wp(3),
                        }}
                      >
                        <View
                          style={{ flexDirection: 'row', marginLeft: wp(10) }}
                        >
                          {item?.members?.slice(0, 5).map((member, index) => (
                            <Image
                              key={index}
                              source={
                                member?.user?.image
                                  ? { uri: member?.user?.image }
                                  : images.picmeeting4
                              }
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 15,
                                marginLeft: index === 0 ? 0 : wp(-3),
                              }}
                              resizeMode="cover"
                            />
                          ))}
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: fonts.medium,
                            color: Colors.mainColor,
                            marginLeft: wp(3),
                          }}
                        >
                          {item?.members?.length || 0} participants
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}

              <View style={{ alignSelf: 'center', marginTop: wp(5) }}>
                <MainButton
                  title="Add Meeting"
                  onPress={() => navigation.navigate('CreateMeetingPage')}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('ChatAI')}
                  style={{
                    width: wp(88),
                    height: wp(13),
                    borderRadius: wp(15),
                    backgroundColor: Colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    borderWidth: 1,
                    borderColor: Colors.mainColor,
                    marginTop: wp(4),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}
                  >
                    AI Suggested
                  </Text>
                  <View style={{ position: 'absolute', right: wp(5) }}>
                    <Image
                      source={images.sendIcon}
                      resizeMode="contain"
                      style={{ width: 17, height: 17 }}
                      tintColor={Colors.mainColor}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Dropdown Modal */}
        <Modal
          transparent
          visible={isDropdownVisible}
          animationType="fade"
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  position: 'absolute',
                  top: dropdownPosition.y,
                  left: dropdownPosition.x,
                  backgroundColor: '#fff',
                  borderRadius: wp(4),
                  elevation: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  minWidth: wp(40),
                  paddingVertical: wp(2),
                }}
              >
                <TouchableOpacity
                  onPress={() => handleOptionSelect('Join Meeting')}
                  style={{
                    paddingVertical: wp(3.5),
                    paddingHorizontal: wp(5),
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#eee',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.black,
                      fontFamily: fonts.medium,
                    }}
                  >
                    Join Meeting
                  </Text>
                </TouchableOpacity>
                {selectedMeeting?.user_id == user.id ? (
                  <TouchableOpacity
                    onPress={() => handleOptionSelect('Cancel Meeting')}
                    style={{
                      paddingVertical: wp(3.5),
                      paddingHorizontal: wp(5),
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#eee',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.black,
                        fontFamily: fonts.medium,
                      }}
                    >
                      Cancel Meeting
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={showFullScreen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFullScreen(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setShowFullScreen(false);
              progressAnim.stopAnimation();
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.98)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  zIndex: 10,
                }}
              >
                <Animated.View
                  style={{
                    height: '100%',
                    backgroundColor: Colors.mainColor,
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                />
              </View>

              <Image
                source={{ uri: fullScreenImage }}
                style={{
                  width: wp(100),
                  height: hp(100),
                  borderRadius: wp(4),
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Planner;
