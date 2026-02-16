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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainButton from '../../Components/MainButton';
import { useTranslate } from '../../Components/hooks/useTranslate';
import { useLanguage } from '../../Components/context/LanguageContext';
import staticTexts from '../../locales/staticTexts';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Faqs = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  // Sample FAQ data
  const [faqs, setFaqs] = useState([
    {
      id: '1',
      question: 'What is this app about?',
      answer: 'This app helps users manage their tasks and stay organized.',
      isExpanded: false,
    },
    {
      id: '2',
      question: 'How do I reset my password?',
      answer: 'Go to the settings page and select "Reset Password".',
      isExpanded: false,
    },
    {
      id: '3',
      question: 'Is there a premium version?',
      answer: 'Yes, the premium version offers additional features.',
      isExpanded: false,
    },
    {
      id: '4',
      question: 'How do I reset my password?',
      answer: 'Go to the settings page and select "Reset Password".',
      isExpanded: false,
    },
    {
      id: '5',
      question: 'Is there a premium version?',
      answer: 'Yes, the premium version offers additional features.',
      isExpanded: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = id => {
    setFaqs(
      faqs.map(faq =>
        faq.id === id
          ? { ...faq, isExpanded: !faq.isExpanded }
          : { ...faq, isExpanded: false },
      ),
    );
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderFaqItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#BD2BAF33',
        marginVertical: wp(2),
        marginHorizontal: wp(5),
        borderRadius: wp(3),
        padding: wp(4),
        // elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      }}
      onPress={() => toggleFaq(item.id)}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.medium,
            color: Colors.white,
            flex: 1,
          }}
        >
          {item.question}
        </Text>
        <SimpleLineIcons
          name={item.isExpanded ? 'arrow-up-circle' : 'arrow-down-circle'}
          size={18}
          color={Colors.white}
        />
      </View>
      {item.isExpanded && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.regular,
            color: Colors.white,
            marginTop: wp(3),
          }}
        >
          {item.answer}
        </Text>
      )}
    </TouchableOpacity>
  );
  const { ready } = useLanguage();

  // Translated static texts
  const Faqs = useTranslate(staticTexts.faqs);
  if (!ready) {
    return (
      <ImageBackground source={images.myallbackbg} style={{ flex: 1 }}>
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
            // backgroundColor: '#FAFAFA',
            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
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
            FAQs
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <View style={{ marginTop: wp(10) }}>
          <FlatList
            data={filteredFaqs}
            renderItem={renderFaqItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              paddingBottom: wp(5),
              flexGrow: 1,
            }}
          />
        </View>
        {/* <View
                      style={{
                        width: wp(90),
                        height: wp(35),
                        borderRadius: wp(3),
                        elevation: 2,
                        backgroundColor: '#F1F3F8',
                        alignSelf: 'center',
                        marginBottom: wp(3),
                        borderWidth: 0.5,
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
                        placeholder="Your questions here...."
                        placeholderTextColor={Colors.lightgrey}
                        value={question}
                        onChangeText={text => setQuestion(text)}
                      />
                      <TouchableOpacity style={{position:'absolute',bottom:wp(3),right:wp(3)}}>
                        <Ionicons name='send' size={18} color={Colors.lightgrey}/>
                      </TouchableOpacity>
                    </View> */}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Faqs;
