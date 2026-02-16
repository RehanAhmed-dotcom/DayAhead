import { Button, StyleSheet, Text, View } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FocusScreen from '../Screens/ExtraScreens/FocusScreen';
import Onboarding1 from '../Screens/Auth/Onboarding1';
import Onboarding2 from '../Screens/Auth/Onboarding2';
import Onboarding3 from '../Screens/Auth/Onboarding3';
import Onboarding4 from '../Screens/Auth/Onboarding4';
import Onboarding5 from '../Screens/Auth/Onboarding5';
import Onboarding6 from '../Screens/Auth/Onboarding6';
import Onboarding7 from '../Screens/Auth/Onboarding7';
import SplashScreen from '../Screens/Auth/SplashScreen';
import { setupNotificationListeners } from '../Screens/Notifee';
import Login from '../Screens/Auth/Login';
import SignUp from '../Screens/Auth/SignUp';
import CompleteProfile from '../Screens/Auth/CompleteProfile';
import VerificationCode from '../Screens/Auth/VerificationCode';
import DailyMeetings from '../Screens/BottomScreens/DailyMeetings';
import AddTaskMeeting from '../Screens/ExtraScreens/AddTaskMeeting';
import AllSet from '../Screens/Auth/AllSet';
import Forget from '../Screens/Auth/Forget';
import Verify from '../Screens/Auth/Verify';
import NewPassword from '../Screens/Auth/NewPassword';
import IndexBottom from '../BottomNav/IndexBottom';
import IndexDrawer from '../DrawerNav/IndexDrawer';
import LanguageScreen from '../Screens/ExtraScreens/LanguageScreen';
import CreateTask from '../Screens/ExtraScreens/CreateTask';
import TaskDetails from '../Screens/ExtraScreens/TaskDetails';
import AlltaskSet from '../Screens/ExtraScreens/AlltaskSet';
import AddNew from '../Screens/ExtraScreens/AddNew';
import Conversation from '../Screens/ExtraScreens/Conversation';
import PrivacyPolicy from '../Screens/ExtraScreens/PrivacyPolicy';
import FriendsMembers from '../Screens/ExtraScreens/FriendsMembers';
import Feedback from '../Screens/ExtraScreens/Feedback';
import Faqs from '../Screens/ExtraScreens/Faqs';
import SetAlarm from '../Screens/ExtraScreens/SetAlarm';
import StatsDetail from '../Screens/ExtraScreens/StatsDetail';
import AlarmScreen from '../Screens/ExtraScreens/AlarmScreen';
import ShareWithMembers from '../Screens/ExtraScreens/ShareWithMembers';
import AllSetAlarm from '../Screens/ExtraScreens/AllSetAlarm';
import Reports from '../Screens/ExtraScreens/Reports';
import CreatePlan from '../Screens/ExtraScreens/CreatePlan';
import CreateMeetingPage from '../Screens/ExtraScreens/CreateMeeting';
import CommunityScreen from '../Screens/ExtraScreens/CommunityScreen';
import CommunityDetails from '../Screens/ExtraScreens/CommunityDetails';
import CreateCommunity from '../Screens/ExtraScreens/CreateCommunity';
import ChatAI from '../Screens/ExtraScreens/ChatAI';
import AddMembers from '../Screens/ExtraScreens/AddMembers';
import Subscription from '../Screens/ExtraScreens/Subscription';
import AudioScreen from '../Screens/ExtraScreens/AudioScreen';
import SpotifyEpisodes from '../Components/SpotifyEpisodes';
import PlayerScreen from '../Components/PlayerScreen';
import ZegoCloud from '../Screens/ZegoCloud';
import JoinCommunity from '../Screens/ExtraScreens/JoinCommunity';
import EditProfile from '../Screens/ExtraScreens/EditProfile';
import Profile from '../Screens/BottomScreens/Profile';
import CreatePost from '../Screens/ExtraScreens/CreatePost';
import SearchScreen from '../Screens/ExtraScreens/SearchScreen';
import Settings from '../Screens/ExtraScreens/Settings';
import AddPlanning from '../Screens/ExtraScreens/AddPlanning';
// import JnlOnboard1 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard1';
import JnlOnboard2 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard2';
import JnlOnboard3 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard3';
import JnlOnboard4 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard4';
import JnlOnboard5 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard5';
import JnlOnboard6 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard6';
import JnlOnboard7 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard7';
import JournalDetails from '../Screens/ExtraScreens/JournalDetails';

import FormJournal from '../Screens/ExtraScreens/JournalOnboard/FormJournal';
import FormJournal1 from '../Screens/ExtraScreens/JournalOnboard/FormJournal1';
import FormJournal2 from '../Screens/ExtraScreens/JournalOnboard/FormJournal2';
import FormJournal2Half from '../Screens/ExtraScreens/JournalOnboard/FormJournal2Half';
import FormJournal3 from '../Screens/ExtraScreens/JournalOnboard/FormJournal3';
import FormJournal4 from '../Screens/ExtraScreens/JournalOnboard/FormJournal4';
import FormJournal5 from '../Screens/ExtraScreens/JournalOnboard/FormJournal5';
import FormJournal6 from '../Screens/ExtraScreens/JournalOnboard/FormJournal6';

