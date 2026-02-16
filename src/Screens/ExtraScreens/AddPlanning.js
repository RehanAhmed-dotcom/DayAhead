import React, { useState,useEffect } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../Components/MainButton';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
const AddPlanning = ({ navigation }) => {
  const user = useSelector(state => state.user.user);

  // State
  const [modalVisiblePlan, setModalVisiblePlan] = useState(false);
  const [selectedTimeKey, setSelectedTimeKey] = useState(null);
  const [tempSelectedPlan, setTempSelectedPlan] = useState(null); // Full object or null
  const [selectedPlans, setSelectedPlans] = useState({}); // { "07:00": { id: 1, name: "Wake Up" }, ... }
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isLoading, setIsLoading] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Handle date selection
  const handleDateSelected = date => {
    setSelectedDate(moment(date));
  };

  // Available routine options (with id for API)
  const planOptions = [
    { id: 1, name: 'Wake Up' },
    { id: 2, name: 'Brush Teeth' },
    { id: 3, name: 'Make Bed' },
    { id: 4, name: 'Drink Water' },
    { id: 5, name: 'Meditation' },
    { id: 6, name: 'Exercise' },
    { id: 7, name: 'Eat breakfast' },
  ];

  // Generate 15-minute time slots from 7:00 AM onwards
  const generateTimeSlots = () => {
    const slots = [];
    const start = moment().startOf('day').hour(7);
    const end = moment(start).add(24, 'hours');

    let current = moment(start);
    while (current.isBefore(end)) {
      const key = current.format('HH:mm');
      slots.push({
        time: current.format('h:mm A'),
        key,
      });
      current = current.add(15, 'minutes');
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Open modal for a specific time
  const openPlanModal = timeKey => {
    setSelectedTimeKey(timeKey);
    setTempSelectedPlan(selectedPlans[timeKey] || null);
    setModalVisiblePlan(true);
  };

  // Save or clear routine for the selected time
  const savePlanForTime = () => {
    if (selectedTimeKey) {
      setSelectedPlans(prev => {
        const updated = { ...prev };
        if (tempSelectedPlan) {
          updated[selectedTimeKey] = tempSelectedPlan;
        } else {
          delete updated[selectedTimeKey];
        }
        return updated;
      });
    }
    setModalVisiblePlan(false);
    setTempSelectedPlan(null);
    setSelectedTimeKey(null);
  };

  // API Call - Send array of objects
  const CreateRoutineApi = async () => {
    const routinesArray = Object.keys(selectedPlans)
      .map(timeKey => ({
        time: timeKey,
        routine_id: selectedPlans[timeKey]?.id,
        routine_name: selectedPlans[timeKey]?.name,
      }))
      .filter(item => item.routine_id != null);

    if (routinesArray.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select at least one routine',
      });
      return;
    }

    const formdata = new FormData();

    // Append routines as indexed array
    routinesArray.forEach((routine, index) => {
      formdata.append(`routines[${index}][time]`, routine.time);
      formdata.append(`routines[${index}][routine_name]`, routine.routine_name);
    });

    // Append selected date (format as needed by your backend)
    formdata.append('date', selectedDate.format('YYYY-MM-DD'));

    setIsLoading(true);

    try {
      const res = await PostAPiwithToken(
        { url: 'add-routine', Token: user?.api_token },
        formdata,
      );

      setIsLoading(false);

      if (res.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: res.message || 'Routine saved successfully!',
        });
               setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                             navigation.goBack();
                    }, 4000);
   
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: res.message || 'Something went wrong',
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.log('API Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network error. Please try again.',
      });
    }
  };
  const isPastTime = (time) => {
    const now = new Date();
   
    // Create date for today with slot time
    const slotTime = new Date();
   
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
   
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
   
    slotTime.setHours(hours, minutes, 0, 0);
   
    return slotTime < now;
  };
  // Custom Calendar Components
  const CustomDayComponent = ({ date, selected }) => {
    const isSelected = selected;
    const dayName = moment(date).format('ddd');
    const dateNumber = moment(date).format('D');

    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isSelected ? Colors.mainColor : 'white',
          borderRadius: wp(3),
          height: 118,
          borderWidth: isSelected ? 0 : 0.5,
          borderColor: isSelected ? undefined : '#E9F1FF',
          elevation: isSelected ? 0 : 1,
        }}
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

  // Render each time slot row
  const renderTimeRow = ({ item }) => {
    const planObj = selectedPlans[item.key];
    const planName = planObj?.name;
const disabled= isPastTime(item.time);
    return (
      <View style={styles.addplanningView}>
        <Text style={[styles.timeStyle,{color:disabled?"grey":Colors.mainColor}]}>{item.time}</Text>

        <TouchableOpacity disabled={disabled} onPress={() => openPlanModal(item.key)}>
          {planName ? (
            <View
              style={{
                backgroundColor: Colors.lightgreen,
                paddingHorizontal: wp(3),
                paddingVertical: wp(1.5),
                borderRadius: wp(2),
                minWidth: wp(35),
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors.black,
                  fontSize: wp(3.5),
                  fontFamily: fonts.medium,
                }}
              >
                {planName}
              </Text>
            </View>
          ) : (
            <Text style={[styles.routineTextStyle,{color:disabled?'grey':Colors.mainColor}]}>+ Add Routine</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

    const translateXValue = useSharedValue(0);
  
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
                  })
              );
          }
      }, [showSuccessModal]);
  
          const animatedStyle2 = useAnimatedStyle(() => {
              return {
                  transform: [{ translateX: translateXValue.value }],
              };
          });

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
            Routine
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        {/* Calendar */}
        <CalendarStrip
          style={{ height: 180, paddingTop: 20, paddingBottom: 10 }}
          calendarHeaderStyle={{
            alignSelf: 'flex-start',
            marginHorizontal: wp(5),
            color: Colors.black,
            fontSize: wp(4.5),
            fontFamily: fonts.bold,
          }}
          // calendarHeaderFormat="MMMM, D YYYY"
          customDateHeader={CustomHeaderComponent} // Use custom header with image
          showArrows={false}
          dayComponentHeight={118}
          minDayComponentSize={wp(18)}
          selectedDate={selectedDate}
          onDateSelected={date => {
            setSelectedDate(date);
          }}
          customDayComponent={CustomDayComponent}
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
            // elevation: 1,
          }}
          scrollToOnSetSelectedDate={true}
          scrollable
          iconStyle={{
            display: 'none',
          }}
          startingDate={moment().subtract(
            CalendarStrip.numberOfDays / 2,
            'days',
          )}
        />

        {/* Time Slots */}
        <ScrollView
          contentContainerStyle={{
            paddingBottom: hp(25),
            paddingHorizontal: wp(5),
          }}
        >
          <FlatList
            data={timeSlots}
            renderItem={renderTimeRow}
            keyExtractor={item => item.key}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: wp(3) }} />}
          />
        </ScrollView>

        {/* Save Button */}
        <View
          style={{
            position: 'absolute',
            bottom: wp(15),
            alignSelf: 'center',
            width: '90%',
          }}
        >
          <MainButton title="Save Routine" onPress={CreateRoutineApi} />
        </View>

        {/* Modal for Selecting Routine */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisiblePlan}
          onRequestClose={() => setModalVisiblePlan(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: wp(5),
                maxHeight: hp(80),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
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
                  Add Routine
                </Text>
                <TouchableOpacity onPress={() => setModalVisiblePlan(false)}>
                  <AntDesign name="close" size={24} color={Colors.black} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {planOptions.map(plan => (
                  <TouchableOpacity
                    key={plan.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: wp(4),
                      paddingHorizontal: wp(3),
                      backgroundColor:
                        tempSelectedPlan?.id === plan.id
                          ? Colors.lightgreen
                          : '#f9f9f9',
                      borderRadius: wp(3),
                      marginBottom: wp(2),
                      
                    }}
                    onPress={() => setTempSelectedPlan(plan)}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fonts.medium,
                        color: Colors.black,
                      }}
                    >
                      {plan.name}
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
                      {tempSelectedPlan?.id === plan.id && (
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
              </ScrollView>

              <TouchableOpacity
                style={{
                  marginTop: wp(6),
                  paddingVertical: wp(4),
                  backgroundColor: Colors.mainColor,
                  borderRadius: wp(10),
                  alignItems: 'center',
                }}
                onPress={savePlanForTime}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 16,
                    fontFamily: fonts.bold,
                  }}
                >
                  {tempSelectedPlan ? 'Save' : 'Skip'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
                                            transparent={true}
                                            visible={showSuccessModal}
                                            animationType="fade"
                                            onRequestClose={() => {
                                                setShowSuccessModal(false);
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
                                                                 images.happy      
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default AddPlanning;
