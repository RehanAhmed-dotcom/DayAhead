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

const LanguageScreen = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [selectedMembers, setSelectedMembers] = useState('English');
  const [allMembers, setAllMembers] = useState([
    { name: 'English' },
    { name: 'Spanish' },
    { name: 'Portuguese' },
    { name: 'French' },
    { name: 'Russian' },
    { name: 'German' },
    { name: 'Hindi' },
    { name: 'Indonesia' },
  ]);
  const [isloading, setIsLoading] = useState(false);

  // Translation
  const { ready } = useLanguage();
  const screenTitle = useTranslate(staticTexts.addMembers);
  const addButtonText = useTranslate(staticTexts.addNow);
  const errorTitle = useTranslate(staticTexts.error);
  const errorMessage = useTranslate(staticTexts.pleaseSelectMember);
  const successTitle = useTranslate(staticTexts.success);

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
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
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
            // elevation: 4,
            width: wp(100),
            height: wp(25),
            // backgroundColor: '#FAFAFA',
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
            barStyle="light-content"
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: 25,
              height: 25,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              // marginRight: wp(7),
            }}
          >
            Languages
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
              // backgroundColor: Colors.white,
              borderRadius: 10,
              padding: wp(5),
              width: wp(90),
              alignItems: 'center',
              // elevation: 2,
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
                  height: 50,
                  paddingVertical: wp(3),
                  backgroundColor: '#BD2BAF33',
                  marginBottom: wp(3),
                  paddingHorizontal: wp(3),
                  borderRadius: wp(2),
                  // elevation: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
                onPress={() => setSelectedMembers(member.name)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.white,
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
                  {selectedMembers == member.name && (
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LanguageScreen;
