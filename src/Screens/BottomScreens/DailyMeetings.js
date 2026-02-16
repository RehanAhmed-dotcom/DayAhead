import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { CalendarList } from 'react-native-calendars';

const DailyMeetings = ({ navigation }) => {
  const DAY_WIDTH = 70;
  const DAY_HEIGHT = 85; // a bit taller than width

  const user = useSelector(state => state.user.user);

  const [onchangeTab, setOnChangeTab] = useState('1');
  const [selectedStripDate, setSelectedStripDate] = useState(moment());
  const [allMeetings, setAllMeeting] = useState([]);

  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);
  const taskStartRef = useRef(null);
  const taskStartTimeRef = useRef(null);
  const [nextMeeting, setNextMeeting] = useState(null);

  const [AllTaskDates, setAllTaskDates] = useState([]);

  const [mySubscription, setmySubscription] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const buttonRefs = useRef({});
  const [dropDownValue, setDropDownValue] = useState('weekly');
  const [isFocus, setIsFocus] = useState(false);

  const getAllMeetings = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'view-all-meeting', Token: user?.api_token })
      .then(res => {
        console.log('Metting response:', res);
        setIsLoading(false);
        if (res.status === 'success') {
          console.log(res.data);
          setAllMeeting(res.data || []);
          setAllTaskDates(res.allDates || []);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error('meeting API error:', err);
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
  const CancelMeeting = () => {
    const formdata = new FormData();
    formdata.append('meeting_id', selectedItem.id);

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
    if (option === 'Join Meeting') {
      navigation.navigate('ZegoCloud', { item: selectedItem });
    } else {
      Alert.alert(
        'Cancel Meeting',
        'Are you sure you want to cancel this meeting?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              CancelMeeting();
            },
            style: 'destructive',
          },
        ],
        { cancelable: true },
      );
    }
    console.log('option', option);
    console.log(`Selected: ${option} for Meeting ID: ${selectedItem.id}`);
  };

  // Parse the start date and time into a Date object
  function parseDateTime(dateStr, timeStr) {
    // Convert 12-hour time to 24-hour format
    const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) {
      throw new Error('Invalid time format');
    }

    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const period = timeParts[3].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create date object
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
    return new Date(year, month - 1, day, hours, minutes);
  }

  // Format milliseconds into HH:MM:SS
  function formatTimeLeft(ms) {
    if (ms <= 0) return '00:00:00';

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(val => val.toString().padStart(2, '0'))
      .join(':');
  }

  // Check if two dates are the same day
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Main timer effect
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nowTimestamp = now.getTime();

      // Filter meetings for today and sort by time
      const todaysMeetings = allMeetings
        .map(meeting => {
          const meetingDateTime = parseDateTime(
            meeting.date,
            meeting.start_time,
          );

          return {
            ...meeting,
            dateTime: meetingDateTime,
            timestamp: meetingDateTime.getTime(),
          };
        })
        .filter(
          meeting => meeting.dateTime.toDateString() === now.toDateString(),
        )
        .sort((a, b) => a.timestamp - b.timestamp);

      // Find next upcoming meeting (future meetings only)
      const nextMeeting =
        todaysMeetings.find(m => m.timestamp > nowTimestamp) || null;

      setNextMeeting(nextMeeting);

      if (!nextMeeting) {
        setTimeLeft('00:00:00');
        setProgress(0);
        taskStartRef.current = null;
        taskStartTimeRef.current = null;
        return;
      }

      // Track when we started counting down to this task
      if (taskStartRef.current !== nextMeeting.id) {
        taskStartRef.current = nextMeeting.id;
        taskStartTimeRef.current = nowTimestamp;
      }

      // Calculate time remaining
      const timeRemaining = nextMeeting.timestamp - nowTimestamp;
      setTimeLeft(formatTimeLeft(timeRemaining));

      // Calculate progress (0 = just started tracking, 1 = meeting time reached)
      const totalDuration = nextMeeting.timestamp - taskStartTimeRef.current;
      const elapsed = nowTimestamp - taskStartTimeRef.current;
      const progressValue =
        totalDuration > 0
          ? Math.min(Math.max(elapsed / totalDuration, 0), 1)
          : 1;

      setProgress(progressValue);
    };

    // Run immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [allMeetings]);

  useFocusEffect(
    useCallback(() => {
      getAllMeetings();
      CheckSubscription();
    }, []),
  );

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

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

  const selectedDateFormatted = useMemo(
    () => moment(selectedStripDate).format('YYYY-MM-DD'),
    [selectedStripDate],
  );
  const filteredMeetings = useMemo(
    () => allMeetings.filter(meeting => meeting.date === selectedDateFormatted),
    [allMeetings, selectedDateFormatted],
  );
  // const markedDates = (AllTaskDates || []).map(item => ({
  //   date: moment(item),
  //   dots: [
  //     {
  //       color: 'white',
  //       selectedColor: 'white',
  //     },
  //   ],
  // }));
  const markedDates = useMemo(() => {
    if (!Array.isArray(AllTaskDates)) return [];
    console.log('Is Array', Array.isArray(AllTaskDates));
    return AllTaskDates.map(item => {
      console.log(item); // log each item safely
      return {
        date: moment(item),
        dots: [
          {
            color: 'white',
            selectedColor: 'white',
          },
        ],
      };
    });
  }, [AllTaskDates]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#7A2A73" />;
  }
  return (
    <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          {/* <CalendarStrip
            style={{
              height: 140,
              width: '72%',
              // paddingTop: 20,
              // paddingBottom: 10,
            }}
            calendarHeaderStyle={{
              color: 'white',
              fontSize: 14,
              alignSelf: 'flex-start',
              marginStart: 20,
            }}
            selectedDate={selectedStripDate}
            onDateSelected={date => setSelectedStripDate(moment(date))}
            // height controls row height
            dayComponentHeight={DAY_HEIGHT}
            minDayComponentSize={DAY_HEIGHT}
            scrollable
            startingDate={moment()}
            scrollToOnSetSelectedDate
            showArrows={false}
            iconStyle={{ display: 'none' }}
            dateNameStyle={{
              color: '#FF88F4',
              fontSize: wp(3.5),
              fontFamily: fonts.bold,
            }}
            dateNumberStyle={{
              color: '#FF88F4',
              fontSize: wp(4.5),
              fontFamily: fonts.bold,
            }}
            highlightDateNameStyle={{
              color: 'white',
              fontSize: wp(3.5),
              fontFamily: fonts.bold,
            }}
            highlightDateNumberStyle={{
              color: 'white',
              fontSize: wp(4.5),
              fontFamily: fonts.bold,
            }}
            // 🟪 Selected day (taller rectangle)
            highlightDateContainerStyle={{
              backgroundColor: '#BD2BAF',
              width: DAY_WIDTH,
              height: DAY_HEIGHT,
              borderRadius: wp(3),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            // ⬜ Normal day (taller rectangle)
            dateContainerStyle={{
              width: DAY_WIDTH,
              height: DAY_HEIGHT,
              borderRadius: wp(3),
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 0,
            }}
            markedDates={markedDates}
          /> */}
          {dropDownValue === 'weekly' ? (
            <CalendarStrip
              scrollable
              startingDate={moment()}
              showArrows={false}
              scrollToOnSetSelectedDate
              style={{ height: 140 }}
              calendarHeaderStyle={{ color: 'white', fontFamily: fonts.bold }}
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
          {nextMeeting ? (
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
                  {nextMeeting?.title}
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
              No Upcoming Meeting for Today
            </Text>
          )}
        </View>

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
            {['All', 'Upcoming', 'Completed'].map((tab, index, array) => (
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
                          : fonts.mediumƒ,

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

        <View style={{ height: wp(95) }}>
          <FlatList
            data={filteredMeetings}
            keyExtractor={item => item.id.toString()}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            onScrollBeginDrag={() => setMenuMeetingOpen(false)}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    flexDirection: 'cloumn',
                    justifyContent: 'space-between',
                    marginHorizontal: wp(4),
                    marginVertical: wp(2),
                    padding: 20,
                    backgroundColor: '#BD2BAF50',
                    borderRadius: 25,
                  }}
                >
                  {/* Time */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF30',
                        paddingVertical: 8,
                        paddingHorizontal: 18,
                        borderRadius: 20,
                      }}
                    >
                      <Text>
                        <Fontisto
                          name="access-time-filled"
                          color="white"
                          size={18}
                        />
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: fonts.medium,
                          fontSize: 12,
                          marginStart: 8,
                        }}
                      >
                        {item.start_time} - {item.end_time}
                      </Text>
                    </View>
                    <Pressable
                      ref={ref => (buttonRefs.current[item.id] = ref)}
                      onPress={() => {
                        buttonRefs.current[item.id]?.measureInWindow(
                          (x, y, width, height) => {
                            setMenuPos({ x, y: y + height });
                            setSelectedItem(item);
                            setOpenMenuId(prev =>
                              prev === item.id ? null : item.id,
                            );
                          },
                        );
                      }}
                      style={{ marginRight: -12 }}
                    >
                      <Fontisto name="more-vert" color="white" size={30} />
                    </Pressable>
                    {openMenuId === item.id && (
                      <View
                        style={{
                          position: 'absolute',
                          top: menuPos.y - 420,
                          left: menuPos.x - 170, // adjust to align left of icon
                          width: 140,
                          padding: 8,
                          backgroundColor: '#7A2A73',
                          borderRadius: 6,
                          elevation: 20,
                          shadowColor: '#000',
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          zIndex: 999,
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            console.log('Join meeting', selectedItem?.id);
                            setOpenMenuId(0);
                            handleOptionSelect('Join Meeting');
                          }}
                          style={{ paddingVertical: 8 }}
                        >
                          <Text style={{ color: 'white' }}>Join Meeting</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => {
                            console.log('Cancel meeting', selectedItem?.id);
                            setOpenMenuId(0);
                            handleOptionSelect('Cancel Meeting');
                          }}
                          style={{ paddingVertical: 8 }}
                        >
                          <Text style={{ color: 'white' }}>Cancel Meeting</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>

                  <View style={{ marginTop: 5 }}>
                    {/* Description */}
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fonts.bold,
                        fontSize: 15,
                        width: 270,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fonts.medium,
                        fontSize: 14,
                        marginTop: 8,
                      }}
                    >
                      Meeting ID:{' '}
                      <Text style={{ fontFamily: fonts.bold }}>
                        {item.meeting_id}
                      </Text>
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                      }}
                    >
                      {item.members.map((member, index) => (
                        <Image
                          key={index}
                          source={{ uri: member.user?.image }}
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
                          {item.members.length}{' '}
                          {item.members.length === 1
                            ? 'Participant'
                            : 'Participants'}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: hp(10),
                  color: Colors.white,
                  fontSize: 16,
                }}
              >
                No meetings are available for{' '}
                {selectedStripDate.format('MMMM D, YYYY')}
              </Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default DailyMeetings;
