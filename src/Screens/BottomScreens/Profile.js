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
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1,paddingTop:Platform.OS === 'ios' ?35: 0  }}
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
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
              <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />

          </TouchableOpacity>
          <Text></Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
               marginRight: wp(7),
             
            }}
          >
            Account
          </Text>
          <TouchableOpacity
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
          </TouchableOpacity>
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
            {/* <Text style={{fontSize:16,fontFamily:fonts.bold,color:Colors.black,textAlign:'center',marginTop:wp(2)}}>John Travolta</Text>
              <Text style={{fontSize:12,fontFamily:fonts.medium,color:'#848A94',textAlign:'center'}}>johntravolta123@support.com</Text> */}
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: Colors.mainColor,
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
                  color: Colors.mainColor,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <Input
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
          />

          <TouchableOpacity
            onPress={() => dispatch(setUser(null))}
            style={{
              width: wp(90),
              height: wp(13),
              borderWidth: 1,
              borderColor: Colors.mainColor,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: wp(10),
              marginBottom: wp(30),
              marginTop: wp(5),
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Profile;
