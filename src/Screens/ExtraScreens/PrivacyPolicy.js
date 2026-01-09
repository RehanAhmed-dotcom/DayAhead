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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { useTranslate } from '../../Components/hooks/useTranslate';
import { useLanguage } from '../../Components/context/LanguageContext';
import staticTexts from '../../locales/staticTexts';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const PrivacyPolicy = ({ navigation }) => {
  const { ready } = useLanguage();

  // Translated static texts
  const privacyPolicy = useTranslate(staticTexts.privacyPolicy);
  if (!ready) {
    return (
      <ImageBackground source={images.mainbackground} style={{ flex: 1 }}>
        <Loader />
      </ImageBackground>
    );
  }
  const {top}=useSafeAreaInsets()
    return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1,paddingTop:Platform.OS === 'ios' ?35: 0 }}
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
           Privacy Policys
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
            <Text
              style={{
                color: Colors.black,
                fontSize: 14,
                fontFamily: fonts.regular,
                lineHeight: 22,
              }}
            >
              On sait depuis longtemps que travailler avec du texte lisible et
              contenant du sens est source de distractions, et empêche de se
              concentrer sur la mise en page elle-même. L'avantage du Lorem
              Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.'
              est qu'il possède une distribution de lettres plus ou moins
              normale, et en tout cas comparable avec celle du français
              standard. De nombreuses suites logicielles de mise en page ou
              éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par
              défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de
              nombreux sites qui n'en sont encore qu'à leur phase de
              construction. Plusieurs versions sont apparues avec le temps,
              parfois par accident, souvent intentionnellement (histoire d'y
              rajouter de petits clins d'oeil, voire des phrases embarassantes).
            </Text>
            <Text
              style={{
                color: Colors.black,
                fontSize: 14,
                fontFamily: fonts.regular,
                lineHeight: 22,
              }}
            >
              On sait depuis longtemps que travailler avec du texte lisible et
              contenant du sens est source de distractions, et empêche de se
              concentrer sur la mise en page elle-même. L'avantage du Lorem
              Ipsum sur un texte générique comme
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default PrivacyPolicy;
