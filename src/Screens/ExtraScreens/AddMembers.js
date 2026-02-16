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
import React, { useEffect, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';

// Translation tools
import { useTranslate } from '../../Components/hooks/useTranslate';
import { useLanguage } from '../../Components/context/LanguageContext';
import staticTexts from '../../locales/staticTexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddMembers = ({ navigation, route }) => {
  const onSave = route?.params?.onSave;
  const user = useSelector(state => state.user.user);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  // Translation
  const { ready } = useLanguage();
  const screenTitle = useTranslate(staticTexts.addMembers);
  const addButtonText = useTranslate(staticTexts.addNow);
  const errorTitle = useTranslate(staticTexts.error);
  const errorMessage = useTranslate(staticTexts.pleaseSelectMember);
  const successTitle = useTranslate(staticTexts.success);

  const handleMemberSelect = member => {
    setSelectedMembers(prev =>
      prev.includes(member)
        ? prev.filter(m => m !== member)
        : [...prev, member],
    );
  };

  const getAllMembers = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'getAllUsers', Token: user?.api_token })
      .then(res => {
        setAllMembers(res.data);
        // console.log('response of all users', JSON.stringify(res));
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    getAllMembers();
  }, []);

  const AddFriendsApi = () => {
    const formdata = new FormData();
    if (selectedMembers.length < 1) {
      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage,
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    selectedMembers.forEach(element => {
      formdata.append('friends[]', element);
    });
    setIsLoading(true);
    PostAPiwithToken({ url: 'add-friend', Token: user?.api_token }, formdata)
      .then(res => {
        console.log('my add friends data--------', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: successTitle,
            text2: res.message, // Backend message — keep original or translate if needed
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          getAllMembers();
          if (onSave) {
            onSave(selectedMembers);
          }

          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: errorTitle,
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
      });
  };

  if (!ready) {
    return (
      <ImageBackground source={images.mainbackground} style={{ flex: 1 }}>
        <Loader />
      </ImageBackground>
    );
  }
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? top : 0 }}
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
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
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
            Add Members
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: wp(35) }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              padding: wp(5),
              width: wp(90),
              alignItems: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              alignSelf: 'center',
              marginTop: wp(5),
            }}
          >
            {allMembers.map(member => (
              <TouchableOpacity
                key={member.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingVertical: wp(3),
                  backgroundColor: Colors.lightgreen,
                  marginBottom: wp(3),
                  paddingHorizontal: wp(3),
                  borderRadius: wp(2),
                  elevation: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
                onPress={() => handleMemberSelect(member.id)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                  }}
                >
                  {member.name} {/* User name — keep original */}
                </Text>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: Colors.mainColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: wp(2),
                  }}
                >
                  {selectedMembers.includes(member.id) && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: Colors.mainColor,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Fixed Button at Bottom */}
        <TouchableOpacity
          onPress={() => AddFriendsApi()}
          style={{
            position: 'absolute',
            bottom: wp(14),
            alignSelf: 'center',
            paddingVertical: wp(3.5),
            paddingHorizontal: wp(5),
            backgroundColor: Colors.mainColor,
            borderRadius: wp(8),
            width: wp(80),
            height: wp(13),
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.bold,
              color: Colors.white,
            }}
          >
            {addButtonText} {/* Translated */}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default AddMembers;
