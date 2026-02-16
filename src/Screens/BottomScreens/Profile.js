import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import Input from '../../Components/Input/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../Redux/Auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import staticTexts from '../../locales/staticTexts';
import { useTranslate } from '../../Components/hooks/useTranslate';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Profile = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  console.log('my data', JSON.stringify(user));
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user?.name);

  const [email, setEmail] = useState(user?.email);
  const [goals, setGoals] = useState(user?.goals);
  const [preferences, setPreferences] = useState(user?.preferences);
  const [image, setImage] = useState(null);
  const { top } = useSafeAreaInsets();
  const screenTitle = useTranslate(staticTexts.settings);
  const friendsMembers = useTranslate(staticTexts.friendsMembers);
  const feedbacks = useTranslate(staticTexts.feedbacks);
  const privacyPolicy = useTranslate(staticTexts.privacyPolicy);
  const contactUs = useTranslate(staticTexts.contactUs);
  const backupOptions = useTranslate(staticTexts.backupOptions);
  const subscription = useTranslate(staticTexts.subscription);
  const faqs = useTranslate(staticTexts.faqs);

  const [showPermission, setShowPermission] = useState(false);
  const PermissionModal = () => (
    <Modal
      visible={showPermission}
      transparent={true}
      onRequestClose={() => setShowPermission(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000088',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ImageBackground
          source={require('../../Assets/Background.png')}
          style={{
            width: wp(90),
            height: 300,
            borderRadius: 10,
            // backgroundColor: '#BD2BAF33', // Main rounded corners
            overflow: 'hidden', // Crucial: clips children (FlatList) to rounded corners
            // elevation: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          }}
        >
          <Image
            source={require('../../Assets/Ahead.png')}
            style={{ width: 250, marginTop: 50, height: 150 }}
          />
          <Text style={{ color: 'white' }}>
            Are you sure you want to logout
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowPermission(false);
                // dispatch(setUser(null));
              }}
              style={{
                width: '45%',
                backgroundColor: '#BD2BAF33',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                height: 50,
              }}
            >
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowPermission(false);
                dispatch(setUser(null));
              }}
              style={{
                width: '45%',
                backgroundColor: '#BD2BAF',
                alignItems: 'center',
                marginLeft: 10,
                justifyContent: 'center',
                borderRadius: 10,
                height: 50,
              }}
            >
              <Text style={{ color: 'white' }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );

  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
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
            // elevation: 4,
            width: wp(100),
            height: wp(25),
            // backgroundColor: '#FAFAFA',
            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 6 }, // push shadow down
            // shadowOpacity: 0.2,
            // shadowRadius: 3,
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <TouchableOpacity onPress={() => navigation?.openDrawer()}>
            <Image
              source={images.menuIcon}
              style={{ width: 26, height: 26 }}
              tintColor="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* <Text></Text> */}
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              // marginRight: wp(7),
            }}
          >
            Account
          </Text>
          <View style={{ width: 26 }} />
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={{
              paddingHorizontal: wp(2),
              paddingVertical: wp(1),
              borderWidth: 1,
              borderColor: Colors.black,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: fonts.medium,
                color: Colors.black,
              }}
            >
              Settings
            </Text>
          </TouchableOpacity> */}
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(5) }}
        >
          <View style={{ marginTop: wp(3) }}>
            <Image
              source={user.image ? { uri: user.image } : images.dummyuserpic}
              style={{
                width: wp(22),
                height: wp(22),
                alignSelf: 'center',
                borderRadius: wp(11),
              }}
              resizeMode="cover"
            />

            <Text
              style={{
                fontSize: 22,
                fontFamily: fonts.bold,
                color: Colors.white,
                textAlign: 'center',
                marginTop: wp(2),
              }}
            >
              {user?.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                color: 'white',
                textAlign: 'center',
              }}
            >
              {user?.email}
            </Text>
            <TouchableOpacity
              // onPress={() => AsyncStorage.setItem('modalLastShown', null)}
              onPress={() => navigation.navigate('EditProfile')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: 'white',
                width: wp(15),
                height: wp(8),
                borderRadius: wp(2),
                marginTop: wp(2),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.medium,
                  color: 'white',
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Input
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            type="default"
            showBorder
            inputColor="#F5F5F5"
            labelColor="#212121"
            placeFontSize={16}
            maxLength={50}
            nonEditable
          />
          <Input
            label="Email"
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            type="default"
            showBorder
            inputColor="#F5F5F5"
            labelColor="#212121"
            placeFontSize={16}
            maxLength={50}
            nonEditable
          />
          <Input
            label="Goals"
            placeholder="goals"
            value={goals}
            onChangeText={setGoals}
            type="default"
            showBorder
            inputColor="#F5F5F5"
            labelColor="#212121"
            placeFontSize={16}
            nonEditable
            maxLength={50}
          />
          <Input
            label="Preferences"
            placeholder="preferences"
            value={preferences}
            onChangeText={setPreferences}
            type="default"
            showBorder
            inputColor="#F5F5F5"
            labelColor="#212121"
            placeFontSize={16}
            maxLength={50}
            nonEditable
          /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            style={styles.accountView}
          >
            <Text style={styles.mainText}>Change Passwords</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('FriendsMembers')}
            style={styles.accountView}
          >
            <Text style={styles.mainText}>{friendsMembers}</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Feedback')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{feedbacks}</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{privacyPolicy}</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AboutUs')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>About Us</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={[styles.accountView, { marginTop: wp(4) }]}>
            <Text style={styles.mainText}>{contactUs}</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={[styles.accountView, { marginTop: wp(4) }]}>
            <Text style={styles.mainText}>{backupOptions}</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => navigation.navigate('Subscription')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>{subscription}</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LanguageScreen')}
            style={[styles.accountView, { marginTop: wp(4) }]}
          >
            <Text style={styles.mainText}>Languages</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Faqs')}
            style={[
              styles.accountView,
              { marginTop: wp(4), marginBottom: wp(10) },
            ]}
          >
            <Text style={styles.mainText}>{faqs}</Text>
            <AntDesign name="right" size={18} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => dispatch(setUser(null))}
            onPress={() => setShowPermission(true)}
            style={{
              width: wp(90),
              height: 50,
              borderWidth: 1,
              borderColor: Colors.mainColor,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: wp(10),
              marginBottom: wp(30),
              marginTop: wp(0),
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.mainColor,
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <PermissionModal />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Profile;
