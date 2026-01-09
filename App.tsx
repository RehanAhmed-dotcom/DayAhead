import { View, Text, SafeAreaView, Platform, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import StackNavigation from './src/Navigation/StackNavigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import Store from './src/Redux/Store';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from './src/Screens/Auth/SplashScreen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PushNotification from 'react-native-push-notification';
import notifee, {
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';
import Toast from 'react-native-toast-message';
import { LanguageProvider } from './src/Components/context/LanguageContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Colors, fonts, images, styles } from './src/Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const persistor = persistStore(Store);
const App = () => {
  const [splashVisible, setSplashVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);


  const linking = {
    prefixes: ['https://plantflipsapp.com', 'dayAhead://'], // Add your custom scheme if needed
    config: {
      screens: {
        // Adjust to match your navigator structure
        // Example if CommunityDetails is in a stack called 'CommunityStack'
        CommunityDetails: 'community/post/:postId', // This matches /community/post/123
      },
    },
  };

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: '365885584898-78esvk6j85p0oqprs6pmps5vnss83ov6.apps.googleusercontent.com', // From Firebase Console
  //   });
  // }, []);

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          alignSelf: 'center',
          width: wp(95),
          padding: 25,
          borderRadius: 10,

          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <Icon
          name="check-circle"
          size={24}
          color={Colors.mainColor}
          style={{ marginRight: 10 }}
        />
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.mainColor }}>{text1}</Text>
          {rest.text2 && (
            <Text style={{ color: '#000000', fontSize: 12 }}>{rest.text2}</Text>
          )}
        </View>
      </View>
    ),
    error: ({ text1, text2, ...rest }) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          width: wp(95),
          padding: 25,
          borderRadius: 10,
          paddingHorizontal: wp(4),
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <Icon name="error" size={24} color="red" style={{ marginRight: 10 }} />
        <View>
          <Text style={{ fontWeight: 'bold', color: 'red' }}>{text1}</Text>
          {text2 && (
            <Text
              style={{ color: '#000000', fontSize: 12, marginRight: wp(4) }}
            >
              {text2}
            </Text>
          )}
        </View>
      </View>
    ),
  };
  const getToken = async () => {
    let fcmToken = await messaging().getToken();
    // console.log('i got fcm', fcmToken);
  };
  const getNotifications = async () => {
    await messaging().onNotificationOpenedApp(remoteMessage => {
      // setBadge(0);
    });
    await messaging()
      .getInitialNotification()
      .then(remoteMessage => {});
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
    }
  };
  const publishKey =
    'pk_test_51SZQxWFbGcTzrHeUqWFNxGXBZmWQHcFjBdZxG99vLvbVpwJQjTbfH6vfI6iUh24pT8wwbuTcPq5oOfQRMp1epTal00FKL2LzfE';
  const _createChannel = () => {
    PushNotification.createChannel({
      channelId: 'fcm_fallback_notification_channel', // (required)
      channelName: 'fcm_fallback_notification_channel', // (required)
      badge: 4,
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });
  };
  useEffect(() => {
    getToken();
    getNotifications();
    requestUserPermission();

    Platform.OS == 'android' && _createChannel();
    const unsubscribe = messaging().onMessage(remoteMessage => {
      console.log('remoteMessage in app', JSON.stringify(remoteMessage));
      Platform.OS === 'ios' &&
        PushNotificationIOS.addNotificationRequest({
          id: new Date().toString(),
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          category: 'userAction',
          userInfo: remoteMessage.data,
        });
      // Platform.OS === 'ios' &&
      //   PushNotificationIOS.setApplicationIconBadgeNumber(1);
    });
    return unsubscribe;
  }, []);
  return (
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //   }}
    // >

    <StripeProvider
      publishableKey={publishKey}
      merchantIdentifier="merchant.com.dayahead"
    >
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <>
            {splashVisible ? (
              <SplashScreen />
            ) : (
              <>
              <LanguageProvider>
                <StackNavigation linking={linking} />
                <Toast config={toastConfig} />
                </LanguageProvider>
              </>
            )}
          </>
        </PersistGate>
      </Provider>
    </StripeProvider>
    // </SafeAreaView>
  );
};

export default App;
