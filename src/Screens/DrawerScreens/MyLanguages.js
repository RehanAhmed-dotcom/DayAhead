// MyLanguages.js
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loader from '../../Components/Loader';
import { useLanguage } from '../../Components/context/LanguageContext';
import { useTranslate } from '../../Components/hooks/useTranslate';
import staticTexts from '../../locales/staticTexts';

const MyLanguages = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const { language, changeLanguage, ready } = useLanguage();
  console.log('languaagge',language)

  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const titleText = useTranslate('Languages');
  console.log('languaagge',titleText)
  const saveButtonText = useTranslate(staticTexts.save);

  const mylanguages = [
    'English',
    'Spanish',
    'Portuguese',
    'French',
    'Russian',
    'German',
    'Indonesian',
    'Arabic',
  ];

  const langMap = {
    English: 'en',
    Spanish: 'es',
    Portuguese: 'pt',
    French: 'fr',
    Russian: 'ru',
    German: 'de',
    Indonesian: 'id',
    Arabic: 'ar',
  };

  // Sync selected language display name with current app language
  useEffect(() => {
    if (!ready) return;

    const currentName =
      Object.keys(langMap).find((key) => langMap[key] === language) || 'English';
    setSelectedLanguage(currentName);
  }, [language, ready]);

  const handleSave = () => {
    const selectedCode = langMap[selectedLanguage];
    changeLanguage(selectedCode);
    // navigation.goBack();
  };

  if (!ready) {
    return (
      <ImageBackground
        source={images.mainbackground}
        style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 40 : 20 }}
        resizeMode="cover"
      >
        <Loader />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={images.mainbackground}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 40 : 20 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : 0}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        {/* Header */}
        <View
          style={{
            marginTop: wp(7),
            marginHorizontal: wp(5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: wp(10),
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={images.menuIcon} style={{ width: 28, height: 28 }} resizeMode="contain" />
          </TouchableOpacity>

          <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.white }}>
            {titleText}
          </Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Language Card */}
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              padding: wp(5),
              width: wp(90),
              alignSelf: 'center',
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              marginTop: wp(7),
            }}
          >
            {mylanguages.map((languageName) => {
              const isSelected = selectedLanguage === languageName;

              return (
                <TouchableOpacity
                  key={languageName}
                  onPress={() => setSelectedLanguage(languageName)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingVertical: wp(3),
                    paddingHorizontal: wp(3),
                    backgroundColor: isSelected ? Colors.lightgreen : '#F3F3F3',
                    marginBottom: wp(3),
                    borderRadius: wp(2),
                    elevation: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    {languageName}
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
                    }}
                  >
                    {isSelected && (
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
              );
            })}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
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
              {saveButtonText}
            </Text>
          </TouchableOpacity>

          <View style={{ height: wp(10) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default MyLanguages;