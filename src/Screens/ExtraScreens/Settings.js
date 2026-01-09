import {
  View,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

// Translation tools
import { useTranslate } from '../../Components/hooks/useTranslate';
import { useLanguage } from '../../Components/context/LanguageContext';
import staticTexts from '../../locales/staticTexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Settings = ({ navigation }) => {
  const { ready } = useLanguage();

  // These will update automatically when language changes
  const screenTitle = useTranslate(staticTexts.settings);
  const friendsMembers = useTranslate(staticTexts.friendsMembers);
  const feedbacks = useTranslate(staticTexts.feedbacks);
  const privacyPolicy = useTranslate(staticTexts.privacyPolicy);
  const contactUs = useTranslate(staticTexts.contactUs);
  const backupOptions = useTranslate(staticTexts.backupOptions);
  const subscription = useTranslate(staticTexts.subscription);
  const faqs = useTranslate(staticTexts.faqs);

  if (!ready) {
    return (
      <ImageBackground
        source={images.mainbackground}
        style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 40 : 20 }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.white, fontSize: 18, fontFamily: fonts.medium }}>
            Loading...
          </Text>
        </View>
      </ImageBackground>
    );
  }
const{top}=useSafeAreaInsets()
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 35 : 0 }}
      resizeMode="cover"
    >
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
            shadowOffset: { width: 0, height: 6 }, 
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
              <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
              // marginRight: wp(7),
            }}
          >
            {screenTitle}
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: wp(20) }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FriendsMembers')}
            style={styles.accountView}
          >
            <Text style={styles.mainText}>{friendsMembers}</Text>
            <AntDesign name="right" size={18} color={Colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Feedback')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{feedbacks}</Text>
            <AntDesign name="right" size={18} color={Colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{privacyPolicy}</Text>
            <AntDesign name="right" size={18} color={Colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{contactUs}</Text>
            <AntDesign name="right" size={18} color={Colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{backupOptions}</Text>
            <AntDesign name="right" size={18} color={Colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Subscription')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{subscription}</Text>
            <AntDesign name="right" size={18} color={Colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Faqs')}
            style={[styles.accountView, { marginTop: wp(4), marginBottom: wp(30) }]}
          >
            <Text style={styles.mainText}>{faqs}</Text>
            <AntDesign name="right" size={18} color={Colors.black} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Settings;