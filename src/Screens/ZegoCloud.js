import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
// import database from '@react-native-firebase/database';
import * as ZegoUIKit from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { useSelector } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
const ZegoCloud = ({ navigation, route }) => {
  const { item } = route.params;
  console.log('roomId', item?.meeting_id);
  const YOUR_APP_ID = 521107898;
  const YOUR_APP_SIGN =
    'e34232a6c3706a8cfebd37f34f65eac9a8972fd57812d297ac0a25e0fab7a645';

  const { user } = useSelector(state => state.user);
  // const navigation = useNavigation();
  console.log('zeggo ids with user,', user, item);
  const sanitizeEmail = email => email.replace(/[^a-zA-Z0-9]/g, '');

  const [participants, setParticipants] = useState([]);

  return (
    <View
      style={{
        flex: 1,
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(100),
      }}
    >
      <ZegoUIKit.ZegoUIKitPrebuiltCall
        appID={YOUR_APP_ID}
        appSign={YOUR_APP_SIGN}
        userID={user?.email}
        userName={`${user?.name}`}
        callID={item?.meeting_id} // Unique room ID
        config={{
          turnOnCameraWhenJoining: false,
          turnOnMicrophoneWhenJoining: true,
          useSpeakerWhenJoining: true,
          layout: { mode: 1 }, // 1 = Grid Layout
          showParticipantList: true, // Show participants list
          showTextChat: true, // Enable chat
          showUserNameOnVideo: true, // Show names on video
          bottomMenuBarConfig: {
            buttons: [
              ZegoUIKit.ZegoMenuBarButtonName.toggleMicrophoneButton,
              ZegoUIKit.ZegoMenuBarButtonName.toggleCameraButton,
              ZegoUIKit.ZegoMenuBarButtonName.switchCameraButton,
              ZegoUIKit.ZegoMenuBarButtonName.toggleAudioOutputButton, // 👈 Speaker toggle
              ZegoUIKit.ZegoMenuBarButtonName.showMemberListButton,
              ZegoUIKit.ZegoMenuBarButtonName.messageButton,
              ZegoUIKit.ZegoMenuBarButtonName.hangUpButton,
            ],
          },
          onLeaveRoom: () => {
            // navigation.navigate('DrawerNavigation', {
            //   screen: 'BottomTab',
            //   params: { screen: 'Home' },
            // })
            navigation.goBack();
            // navigation.navigate('IndexDrawer', {
            //     screen: 'IndexBottom',
            //     params: { screen: 'Tasks' },
            // EndmeetingFunction(item.id, Date.now(), 'Ended');
            // setCallModal(false);
            // Alert.alert('hello');
          },
          onCallEnd: () => {
            // navigation.navigate('DrawerNavigation', {
            //   screen: 'BottomTab',
            //   params: { screen: 'Home' },
            // });
            navigation.goBack();
            // EndmeetingFunction(item.id, Date.now(), 'Ended');
            // setCallModal(false);
            // Alert.alert('Call Ended');
          },
        }}
      />
    </View>
  );
};

export default ZegoCloud;
