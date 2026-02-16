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
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import { AllGetAPI } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setJnlOnboardFalse } from '../../Redux/OnboardingSlice';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';

const JournalDetails = ({ navigation, route }) => {
  const user = useSelector(state => state.user.user);
  const { Myitem } = route.params;
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  // const [myallJournals, setMyallJournals] = useState([])
  // const getAllJournals = () => {
  //     setIsLoading(true);
  //     AllGetAPI({ url: 'get-journal-info', Token: user?.api_token })
  //         .then(res => {
  //             setIsLoading(false);
  //             console.log('api my journals', JSON.stringify(res));

  //             if (res.status == 'success') {
  //                 setMyallJournals(res.data || []);
  //             }

  //         })
  //         .catch(err => {
  //             setIsLoading(false);
  //             console.log('api error tasks', err);
  //         });
  // };
  // useFocusEffect(
  //     useCallback(() => {
  //         getAllJournals();
  //     }, []),
  // );
  const formatDate = dateString => {
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const options = { month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return isToday ? `Today` : formattedDate;
  };

  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : 0}
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
            barStyle="dark-content"
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: 25,
              height: 25,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              // marginRight: wp(7),
            }}
          >
            Journal Details
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              marginTop: wp(5),
              marginHorizontal: wp(5),
              marginBottom: wp(4),
            }}
          >
            <View style={{ width: wp(90), alignSelf: 'center' }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: fonts.light,
                }}
              >
                {formatDate(Myitem.created_at)}
              </Text>
              {Myitem?.gratitude?.some(item => item) && (
                <View
                  style={{
                    width: wp(90),
                    paddingHorizontal: wp(5),
                    paddingVertical: wp(4),
                    backgroundColor: '#BD2BAF33',
                    // borderWidth: 1,
                    borderColor: '#BBBBBB',
                    borderRadius: wp(2),
                    alignSelf: 'center',
                    marginTop: wp(2),
                    // elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    Gratitude:
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: 'white',
                      marginTop: wp(1),
                    }}
                  >
                    What am I grateful for today?
                  </Text>

                  <View style={{ marginTop: wp(2) }}>
                    {Myitem.gratitude
                      .filter(item => item)
                      .map((gratitudeItem, index) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            alignItems: 'center',
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: 'white',
                              height: wp(1),
                              width: wp(1),
                              borderRadius: 20,
                            }}
                          />
                          <Text
                            key={index}
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.medium,
                              color: Colors.white,

                              lineHeight: 18,
                              marginLeft: 5,
                            }}
                          >
                            {gratitudeItem}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              )}

              <View
                style={{
                  width: wp(90),
                  paddingHorizontal: wp(5),
                  paddingVertical: wp(4),
                  backgroundColor: '#BD2BAF33',
                  // borderWidth: 1,
                  borderColor: '#BBBBBB',
                  borderRadius: wp(3),
                  alignSelf: 'center',
                  marginTop: wp(3),
                  // elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Daily Affirmation
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: 'white',
                    marginTop: wp(1),
                  }}
                >
                  How do I choose to show up today?
                </Text>
                <View style={{ marginTop: wp(2) }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        height: wp(1),
                        width: wp(1),
                        borderRadius: 20,
                      }}
                    />
                    <Text
                      // key={index}
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                        lineHeight: 18,
                        marginLeft: 5,
                      }}
                    >
                      {Myitem.affirmation}
                    </Text>
                  </View>
                </View>
              </View>

              {Myitem?.bigger_goal == null ? null : (
                <View
                  style={{
                    width: wp(90),
                    paddingHorizontal: wp(5),
                    paddingVertical: wp(4),
                    backgroundColor: '#BD2BAF33',
                    // borderWidth: 1,
                    borderColor: '#BBBBBB',
                    borderRadius: wp(3),
                    alignSelf: 'center',
                    marginTop: wp(3),
                    // elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                     Top Intention or Goal:
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: 'white',
                      marginTop: wp(1),
                    }}
                  >
                    What is the most important thing I want to achieve today?
                  </Text>

                  <View
                    style={{
                      marginRight: wp(3),
                      marginTop: 10,
                      flexDirection: 'row',
                      //   marginTop: 10,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        height: wp(1),
                        width: wp(1),
                        borderRadius: 20,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                        lineHeight: 18,
                        marginLeft: 5,
                      }}
                    >
                      {Myitem?.bigger_goal}
                    </Text>
                  </View>
                </View>
              )}
              {Myitem?.['promise-today'] == null ? null : (
                <View
                  style={{
                    width: wp(90),
                    paddingHorizontal: wp(5),
                    paddingVertical: wp(4),
                    backgroundColor: '#BD2BAF33',
                    borderColor: '#BBBBBB',
                    borderRadius: wp(3),
                    alignSelf: 'center',
                    marginTop: wp(3),
                    // elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    Letting Go
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: 'white',
                      marginTop: wp(1),
                    }}
                  >
                    Something i want to achieve
                  </Text>

                  <View
                    style={{
                      marginRight: wp(3),
                      marginTop: 10,
                      flexDirection: 'row',
                      //   marginTop: 10,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        height: wp(1),
                        width: wp(1),
                        borderRadius: 20,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                        lineHeight: 18,
                        marginLeft: 5,
                      }}
                    >
                      {' '}
                      {Myitem?.['promise-today']}
                    </Text>
                  </View>
                </View>
              )}
              {Myitem?.small_step == null ? null : (
                <View
                  style={{
                    width: wp(90),
                    paddingHorizontal: wp(5),
                    paddingVertical: wp(4),
                    backgroundColor: '#BD2BAF33',
                    // borderWidth: 1,
                    borderColor: '#BBBBBB',
                    borderRadius: wp(3),
                    alignSelf: 'center',
                    marginTop: wp(3),
                    // elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.white,
                    }}
                  >
                    One small step today
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: 'white',
                      marginTop: wp(1),
                    }}
                  >
                    Something i want to achieve
                  </Text>

                  <View
                    style={{
                      marginRight: wp(3),
                      marginTop: 10,
                      flexDirection: 'row',
                      //   marginTop: 10,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        height: wp(1),
                        width: wp(1),
                        borderRadius: 20,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                        lineHeight: 18,
                        marginLeft: 5,
                      }}
                    >
                      {Myitem?.small_step}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default JournalDetails;
