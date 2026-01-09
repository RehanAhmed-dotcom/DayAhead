// src/screens/Notification.js

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
} from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainButton from '../../Components/MainButton';
import { AllGetAPI } from '../../Components/ApiRoot';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import { useSelector } from 'react-redux';
import moment from 'moment';
import staticTexts from '../../locales/staticTexts';

// Translation tools
import { useTranslate } from '../../Components/hooks/useTranslate';
import { useLanguage } from '../../Components/context/LanguageContext';

const Notification = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const { language, ready } = useLanguage();
  console.log('my language',language)

  const [mynotifications, setMyNotifications] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [customNotification, setCustomNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const [translatedNotifications, setTranslatedNotifications] = useState([]);
  console.log('my transllationn',JSON.stringify(translatedNotifications))
  const [isTranslating, setIsTranslating] = useState(false);

  // Static translated texts
  const screenTitle = useTranslate(staticTexts.notifications);
  const viewDetailsText = useTranslate(staticTexts.viewDetails);
  const noNotificationsText = useTranslate(staticTexts.noNotifications);
  const defaultModalTitle = useTranslate(staticTexts.notification);

  // Fetch notifications
  const getAllNotification = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'viewAllNotification', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          const notifications = res.data || [];
          setMyNotifications(notifications);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Notification API error:', err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllNotification();
    }, [])
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
          mynotifications.map(async (item) => {
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
          })
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

  const formatTimeAgo = (date) => moment(date).fromNow();

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
  const displayNotifications =
    language === 'en'
      ? mynotifications
      : translatedNotifications.length > 0
      ? translatedNotifications
      : mynotifications; // fallback during translation

  return (
    <ImageBackground
      // source={images.mainbackground}
      source={images.myallbackbg}
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
            {screenTitle}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          
          </View>
        </View>

        {/* Notifications List */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: wp(5),marginTop:wp(2) }}>
          <View style={{marginBottom:wp(25)}}>
          <FlatList
            data={displayNotifications}
            keyExtractor={(item) => item?.id?.toString()}
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
                  if (item?.type === 'custom_notification') {
                    setNotificationData(item);
                    setCustomNotification(true);
                  } else if (item?.type === 'message') {
                    navigation.navigate('Conversation', { item });
                  } else if (item?.type === 'snap_alaram') {
                    navigation.navigate('IndexDrawer', { screen: 'SnapAlarm' });
                  } else if (item?.type === 'like_post') {
                    navigation.navigate('CommunityScreen', { item });
                  } else if (item?.type === 'comment_post') {
                    navigation.navigate('CommunityDetails', { postdata: item });
                  }
                }}
                style={{
                  backgroundColor: Colors.lightgreen,
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
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={images.notificationIcon}
                    resizeMode="contain"
                    style={{ width: 28, height: 28, marginRight: wp(3) }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: fonts.medium,
                        color: Colors.darkgray,
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
                        color: Colors.darkgray,
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
                  : notificationData?.translatedTitle || notificationData?.title || defaultModalTitle}
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
                      : notificationData?.translatedMessage || notificationData?.message}
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
                    <AntDesign name="arrowright" size={18} color={Colors.white} />
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