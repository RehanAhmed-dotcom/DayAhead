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
  Linking,
  SectionList,
} from 'react-native';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSelector } from 'react-redux';
import moment from 'moment';
import staticTexts from '../../locales/staticTexts';

// Translation tools
import { useTranslate } from '../../Components/hooks/useTranslate';
import { useLanguage } from '../../Components/context/LanguageContext';
import Toast from 'react-native-toast-message';

const Notification = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const { language, ready } = useLanguage();
  const swipeRef = useRef(null);

  const [notificationTab, setNotificationTab] = useState('app');
  const [mynotifications, setMyNotifications] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [customNotification, setCustomNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const [translatedNotifications, setTranslatedNotifications] = useState([]);
  // console.log('my transllationn',JSON.stringify(translatedNotifications))
  const [isTranslating, setIsTranslating] = useState(false);

  // Static translated texts
  const screenTitle = useTranslate(staticTexts.notifications);
  const viewDetailsText = useTranslate(staticTexts.viewDetails);
  const noNotificationsText = useTranslate(staticTexts.noNotifications);
  const defaultModalTitle = useTranslate(staticTexts.notification);

  const renderRightActions = id => {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: '#BD2BAF',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginRight: 8,
            // marginVertical: wp(2),
            padding: 8,
            marginVertical: 15,
            borderRadius: wp(2),
          },
        ]}
        onPress={() => deleteNotification(id)}
      >
        <Fontisto name="delete" color="white" size={35} />
      </TouchableOpacity>
    );
  };

  function groupNotificationsByDay(notifications) {
    const now = new Date();

    const grouped = {};

    notifications.forEach(notif => {
      const notifDate = new Date(notif.time);
      const notifDay = notifDate.toDateString();

      const diffTime = now - notifDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      let key = '';

      if (diffDays === 0 && notifDate.toDateString() === now.toDateString()) {
        key = 'today';
      } else if (
        diffDays === 1 ||
        notifDate.toDateString() === yesterday.toDateString()
      ) {
        key = 'yesterday';
      } else {
        // Use weekday name
        const options = { weekday: 'long' };
        key = notifDate.toLocaleDateString('en-US', options).toLowerCase(); // e.g., monday, tuesday
      }

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(notif);
    });

    // Optional: sort each group by newest first
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.time) - new Date(a.time));
    });

    // Convert to SectionList format and sort sections
    const order = ['Today', 'Yesterday']; // predefined order for top sections
    const sections = [];

    // Add Today and Yesterday first if they exist
    order.forEach(day => {
      if (grouped[day]) {
        sections.push({ title: day, data: grouped[day] });
        delete grouped[day];
      }
    });

    // Add remaining weekdays sorted by newest notification first
    Object.keys(grouped)
      .sort((a, b) => {
        // sort by newest notification timestamp in descending order
        const latestA = new Date(grouped[a][0].time);
        const latestB = new Date(grouped[b][0].time);
        return latestB - latestA;
      })
      .forEach(key => {
        sections.push({ title: key, data: grouped[key] });
      });

    return sections;
  }

  // Fetch notifications
  const getAllNotification = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'viewAllNotification', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          const notifications = res.data || [];
          setMyNotifications(notifications);
          console.log('My Notifications: ', notifications);
          const groupedNotifications = groupNotificationsByDay(notifications);
          // console.log(groupedNotifications);

          console.log('Group Notifications: ', groupedNotifications);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Notification API error:', err);
      });
  };

  const deleteNotification = id => {
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append('id', id);
    PostAPiwithToken(
      { url: 'deleteNotification', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        console.log('apiresponse', JSON.stringify(res));
        if (res.status === 'success') {
          console.log(res);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
          });
          getAllNotification();
        } else {
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
        console.log('Task save error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save task',
        });
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllNotification();
    }, []),
  );

  // Translate all dynamic title & message when language or data changes
  useEffect(() => {
    if (!ready) return;

    if (language === 'en' || mynotifications.length === 0) {
      setTranslatedNotifications(mynotifications);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);

    const translateAll = async () => {
      try {
        const translated = await Promise.all(
          mynotifications.map(async item => {
            let translatedTitle = item.title;
            let translatedMessage = item.message;

            try {
              translatedTitle = await useTranslate(item.title);
            } catch (err) {
              console.log('Title translation failed:', err);
              translatedTitle = item.title;
            }

            try {
              translatedMessage = await useTranslate(item.message);
            } catch (err) {
              console.log('Message translation failed:', err);
              translatedMessage = item.message;
            }

            return {
              ...item,
              translatedTitle,
              translatedMessage,
            };
          }),
        );
        setTranslatedNotifications(translated);
      } catch (error) {
        console.log('Bulk translation error:', error);
        setTranslatedNotifications(mynotifications);
      } finally {
        setIsTranslating(false);
      }
    };

    translateAll();
  }, [mynotifications, language, ready]);

  const formatTimeAgo = date => moment(date).fromNow();

  const handleLinkPress = async () => {
    if (notificationData?.url) {
      const supported = await Linking.canOpenURL(notificationData.url);
      if (supported) {
        await Linking.openURL(notificationData.url);
      }
    }
  };

  // Show loader until language context is ready
  if (!ready) {
    return (
      <ImageBackground source={images.mainbackground} style={{ flex: 1 }}>
        <Loader />
      </ImageBackground>
    );
  }

  // Decide which list to display
  const displayNotifications = groupNotificationsByDay(mynotifications); // fallback during translation
  // const displayNotifications =
  //   language === 'en'
  //     ? mynotifications
  //     : translatedNotifications.length > 0
  //     ? translatedNotifications
  //     : mynotifications; // fallback during translation

  const filteredNotifications = displayNotifications
    .map(section => {
      const filteredData = section.data.filter(item => {
        if (notificationTab === 'custom') {
          return item.type === 'custom_notification';
        }
        return item.type !== 'custom_notification';
      });

      return {
        ...section,
        data: filteredData,
      };
    })
    .filter(section => section.data.length > 0); // remove empty sections

  function humanReadableTime(timestamp) {
    const dt = new Date(timestamp);
    const now = new Date();

    const diffMs = now - dt; // difference in milliseconds
    const diffSeconds = diffMs / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffSeconds / 3600;
    const diffDays = Math.floor(diffHours / 24);

    const isSameDay = dt.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = dt.toDateString() === yesterday.toDateString();

    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffMinutes < 60) {
      const mins = Math.floor(diffMinutes);
      return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 12) {
      const hrs = Math.floor(diffHours);
      return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    } else if (isSameDay) {
      return 'today';
    } else if (isYesterday) {
      return 'yesterday';
    } else {
      return dt.toISOString().split('T')[0]; // returns YYYY-MM-DD
    }
  }

  return (
    <ImageBackground
      // source={images.mainbackground}
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30 : 0 }}
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
            width: wp(100),
            height: wp(25),
            paddingHorizontal: wp(4),
            paddingTop: wp(5),
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={images.menuIcon2}
              style={{ width: 26, height: 26 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              marginRight: wp(7),
            }}
          >
            {screenTitle}
          </Text>
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, top: '70%', right: 20 }}
          >
            <Text style={{ color: Colors.white, fontSize: 10 }}>
              Mark as read
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              width: '45%',
            }}
            onPress={() => setNotificationTab('app')}
          >
            <Text
              style={{
                color: Colors.white,
                textAlign: 'center',
                backgroundColor:
                  notificationTab === 'app'
                    ? Colors.mainColor
                    : Colors.mainColor + 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
              }}
            >
              App Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '45%',
            }}
            onPress={() => setNotificationTab('custom')}
          >
            <Text
              style={{
                color: Colors.white,
                textAlign: 'center',
                backgroundColor:
                  notificationTab === 'custom'
                    ? Colors.mainColor
                    : Colors.mainColor + 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
              }}
            >
              Custom Notification
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: wp(5),
            marginTop: wp(2),
          }}
        >
          <View style={{ marginBottom: wp(25) }}>
            {/* <FlatList
              data={displayNotifications}
              keyExtractor={item => item?.id?.toString()}
              inverted
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: wp(30),
                    color: Colors.darkgray,
                    fontSize: 16,
                    fontFamily: fonts.regular,
                  }}
                >
                  {noNotificationsText}
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log('Pressed Notification: ', item);
                    // if (item?.type === 'custom_notification') {
                    //   setNotificationData(item);
                    //   setCustomNotification(true);
                    // } else if (item?.type === 'message') {
                    //   navigation.navigate('Conversation', { item });
                    // } else if (item?.type === 'snap_alaram') {
                    //   navigation.navigate('IndexDrawer', {
                    //     screen: 'SnapAlarm',
                    //   });
                    // } else if (item?.type === 'like_post') {
                    //   navigation.navigate('CommunityScreen', { item });
                    // } else if (item?.type === 'comment_post') {
                    //   navigation.navigate('CommunityDetails', {
                    //     postdata: item,
                    //   });
                    // }
                  }}
                  style={{
                    backgroundColor: Colors.mainColor + 20,
                    marginHorizontal: wp(5),
                    borderRadius: wp(4),
                    padding: wp(4),
                    marginBottom: wp(3),
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                  }}
                >
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text>
                        <Ionicons
                          name="notifications"
                          size={24}
                          color={Colors.white}
                        />
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: fonts.medium,
                          color: Colors.white,
                          marginBottom: wp(1),
                        }}
                      >
                        {language === 'en'
                          ? item.title
                          : item.translatedTitle || item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: fonts.medium,
                          color: Colors.white,
                          marginBottom: wp(1),
                        }}
                      >
                        {humanReadableTime(item.time)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text>
                      <Ionicons
                        name="notifications"
                        size={24}
                        color={Colors.white}
                      />
                    </Text>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: fonts.medium,
                          color: Colors.white,
                          marginBottom: wp(1),
                        }}
                      >
                        {language === 'en'
                          ? item.title
                          : item.translatedTitle || item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: fonts.regular,
                          color: Colors.white,
                          lineHeight: 18,
                        }}
                      >
                        {language === 'en'
                          ? item.message
                          : item.translatedMessage || item.message}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            /> */}

            <SectionList
              sections={filteredNotifications}
              keyExtractor={item => item.id.toString()}
              renderSectionHeader={({ section: { title } }) => (
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                    marginVertical: wp(2),
                    marginLeft: wp(5),
                  }}
                >
                  {title.toUpperCase()}
                </Text>
              )}
              renderItem={({ item }) => (
                <ReanimatedSwipeable
                  ref={swipeRef}
                  renderRightActions={() => renderRightActions(item.id)}
                  // onSwipeableOpen={() => console.log(item.id)}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      console.log('Pressed Notification: ', item);
                      if (item?.type === 'custom_notification') {
                        setNotificationData(item);
                        setCustomNotification(true);
                      } else if (item?.type === 'message') {
                        navigation.navigate('Conversation', { item });
                      } else if (item?.type === 'snap_alaram') {
                        navigation.navigate('IndexDrawer', {
                          screen: 'SnapAlarm',
                        });
                      } else if (item?.type === 'like_post') {
                        navigation.navigate('CommunityScreen', { item });
                      } else if (item?.type === 'comment_post') {
                        navigation.navigate('CommunityDetails', {
                          postdata: item,
                        });
                      }
                    }}
                    style={{
                      backgroundColor: Colors.mainColor + '20',
                      marginHorizontal: wp(5),
                      borderRadius: wp(4),
                      padding: wp(4),
                      marginBottom: wp(3),
                      // elevation: 3,
                      // shadowColor: '#000',
                      // shadowOffset: { width: 0, height: 2 },
                      // shadowOpacity: 0.1,
                      // shadowRadius: 5,
                    }}
                  >
                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                      {item?.type === 'custom_notification' ? (
                        <Ionicons
                          name="notifications"
                          size={20}
                          color={Colors.white}
                        />
                      ) : item?.type === 'message' ? (
                        <AntDesign
                          name="message1"
                          size={20}
                          color={Colors.white}
                        />
                      ) : item?.type === 'snap_alaram' ? (
                        <Ionicons name="alarm" size={20} color={Colors.white} />
                      ) : item?.type === 'like_post' ? (
                        <AntDesign
                          name="heart"
                          size={20}
                          color={Colors.white}
                        />
                      ) : item?.type === 'comment_post' ? (
                        <AntDesign
                          name="message1"
                          size={20}
                          color={Colors.white}
                        />
                      ) : (
                        <Ionicons
                          name="notifications"
                          size={20}
                          color={Colors.white}
                        />
                      )}

                      <View style={{ marginLeft: wp(2), flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: fonts.medium,
                            color: Colors.white,
                          }}
                        >
                          {language === 'en'
                            ? item.title
                            : item.translatedTitle || item.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: fonts.regular,
                            color: Colors.white,
                            lineHeight: 18,
                          }}
                        >
                          {language === 'en'
                            ? item.message
                            : item.translatedMessage || item.message}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.regular,
                          color: Colors.white,
                        }}
                      >
                        {humanReadableTime(item.time)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ReanimatedSwipeable>
              )}
            />
          </View>
        </ScrollView>

        {/* Custom Notification Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={customNotification}
          onRequestClose={() => setCustomNotification(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                width: wp(90),
                maxHeight: hp(80),
                borderRadius: wp(5),
                padding: wp(5),
                elevation: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setCustomNotification(false)}
                style={{ alignSelf: 'flex-end', marginBottom: wp(3) }}
              >
                <AntDesign name="close" size={24} color={Colors.darkgray} />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 18,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  marginBottom: wp(2),
                  textAlign: 'center',
                }}
              >
                {language === 'en'
                  ? notificationData?.title || defaultModalTitle
                  : notificationData?.translatedTitle ||
                    notificationData?.title ||
                    defaultModalTitle}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.regular,
                  color: Colors.darkgray,
                  textAlign: 'center',
                  marginBottom: wp(4),
                }}
              >
                {formatTimeAgo(notificationData?.time)}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {notificationData?.message && (
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.regular,
                      color: Colors.darkgray,
                      lineHeight: 22,
                      marginBottom: wp(4),
                    }}
                  >
                    {language === 'en'
                      ? notificationData?.message
                      : notificationData?.translatedMessage ||
                        notificationData?.message}
                  </Text>
                )}

                {notificationData?.imageUrl && (
                  <Image
                    source={{ uri: notificationData.imageUrl }}
                    style={{
                      width: '100%',
                      height: hp(30),
                      borderRadius: wp(3),
                      marginVertical: wp(4),
                    }}
                    resizeMode="cover"
                  />
                )}

                {notificationData?.url && (
                  <TouchableOpacity
                    onPress={handleLinkPress}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.mainColor,
                      padding: wp(4),
                      borderRadius: wp(3),
                      marginTop: wp(2),
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.white,
                        fontFamily: fonts.medium,
                        fontSize: 15,
                        marginRight: wp(2),
                      }}
                    >
                      {viewDetailsText}
                    </Text>
                    <AntDesign
                      name="arrowright"
                      size={18}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Notification;
