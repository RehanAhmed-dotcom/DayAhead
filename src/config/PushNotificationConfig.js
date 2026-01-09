import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import * as RootNavigation from './NavigationService';
// import database from '@react-native-firebase/database';
// import { Alert } from 'react-native';
// import { navigationRef } from '../Navigation/NavigationService';
// import {thirdAttend} from '../components/CallFirebase';
// import {Store} from '../redux/store';
// import {showchatmodal} from '../redux/actions';
const PushNotificationsConfigs = {
  configurations: () => {
    // const dispatch = Store.dispatch;
    PushNotification.configure({
      onNotification: notification => {
        // console.log()
        console.log(
          'Notification entered my app',
          JSON.stringify(notification),
        );

        // console.log(
        //   'called on notification',
        //   JSON.parse(notification.data.item),
        // );
        // console.log()
        // PushNotificationIOS.setApplicationIconBadgeNumber(2);
        // Platform.OS === 'ios' &&
        //   PushNotificationIOS.setApplicationIconBadgeNumber(8);
        const clicked = notification.userInteraction;
        if (clicked) {
          const notify = notification.data;
          console.log('clicked', notification);
          // if (notification.data.type == 'alert') {
          //   database()
          //     .ref('Users')
          //     .on('value', dataSnapshot => {
          //       let users = [];
          //       dataSnapshot?.forEach(child => {
          //         users.push(child.val());
          //       });
          //       if (users.length > 0) {
          //         thirdAttend();
          //       }
          //     });
          //   RootNavigation.navigateWithParam('Call', {
          //     selectedItem: JSON.parse(notification.data.language),
          //     called: notification.data.called,
          //     senderCall: JSON.parse(notification.data.sender_call),
          //     id: notification.data.interpreter_id,
          //     type: notification.data.call_type,
          //     third: notification.data.third_user,
          //     fcmToken: notification.data.fcm_token,
          //     thirdParty: notification?.data?.thirdparty,
          //   });
          // } else if (notification?.data.type == 'bid') {
          //   RootNavigation.navigateWithParam('BidsList', {
          //     id: notification?.data?.project_id,
          //   });
          // }
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onRegistrationError: err => {},
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: false,
    });
  },
};
export default PushNotificationsConfigs;
