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
  FlatList,
} from 'react-native';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import SwitchToggle from 'react-native-switch-toggle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { OPEN_AI_KEY } from '../../Components/OpenAi_Key';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ChatBot = ({ navigation }) => {
  const apiKey = OPEN_AI_KEY;
  const [messages, setMessages] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const responseCache = useRef(new Map()).current;
  const conversationContext = useRef([]).current;
console.log("ai key",OPEN_AI_KEY);
  // Fetch initial questions on component mount
  useEffect(() => {
    // Add custom initial message
    setMessages([
      {
        type: 'bot',
        text: 'Hi, I am DevBot! I can help you with app development questions.',
      },
    ]);
    fetchInitialQuestions();
  }, []);

  const fetchInitialQuestions = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a knowledgeable chatbot specializing in app development (mobile and web). Generate a list of 3 concise, engaging questions related to app development to start a conversation. Return the questions in a JSON array format, e.g., ["question1", "question2", "question3"].',
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const questions = JSON.parse(
        response.data.choices[0].message.content.trim(),
      );
      setCurrentQuestions(
        questions.map((q, index) => ({ id: `initial-${index}`, question: q })),
      );
    } catch (error) {
      console.error(
        'Error fetching initial questions:',
        error.response?.data || error.message,
      );
      setErrorMessage('Failed to load initial questions. Please try again.');
      setCurrentQuestions([
        {
          id: 'fallback-1',
          question: 'What framework do you use for app development?',
        },
        { id: 'fallback-2', question: 'How do you test mobile apps?' },
        {
          id: 'fallback-3',
          question: 'What’s your approach to app performance?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOpenAIAnswer = async (question, retries = 3, delay = 5000) => {
    if (responseCache.has(question)) {
      console.log(`Cache hit for question: ${question}`);
      return responseCache.get(question);
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      console.log(`Fetching answer for: ${question}`);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                "You are a knowledgeable chatbot specializing in app development. Provide a concise, conversational answer (1-2 sentences) to the user's question, as if you were a developer sharing insights.",
            },
            ...conversationContext,
            { role: 'user', content: question },
          ],
          max_tokens: 50,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const answer = response.data.choices[0].message.content.trim();
      responseCache.set(question, answer);
      console.log(`Cached answer for: ${question}`);
      return answer;
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      if (error.response?.status === 429 && retries > 0) {
        console.log(
          `Rate limit hit, retrying in ${delay}ms... (${retries} retries left)`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchOpenAIAnswer(question, retries - 1, delay * 2);
      }
      const errorMsg =
        error.response?.status === 429
          ? 'Rate limit reached. Please wait a moment and try again.'
          : "Sorry, I couldn't fetch an answer right now. Try again!";
      setErrorMessage(errorMsg);
      responseCache.set(question, errorMsg);
      return errorMsg;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowUpQuestions = async (question, answer) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a knowledgeable chatbot specializing in app development. Based on the user\'s question and your answer, generate 2-3 concise follow-up questions related to app development to continue the conversation. Return the questions in a JSON array format, e.g., ["question1", "question2", "question3"].',
            },
            ...conversationContext,
            { role: 'user', content: question },
            { role: 'assistant', content: answer },
          ],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const questions = JSON.parse(
        response.data.choices[0].message.content.trim(),
      );
      return questions.map((q, index) => ({
        id: `followup-${Date.now()}-${index}`,
        question: q,
      }));
    } catch (error) {
      console.error(
        'Error fetching follow-up questions:',
        error.response?.data || error.message,
      );
      return [
        {
          id: 'fallback-1',
          question: 'Can you elaborate on your app development process?',
        },
        {
          id: 'fallback-2',
          question: 'What tools do you use for app testing?',
        },
      ];
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSelect = debounce(async questionId => {
    const selectedQuestion = currentQuestions.find(q => q.id === questionId);
    if (!selectedQuestion) return;

    // Add user's question to messages and context
    setMessages(prev => [
      ...prev,
      { type: 'user', text: selectedQuestion.question },
    ]);
    conversationContext.push({
      role: 'user',
      content: selectedQuestion.question,
    });

    // Fetch answer
    const answer = await fetchOpenAIAnswer(selectedQuestion.question);

    // Add bot's answer to messages and context
    setMessages(prev => [...prev, { type: 'bot', text: answer }]);
    conversationContext.push({ role: 'assistant', content: answer });

    // Fetch follow-up questions
    const followUpQuestions = await fetchFollowUpQuestions(
      selectedQuestion.question,
      answer,
    );
    setCurrentQuestions(followUpQuestions);
  }, 1000);

  const handleRetry = () => {
    if (currentQuestions.length > 0) {
      handleQuestionSelect(currentQuestions[0].id);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.type === 'bot' ? styles.botMessage : styles.userMessage}>
      <Text
        style={item.type === 'bot' ? styles.messageText : styles.messagebotText}
      >
        {item.text}
      </Text>
    </View>
  );

  const renderQuestion = ({ item }) => (
    <TouchableOpacity
      style={[styles.questionButton, isLoading && styles.disabledButton]}
      onPress={() => !isLoading && handleQuestionSelect(item.id)}
      disabled={isLoading}
    >
      <Text style={styles.questionText}>{item.question}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={images.mainbackground}
      style={{ flex: 1, paddingTop: 20 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <View
          style={{
            marginTop: wp(7),
            marginHorizontal: wp(5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: wp(15),
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={images.menuIcon}
              style={{ width: 28, height: 28, marginRight: wp(2) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              marginRight: wp(7),
            }}
          >
            DevBot
          </Text>
          <Text></Text>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, marginBottom: wp(75) }}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => index.toString()}
              style={styles.messageList}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading answer...</Text>
              </View>
            )}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <MainButton
                  title="Retry"
                  onPress={handleRetry}
                  style={{ marginTop: 10, width: wp(30) }}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View style={styles.questionContainer}>
          <FlatList
            data={currentQuestions}
            renderItem={renderQuestion}
            keyExtractor={item => item.id}
            style={styles.questionList}
          />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ChatBot;

// import {
//   View,
//   Text,
//   ImageBackground,
//   Image,
//   KeyboardAvoidingView,
//   StatusBar,
//   Platform,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { Colors, fonts, images, styles } from '../../Constant/Index';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import CalendarStrip from 'react-native-calendar-strip';
// import moment from 'moment';
// import { useSelector } from 'react-redux';
// import { AllGetAPI } from '../../Components/ApiRoot';
// const Home = ({ navigation }) => {
//   const user = useSelector(state => state.user.user);
//   const [mySerach, setMySearch] = useState('');
//   const [onchangeTab, setOnChangeTab] = useState('1');
//   const [selectedDate, setSelectedDate] = useState(moment());
//   const handleDateSelected = date => {
//     const daysToScroll = Math.floor(CalendarStrip.numberOfDays / 2);
//     const centeredDate = moment(date).subtract(daysToScroll, 'days');
//     setSelectedDate(centeredDate);
//   };
//   const [myTasks, setMyTasks] = useState([]);
//   const [myReminders, setMyReminders] = useState([]);
//   const [myNotes, setMyNotes] = useState([]);

//   const truncateToThreeWords = (text: string) => {
//     if (!text) return '';
//     const words = text.trim().split(/\s+/);
//     if (words.length <= 3) return text;
//     return `${words.slice(0, 3).join(' ')}…`;
//   };

//   const getAllTasks = () => {
//     AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
//       .then(res => {
//         setMyTasks(res.data);
//         // console.log('response of all tasks', JSON.stringify(res));
//       })
//       .catch(err => {
//         console.log('api error', err);
//       });
//   };
//   const getAllReminders = () => {
//     AllGetAPI({ url: 'view-all-reminder', Token: user?.api_token })
//       .then(res => {
//         setMyReminders(res.data);
//         // console.log('response of all reminders', JSON.stringify(res));
//       })
//       .catch(err => {
//         console.log('api error', err);
//       });
//   };
//   const getAllNotes = () => {
//     AllGetAPI({ url: 'view-all-note', Token: user?.api_token })
//       .then(res => {
//         setMyNotes(res.data);
//         console.log('response of all Notes', JSON.stringify(res));
//       })
//       .catch(err => {
//         console.log('api error', err);
//       });
//   };
//   useEffect(() => {
//     getAllTasks();
//     getAllReminders();
//     getAllNotes();
//   }, []);
//   const CustomDayComponent = ({ date, selected, style }) => {
//     const isSelected = selected;
//     const dayName = moment(date).format('ddd');
//     const dateNumber = moment(date).format('D');

//     return (
//       <View
//         style={[
//           style,
//           {
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: isSelected ? Colors.mainColor : 'white',
//             borderRadius: wp(3),
//             height: 118,
//             borderWidth: isSelected ? 0 : 0.5,
//             borderColor: isSelected ? undefined : '#E9F1FF',
//             elevation: isSelected ? 0 : 1,
//           },
//         ]}
//       >
//         <Text
//           style={
//             isSelected
//               ? {
//                   color: Colors.white,
//                   fontSize: wp(5.5),
//                   fontFamily: fonts.semibold,
//                 }
//               : {
//                   color: '#1E293B',
//                   fontSize: wp(4),
//                   fontFamily: fonts.semibold,
//                 }
//           }
//         >
//           {dateNumber}
//         </Text>
//         <Text
//           style={
//             isSelected
//               ? {
//                   color: 'white',
//                   fontSize: wp(3.5),
//                   fontFamily: fonts.regular,
//                   marginTop: wp(2),
//                 }
//               : {
//                   color: 'white',
//                   fontSize: wp(3.5),
//                   fontFamily: fonts.regular,
//                   marginTop: wp(2),
//                 }
//           }
//         >
//           {dayName}
//         </Text>
//       </View>
//     );
//   };

//   const CustomHeaderComponent = ({ date }) => {
//     return (
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           alignSelf: 'flex-start',
//           marginHorizontal: wp(5),
//         }}
//       >
//         <Image
//           source={images.homepic}
//           style={{
//             width: wp(15),
//             height: wp(15),
//             marginRight: wp(2),
//             tintColor: Colors.black,
//           }}
//           resizeMode="contain"
//         />
//         <Text
//           style={{
//             color: Colors.black,
//             fontSize: wp(4.5),
//             fontFamily: fonts.bold,
//           }}
//         >
//           {moment(date).format('MMMM, D YYYY')}
//         </Text>
//       </View>
//     );
//   };
//   return (
//     <ImageBackground
//       source={images.Homebackground}
//       style={{ flex: 1, paddingTop: 20 }}
//       resizeMode="cover"
//     >
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
//       >
//         <StatusBar
//           translucent
//           backgroundColor={'transparent'}
//           barStyle={'light-content'}
//         />
//         <View
//           style={{
//             marginTop: wp(5),
//             marginHorizontal: wp(5),
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <TouchableOpacity onPress={() => navigation.openDrawer()}>
//               <Image
//                 source={images.menuIcon}
//                 style={{ width: 28, height: 28, marginRight: wp(2) }}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <Image
//               source={images.avatarpic}
//               style={{ width: 34, height: 34, marginRight: wp(1) }}
//               resizeMode="contain"
//             />
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: fonts.bold,
//                 color: Colors.white,
//               }}
//             >
//               John Travolta
//             </Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <TouchableOpacity onPress={() => navigation.navigate('AddMembers')}>
//               <Image
//                 source={images.useraddIcon}
//                 style={{ width: 18, height: 18, marginRight: wp(2) }}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate('ChatAI')}>
//               <Image
//                 source={images.aiIcon}
//                 style={{ width: 18, height: 18, marginRight: wp(1) }}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View
//           style={{
//             width: wp(90),
//             height: wp(14),
//             backgroundColor: '#41AD88',
//             borderRadius: wp(2),
//             alignSelf: 'center',
//             justifyContent: 'center',
//             paddingHorizontal: wp(3),
//             marginTop: wp(3),
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginBottom: wp(10),
//           }}
//         >
//           <AntDesign name="search1" color={'white'} size={20} />
//           <TextInput
//             placeholder="Search here..."
//             placeholderTextColor={'white'}
//             value={mySerach}
//             onChangeText={text => setMySearch(text)}
//             style={{
//               color: 'white',
//               fontSize: 14,
//               fontFamily: fonts.medium,
//               width: wp(80),
//             }}
//           />
//         </View>
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginTop: wp(4),
//               marginHorizontal: wp(5),
//             }}
//           >
//             <TouchableOpacity onPress={() => setOnChangeTab('1')}>
//               <View
//                 //     onchangeTab === '1' ? Colors.buttoncolor : '#C6DEFB'
//                 //   }
//                 style={{
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   width: wp(29),
//                   height: 45,
//                   borderRadius: 10,
//                   backgroundColor:
//                     onchangeTab === '1' ? Colors.mainColor : '#ECF7F3',
//                   flexDirection: 'row',
//                 }}
//               >
//                 <Image
//                   source={images.tabIcon}
//                   tintColor={
//                     onchangeTab === '1' ? Colors.white : Colors.mainColor
//                   }
//                   resizeMode="contain"
//                   style={{ width: 15, height: 14, marginRight: wp(1) }}
//                 />
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontFamily: fonts.bold,
//                     color: onchangeTab === '1' ? Colors.white : Colors.black,
//                   }}
//                 >
//                   Today’s
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setOnChangeTab('2')}>
//               <View
//                 //   tintColor={
//                 //     onchangeTab === '2' ? Colors.buttoncolor : '#C6DEFB'
//                 //   }
//                 style={{
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   width: wp(29),
//                   height: 45,
//                   borderRadius: 10,
//                   flexDirection: 'row',
//                   backgroundColor:
//                     onchangeTab === '2' ? Colors.mainColor : '#ECF7F3',
//                 }}
//               >
//                 <Image
//                   source={images.tabIcon}
//                   tintColor={
//                     onchangeTab === '2' ? Colors.white : Colors.mainColor
//                   }
//                   resizeMode="contain"
//                   style={{ width: 15, height: 14, marginRight: wp(1) }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontFamily: fonts.bold,
//                     color: onchangeTab === '2' ? Colors.white : Colors.black,
//                   }}
//                 >
//                   Pending
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setOnChangeTab('3')}>
//               <View
//                 //   tintColor={
//                 //     onchangeTab === '2' ? Colors.buttoncolor : '#C6DEFB'
//                 //   }
//                 style={{
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   width: wp(29),
//                   height: 45,
//                   borderRadius: 10,
//                   flexDirection: 'row',
//                   backgroundColor:
//                     onchangeTab === '3' ? Colors.mainColor : '#ECF7F3',
//                 }}
//               >
//                 <Image
//                   source={images.tabIcon}
//                   tintColor={
//                     onchangeTab === '3' ? Colors.white : Colors.mainColor
//                   }
//                   resizeMode="contain"
//                   style={{ width: 15, height: 14, marginRight: wp(1) }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontFamily: fonts.bold,
//                     color: onchangeTab === '3' ? Colors.white : Colors.black,
//                   }}
//                 >
//                   Upcoming
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//           {onchangeTab === '1' ? (
//             <>
//               <View style={{ marginTop: wp(3) }}>
//                 {/* <CalendarStrip
//                   style={{ height: 180, paddingBottom: 10 }}
//                   calendarHeaderStyle={{
//                     alignSelf: 'flex-start',
//                     marginHorizontal: wp(5),
//                     color: Colors.black,
//                     fontSize: wp(4.5),
//                     fontFamily: fonts.bold,
//                   }}
//                   calendarHeaderFormat="MMMM, D YYYY"
//                   customDateHeader={CustomHeaderComponent} // Use custom header with image
//                   showArrows={false}
//                   dayComponentHeight={118}
//                   minDayComponentSize={wp(18)}
//                   selectedDate={selectedDate}
//                   onDateSelected={handleDateSelected}
//                   customDayComponent={CustomDayComponent}
//                   dateNameStyle={{
//                     color: 'black',
//                     fontSize: wp(3.5),
//                     fontFamily: fonts.regular,
//                   }}
//                   dateNumberStyle={{
//                     color: '#1E293B',
//                     fontSize: wp(4),
//                     fontFamily: fonts.semibold,
//                   }}
//                   highlightDateNumberStyle={{
//                     color: Colors.white,
//                     fontSize: wp(5.5),
//                     fontFamily: fonts.semibold,
//                   }}
//                   highlightDateNameStyle={{
//                     color: 'white',
//                     fontSize: wp(3.5),
//                     fontFamily: fonts.regular,
//                   }}
//                   highlightDateContainerStyle={{
//                     backgroundColor: Colors.mainColor,
//                     borderRadius: wp(3),
//                     height: 118,
//                   }}
//                   dayContainerStyle={{
//                     backgroundColor: 'white',
//                     borderWidth: 0.7,
//                     borderColor: '#E9F1FF',
//                     borderRadius: wp(3),
//                     // elevation: 0.3,
//                     marginBottom:wp(2)
//                   }}
//                   scrollToOnSetSelectedDate={true}
//                   scrollable
//                   iconStyle={{
//                     display: 'none',
//                   }}
//                   startingDate={moment().subtract(
//                     CalendarStrip.numberOfDays / 2,
//                     'days',
//                   )}
//                 /> */}

//                 <FlatList
//                   data={myTasks}
//                   keyExtractor={item => item.id.toString()}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('TaskDetails', { data: item })
//                       }
//                       style={[
//                         styles.flatView,
//                         {
//                           backgroundColor:
//                             item.priority == 'High Priority'
//                               ? '#FCCABD'
//                               : item.priority == 'Medium Priority'
//                               ? '#C5DBFC'
//                               : '#DDBDE5',
//                         },
//                       ]}
//                     >
//                       <View
//                         style={{
//                           flexDirection: 'row',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <Text
//                           style={{
//                             fontSize: 14,
//                             fontFamily: fonts.bold,
//                             color: Colors.black,
//                           }}
//                         >
//                           {item.title}
//                         </Text>

//                         <View
//                           style={{
//                             // width: wp(25),
//                             paddingVertical: wp(1),
//                             borderRadius: wp(3),
//                             paddingHorizontal: wp(2),
//                             backgroundColor:
//                               item?.priority == 'High Priority'
//                                 ? '#F95555'
//                                 : item?.priority == 'Medium Priority'
//                                 ? 'blue'
//                                 : Colors.mainColor,
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <Image
//                             source={images.flag}
//                             resizeMode="contain"
//                             style={{
//                               width: wp(4),
//                               height: wp(4),
//                               marginRight: wp(1),
//                             }}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 8,
//                               fontFamily: fonts.bold,
//                               color: Colors.white,
//                             }}
//                           >
//                             {item?.priority == 'High Priority'
//                               ? 'High'
//                               : item?.priority == 'Medium Priority'
//                               ? 'Medium'
//                               : 'Low'}
//                           </Text>
//                         </View>
//                       </View>
//                       <View style={{ marginTop: wp(1) }}>
//                         <Text
//                           style={{ fontSize: 12, fontFamily: fonts.medium }}
//                           numberOfLines={1}
//                         >
//                           {item.description}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                 />
//                 <FlatList
//                   data={myNotes}
//                   keyExtractor={item => item.id.toString()}
//                   renderItem={({ item }) => (
//                     <>
//                       <View
//                         style={{
//                           width: wp(90),
//                           height: wp(0.3),
//                           backgroundColor: '#D7D7D7',
//                           alignSelf: 'center',
//                           marginTop: wp(4),
//                         }}
//                       ></View>
//                       <View style={{ marginTop: wp(3) }}>
//                         <Text
//                           style={{
//                             fontSize: 16,
//                             fontFamily: fonts.bold,
//                             color: Colors.black,
//                             paddingHorizontal: wp(5),
//                           }}
//                         >
//                           Notes
//                         </Text>
//                         <View
//                           style={{
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             paddingHorizontal: wp(5),
//                           }}
//                         >
//                           <View
//                             style={{
//                               flexDirection: 'row',
//                               alignItems: 'center',
//                             }}
//                           >
//                             <View
//                               style={{
//                                 borderWidth: 1,
//                                 borderColor: Colors.black,
//                                 borderRadius: wp(1),
//                                 width: 16,
//                                 height: 18,
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 marginRight: wp(4),
//                               }}
//                             >
//                               <Feather
//                                 name="hash"
//                                 color={Colors.black}
//                                 size={12}
//                               />
//                             </View>
//                             <Text
//                               style={{
//                                 fontSize: 18,
//                                 fontFamily: fonts.medium,
//                                 color: '#616161',
//                               }}
//                             >
//                               {truncateToThreeWords(item.description)}
//                             </Text>
//                           </View>
//                           <AntDesign
//                             name="right"
//                             size={16}
//                             color={Colors.black}
//                           />
//                         </View>
//                       </View>
//                       <View
//                         style={{
//                           width: wp(90),
//                           height: wp(0.3),
//                           backgroundColor: '#D7D7D7',
//                           alignSelf: 'center',
//                           marginTop: wp(4),
//                         }}
//                       ></View>
//                     </>
//                   )}
//                 />
//                 <View style={{ marginTop: wp(4) }}>
//                   <Text
//                     style={{
//                       fontSize: 16,
//                       fontFamily: fonts.bold,
//                       color: Colors.black,
//                       paddingHorizontal: wp(5),
//                     }}
//                   >
//                     Reminders
//                   </Text>
//                   <FlatList
//                     data={myReminders}
//                     keyExtractor={item => item.id.toString()}
//                     renderItem={({ item }) => (
//                       <View style={styles.flatView}>
//                         <View
//                           style={{
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontSize: 14,
//                               fontFamily: fonts.bold,
//                               color: Colors.black,
//                             }}
//                           >
//                             {item.title}
//                           </Text>
//                           <View
//                             style={{
//                               flexDirection: 'row',
//                               alignItems: 'center',
//                             }}
//                           >
//                             <Image
//                               source={images.calendarIcon}
//                               resizeMode="contain"
//                               style={{
//                                 width: wp(4.5),
//                                 height: wp(4.5),
//                                 marginRight: wp(1),
//                               }}
//                             />
//                             <Text
//                               style={{
//                                 fontSize: 12,
//                                 fontFamily: fonts.medium,
//                                 color: Colors.black,
//                               }}
//                             >
//                               {item.date}
//                             </Text>
//                           </View>
//                         </View>
//                         <View
//                           style={{
//                             width: wp(38),
//                             paddingVertical: wp(1),
//                             borderRadius: wp(3),
//                             paddingHorizontal: wp(2),
//                             backgroundColor: '#ECF7F3',
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             marginTop: wp(3),
//                           }}
//                         >
//                           <Image
//                             source={images.clockIcon}
//                             resizeMode="contain"
//                             style={{
//                               width: wp(4),
//                               height: wp(4),
//                               marginRight: wp(1),
//                             }}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 10,
//                               fontFamily: fonts.bold,
//                               color: Colors.black,
//                             }}
//                           >
//                             {item.start_time} - {item.end_time}
//                           </Text>
//                         </View>
//                       </View>
//                     )}
//                   />
//                 </View>
//                 <View style={{ marginBottom: wp(30) }}>
//                   <Text
//                     style={{
//                       fontSize: 16,
//                       fontFamily: fonts.bold,
//                       color: Colors.black,
//                       paddingHorizontal: wp(5),
//                     }}
//                   >
//                     Search for more
//                   </Text>
//                   <View
//                     style={{
//                       backgroundColor: '#ECF7F3',
//                       width: wp(90),
//                       alignSelf: 'center',
//                       paddingHorizontal: wp(3),
//                       paddingVertical: wp(3),
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       flexDirection: 'row',
//                       borderRadius: wp(3),
//                       marginTop: wp(2),
//                     }}
//                   >
//                     <View>
//                       <Text
//                         style={{
//                           fontSize: 14,
//                           fontFamily: fonts.medium,
//                           color: Colors.black,
//                         }}
//                       >
//                         Invite Users
//                       </Text>
//                       <Text
//                         style={{
//                           fontSize: 12,
//                           fontFamily: fonts.medium,
//                           color: Colors.black,
//                         }}
//                       >
//                         Invite your teammates together
//                       </Text>
//                     </View>
//                     <Image
//                       source={images.inviteuser}
//                       resizeMode="contain"
//                       style={{ width: 41, height: 41 }}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </>
//           ) : onchangeTab === '2' ? (
//             <>
//               <View style={{ marginTop: wp(3) }}>
//                 <CalendarStrip
//                   style={{ height: 180, paddingBottom: 10 }}
//                   calendarHeaderStyle={{
//                     alignSelf: 'flex-start',
//                     marginHorizontal: wp(5),
//                     color: Colors.black,
//                     fontSize: wp(4.5),
//                     fontFamily: fonts.bold,
//                   }}
//                   // calendarHeaderFormat="MMMM, D YYYY"
//                   customDateHeader={CustomHeaderComponent} // Use custom header with image
//                   showArrows={false}
//                   dayComponentHeight={118}
//                   minDayComponentSize={wp(18)}
//                   selectedDate={selectedDate}
//                   onDateSelected={handleDateSelected}
//                   customDayComponent={CustomDayComponent}
//                   dateNameStyle={{
//                     color: 'black',
//                     fontSize: wp(3.5),
//                     fontFamily: fonts.regular,
//                   }}
//                   dateNumberStyle={{
//                     color: '#1E293B',
//                     fontSize: wp(4),
//                     fontFamily: fonts.semibold,
//                   }}
//                   highlightDateNumberStyle={{
//                     color: Colors.white,
//                     fontSize: wp(5.5),
//                     fontFamily: fonts.semibold,
//                   }}
//                   highlightDateNameStyle={{
//                     color: 'white',
//                     fontSize: wp(3.5),
//                     fontFamily: fonts.regular,
//                   }}
//                   highlightDateContainerStyle={{
//                     backgroundColor: Colors.mainColor,
//                     borderRadius: wp(3),
//                     height: 118,
//                   }}
//                   dayContainerStyle={{
//                     backgroundColor: 'white',
//                     borderWidth: 0.7,
//                     borderColor: '#E9F1FF',
//                     borderRadius: wp(3),
//                     // elevation: 0.3,
//                     marginBottom: wp(2),
//                   }}
//                   scrollToOnSetSelectedDate={true}
//                   scrollable
//                   iconStyle={{
//                     display: 'none',
//                   }}
//                   startingDate={moment().subtract(
//                     CalendarStrip.numberOfDays / 2,
//                     'days',
//                   )}
//                 />

//                 <FlatList
//                   data={myTasks}
//                   keyExtractor={item => item.id.toString()}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('TaskDetails', { data: item })
//                       }
//                       style={[
//                         styles.flatView,
//                         {
//                           backgroundColor:
//                             item.priority == 'High Priority'
//                               ? '#FCCABD'
//                               : item.priority == 'Medium Priority'
//                               ? '#C5DBFC'
//                               : '#DDBDE5',
//                         },
//                       ]}
//                     >
//                       <View
//                         style={{
//                           flexDirection: 'row',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <Text
//                           style={{
//                             fontSize: 14,
//                             fontFamily: fonts.bold,
//                             color: Colors.black,
//                           }}
//                         >
//                           {item.title}
//                         </Text>

//                         <View
//                           style={{
//                             // width: wp(25),
//                             paddingVertical: wp(1),
//                             borderRadius: wp(3),
//                             paddingHorizontal: wp(2),
//                             backgroundColor:
//                               item?.priority == 'High Priority'
//                                 ? '#F95555'
//                                 : item?.priority == 'Medium Priority'
//                                 ? 'blue'
//                                 : Colors.mainColor,
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <Image
//                             source={images.flag}
//                             resizeMode="contain"
//                             style={{
//                               width: wp(4),
//                               height: wp(4),
//                               marginRight: wp(1),
//                             }}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 8,
//                               fontFamily: fonts.bold,
//                               color: Colors.white,
//                             }}
//                           >
//                             {item.priority}
//                           </Text>
//                         </View>
//                       </View>
//                       <View style={{ marginTop: wp(1) }}>
//                         <Text
//                           style={{ fontSize: 12, fontFamily: fonts.medium }}
//                         >
//                           {item.description}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                 />

//                 <View style={{ marginTop: wp(4), marginBottom: wp(23) }}>
//                   <Text
//                     style={{
//                       fontSize: 16,
//                       fontFamily: fonts.bold,
//                       color: Colors.black,
//                       paddingHorizontal: wp(5),
//                     }}
//                   >
//                     Reminders
//                   </Text>
//                   <FlatList
//                     data={myReminders}
//                     keyExtractor={item => item.id.toString()}
//                     renderItem={({ item }) => (
//                       <View style={styles.flatView}>
//                         <View
//                           style={{
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontSize: 14,
//                               fontFamily: fonts.bold,
//                               color: Colors.black,
//                             }}
//                           >
//                             {item.title}
//                           </Text>
//                           <View
//                             style={{
//                               flexDirection: 'row',
//                               alignItems: 'center',
//                             }}
//                           >
//                             <Image
//                               source={images.calendarIcon}
//                               resizeMode="contain"
//                               style={{
//                                 width: wp(4.5),
//                                 height: wp(4.5),
//                                 marginRight: wp(1),
//                               }}
//                             />
//                             <Text
//                               style={{
//                                 fontSize: 12,
//                                 fontFamily: fonts.medium,
//                                 color: Colors.black,
//                               }}
//                             >
//                               {item.date}
//                             </Text>
//                           </View>
//                         </View>
//                         <View
//                           style={{
//                             width: wp(38),
//                             paddingVertical: wp(1),
//                             borderRadius: wp(3),
//                             paddingHorizontal: wp(2),
//                             backgroundColor: '#ECF7F3',
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             marginTop: wp(3),
//                           }}
//                         >
//                           <Image
//                             source={images.clockIcon}
//                             resizeMode="contain"
//                             style={{
//                               width: wp(4),
//                               height: wp(4),
//                               marginRight: wp(1),
//                             }}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 10,
//                               fontFamily: fonts.bold,
//                               color: Colors.black,
//                             }}
//                           >
//                             {item?.start_time} - {item?.end_time}
//                           </Text>
//                         </View>
//                       </View>
//                     )}
//                   />
//                 </View>
//               </View>
//             </>
//           ) : (
//             <>
//               <View style={{ marginTop: wp(3) }}>
//                 <CalendarStrip
//                   style={{ height: 180, paddingBottom: 10 }}
//                   calendarHeaderStyle={{
//                     alignSelf: 'flex-start',
//                     marginHorizontal: wp(5),
//                     color: Colors.black,
//                     fontSize: wp(4.5),
//                     fontFamily: fonts.bold,
//                   }}
//                   // calendarHeaderFormat="MMMM, D YYYY"
//                   customDateHeader={CustomHeaderComponent} // Use custom header with image
//                   showArrows={false}
//                   dayComponentHeight={118}
//                   minDayComponentSize={wp(18)}
//                   selectedDate={selectedDate}
//                   onDateSelected={handleDateSelected}
//                   customDayComponent={CustomDayComponent}
//                   dateNameStyle={{
//                     color: 'black',
//                     fontSize: wp(3.5),
//                     fontFamily: fonts.regular,
//                   }}
//                   dateNumberStyle={{
//                     color: '#1E293B',
//                     fontSize: wp(4),
//                     fontFamily: fonts.semibold,
//                   }}
//                   highlightDateNumberStyle={{
//                     color: Colors.white,
//                     fontSize: wp(5.5),
//                     fontFamily: fonts.semibold,
//                   }}
//                   highlightDateNameStyle={{
//                     color: 'white',
//                     fontSize: wp(3.5),
//                     fontFamily: fonts.regular,
//                   }}
//                   highlightDateContainerStyle={{
//                     backgroundColor: Colors.mainColor,
//                     borderRadius: wp(3),
//                     height: 118,
//                   }}
//                   dayContainerStyle={{
//                     backgroundColor: 'white',
//                     borderWidth: 0.7,
//                     borderColor: '#E9F1FF',
//                     borderRadius: wp(3),
//                     // elevation: 0.3,
//                     marginBottom: wp(2),
//                   }}
//                   scrollToOnSetSelectedDate={true}
//                   scrollable
//                   iconStyle={{
//                     display: 'none',
//                   }}
//                   startingDate={moment().subtract(
//                     CalendarStrip.numberOfDays / 2,
//                     'days',
//                   )}
//                 />

//                 <FlatList
//                   data={myTasks}
//                   keyExtractor={item => item.id.toString()}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('TaskDetails', { data: item })
//                       }
//                       style={[
//                         styles.flatView,
//                         {
//                           backgroundColor:
//                             item.priority == 'High Priority'
//                               ? '#FCCABD'
//                               : item.priority == 'Medium Priority'
//                               ? '#C5DBFC'
//                               : '#DDBDE5',
//                         },
//                       ]}
//                     >
//                       <View
//                         style={{
//                           flexDirection: 'row',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <Text
//                           style={{
//                             fontSize: 14,
//                             fontFamily: fonts.bold,
//                             color: Colors.black,
//                           }}
//                         >
//                           {item.title}
//                         </Text>

//                         <View
//                           style={{
//                             // width: wp(25),
//                             paddingVertical: wp(1),
//                             borderRadius: wp(3),
//                             paddingHorizontal: wp(2),
//                             backgroundColor:
//                               item?.priority == 'High Priority'
//                                 ? '#F95555'
//                                 : item?.priority == 'Medium Priority'
//                                 ? 'blue'
//                                 : Colors.mainColor,
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <Image
//                             source={images.flag}
//                             resizeMode="contain"
//                             style={{
//                               width: wp(4),
//                               height: wp(4),
//                               marginRight: wp(1),
//                             }}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 8,
//                               fontFamily: fonts.bold,
//                               color: Colors.white,
//                             }}
//                           >
//                             {item.priority}
//                           </Text>
//                         </View>
//                       </View>
//                       <View style={{ marginTop: wp(1) }}>
//                         <Text
//                           style={{ fontSize: 12, fontFamily: fonts.medium }}
//                         >
//                           {item.description}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                 />

//                 <View style={{ marginTop: wp(4), marginBottom: wp(23) }}>
//                   <Text
//                     style={{
//                       fontSize: 16,
//                       fontFamily: fonts.bold,
//                       color: Colors.black,
//                       paddingHorizontal: wp(5),
//                     }}
//                   >
//                     Reminders
//                   </Text>
//                   <FlatList
//                     data={myReminders}
//                     keyExtractor={item => item.id.toString()}
//                     renderItem={({ item }) => (
//                       <View style={styles.flatView}>
//                         <View
//                           style={{
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontSize: 14,
//                               fontFamily: fonts.bold,
//                               color: Colors.black,
//                             }}
//                           >
//                             {item?.title}
//                           </Text>
//                           <View
//                             style={{
//                               flexDirection: 'row',
//                               alignItems: 'center',
//                             }}
//                           >
//                             <Image
//                               source={images.calendarIcon}
//                               resizeMode="contain"
//                               style={{
//                                 width: wp(4.5),
//                                 height: wp(4.5),
//                                 marginRight: wp(1),
//                               }}
//                             />
//                             <Text
//                               style={{
//                                 fontSize: 12,
//                                 fontFamily: fonts.medium,
//                                 color: Colors.black,
//                               }}
//                             >
//                               {item?.date}
//                             </Text>
//                           </View>
//                         </View>
//                         <View
//                           style={{
//                             width: wp(38),
//                             paddingVertical: wp(1),
//                             borderRadius: wp(3),
//                             paddingHorizontal: wp(2),
//                             backgroundColor: '#ECF7F3',
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             marginTop: wp(3),
//                           }}
//                         >
//                           <Image
//                             source={images.clockIcon}
//                             resizeMode="contain"
//                             style={{
//                               width: wp(4),
//                               height: wp(4),
//                               marginRight: wp(1),
//                             }}
//                           />
//                           <Text
//                             style={{
//                               fontSize: 10,
//                               fontFamily: fonts.bold,
//                               color: Colors.black,
//                             }}
//                           >
//                             {item?.start_time} - {item?.end_time}
//                           </Text>
//                         </View>
//                       </View>
//                     )}
//                   />
//                 </View>
//               </View>
//             </>
//           )}
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </ImageBackground>
//   );
// };

// export default Home;
