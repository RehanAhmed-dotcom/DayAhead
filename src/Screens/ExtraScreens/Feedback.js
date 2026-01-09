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
import { Rating } from 'react-native-ratings';
import { useSelector } from 'react-redux';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';

// Translation tools
import { useTranslate } from '../../Components/hooks/useTranslate';
import { useLanguage } from '../../Components/context/LanguageContext';
import staticTexts from '../../locales/staticTexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Feedback = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isloading, setIsLoading] = useState(false);

  const { ready } = useLanguage();

  // Translated static texts
  const screenTitle = useTranslate(staticTexts.feedbackTitle);
  const feedbackLabel = useTranslate(staticTexts.feedbackLabel);
  const placeholderText = useTranslate(staticTexts.feedbackPlaceholder);
  const submitButton = useTranslate(staticTexts.submitButton);
  const errorTitle = useTranslate(staticTexts.error);
  const ratingRequired = useTranslate(staticTexts.ratingRequired);
  const feedbackRequired = useTranslate(staticTexts.feedbackRequired);
  const successTitle = useTranslate(staticTexts.success);

  const ratingCompleted = ratingValue => {
    setRating(ratingValue);
  };

  const AddFeedbackApi = () => {
    if (!rating) {
      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: ratingRequired,
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    if (!review) {
      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: feedbackRequired,
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const formdata = new FormData();
    formdata.append('rating', rating);
    formdata.append('feedback', review);
    setIsLoading(true);
    PostAPiwithToken({ url: 'add-feedback', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: successTitle,
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          setRating(0);
          setReview('');
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
const {top}=useSafeAreaInsets()
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 35 : 0 }}
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
          {screenTitle}
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                flex: 1,
                marginTop: wp(15),
              }}
            >
              <Image
                source={images.feedbackImg}
                resizeMode="cover"
                style={{ width: wp(70), height: wp(70), alignSelf: 'center' }}
              />
            </View>
            <View
              style={{
                width: wp(60),
                height: wp(0.4),
                backgroundColor: Colors.grey,
                alignSelf: 'center',
              }}
            ></View>
            <View
              style={{
                alignItems: 'center',
                marginTop: wp(5),
                justifyContent: 'center',
                alignSelf: 'center',
                width: wp(90),
              }}
            >
              <Rating
                type="star"
                ratingCount={5}
                imageSize={30}
                onFinishRating={ratingCompleted}
              />
            </View>
            <Text
              style={[
                styles.labelStyle,
                { marginLeft: wp(7), marginTop: wp(4) },
              ]}
            >
              {feedbackLabel}
            </Text>
            <View
              style={{
                width: wp(85),
                height: wp(35),
                borderRadius: wp(3),
                elevation: 2,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'white',
                shadowRadius: 8,
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: wp(3),
                borderWidth: 1,
                borderColor: Colors.mainColor,
              }}
            >
              <TextInput
                style={{
                  paddingHorizontal: wp(3),
                  color: Colors.black,
                  fontFamily: fonts.regular,
                  fontSize: 13,
                }}
                multiline
                placeholder={placeholderText}
                placeholderTextColor={Colors.lightgrey}
                value={review}
                onChangeText={text => setReview(text)}
              />
            </View>
          </View>
          <View style={{ marginBottom: wp(10), marginTop: wp(5) }}>
            <MainButton title={submitButton} onPress={() => AddFeedbackApi()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Feedback;