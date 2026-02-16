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
import React, { use, useCallback, useEffect, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setJnlOnboardFalse } from '../../Redux/OnboardingSlice';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';

const MyJournal = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [myallJournals, setMyallJournals] = useState([]);
  const [todayResponse, setTodayResponse] = useState(0);

  const getAllJournals = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'get-journal-info', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        console.log('api my journals', JSON.stringify(res));

        if (res.status == 'success') {
          setMyallJournals(res.data || []);
          setTodayResponse(res?.todayData);
          console.log(res?.todayData);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error tasks', err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getAllJournals();
    }, []),
  );

  const handleDeleteJournal = id => {
    setIsLoading(true);

    AllGetAPI({ url: `delete-journal/${id}`, Token: user?.api_token })
      .then(res => {
        if (res.status === 'success') {
          setIsLoading(true);

          console.log(res);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
          });
          getAllJournals();
        } else {
          setIsLoading(false);

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
        console.log('Task delete error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete task',
        });
      });
  };

  const renderRightActions = id => {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: '#BD2BAF',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 12,
            padding: 8,
            // marginVertical: 16,
            borderRadius: wp(2),
          },
        ]}
        onPress={() => handleDeleteJournal(id)}
      >
        <Fontisto name="delete" color="white" size={35} />
      </TouchableOpacity>
    );
  };

  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 10 : 0 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        {isloading && <Loader />}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // elevation: 4,
            width: wp(100),
            height: wp(25),
            // backgroundColor: '#FAFAFA',
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
            barStyle="light-content"
          />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={images.menuIcon}
              style={{ width: 26, height: 26 }}
              tintColor="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              marginLeft: wp(10),
            }}
          >
            Journal
          </Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(setJnlOnboardFalse()),
                navigation.navigate('JnlOnboard2');
              //   navigation.navigate('FormJournal');
            }}
            style={
              {
                // width:28
              }
            }
          >
            <Text style={{ fontSize: 12, color: Colors.white }}>
              How to use?
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {todayResponse == 1 ? (
            <View
              style={{
                width: wp(90),
                paddingHorizontal: wp(3),
                paddingVertical: wp(4),
                // elevation: 2,
                // backgroundColor: '#BD2BAF',
                // backgroundColor: Colors.white,
                backgroundColor: '#BD2BAF33',
                // borderWidth: 1,
                borderColor: '#BBBBBB',
                borderRadius: wp(3),
                alignSelf: 'center',
                marginTop: wp(5),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (todayResponse === 1) {
                    Toast.show({
                      type: 'success',
                      text1: 'Success',
                      text2: 'Journal already saved. Come back tomorrow.',
                      topOffset: Platform.OS === 'ios' ? 20 : 0,
                      visibilityTime: 3000,
                      autoHide: true,
                    });
                  } else {
                    navigation.navigate('FormJournal');
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                // disabled={todayResponse === 1}
              >
                {/* <SimpleLineIcons name={'check'} size={27} color={Colors.black} /> */}
                <Ionicons
                  name={'checkmark-circle-outline'}
                  size={22}
                  color={Colors.white}
                />
                <View style={{ marginLeft: wp(2), width: wp(70) }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    Saved your today’s journal info
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      Great job! come back tomorrow.
                    </Text>
                  </View>
                </View>
                {todayResponse !== 1 && (
                  <AntDesign name={'right'} size={22} color={Colors.white} />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                width: wp(90),
                paddingHorizontal: wp(3),
                paddingVertical: wp(4),
                // elevation: 2,
                backgroundColor: '#BD2BAF80',
                // borderWidth: 1,
                borderColor: '#BBBBBB',
                borderRadius: wp(3),
                alignSelf: 'center',
                marginTop: wp(5),
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('FormJournal')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* <SimpleLineIcons name={'check'} size={27} color={Colors.black} /> */}
                <Ionicons
                  name={'create-outline'}
                  size={22}
                  color={Colors.white}
                />
                <View style={{ marginLeft: wp(2), width: wp(70) }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    Save Your Today's Journal info
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      Start today’s journal.
                    </Text>
                  </View>
                </View>
                <AntDesign name={'right'} size={22} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              marginTop: wp(5),
              marginHorizontal: wp(5),
              marginBottom: wp(4),
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                fontFamily: fonts.bold,
              }}
            >
              Journals
            </Text>

            <FlatList
              data={myallJournals}
              keyExtractor={item => item?.id?.toString()}
              inverted
              renderItem={({ item }) => {
                const formatDate = dateString => {
                  const date = new Date(dateString);
                  const today = new Date();

                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

                  const options = { month: 'long' };
                  const formattedDate = date.toLocaleDateString(
                    'en-US',
                    // options,
                  );

                  return isToday ? `Today,` : formattedDate;
                };

                return (
                  <View
                    style={{
                      width: wp(90),
                      alignSelf: 'center',
                      marginTop: wp(2),
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      {formatDate(item.created_at)}
                    </Text>

                    <ReanimatedSwipeable
                      renderRightActions={() => renderRightActions(item.id)}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('JournalDetails', {
                            Myitem: item,
                          })
                        }
                        style={{
                          width: wp(90),
                          // elevation: 2,
                          paddingHorizontal: wp(3),
                          paddingVertical: wp(2),
                          backgroundColor: '#BD2BAF33',
                          // borderWidth: 1,
                          borderColor: '#BBBBBB',
                          borderRadius: wp(3),
                          alignSelf: 'center',
                          marginTop: wp(2),
                        }}
                      >
                        {item?.gratitude?.some(itm => itm) && (
                          <>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: fonts.bold,
                                color: Colors.white,
                              }}
                            >
                              Gratitude:
                            </Text>
                            <View
                              style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                            >
                              {item?.gratitude
                                ?.filter(g => g)
                                .map((gratitudeItem, index) => (
                                  <View
                                    key={index}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginRight: wp(3),
                                      marginBottom: wp(2),
                                      marginTop: wp(1),
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: wp(1),
                                        height: wp(1),
                                        borderRadius: wp(2),
                                        backgroundColor: 'white',
                                        marginRight: wp(1),
                                      }}
                                    />
                                    <Text
                                      style={{
                                        fontSize: 14,
                                        fontFamily: fonts.medium,
                                        color: 'white',
                                      }}
                                    >
                                      {gratitudeItem}
                                    </Text>
                                  </View>
                                ))}
                            </View>
                          </>
                        )}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.bold,
                              color: Colors.white,
                            }}
                          >
                            Affirmation:
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.medium,
                              color: 'white',
                            }}
                          >
                            {item?.affirmation}
                          </Text>
                        </View>

                        <View
                          style={{
                            position: 'absolute',
                            right: wp(4),
                            top: '50%',
                            transform: [{ translateY: -9 }],
                          }}
                        >
                          <AntDesign
                            name={'right'}
                            size={18}
                            color={Colors.white}
                          />
                        </View>
                      </TouchableOpacity>
                    </ReanimatedSwipeable>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default MyJournal;
