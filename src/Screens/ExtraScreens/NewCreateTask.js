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
    Dimensions,
    Linking,
  } from 'react-native';
  import React, { useCallback, useEffect, useMemo, useState } from 'react';
  import { Colors, fonts, images, styles } from '../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import messaging from '@react-native-firebase/messaging';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import Feather from 'react-native-vector-icons/Feather';
  import CalendarStrip from 'react-native-calendar-strip';
  import moment from 'moment';
  import { useDispatch, useSelector } from 'react-redux';
  import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
  import { useFocusEffect } from '@react-navigation/native';
  import { setup } from '../Notifee';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';
  import { setUser } from '../../Redux/Auth';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AheadChallengeModal from '../../Components/AheadChallengeModal';
  const Home = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const [usersuspened, setuserSuspended] = useState(false);
    const [mySearch, setMySearch] = useState('');
    const [onchangeTab, setOnChangeTab] = useState('2');
    const [modalAddNotes, setModalAddNotes] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showAheadChallenge, setShowAheadChallenge] = useState(false);
  
    const handleEmailPress = () => {
      Linking.openURL(
        'mailto:saaday7@gmail.com?subject=Account Suspended – Assistance Needed&body=Hi Support Team, I noticed that my account has been suspended.Kindly guide me regarding the issue and what steps I need to take to reactivate my account.Thank you!',
      );
    };
    const [selectedDate, setSelectedDate] = useState(moment());
    const today = moment();
  
    const [myTasks, setMyTasks] = useState([]);
    const [myReminders, setMyReminders] = useState([]);
    const [myNotes, setMyNotes] = useState([]);
    const [mySubscription, setmySubscription] = useState(0);
    console.log('my sub',mySubscription)
    const searchQuery = mySearch.toLowerCase().trim();
  
  
  
    const [visible, setVisible] = useState(true);
    console.log('mmmmm',visible)
    const [showOracle, setShowOracle] = useState(false);
    const [timeImage, setTimeImage] = useState(null);
    const [colorTime,setTime] = useState("");
    const [showExtra,setShowExtra] = useState(false);
    const [oracleCard, setOracleCard] = useState(null);
    const data = [
      { id:1,
        Oracle:"Today doesn’t ask you to rush or force outcomes. What is meant for you is already aligning, even if you can’t see it yet. Trust the pace of the day.",
        Expand:"This card appears when urgency or pressure is influencing your mindset. Angelic guidance reminds you that alignment happens through cooperation, not control. When you allow things to unfold naturally, clarity and ease follow.",
      image:require("../../Assets/Group 1272628560.jpg"),
      },
      { id:2,
        Oracle:"You are not doing this alone, even if it feels quiet right now. Support surrounds you in visible and invisible ways. Allow yourself to lean into it.",
        Expand:"Angel oracle traditions often emphasize unseen support as reassurance. This card invites you to notice where help, encouragement, or ease is already present. You don’t have to carry everything by yourself today.",
      image:require("../../Assets/Group 1272628561.jpg"),
      },
       {id:3, Oracle:"You don’t need to start today at full speed. Gentle beginnings create steadier momentum. Ease can be a strength.",
  Expand:"This message aligns with angelic guidance around self-compassion and balance. Moving gently helps you conserve energy and stay present. Today favors pacing over pushing.",
  image:require("../../Assets/Group 1272628562.jpg"),
      },
       {id:4, Oracle:"You don’t need all the answers before the day begins. Some understanding arrives through experience. Let clarity meet you naturally.",
  Expand:"This card reassures you that uncertainty is not a failure. Angel guidance reminds you that insight unfolds in stages. Trust that today will reveal what you need, when you need it.",
  image:require("../../Assets/Group 1272628564.jpg"),
      },
      {id:5, Oracle:"Come back to the present moment. Stability is available when you slow down and notice what’s real. You are here.",
  Expand:"Grounding is a core angelic theme for emotional steadiness. This card suggests reconnecting with your body and breath. From grounded awareness, better choices follow.",
  image:require("../../Assets/Group 1272628564.jpg"),
      },
      {id:6, Oracle:"Your words will shape the tone of your day. Choose honesty guided by compassion. Begin with kindness toward yourself.",
  Expand:"Angel guidance often centers communication as a healing tool. This card reminds you that words carry energy. Gentle truth creates safety and connection.",
  image:require("../../Assets/Group 1272628565.jpg"),
      },
      {id:7, Oracle:"Not everything today needs your management. Some things respond better to trust than effort. Letting go can create ease.",
  Expand:"This card reflects angel teachings around surrender. Control often comes from fear, while trust opens flow. Notice where effort is unnecessary and allow space for support.",
  image:require("../../Assets/Group 1272628585.jpg"),
      },
      {id:8, Oracle:"Your energy is valuable and limited. You are allowed to choose where it goes. Boundaries today are an act of wisdom.",
  Expand:"Protection is a frequent angel oracle theme. This card encourages discernment around people, tasks, and emotions. Preserving energy supports clarity and balance.",
  image:require("../../Assets/Group 1272628566.jpg"),
      },
      {id:9, Oracle:"You don’t need to prove your worth today. Your value is not tied to productivity or perfection. Showing up honestly is enough.",
  Expand:"Angel guidance often reassures worthiness. This card gently counters self-judgment and pressure. Resting in enoughness brings peace and confidence.",
  image:require("../../Assets/Group 1272628584.jpg"),
      },
      {id:10, Oracle:"Goodness is available to you today. You don’t need to deflect or brace against it. Allow yourself to receive.",
  Expand:"Angel cards frequently remind us that receiving is as important as giving. This message invites openness to ease, kindness, and small moments of joy. Let the day be lighter than expected.",
  image:require("../../Assets/Group 1272628567.jpg"),
      },
   
      {id:11, Oracle:"You don’t need the whole path, just the next step. Progress happens through small, aligned actions. Begin where you are.",
  Expand:"Angel guidance often emphasizes forward motion without overwhelm. This card reassures you that clarity grows with movement. One step is enough for today.",
  image:require("../../Assets/Group 1272628568.jpg"),
      },
  {id:12, Oracle:"What you feel today matters. Emotions are signals, not obstacles. Allow them space.",
  Expand:"This card reflects angel teachings around emotional awareness. When feelings are acknowledged, they soften. Listening inward creates clarity and balance.",
  image:require("../../Assets/Group 1272628569.jpg"),
      },
      {id:13, Oracle:"Something helpful may arrive in an unexpected way. Openness creates opportunity.Release rigid expectations.",
  Expand:"Angel oracle themes often highlight openness as a doorway to guidance. This card encourages flexibility and curiosity. What you need may arrive differently than planned.",
  image:require("../../Assets/Group 1272628570.jpg"),
      },
       {id:14, Oracle:"Slowing down supports progress. Rest restores clarity and energy. You’re allowed to pause.",
  Expand:"This card counters the belief that constant effort is required. Angel guidance reminds you that rest strengthens insight and resilience. Pausing today benefits what comes next.",
  image:require("../../Assets/Group 1272628571.jpg"),
      },
      {id:15, Oracle:"Let your actions reflect what truly matters to you. Alignment brings peace, even when it’s uncomfortable. Choose honesty.",
  Expand:"Angel cards often emphasize integrity as inner alignment. Acting from values creates steadiness and self-trust. Today favors choices that feel true.",
  image:require("../../Assets/Group 1272628572.jpg"),
      },
       {id:16, Oracle:"You already know more than you think. Your intuition is quiet but reliable. Listen inward.",
  Expand:"Angel guidance frequently affirms inner wisdom. This card encourages confidence in your own insight. Trust grows when you act on what feels right.",
  image:require("../../Assets/Group 1272628573.jpg"),
      },
  {id:17, Oracle:"This moment is enough. Presence improves everything that follows. Come fully here.",
  Expand:"Angel teachings often emphasize presence as grounding and clarifying. When attention returns to now, stress softens. Today benefits from mindful awareness.",
  image:require("../../Assets/Group 1272628574.jpg"),
      },
       {id:18, Oracle:"Complexity is optional today. Simplicity brings clarity and ease. Focus on what matters most.",
  Expand:"This card reflects angel guidance around reducing mental noise. When you simplify, energy returns. Let go of unnecessary effort.",
  image:require("../../Assets/Group 1272628575.jpg"),
      },
      {id:19, Oracle:"You are being nudged in the right direction. Guidance may appear subtly. Pay attention.",
  Expand:"Angel oracle traditions often describe guidance as intuitive signals. This card invites awareness of signs, instincts, and gentle confirmations. Trust what you notice.",
  image:require("../../Assets/Group 1272628576.jpg"),
      },
      {id:20, Oracle:"Gratitude changes how you experience the day. Appreciation softens perspective. Begin with thanks.",
  Expand:"Angel cards frequently highlight gratitude as a grounding practice. What you acknowledge grows in importance. Gratitude brings steadiness and calm.",
  image:require("../../Assets/Group 1272628577.jpg"),
      },
      {id:21, Oracle:"One conscious breath can shift everything. Pause before reacting. Calm creates clarity.",
  Expand:"Angel guidance often encourages breath as a reset. This card reminds you to slow the nervous system before responding. Presence begins with breath.",
  image:require("../../Assets/Group 1272628578.jpg"),
      },
       {id:22, Oracle:"Peace is available, even in challenge. You can choose calm over conflict. Let peace guide your responses.",
  Expand:"This card reflects angelic reassurance around emotional choice. Not every situation requires defense. Peace conserves energy and clarity.",
  image:require("../../Assets/Group 1272628579.jpg"),
      },
      {id:23, Oracle:"Growth is happening, even when it feels messy. Learning often looks imperfect. Be patient with yourself.",
  Expand:"Angel oracle themes frequently normalize growth through experience. This card reframes mistakes as part of expansion. Compassion accelerates learning.",
  image:require("../../Assets/Group 1272628580.jpg"),
      },
      {id:24, Oracle:"Something is shifting for your benefit. Change clears space for alignment. Trust the movement.",
  Expand:"Angel guidance often frames change as preparation. This card encourages openness rather than resistance. What’s shifting supports growth.",
  image:require("../../Assets/Group 1272628581.jpg"),
      },
      {id:25, Oracle:"Guidance speaks softly. Answers may arrive through subtle feelings or quiet moments. Slow down enough to hear.",
  Expand:"Angel oracle traditions emphasize listening over forcing. This card invites attunement to intuition and subtle cues. Stillness reveals direction.",
  image:require("../../Assets/Group 1272628582.jpg"),
      },
    ]
    
  
  
  
    // console.log("random",oracleCard?.id)
    // const isDarkMode = useColorScheme() === 'dark';
  // useEffect(() => {
  //     checkModalStatus();
  //     setShowAheadChallenge(mySubscription===0 ? true : false);
  //   }, [mySubscription]);
  useEffect(() => {
    const init = async () => {
      const canShow = await checkModalStatus(); // return true/false
      
      if (canShow && mySubscription === 0) {
        setShowAheadChallenge(true);
      } else {
        setShowAheadChallenge(false);
      }
    };
  
    init();
  }, [mySubscription]);
  
    //  const checkModalStatus = async () => {
    //   const lastShown = await AsyncStorage.getItem('modalLastShown');
    //   const today = new Date().toDateString();
   
    //   if (lastShown !== today) {
    //     const randomIndex = Math.floor(Math.random() * data.length);
    //      setOracleCard(data[randomIndex]);
    //     setVisible(true);
    //     checkTime();
   
    //     const timer = setTimeout(() => {
    //       setShowOracle(true);
    //       AsyncStorage.setItem('modalLastShown', today); // save the date
    //     }, 2000);
   
    //     return () => clearTimeout(timer);
    //   }
    // };
    const checkModalStatus = async () => {
      try {
        const lastShown = await AsyncStorage.getItem('modalLastShown');
        const today = new Date().toDateString(); // "Mon Dec 22 2025"
    
        if (lastShown !== today) {
          // Pick random card
          const randomIndex = Math.floor(Math.random() * data.length);
          setOracleCard(data[randomIndex]);
          checkTime();
    
          // Immediately mark as shown for today
          await AsyncStorage.setItem('modalLastShown', today);
    
          // Show greeting screen first
          setVisible(true);
    
          // After 2 seconds, show oracle card
          const timer = setTimeout(() => {
            setShowOracle(true);
          }, 2000);
    
          // Cleanup timer if component unmounts
          return () => clearTimeout(timer);
        } else {
          // Optional: if already shown today, ensure modal is hidden
          setVisible(false);
        }
      } catch (error) {
        console.log('Error checking modal status:', error);
        // Optionally still show modal on error (or not)
      }
    };
    const checkTime = () => {
      const hour = new Date().getHours();
   
      if (hour >= 5 && hour < 12) {
        setTimeImage(require('../../Assets/screen 1.png'));
        setTime("Morning");
      } else if (hour >= 12 && hour < 17) {
        setTimeImage(require('../../Assets/screen 2.png'));
         setTime("Noon");
      } else {
        setTimeImage(require('../../Assets/screen 3.png'));
         setTime("Night");
      }
    };
  
  
  
  
    const truncateToThreeWords = (text = '') => {
      const words = text.trim().split(/\s+/);
      return words.length <= 3 ? text : `${words.slice(0, 3).join(' ')}…`;
    };
  
    useEffect(() => {
      setup();
      // Platform.OS=="ios"?getToken():null;
    }, []);
  
    const getAllTasks = () => {
      AllGetAPI({ url: 'view-all-task', Token: user?.api_token })
        .then(res => setMyTasks(res.data || []))
        .catch(err => console.log('api error tasks', err));
    };
  
    const getAllReminders = () => {
      AllGetAPI({ url: 'view-all-reminder', Token: user?.api_token })
        .then(res => setMyReminders(res.data || []))
        .catch(err => console.log('api error reminders', err));
    };
  
    const getAllNotes = () => {
      AllGetAPI({ url: 'view-all-note', Token: user?.api_token })
        .then(res => setMyNotes(res.data || []))
        .catch(err => console.log('api error notes', err));
    };
  
    const CheckSubscription = () => {
      AllGetAPI({ url: 'check-subscription', Token: user?.api_token })
        .then(res => {
          console.log('check subscription', JSON.stringify(res));
          setmySubscription(res.subscription);
          // setMyNotes(res.data || [])
        })
        .catch(err => console.log('api error notes', err));
    };
  
    const getToken = async () => {
  
      let fcmToken = await messaging().getToken();
      console.log("i called onn setup", fcmToken)
      const formData = new FormData();
      formData.append('fcm_token', fcmToken);
      PostAPiwithToken({ url: 'update-fcm', Token: user?.api_token }, formData)
        .then(res => {
          console.log('FCM token update----- runner', JSON.stringify(res));
          if (res.suspend === 1) {
            console.log('FCM token update----- runner', res);
            setuserSuspended(true);
          } else {
            // setuserSuspended(true);
          }
        })
        .catch(err => console.log('error in update', err));
  
      messaging().onTokenRefresh(token => {
        const formData = new FormData();
        formData.append('fcm_token', token);
        PostAPiwithToken(
          { url: 'update-fcm', Token: user?.api_token },
          formData,
        ).catch(() => { });
      });
    }; 
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        console.log("avigwation done ");
        getToken();
        // The screen is focused
        // Call any action
      });
  
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, [navigation]);
    useFocusEffect(
      useCallback(() => {
        getAllTasks();
        getAllReminders();
        CheckSubscription();
        getAllNotes();
        getToken();
        setSelectedDate(moment());
        setMySearch(''); // Optional: clear search on screen focus
      }, []),
    );
  
    const handleDateSelected = date => {
      setSelectedDate(moment(date));
    };
  
    const handleTabChange = tab => {
      setOnChangeTab(tab);
      setMySearch(''); // Clear search when changing tabs
    };
  
    const screenHeight = Dimensions.get('window').height;
  
    // Filter tasks by date & tab
    const filteredTasks = useMemo(() => {
      if (onchangeTab === '2') {
        return myTasks.filter(task => {
          const taskDate = moment(task.start_datetime, 'YYYY-MM-DD hh:mm A');
          return taskDate.isSame(today, 'day');
        });
      }
  
      return myTasks.filter(task => {
        const taskDate = moment(task.start_datetime, 'YYYY-MM-DD hh:mm A');
        if (selectedDate.isSame(today, 'day')) {
          if (onchangeTab === '1') return taskDate.isBefore(today, 'day');
          if (onchangeTab === '3') return taskDate.isAfter(today, 'day');
        }
        return taskDate.isSame(selectedDate, 'day');
      });
    }, [myTasks, selectedDate, onchangeTab, today]);
  
    // Apply search on tasks
    const searchedTasks = useMemo(() => {
      if (!searchQuery) return filteredTasks;
      return filteredTasks.filter(
        task =>
          task.title?.toLowerCase().includes(searchQuery) ||
          task.description?.toLowerCase().includes(searchQuery),
      );
    }, [filteredTasks, searchQuery]);
  
    // Search Notes
    const searchedNotes = useMemo(() => {
      if (!searchQuery) return myNotes;
      return myNotes.filter(note =>
        note.description?.toLowerCase().includes(searchQuery),
      );
    }, [myNotes, searchQuery]);
  
    // Search Reminders
    const searchedReminders = useMemo(() => {
      if (!searchQuery) return myReminders;
      return myReminders.filter(
        reminder =>
          reminder.title?.toLowerCase().includes(searchQuery) ||
          reminder.date?.includes(searchQuery) ||
          reminder.start_time?.includes(searchQuery) ||
          reminder.end_time?.includes(searchQuery),
      );
    }, [myReminders, searchQuery]);
  
  
    const TASK_COLORS = [
      '#FCCABD',
      '#C5DBFC',
      '#DDBDE5',
      '#E2E2E2',
      '#FFDD5B',
    ];
    const getTaskBackgroundColor = (index) => {
      return TASK_COLORS[index % TASK_COLORS.length];
    };
  
  
    const CustomDayComponent = ({ date, selected, style }) => {
      const isSelected = selected;
      const dayName = moment(date).format('ddd');
      const dateNumber = moment(date).format('D');
  
      return (
        <View
          style={[
            style,
            {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isSelected ? Colors.mainColor : 'white',
              borderRadius: wp(3),
              height: 118,
              borderWidth: isSelected ? 0 : 0.5,
              borderColor: isSelected ? undefined : '#E9F1FF',
              elevation: isSelected ? 0 : 1,
            },
          ]}
        >
          <Text
            style={
              isSelected
                ? {
                  color: Colors.white,
                  fontSize: wp(5.5),
                  fontFamily: fonts.semibold,
                }
                : {
                  color: '#1E293B',
                  fontSize: wp(4),
                  fontFamily: fonts.semibold,
                }
            }
          >
            {dateNumber}
          </Text>
          <Text
            style={
              isSelected
                ? {
                  color: 'white',
                  fontSize: wp(3.5),
                  fontFamily: fonts.regular,
                  marginTop: wp(2),
                }
                : {
                  color: 'white',
                  fontSize: wp(3.5),
                  fontFamily: fonts.regular,
                  marginTop: wp(2),
                }
            }
          >
            {dayName}
          </Text>
        </View>
      );
    };
  
    const renderTaskItem = ({ item, index }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetails', { data: item })}
        style={[
          styles.flatView,
          {
            backgroundColor: getTaskBackgroundColor(index)
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}
          >
            {item.title}
          </Text>
          <View
            style={{
              paddingVertical: wp(1),
              borderRadius: wp(3),
              paddingHorizontal: wp(2),
              backgroundColor:
                item.priority === 'High Priority'
                  ? '#F95555'
                  : item.priority === 'Medium Priority'
                    ? '#3498DB'
                    : Colors.mainColor,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={images.flag}
              resizeMode="contain"
              style={{ width: wp(4), height: wp(4), marginRight: wp(1) }}
            />
            <Text
              style={{ fontSize: 8, fontFamily: fonts.bold, color: Colors.white }}
            >
              {item.priority === 'High Priority'
                ? 'High'
                : item.priority === 'Medium Priority'
                  ? 'Medium'
                  : 'Low'}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: wp(1) }}>
          <Text
            style={{ fontSize: 12, fontFamily: fonts.medium }}
            numberOfLines={1}
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  
  
    const MorningModal = () => {
      return (
       <Modal
            visible={visible}
            animationType="fade"
            presentationStyle="fullScreen"
          >
            {!showOracle ? (
              // 🌅 FULL SCREEN GOOD MORNING
              <>
             
              <Image
                source={timeImage}
                style={styles.fullImage}
              />
              {/* <TouchableOpacity onPress={()=>setShowOracle(true)} style={{
                // backgroundColor:colorTime=="Morning"?"#6CCA9D":colorTime=="Noon"?"#F7AA1F":"#3A357A",
                backgroundColor:"white",
                position:"absolute",zIndex:100,width:"90%",alignItems:"center",justifyContent:"center", height:60,bottom:150,alignSelf:'center',borderRadius:40,}}>
    <Text style={{}}>{colorTime=="Morning"?"Start my day":colorTime=="Noon"?"Continue my day":"End my day"}</Text>
              </TouchableOpacity> */}
              </>
            ) : (
              // 🔮 FULL SCREEN ORACLE CARD
              <View style={styles.oracleContainer}>
                <View style={{backgroundColor:'#FFF8E5',borderRadius:20,paddingHorizontal:10, paddingTop:10, paddingBottom:10, width:"90%",alignSelf:"center"}}>
                 <TouchableOpacity onPress={()=>setVisible(false)} style={{height:30,width:30,borderRadius:20,alignItems:'center',backgroundColor:"white", justifyContent:"center", position:'absolute',zIndex:1000,top:20,right:30,}}>
                  {/* <Image  source={require("./Cross.png")} style={{height:10,width:10}}/>
                   */}
                   <AntDesign name={'close'} size={20} color={Colors.black}/>
                 </TouchableOpacity>
                  <Image
                  resizeMode='stretch'
                  source={oracleCard?.image}
                  style={{width:"100%",height:250,borderRadius:10,}}
                />
                <View style={{marginTop:20, paddingBottom:30,borderBottomColor:"grey",borderBottomWidth:1,}}>
                  <Text>
                    {oracleCard?.Oracle}
                  </Text>
    {showExtra? (<Text style={{marginTop:30,}}>
                    {oracleCard?.Expand}
                  </Text>):null}
     
                </View>
                {showExtra? <TouchableOpacity onPress={()=>setVisible(false)} style={{height:60,width:"100%",backgroundColor:"#FFE1D7",borderRadius:15,alignItems:"center",justifyContent:'center',marginTop:20}}><Text style={{alignSelf:"center",color:"black"}}>Where can I release urgency today?</Text></TouchableOpacity>:null}
                <TouchableOpacity onPress={()=>showExtra?setVisible(false): setShowExtra(true)}><Text style={{alignSelf:"center",marginTop:20,color:"#00BF63"}}>{showExtra?"Go To Home":"Read More"}</Text></TouchableOpacity>
                </View>
                
     
                {/* <View style={styles.content}>
                  <Text style={styles.title}>Trust The Timing</Text>
     
                  <Text style={styles.description}>
                    Today doesn’t ask you to rush or force outcomes.
                    What is meant for you is already aligning.
                  </Text>
     
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setVisible(false)}
                  >
                    <Text style={styles.buttonText}>Go To Home</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            )}
          </Modal>
      );
    };
  
  
    const { top } = useSafeAreaInsets();
    return (
      <ImageBackground
        source={images.Homebackground}
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 35 : 20,
          height: screenHeight,
        }}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
  
          {/* HEADER */}
          <View
            style={{
              marginTop: wp(5),
              marginHorizontal: wp(5),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={images.menuIcon}
                  style={{ width: 28, height: 28, marginRight: wp(2) }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.navigate('Profile')}>
              <Image
                source={user?.image ? { uri: user?.image } : images.avatarpic}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: wp(1),
                  borderRadius: 18,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                }}
              >
                {user?.name}
              </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate('AddMembers')}>
                <Image
                  source={images.useraddIcon}
                  style={{ width: 18, height: 18, marginRight: wp(2) }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  mySubscription === 0
                    ? navigation.navigate('Subscription')
                    : navigation.navigate('ChatAI')
                }
              >
                <Image
                  source={images.aiIcon}
                  style={{ width: 18, height: 18, marginRight: wp(1) }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
  
          {/* SEARCH BAR - NOW FUNCTIONAL + CLEAR BUTTON */}
          <View
            style={{
              width: wp(90),
              height: wp(12),
              backgroundColor: '#41AD88',
              borderRadius: wp(2),
              alignSelf: 'center',
              justifyContent: 'center',
              paddingHorizontal: wp(3),
              marginTop: wp(3),
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: wp(15),
            }}
          >
            <AntDesign name="search1" color="white" size={20} />
            <TextInput
              placeholder="Search tasks, notes, reminders..."
              placeholderTextColor="#B2E8D1"
              value={mySearch}
              onChangeText={setMySearch}
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: fonts.medium,
                flex: 1,
                marginLeft: wp(2),
              }}
            />
            {mySearch ? (
              <TouchableOpacity onPress={() => setMySearch('')}>
                <AntDesign name="close" color="white" size={20} />
              </TouchableOpacity>
            ) : null}
          </View>
  
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* TABS */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: wp(5),
                marginBottom: wp(3),
              }}
            >
              {['Pending', 'Today', 'Upcoming'].map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTabChange(String(index + 1))}
                >
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: wp(29),
                      height: 45,
                      borderRadius: 10,
                      backgroundColor:
                        onchangeTab === String(index + 1)
                          ? Colors.mainColor
                          : '#ECF7F3',
                      flexDirection: 'row',
                    }}
                  >
                    <Image
                      source={images.tabIcon}
                      tintColor={
                        onchangeTab === String(index + 1)
                          ? Colors.white
                          : Colors.mainColor
                      }
                      resizeMode="contain"
                      style={{ width: 15, height: 14, marginRight: wp(1) }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.bold,
                        color:
                          onchangeTab === String(index + 1)
                            ? Colors.white
                            : Colors.black,
                      }}
                    >
                      {tab}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
  
            {/* TODAY TAB */}
            {onchangeTab === '2' ? (
              <>
                <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}
                  >
                    Today
                  </Text>
                </View>
  
                {/* Tasks */}
                <FlatList
                  data={searchedTasks}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderTaskItem}
                  ListEmptyComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(8), alignSelf: 'center' }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#666',
                          fontFamily: fonts.medium,
                        }}
                      >
                        {searchQuery ? 'No tasks found' : 'No tasks for today'}
                      </Text>
                      <TouchableOpacity onPress={() => navigation.navigate('CreateTask')}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: '#0000EE', textDecorationLine: 'underline', marginLeft: wp(2) }}>Add Task</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  contentContainerStyle={{
                    paddingHorizontal: wp(5),
                    paddingTop: wp(3),
                  }}
                />
  
                {/* Notes */}
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    marginHorizontal: wp(5),
                    marginTop: wp(6),
                  }}
                >
                  Notes
                </Text>
                <FlatList
                  data={searchedNotes}
                  keyExtractor={item => item.id.toString()}
                  inverted
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedNote(item);
                        setModalAddNotes(true);
                      }}
                      style={{ paddingHorizontal: wp(5), marginTop: wp(2) }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottomWidth: 0.3,
                          borderBottomColor: '#D7D7D7',
                          paddingBottom: wp(3),
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                          }}
                        >
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: Colors.black,
                              borderRadius: wp(1),
                              width: 16,
                              height: 18,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginRight: wp(4),
                            }}
                          >
                            <Feather name="hash" color={Colors.black} size={12} />
                          </View>
                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: fonts.medium,
                              color: '#616161',
                              flex: 1,
                            }}
                          >
                            {truncateToThreeWords(item.description)}
                          </Text>
                        </View>
                        <AntDesign name="right" size={16} color={Colors.black} />
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(5), alignSelf: 'center' }}>
                      <Text
                        style={{
                          textAlign: 'center',
  
                          color: '#666',
                        }}
                      >
                        {searchQuery ? 'No notes found' : 'No notes'}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('IndexDrawer', {
                            screen: 'IndexBottom',
                            params: {
                              screen: 'Add New',
                            },
                          })
                        }
                      >
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: '#0000EE', textDecorationLine: 'underline', marginLeft: wp(2) }}>Add Note</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
  
                {/* Reminders */}
                <View style={{ marginTop: wp(6), paddingHorizontal: wp(5) }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}
                  >
                    Reminders
                  </Text>
                  <FlatList
                    data={searchedReminders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                      <View style={[styles.flatView, { marginTop: wp(3) }]}>
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
                              fontFamily: fonts.bold,
                              color: Colors.black,
                            }}
                          >
                            {item.titlehome}
                          </Text>
                          <View
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                          >
                            <Image
                              source={images.calendarIcon}
                              resizeMode="contain"
                              style={{
                                width: wp(4.5),
                                height: wp(4.5),
                                marginRight: wp(1),
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: fonts.medium,
                                color: Colors.black,
                              }}
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: wp(38),
                            paddingVertical: wp(1),
                            borderRadius: wp(3),
                            paddingHorizontal: wp(2),
                            backgroundColor: '#ECF7F3',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: wp(3),
                          }}
                        >
                          <Image
                            source={images.clockIcon}
                            resizeMode="contain"
                            style={{
                              width: wp(4),
                              height: wp(4),
                              marginRight: wp(1),
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: fonts.bold,
                              color: Colors.black,
                            }}
                          >
                            {item.start_time} - {item.end_time}
                          </Text>
                        </View>
                      </View>
                    )}
                    ListEmptyComponent={
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(5), alignSelf: 'center' }}>
                      <Text
                        style={{
                          textAlign: 'center',
                       
                          color: '#666',
                        }}
                      >
                        {searchQuery ? 'No reminders found' : 'No reminders'}
                      </Text>
                          <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('IndexDrawer', {
                              screen: 'IndexBottom',
                              params: {
                                screen: 'Add New',
                              },
                            })
                          }
                        >
                          <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: '#0000EE', textDecorationLine: 'underline', marginLeft: wp(2) }}>Add Reminder</Text>
                        </TouchableOpacity>
                        </View>
                    }
                  />
                </View>
  
                {/* Invite Card */}
                <View
                  style={{
                    marginTop: wp(2),
                    paddingHorizontal: wp(5),
                    marginBottom: wp(25),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}
                  >
                    Search for more
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddMembers')}
                    style={{
                      backgroundColor: '#ECF7F3',
                      width: wp(90),
                      alignSelf: 'center',
                      padding: wp(4),
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      borderRadius: wp(3),
                      marginTop: wp(2),
                      shadowOffset: { height: 2, width: 4 },
                      shadowOpacity: 0.2,
                      shadowColor: 'white',
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.medium,
                          color: Colors.black,
                        }}
                      >
                        Invite Users
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.medium,
                          color: Colors.black,
                        }}
                      >
                        Invite your teammates together
                      </Text>
                    </View>
                    <Image
                      source={images.inviteuser}
                      resizeMode="contain"
                      style={{ width: 41, height: 41 }}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // Pending & Upcoming Tabs
              <>
                <CalendarStrip
                  style={{ height: 180, paddingTop: 20, paddingBottom: 10 }}
                  selectedDate={selectedDate}
                  onDateSelected={handleDateSelected}
                  dayComponentHeight={118}
                  minDayComponentSize={wp(18)}
                  // customDayComponent={CustomDayComponent}
                  dateNameStyle={{
                    color: 'black',
                    fontSize: wp(3.5),
                    fontFamily: fonts.regular,
                  }}
                  dateNumberStyle={{
                    color: '#1E293B',
                    fontSize: wp(4),
                    fontFamily: fonts.semibold,
                  }}
                  highlightDateNumberStyle={{
                    color: Colors.white,
                    fontSize: wp(5.5),
                    fontFamily: fonts.semibold,
                  }}
                  highlightDateNameStyle={{
                    color: 'white',
                    fontSize: wp(3.5),
                    fontFamily: fonts.regular,
                  }}
                  // highlightDateContainerStyle={{
                  //   backgroundColor: Colors.mainColor,
                  //   borderRadius: wp(3),
                  //   height: 118,
                  // }}
                  // dayContainerStyle={{
                  //   backgroundColor: 'white',
                  //   borderWidth: 0.5,
                  //   borderColor: '#E9F1FF',
                  //   borderRadius: wp(3),
                  //   // elevation: 1,
                  // }}
                  scrollable
                  startingDate={moment()}
                  scrollToOnSetSelectedDate={true}
                  showArrows={false}
                  iconStyle={{ display: 'none' }}
                  highlightDateContainerStyle={{
                    backgroundColor: Colors.mainColor,
                    borderRadius: wp(3),
                    height: 118,
                  }}
                  dayContainerStyle={{
                    backgroundColor: 'white',
                    borderWidth: 0.5,
                    borderColor: '#E9F1FF',
                    borderRadius: wp(3),
                  }}
                />
  
                <FlatList
                  data={searchedTasks}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderTaskItem}
                  ListEmptyComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(8), alignSelf: 'center' }}>
                      <Text
                        style={{
                          textAlign: 'center',
  
                          color: '#666',
                          fontFamily: fonts.medium,
                        }}
                      >
                        {searchQuery ? 'No tasks found' : 'No tasks found'}
                      </Text>
                      <TouchableOpacity onPress={() => navigation.navigate('CreateTask')}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: '#0000EE', textDecorationLine: 'underline', marginLeft: wp(2) }}>Add Task</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  contentContainerStyle={{
                    paddingHorizontal: wp(5),
                    paddingTop: wp(3),
                  }}
                />
  
                {/* Reminders in Pending/Upcoming */}
                <View
                  style={{
                    marginTop: wp(6),
                    paddingHorizontal: wp(5),
                    marginBottom: wp(30),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}
                  >
                    Reminders
                  </Text>
                  <FlatList
                    data={searchedReminders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                      <View style={[styles.flatView, { marginTop: wp(3) }]}>
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
                              fontFamily: fonts.bold,
                              color: Colors.black,
                              flex: 1,
                            }}
                          >
                            {item.title}
                          </Text>
                          <View
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                          >
                            <Image
                              source={images.calendarIcon}
                              resizeMode="contain"
                              style={{
                                width: wp(4.5),
                                height: wp(4.5),
                                marginRight: wp(1),
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: fonts.medium,
                                color: Colors.black,
                              }}
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
  
                        <View
                          style={{
                            width: wp(38),
                            paddingVertical: wp(1),
                            borderRadius: wp(3),
                            paddingHorizontal: wp(2),
                            backgroundColor: '#ECF7F3',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: wp(3),
                          }}
                        >
                          <Image
                            source={images.clockIcon}
                            resizeMode="contain"
                            style={{
                              width: wp(4),
                              height: wp(4),
                              marginRight: wp(1),
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: fonts.bold,
                              color: Colors.black,
                            }}
                          >
                            {item.start_time} - {item.end_time}
                          </Text>
                        </View>
                      </View>
                    )}
                    ListEmptyComponent={
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(8), alignSelf: 'center' }}>
                      <Text
                        style={{
                          textAlign: 'center',
                       
                          color: '#666',
                        }}
                      >
                        {searchQuery ? 'No reminders found' : 'No reminders'}
                      </Text>
                         <TouchableOpacity
                         onPress={() =>
                           navigation.navigate('IndexDrawer', {
                             screen: 'IndexBottom',
                             params: {
                               screen: 'Add New',
                             },
                           })
                         }
                       >
                         <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: '#0000EE', textDecorationLine: 'underline', marginLeft: wp(2) }}>Add Reminder</Text>
                       </TouchableOpacity>
                       </View>
                    }
                  />
                </View>
              </>
            )}
          </ScrollView>
  
          {/* Note Details Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalAddNotes}
            onRequestClose={() => setModalAddNotes(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                  padding: wp(6),
                  width: wp(90),
                  maxHeight: hp(80),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                  elevation: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalAddNotes(false)}
                  style={{ position: 'absolute', top: 15, right: 15, zIndex: 1 }}
                >
                  <AntDesign name="close" size={24} color={Colors.black} />
                </TouchableOpacity>
  
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    textAlign: 'center',
                    marginBottom: wp(4),
                  }}
                >
                  Note Details
                </Text>
  
                {selectedNote ? (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                      style={{
                        fontSize: wp(4.8),
                        fontFamily: fonts.medium,
                        color: '#333',
                        lineHeight: wp(7),
                        textAlign: 'left',
                      }}
                    >
                      {selectedNote.description || 'No description available'}
                    </Text>
                    {selectedNote.created_at && (
                      <Text
                        style={{
                          marginTop: wp(8),
                          fontSize: wp(3.8),
                          fontFamily: fonts.regular,
                          color: '#888',
                          textAlign: 'right',
                        }}
                      >
                        {moment(selectedNote.created_at).format(
                          'MMM D, YYYY • h:mm A',
                        )}
                      </Text>
                    )}
                  </ScrollView>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#999',
                      fontSize: wp(4.5),
                    }}
                  >
                    Loading note...
                  </Text>
                )}
              </View>
            </View>
          </Modal>
  
          <Modal transparent={true} visible={usersuspened} animationType="none">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                  padding: wp(6),
                  width: wp(90),
                  maxHeight: hp(80),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                  elevation: 20,
                }}
              >
                <View>
                  <Image
                    source={images.avatarpic}
                    resizeMode="contain"
                    style={{ width: wp(20), height: wp(20), alignSelf: 'center' }}
                  />
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    marginHorizontal: wp(3),
                    marginTop: wp(5),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                      lineHeight: 22,
                      textAlign: 'center',
                    }}
                  >
                    Oops! It looks like your account is currently suspended by the
                    admin. You won’t be able to access your tasks or communities
                    until your account is reactivated. Please reach out to support
                    if you think this is a mistake.{' '}
                    {/* <TouchableOpacity onPress={handleEmailPress}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: Colors.buttoncolor,
                          textDecorationLine: 'underline',
                          paddingTop: wp(2),
                        }}
                      >
                        saaday7@gmail.com
                      </Text>
                    </TouchableOpacity> */}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: wp(7),
                    marginTop: wp(5),
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleEmailPress(),
                        dispatch(setUser(null)),
                        setuserSuspended(false);
                    }}
                    style={[
                      {
                        width: wp(60),
                        height: wp(12),
                        borderRadius: wp(20),
                        backgroundColor: Colors.mainColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        {
                          fontSize: 14,
                          color: Colors.white,
                          fontFamily: fonts.bold,
                        },
                      ]}
                    >
                      Support Team
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
         
        </KeyboardAvoidingView>
        {MorningModal()}
        <AheadChallengeModal
          visible={showAheadChallenge}
          // onClose={() => setShowAheadChallenge(false)}
          navigation={navigation}
        />
      </ImageBackground>
    );
  };
  
  export default Home;
  


  const data = [
    { id:1,
      Oracle:"Today doesn’t ask you to rush or force outcomes. What is meant for you is already aligning, even if you can’t see it yet. Trust the pace of the day.",
      Expand:"This card appears when urgency or pressure is influencing your mindset. Angelic guidance reminds you that alignment happens through cooperation, not control. When you allow things to unfold naturally, clarity and ease follow.",
    image:require("../../Assets/Group 1272628560.jpg"),
    },
    { id:2,
      Oracle:"You are not doing this alone, even if it feels quiet right now. Support surrounds you in visible and invisible ways. Allow yourself to lean into it.",
      Expand:"Angel oracle traditions often emphasize unseen support as reassurance. This card invites you to notice where help, encouragement, or ease is already present. You don’t have to carry everything by yourself today.",
    image:require("../../Assets/Group 1272628561.jpg"),
    },
     {id:3, Oracle:"You don’t need to start today at full speed. Gentle beginnings create steadier momentum. Ease can be a strength.",
Expand:"This message aligns with angelic guidance around self-compassion and balance. Moving gently helps you conserve energy and stay present. Today favors pacing over pushing.",
image:require("../../Assets/Group 1272628562.jpg"),
    },
     {id:4, Oracle:"You don’t need all the answers before the day begins. Some understanding arrives through experience. Let clarity meet you naturally.",
Expand:"This card reassures you that uncertainty is not a failure. Angel guidance reminds you that insight unfolds in stages. Trust that today will reveal what you need, when you need it.",
image:require("../../Assets/Group 1272628564.jpg"),
    },
    {id:5, Oracle:"Come back to the present moment. Stability is available when you slow down and notice what’s real. You are here.",
Expand:"Grounding is a core angelic theme for emotional steadiness. This card suggests reconnecting with your body and breath. From grounded awareness, better choices follow.",
image:require("../../Assets/Group 1272628564.jpg"),
    },
    {id:6, Oracle:"Your words will shape the tone of your day. Choose honesty guided by compassion. Begin with kindness toward yourself.",
Expand:"Angel guidance often centers communication as a healing tool. This card reminds you that words carry energy. Gentle truth creates safety and connection.",
image:require("../../Assets/Group 1272628565.jpg"),
    },
    {id:7, Oracle:"Not everything today needs your management. Some things respond better to trust than effort. Letting go can create ease.",
Expand:"This card reflects angel teachings around surrender. Control often comes from fear, while trust opens flow. Notice where effort is unnecessary and allow space for support.",
image:require("../../Assets/Group 1272628585.jpg"),
    },
    {id:8, Oracle:"Your energy is valuable and limited. You are allowed to choose where it goes. Boundaries today are an act of wisdom.",
Expand:"Protection is a frequent angel oracle theme. This card encourages discernment around people, tasks, and emotions. Preserving energy supports clarity and balance.",
image:require("../../Assets/Group 1272628566.jpg"),
    },
    {id:9, Oracle:"You don’t need to prove your worth today. Your value is not tied to productivity or perfection. Showing up honestly is enough.",
Expand:"Angel guidance often reassures worthiness. This card gently counters self-judgment and pressure. Resting in enoughness brings peace and confidence.",
image:require("../../Assets/Group 1272628584.jpg"),
    },
    {id:10, Oracle:"Goodness is available to you today. You don’t need to deflect or brace against it. Allow yourself to receive.",
Expand:"Angel cards frequently remind us that receiving is as important as giving. This message invites openness to ease, kindness, and small moments of joy. Let the day be lighter than expected.",
image:require("../../Assets/Group 1272628567.jpg"),
    },
 
    {id:11, Oracle:"You don’t need the whole path, just the next step. Progress happens through small, aligned actions. Begin where you are.",
Expand:"Angel guidance often emphasizes forward motion without overwhelm. This card reassures you that clarity grows with movement. One step is enough for today.",
image:require("../../Assets/Group 1272628568.jpg"),
    },
{id:12, Oracle:"What you feel today matters. Emotions are signals, not obstacles. Allow them space.",
Expand:"This card reflects angel teachings around emotional awareness. When feelings are acknowledged, they soften. Listening inward creates clarity and balance.",
image:require("../../Assets/Group 1272628569.jpg"),
    },
    {id:13, Oracle:"Something helpful may arrive in an unexpected way. Openness creates opportunity.Release rigid expectations.",
Expand:"Angel oracle themes often highlight openness as a doorway to guidance. This card encourages flexibility and curiosity. What you need may arrive differently than planned.",
image:require("../../Assets/Group 1272628570.jpg"),
    },
     {id:14, Oracle:"Slowing down supports progress. Rest restores clarity and energy. You’re allowed to pause.",
Expand:"This card counters the belief that constant effort is required. Angel guidance reminds you that rest strengthens insight and resilience. Pausing today benefits what comes next.",
image:require("../../Assets/Group 1272628571.jpg"),
    },
    {id:15, Oracle:"Let your actions reflect what truly matters to you. Alignment brings peace, even when it’s uncomfortable. Choose honesty.",
Expand:"Angel cards often emphasize integrity as inner alignment. Acting from values creates steadiness and self-trust. Today favors choices that feel true.",
image:require("../../Assets/Group 1272628572.jpg"),
    },
     {id:16, Oracle:"You already know more than you think. Your intuition is quiet but reliable. Listen inward.",
Expand:"Angel guidance frequently affirms inner wisdom. This card encourages confidence in your own insight. Trust grows when you act on what feels right.",
image:require("../../Assets/Group 1272628573.jpg"),
    },
{id:17, Oracle:"This moment is enough. Presence improves everything that follows. Come fully here.",
Expand:"Angel teachings often emphasize presence as grounding and clarifying. When attention returns to now, stress softens. Today benefits from mindful awareness.",
image:require("../../Assets/Group 1272628574.jpg"),
    },
     {id:18, Oracle:"Complexity is optional today. Simplicity brings clarity and ease. Focus on what matters most.",
Expand:"This card reflects angel guidance around reducing mental noise. When you simplify, energy returns. Let go of unnecessary effort.",
image:require("../../Assets/Group 1272628575.jpg"),
    },
    {id:19, Oracle:"You are being nudged in the right direction. Guidance may appear subtly. Pay attention.",
Expand:"Angel oracle traditions often describe guidance as intuitive signals. This card invites awareness of signs, instincts, and gentle confirmations. Trust what you notice.",
image:require("../../Assets/Group 1272628576.jpg"),
    },
    {id:20, Oracle:"Gratitude changes how you experience the day. Appreciation softens perspective. Begin with thanks.",
Expand:"Angel cards frequently highlight gratitude as a grounding practice. What you acknowledge grows in importance. Gratitude brings steadiness and calm.",
image:require("../../Assets/Group 1272628577.jpg"),
    },
    {id:21, Oracle:"One conscious breath can shift everything. Pause before reacting. Calm creates clarity.",
Expand:"Angel guidance often encourages breath as a reset. This card reminds you to slow the nervous system before responding. Presence begins with breath.",
image:require("../../Assets/Group 1272628578.jpg"),
    },
     {id:22, Oracle:"Peace is available, even in challenge. You can choose calm over conflict. Let peace guide your responses.",
Expand:"This card reflects angelic reassurance around emotional choice. Not every situation requires defense. Peace conserves energy and clarity.",
image:require("../../Assets/Group 1272628579.jpg"),
    },
    {id:23, Oracle:"Growth is happening, even when it feels messy. Learning often looks imperfect. Be patient with yourself.",
Expand:"Angel oracle themes frequently normalize growth through experience. This card reframes mistakes as part of expansion. Compassion accelerates learning.",
image:require("../../Assets/Group 1272628580.jpg"),
    },
    {id:24, Oracle:"Something is shifting for your benefit. Change clears space for alignment. Trust the movement.",
Expand:"Angel guidance often frames change as preparation. This card encourages openness rather than resistance. What’s shifting supports growth.",
image:require("../../Assets/Group 1272628581.jpg"),
    },
    {id:25, Oracle:"Guidance speaks softly. Answers may arrive through subtle feelings or quiet moments. Slow down enough to hear.",
Expand:"Angel oracle traditions emphasize listening over forcing. This card invites attunement to intuition and subtle cues. Stillness reveals direction.",
image:require("../../Assets/Group 1272628582.jpg"),
    },
  ]