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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import * as Progress from 'react-native-progress';
import { useSelector } from 'react-redux';
import { AllGetAPI } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Journal = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [myTasks, setMyTasks] = useState([]);
  const [onchangeTab, setOnChangeTab] = useState('1'); // '1': All, '2': Inprogress, '3': Completed

  const getAllTasks = () => {
    AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
      .then(res => {
        setMyTasks(res.data || []);
      })
      .catch(err => console.log('api error tasks', err));
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  // Custom Day Component for Calendar
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
          borderColor: '#E9F1FF',
          elevation: isSelected ? 0 : 1,
        }}
      >
        <Text
          style={{
            color: isSelected ? Colors.white : '#1E293B',
            fontSize: isSelected ? wp(5.5) : wp(4),
            fontFamily: fonts.semibold,
          }}
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

  // Custom Header with Date & Icon
  const CustomHeaderComponent = ({ date }) => {
    return (
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
  };
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainbackground}
      style={{ flex: 1,paddingTop:Platform.OS === 'ios' ?40: 20, }}
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
            marginTop: wp(7),
            marginHorizontal: wp(5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: wp(15),
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={images.menuIcon}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
            }}
          >
            Journal
          </Text>
          <TouchableOpacity onPress={()=>navigation.navigate('JnlOnboard1')} style={{
            // width:28
             }} >
            <Text style={{fontSize:14,color:Colors.white}}>Onboard</Text>
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Calendar Strip */}
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
            // onDateSelected={handleDateSelected}
            customDayComponent={CustomDayComponent}
            selectedDate={selectedDate}
            onDateSelected={date => setSelectedDate(date)}
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

          {/* Tabs */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: wp(5),
              marginHorizontal: wp(5),
            }}
          >
            <TouchableOpacity onPress={() => setOnChangeTab('1')}>
              <View
                style={{
                  paddingHorizontal: wp(4),
                  paddingVertical: wp(2),
                  borderRadius: 10,
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
                  All Task
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOnChangeTab('2')}>
              <View
                style={{
                  paddingHorizontal: wp(4),
                  paddingVertical: wp(2),
                  borderRadius: 10,
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
                  Inprogress Task
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOnChangeTab('3')}>
              <View
                style={{
                  paddingHorizontal: wp(4),
                  paddingVertical: wp(2),
                  borderRadius: 10,
                  backgroundColor:
                    onchangeTab === '3' ? Colors.mainColor : '#ECF7F3',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.bold,
                    color: onchangeTab === '3' ? Colors.white : Colors.black,
                  }}
                >
                  Completed Task
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Task List - Unified for All Tabs */}
          <View style={{ marginTop: wp(3), marginHorizontal: wp(3), flex: 1 }}>
            {(() => {
              const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');

              // Filter tasks by selected date
              let filteredTasks = myTasks.filter(task => {
                const taskDate = moment(
                  task.created_at || task.due_date,
                ).format('YYYY-MM-DD');
                return taskDate === selectedDateStr;
              });

              // Apply status filter based on tab
              if (onchangeTab === '2') {
                filteredTasks = filteredTasks.filter(task =>
                  [
                    'Inprogress',
                    'In Progress',
                    'inprogress',
                    'in progress',
                  ].includes(task.status),
                );
              } else if (onchangeTab === '3') {
                filteredTasks = filteredTasks.filter(task =>
                  ['Completed', 'Complete', 'completed', 'complete'].includes(
                    task.status,
                  ),
                );
              }

              // Dynamic empty message
              const getEmptyMessage = () => {
                const dateText = moment(selectedDate).format('MMMM D, YYYY');
                if (onchangeTab === '1') return `No tasks for ${dateText}`;
                if (onchangeTab === '2')
                  return `No Inprogress tasks for ${dateText}`;
                if (onchangeTab === '3')
                  return `No Completed tasks for ${dateText}`;
              };

              return (
                <FlatList
                  data={filteredTasks}
                  keyExtractor={item => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  contentContainerStyle={{ paddingBottom: hp(15) }}
                  ListEmptyComponent={
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp(20),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#666',
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                        }}
                      >
                        {getEmptyMessage()}
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('TaskDetails', { data: item })
                      }
                      style={{
                        width: wp(44),
                        borderRadius: wp(2),
                        backgroundColor: Colors.white,
                        marginBottom: wp(4),
                        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
                        paddingHorizontal: wp(2),
                        marginLeft: wp(1),
                        paddingVertical: wp(3),
                        marginRight: wp(3),
                        marginTop: wp(1),
                        shadowOffset: { height: 2, width: 2 },
                        shadowOpacity: 0.2,
                        shadowColor: '#4686D4',
                      }}
                    >
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

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: wp(2),
                        }}
                      >
                        <Image
                          source={images.calendarIcon}
                          resizeMode="contain"
                          style={{
                            width: wp(4.5),
                            height: wp(4.5),
                            marginRight: wp(1),
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: fonts.medium,
                            color: Colors.black,
                          }}
                        >
                          {moment(item?.created_at).format('MMM D, YYYY')}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: wp(2),
                        }}
                      >
                        <View
                          style={{
                            paddingVertical: wp(1),
                            borderRadius: wp(3),
                            paddingHorizontal: wp(2),
                            backgroundColor: '#ECF7F3',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: wp(2),
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
                              fontSize: 8,
                              fontFamily: fonts.bold,
                              color: '#475467',
                            }}
                          >
                            {item?.status || 'In Progress'}
                          </Text>
                        </View>

                        <View
                          style={{
                            paddingVertical: wp(1),
                            borderRadius: wp(3),
                            paddingHorizontal: wp(2),
                            backgroundColor:
                              item?.priority === 'High' ||
                              item?.priority === 'High Priority'
                                ? '#F95555'
                                : item?.priority === 'Medium' ||
                                  item?.priority === 'Medium Priority'
                                ? '#FE7A36'
                                : Colors.mainColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            source={images.flag}
                            resizeMode="contain"
                            style={{ width: wp(4), height: wp(4) }}
                          />
                          <Text
                            style={{
                              fontSize: 8,
                              fontFamily: fonts.bold,
                              color: Colors.white,
                              marginLeft: wp(1),
                            }}
                          >
                            {item?.priority === 'High' ||
                            item?.priority === 'High Priority'
                              ? 'High'
                              : item?.priority === 'Medium' ||
                                item?.priority === 'Medium Priority'
                              ? 'Medium'
                              : 'Low'}
                          </Text>
                        </View>
                      </View>

                      <View style={{ marginTop: wp(3) }}>
                        <Progress.Bar
                          color={
                            item?.status == 'Pending'
                              ? 'red'
                              : item?.status == 'Inprogress'
                              ? '#ffcc11'
                              : Colors.mainColor
                          }
                          unfilledColor={'#E7E7E7'}
                          borderWidth={0}
                          height={8}
                          animated={true}
                          progress={
                            item?.status == 'Pending'
                              ? 0.0
                              : item?.status == 'Inprogress'
                              ? 0.5
                              : 1.0
                          }
                          width={wp(38)}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              );
            })()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Journal;