import { useDispatch, useSelector } from 'react-redux';
import { navigationRef } from '../Screens/RootNavigation';
import Home from '../Screens/BottomScreens/Home';
import AboutUs from '../Screens/DrawerScreens/AboutUs';
import ChangePassword from '../Screens/ExtraScreens/ChangePassword';
const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  const user = useSelector(state => state.user.user);
  useEffect(() => {
    setupNotificationListeners();
  }, []);
  const onboarding = useSelector(state => state.onboarding.onBoardingStatus);
  // console.log('my onboarding status is ', onboarding);
  const dispatch = useDispatch();
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {onboarding == false ? (
          <>
            {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}

            <Stack.Screen name="Onboarding1" component={Onboarding1} />
            <Stack.Screen name="Onboarding2" component={Onboarding2} />
            <Stack.Screen name="Onboarding3" component={Onboarding3} />
            <Stack.Screen name="Onboarding4" component={Onboarding4} />
            <Stack.Screen name="Onboarding5" component={Onboarding5} />
            <Stack.Screen name="Onboarding6" component={Onboarding6} />
            <Stack.Screen name="Onboarding7" component={Onboarding7} />
          </>
        ) : (
          <>
            {user === null ? (
              <>
                {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                {/* <Stack.Screen
                  name="CompleteProfile"
                  component={CompleteProfile}
                /> */}
                <Stack.Screen name="AllSet" component={AllSet} />
                <Stack.Screen name="Forget" component={Forget} />

                <Stack.Screen name="Verify" component={Verify} />
                <Stack.Screen
                  name="VerificationCode"
                  component={VerificationCode}
                />

                <Stack.Screen name="NewPassword" component={NewPassword} />
              </>
            ) : user?.email_verified_at == null ? (
              <>
                <Stack.Screen
                  name="VerificationCode"
                  component={VerificationCode}
                />
              </>
            ) : user.is_complete_profile == 0 ? (
              <>
                <Stack.Screen
                  name="CompleteProfile"
                  component={CompleteProfile}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="IndexDrawer" component={IndexDrawer} />
                {/* <Stack.Screen name="IndexBottom" component={IndexBottom} /> */}
                <Stack.Screen name="CreateTask" component={CreateTask} />
                <Stack.Screen name="AlltaskSet" component={AlltaskSet} />
                <Stack.Screen name="TaskDetails" component={TaskDetails} />
                <Stack.Screen name="AddNew" component={AddNew} />
                <Stack.Screen name="Home" component={Home} />

                <Stack.Screen name="Conversation" component={Conversation} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                <Stack.Screen
                  name="FriendsMembers"
                  component={FriendsMembers}
                />
                <Stack.Screen name="Feedback" component={Feedback} />
                <Stack.Screen name="Faqs" component={Faqs} />
                <Stack.Screen name="SetAlarm" component={SetAlarm} />
                <Stack.Screen name="AlarmScreen" component={AlarmScreen} />
                <Stack.Screen
                  name="ShareWithMembers"
                  component={ShareWithMembers}
                />
                <Stack.Screen name="CreatePost" component={CreatePost} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="AllSetAlarm" component={AllSetAlarm} />
                <Stack.Screen name="Reports" component={Reports} />
                <Stack.Screen name="CreatePlan" component={CreatePlan} />
                <Stack.Screen
                  name="CreateMeetingPage"
                  component={CreateMeetingPage}
                />
                <Stack.Screen
                  name="CommunityScreen"
                  component={CommunityScreen}
                />
                <Stack.Screen
                  name="CommunityDetails"
                  component={CommunityDetails}
                />
                <Stack.Screen
                  name="CreateCommunity"
                  component={CreateCommunity}
                />
                <Stack.Screen
                  name="AddTaskMeeting"
                  component={AddTaskMeeting}
                />
                <Stack.Screen name="SearchScreen" component={SearchScreen} />
                <Stack.Screen name="DailyMeetings" component={DailyMeetings} />
                <Stack.Screen name="ZegoCloud" component={ZegoCloud} />
                <Stack.Screen name="ChatAI" component={ChatAI} />
                <Stack.Screen name="AddMembers" component={AddMembers} />
                <Stack.Screen name="Subscription" component={Subscription} />
                <Stack.Screen name="JoinCommunity" component={JoinCommunity} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="AddPlanning" component={AddPlanning} />
                <Stack.Screen name="AudioScreen" component={AudioScreen} />
                <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
                <Stack.Screen name="StatsDetail" component={StatsDetail} />
                <Stack.Screen name="AboutUs" component={AboutUs} />
                <Stack.Screen
                  name="ChangePassword"
                  component={ChangePassword}
                />
                <Stack.Screen
                  name="SpotifyEpisodes"
                  component={SpotifyEpisodes}
                />
                {/* <Stack.Screen name="JnlOnboard1" component={JnlOnboard1} /> */}
                <Stack.Screen
                  name="JournalDetails"
                  component={JournalDetails}
                />

                <Stack.Screen name="JnlOnboard2" component={JnlOnboard2} />

                <Stack.Screen name="JnlOnboard3" component={JnlOnboard3} />
                <Stack.Screen name="JnlOnboard4" component={JnlOnboard4} />
                <Stack.Screen name="JnlOnboard5" component={JnlOnboard5} />
                <Stack.Screen name="JnlOnboard6" component={JnlOnboard6} />
                <Stack.Screen name="JnlOnboard7" component={JnlOnboard7} />

                <Stack.Screen name="FormJournal" component={FormJournal} />
                <Stack.Screen name="FormJournal1" component={FormJournal1} />
                <Stack.Screen name="FormJournal2" component={FormJournal2} />
                <Stack.Screen
                  name="FormJournal2Half"
                  component={FormJournal2Half}
                />
                <Stack.Screen
                  name="LanguageScreen"
                  component={LanguageScreen}
                />
                <Stack.Screen name="FocusScreen" component={FocusScreen} />
                <Stack.Screen name="FormJournal3" component={FormJournal3} />
                <Stack.Screen name="FormJournal4" component={FormJournal4} />
                <Stack.Screen name="FormJournal5" component={FormJournal5} />
                <Stack.Screen name="FormJournal6" component={FormJournal6} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
