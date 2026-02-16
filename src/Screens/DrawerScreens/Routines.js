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
import React, { useCallback, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../Components/MainButton';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Routines = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dots,setDots] = useState([]);
  const formattedSelectedDate = moment(selectedDate).format('MMMM D');
  console.log(
    'selectedededede dateeee:',
    moment(selectedDate).format('YYYY-MM-DD'),
  );
  const [allRoutines, setAllRoutines] = useState([]);

  console.log('my all routines', JSON.stringify(allRoutines));
  const [isloading, setIsLoading] = useState(false);
  const handleDateSelected = date => {
    const daysToScroll = Math.floor(CalendarStrip.numberOfDays / 2);
    const centeredDate = moment(date).subtract(daysToScroll, 'days');
    setSelectedDate(centeredDate);
  };
  const markedDates = dots.map(item => ({
    date: moment(item), // IMPORTANT
    dots: [
      {
        color: '#4CAF50',
        selectedColor: '#4CAF50',
      },
    ],
  }));
  const getAllRoutine = date => {
    console.log(
      'funnnccttiioonn daffteeee:',
      moment(date).format('YYYY-MM-DD'),
    );
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append('date', moment(date).format('YYYY-MM-DD'));
    PostAPiwithToken(
      { url: 'view-all-routine', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        console.log('Routine response:', JSON.stringify(res));
        setIsLoading(false);

        if (res.status === 'success') {
          // console.log('check data', JSON.stringify(res));
          setAllRoutines(res.data || []);
          setDots(res.alldates)
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('plans API error:', err);
      });
  };

  // const CustomDayComponent = ({ date, selected, style }) => {
  //   const isSelected = selected;
  //   const dayName = moment(date).format('ddd');
  //   const dateNumber = moment(date).format('D');

  //   return (
  //     <View
  //       style={[
  //         style,
  //         {
  //           flexDirection: 'column',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           backgroundColor: isSelected ? Colors.mainColor : 'white',
  //           borderRadius: wp(3),
  //           height: 118,
  //           borderWidth: isSelected ? 0 : 0.5,
  //           borderColor: isSelected ? undefined : '#E9F1FF',
  //           elevation: isSelected ? 0 : 1,
  //         },
  //       ]}
  //     >
  //       <Text
  //         style={
  //           isSelected
  //             ? {
  //                 color: Colors.white,
  //                 fontSize: wp(5.5),
  //                 fontFamily: fonts.semibold,
  //               }
  //             : {
  //                 color: '#1E293B',
  //                 fontSize: wp(4),
  //                 fontFamily: fonts.semibold,
  //               }
  //         }
  //       >
  //         {dateNumber}
  //       </Text>
  //       <Text
  //         style={
  //           isSelected
  //             ? {
  //                 color: 'white',
  //                 fontSize: wp(3.5),
  //                 fontFamily: fonts.regular,
  //                 marginTop: wp(2),
  //               }
  //             : {
  //                 color: 'white',
  //                 fontSize: wp(3.5),
  //                 fontFamily: fonts.regular,
  //                 marginTop: wp(2),
  //               }
  //         }
  //       >
  //         {dayName}
  //       </Text>
  //     </View>
  //   );
  // };
  const CustomDayComponent = ({ date, selected, style }) => {
    const isSelected = selected;

    // `date` is already a moment object
    const dayName = date.format('ddd');
    const dateNumber = date.format('D');

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
            color: isSelected ? Colors.white : '#1E293B', // fix unselected text color
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
  useFocusEffect(
    useCallback(() => {
      getAllRoutine();
      handleDateSelected();
    }, []),
  );
  const { top } = useSafeAreaInsets()
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30 : 0, }}
      resizeMode="cover"
    >
      {isloading && <Loader />}
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
          }}
        >
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginRight: wp(7) }}>
            Routines
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          </View>
        </View>
        <CalendarStrip
          style={{ height: 180, paddingTop: 20, paddingBottom: 10 }}
          calendarHeaderStyle={{
            alignSelf: 'flex-start',
            marginHorizontal: wp(5),
            color: Colors.black,
            fontSize: wp(4.5),
            fontFamily: fonts.bold,
          }}
          markedDates={markedDates}
          // calendarHeaderFormat="MMMM, D YYYY"
          customDateHeader={CustomHeaderComponent} // Use custom header with image
          showArrows={false}
          dayComponentHeight={118}
          minDayComponentSize={wp(18)}
          selectedDate={selectedDate}
          onDateSelected={date => {
            setSelectedDate(date), getAllRoutine(date);
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ marginTop: wp(3), flex: 1, marginBottom: wp(30) }}>
            <FlatList
              data={allRoutines}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                      marginRight: wp(2),
                    }}
                  >
                    {item.time}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.flatView,
                      {
                        width: wp(78),
                        backgroundColor:
                          item?.routine_name == 'Wake Up'
                            ? '#FCCABD'
                            : item?.routine_name == 'Brush Teeth'
                              ? '#C5DBFC'
                              : item?.routine_name == 'Make Bed'
                                ? '#DDBDE5'
                                : item?.routine_name == 'Meditation'
                                  ? '#C5DBFC'
                                  : item?.routine_name == 'Exercise'
                                    ? '#FDEBBD' :
                                    item?.routine_name == "Eat breakfast" ? "#0A8043"
                                      : '#FDEBBD',
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.bold,
                          color: item?.routine_name == "Eat breakfast" ?"white": Colors.black,
                        }}
                      >
                        {item.routine_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </ScrollView>
        <View
          style={{ position: 'absolute', bottom: wp(15), alignSelf: 'center' }}
        >
          <MainButton
            title="Add Routine"
            onPress={() => navigation.navigate('AddPlanning')}
          />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Routines;
