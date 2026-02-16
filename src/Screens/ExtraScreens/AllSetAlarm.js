import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Modal,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainButton from '../../Components/MainButton';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AllSetAlarm = ({ navigation }) => {
  const [oracleCard, setOracleCard] = useState(null);
  const [timeImage, setTimeImage] = useState(null);
  const [colorTime, setTime] = useState('');
  const [visible, setVisible] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      checkModalStatus();
    }, 500);
  }, []);
  const data = [
    {
      id: 1,
      Oracle:
        'Today doesn’t ask you to rush or force outcomes. What is meant for you is already aligning, even if you can’t see it yet. Trust the pace of the day.',
      Expand:
        'This card appears when urgency or pressure is influencing your mindset. Angelic guidance reminds you that alignment happens through cooperation, not control. When you allow things to unfold naturally, clarity and ease follow.',
      image: require('../../Assets/Trust the Timing.png'),
      name: 'Trust the Timing',
    },
    {
      id: 2,
      Oracle:
        'You are not doing this alone, even if it feels quiet right now. Support surrounds you in visible and invisible ways. Allow yourself to lean into it.',
      Expand:
        'Angel oracle traditions often emphasize unseen support as reassurance. This card invites you to notice where help, encouragement, or ease is already present. You don’t have to carry everything by yourself today.',
      image: require('../../Assets/You Are Supported.png'),
      name: 'You Are Supported',
    },
    {
      id: 3,
      Oracle:
        'You don’t need to start today at full speed. Gentle beginnings create steadier momentum. Ease can be a strength.',
      Expand:
        'This message aligns with angelic guidance around self-compassion and balance. Moving gently helps you conserve energy and stay present. Today favors pacing over pushing.',
      image: require('../../Assets/Begin Gently.png'),
      name: 'Begin Gently',
    },
    {
      id: 4,
      Oracle:
        'You don’t need all the answers before the day begins. Some understanding arrives through experience. Let clarity meet you naturally.',
      Expand:
        'This card reassures you that uncertainty is not a failure. Angel guidance reminds you that insight unfolds in stages. Trust that today will reveal what you need, when you need it.',
      image: require('../../Assets/Clarity Will Come.png'),
      name: 'Clarity Will Come',
    },
    {
      id: 5,
      Oracle:
        'Come back to the present moment. Stability is available when you slow down and notice what’s real. You are here.',
      Expand:
        'Grounding is a core angelic theme for emotional steadiness. This card suggests reconnecting with your body and breath. From grounded awareness, better choices follow.',
      image: require('../../Assets/Ground Yourself.png'),
      name: 'Ground Yourself',
    },
    {
      id: 6,
      Oracle:
        'Your words will shape the tone of your day. Choose honesty guided by compassion. Begin with kindness toward yourself.',
      Expand:
        'Angel guidance often centers communication as a healing tool. This card reminds you that words carry energy. Gentle truth creates safety and connection.',
      image: require('../../Assets/Speak with Kindness.png'),
      name: 'Speak with Kindness',
    },
    {
      id: 7,
      Oracle:
        'Not everything today needs your management. Some things respond better to trust than effort. Letting go can create ease.',
      Expand:
        'This card reflects angel teachings around surrender. Control often comes from fear, while trust opens flow. Notice where effort is unnecessary and allow space for support.',
      image: require('../../Assets/Release Control.png'),
      name: 'Release Control',
    },
    {
      id: 8,
      Oracle:
        'Your energy is valuable and limited. You are allowed to choose where it goes. Boundaries today are an act of wisdom.',
      Expand:
        'Protection is a frequent angel oracle theme. This card encourages discernment around people, tasks, and emotions. Preserving energy supports clarity and balance.',
      image: require('../../Assets/Protect Your Energy.png'),
      name: 'Protect Your Energy',
    },
    {
      id: 9,
      Oracle:
        'You don’t need to prove your worth today. Your value is not tied to productivity or perfection. Showing up honestly is enough.',
      Expand:
        'Angel guidance often reassures worthiness. This card gently counters self-judgment and pressure. Resting in enoughness brings peace and confidence.',
      image: require('../../Assets/You Are Enough.png'),
      name: 'You are Enough',
    },
    {
      id: 10,
      Oracle:
        'Goodness is available to you today. You don’t need to deflect or brace against it. Allow yourself to receive.',
      Expand:
        'Angel cards frequently remind us that receiving is as important as giving. This message invites openness to ease, kindness, and small moments of joy. Let the day be lighter than expected.',
      image: require('../../Assets/Receive the Good.png'),
      name: 'Receive the Good',
    },

    {
      id: 11,
      Oracle:
        'You don’t need the whole path, just the next step. Progress happens through small, aligned actions. Begin where you are.',
      Expand:
        'Angel guidance often emphasizes forward motion without overwhelm. This card reassures you that clarity grows with movement. One step is enough for today.',
      image: require('../../Assets/Take the Next Step.png'),
      name: 'Take the Next Step',
    },
    {
      id: 12,
      Oracle:
        'What you feel today matters. Emotions are signals, not obstacles. Allow them space.',
      Expand:
        'This card reflects angel teachings around emotional awareness. When feelings are acknowledged, they soften. Listening inward creates clarity and balance.',
      image: require('../../Assets/Honor Your Feelings.png'),
      name: 'Honor Your Feelings',
    },
    {
      id: 13,
      Oracle:
        'Something helpful may arrive in an unexpected way. Openness creates opportunity.Release rigid expectations.',
      Expand:
        'Angel oracle themes often highlight openness as a doorway to guidance. This card encourages flexibility and curiosity. What you need may arrive differently than planned.',
      image: require('../../Assets/Stay Open.png'),
      name: 'Stay Open',
    },
    {
      id: 14,
      Oracle:
        'Slowing down supports progress. Rest restores clarity and energy. You’re allowed to pause.',
      Expand:
        'This card counters the belief that constant effort is required. Angel guidance reminds you that rest strengthens insight and resilience. Pausing today benefits what comes next.',
      image: require('../../Assets/Rest Is Productive.png'),
      name: 'Rest Is Productive',
    },
    {
      id: 15,
      Oracle:
        'Let your actions reflect what truly matters to you. Alignment brings peace, even when it’s uncomfortable. Choose honesty.',
      Expand:
        'Angel cards often emphasize integrity as inner alignment. Acting from values creates steadiness and self-trust. Today favors choices that feel true.',
      image: require('../../Assets/Act with Integrity.png'),
      name: 'Act with Integrity',
    },
    {
      id: 16,
      Oracle:
        'You already know more than you think. Your intuition is quiet but reliable. Listen inward.',
      Expand:
        'Angel guidance frequently affirms inner wisdom. This card encourages confidence in your own insight. Trust grows when you act on what feels right.',
      image: require('../../Assets/Trust Yourself.png'),
      name: 'Trust Yourself',
    },
    {
      id: 17,
      Oracle:
        'This moment is enough. Presence improves everything that follows. Come fully here.',
      Expand:
        'Angel teachings often emphasize presence as grounding and clarifying. When attention returns to now, stress softens. Today benefits from mindful awareness.',
      image: require('../../Assets/Choose Presence.png'),
      name: 'Choose Presence',
    },
    {
      id: 18,
      Oracle:
        'Complexity is optional today. Simplicity brings clarity and ease. Focus on what matters most.',
      Expand:
        'This card reflects angel guidance around reducing mental noise. When you simplify, energy returns. Let go of unnecessary effort.',
      image: require('../../Assets/Let It Be Simple.png'),
      name: 'Let It Be Simple',
    },
    {
      id: 19,
      Oracle:
        'You are being nudged in the right direction. Guidance may appear subtly. Pay attention.',
      Expand:
        'Angel oracle traditions often describe guidance as intuitive signals. This card invites awareness of signs, instincts, and gentle confirmations. Trust what you notice.',
      image: require('../../Assets/You Are Guided.png'),
      name: 'You Are Guided',
    },
    {
      id: 20,
      Oracle:
        'Gratitude changes how you experience the day. Appreciation softens perspective. Begin with thanks.',
      Expand:
        'Angel cards frequently highlight gratitude as a grounding practice. What you acknowledge grows in importance. Gratitude brings steadiness and calm.',
      image: require('../../Assets/End with Gratitude.png'),
      name: 'End with Gratitude',
    },
    {
      id: 21,
      Oracle:
        'One conscious breath can shift everything. Pause before reacting. Calm creates clarity.',
      Expand:
        'Angel guidance often encourages breath as a reset. This card reminds you to slow the nervous system before responding. Presence begins with breath.',
      image: require('../../Assets/Breathe First.png'),
      name: 'Breathe First',
    },
    {
      id: 22,
      Oracle:
        'Peace is available, even in challenge. You can choose calm over conflict. Let peace guide your responses.',
      Expand:
        'This card reflects angelic reassurance around emotional choice. Not every situation requires defense. Peace conserves energy and clarity.',
      image: require('../../Assets/Choose Peace.png'),
      name: 'Choose Peace',
    },
    {
      id: 23,
      Oracle:
        'Growth is happening, even when it feels messy. Learning often looks imperfect. Be patient with yourself.',
      Expand:
        'Angel oracle themes frequently normalize growth through experience. This card reframes mistakes as part of expansion. Compassion accelerates learning.',
      image: require('../../Assets/You Are Learning.png'),
      name: 'You Are Learning',
    },
    {
      id: 24,
      Oracle:
        'Something is shifting for your benefit. Change clears space for alignment. Trust the movement.',
      Expand:
        'Angel guidance often frames change as preparation. This card encourages openness rather than resistance. What’s shifting supports growth.',
      image: require('../../Assets/Welcome Change.png'),
      name: 'Welcome Change',
    },
    {
      id: 25,
      Oracle:
        'Guidance speaks softly. Answers may arrive through subtle feelings or quiet moments. Slow down enough to hear.',
      Expand:
        'Angel oracle traditions emphasize listening over forcing. This card invites attunement to intuition and subtle cues. Stillness reveals direction.',
      image: require('../../Assets/Listen Closely.png'),
      name: 'Listen Closely',
    },
  ];
  const checkModalStatus = async () => {
    try {
      const lastShown = await AsyncStorage.getItem('modalLastShown');
      const todayStr = new Date().toDateString();

      if (lastShown !== todayStr) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setOracleCard(data[randomIndex]);
        checkTime();

        await AsyncStorage.setItem('modalLastShown', todayStr);

        setVisible(true);

        setTimeout(() => {
          setShowOracle(true);
        }, 4000);
      }
    } catch (error) {
      console.log('Error checking modal status:', error);
    }
  };

  const checkTime = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setTimeImage(require('../../Assets/Start 7.png'));
      setTime('Morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeImage(require('../../Assets/Start 8.png'));
      setTime('Noon');
    } else {
      setTimeImage(require('../../Assets/Start 9.png'));
      setTime('Night');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true; // block back button
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove(); // ✅ correct cleanup
      };
    }, []),
  );
  return (
    <ImageBackground
      source={images.mainImage}
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              marginTop: wp(40),
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: Colors.white,
                fontFamily: fonts.bold,
              }}
            >
              You’re All Set
            </Text>
          </View>
          {/* <ImageBackground
            style={{
              width: wp(50),
              height: wp(80),
              alignSelf: 'center',
              marginTop: wp(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={images.alarmsetImg}
            resizeMode="contain"
          > */}
          <Image
            source={require('../../Assets/Complete.png')}
            resizeMode="contain"
            style={{ width: wp(60), height: wp(90), alignSelf: 'center' }}
          />
          {/* </ImageBackground> */}
          <Text
            style={{
              fontSize: 13,
              color: 'white',
              fontFamily: fonts.medium,
              lineHeight: 18,
              textAlign: 'center',
            }}
          >
            Your selfie has been approved by AI.
          </Text>
          <View
            style={{
              position: 'absolute',
              bottom: wp(30),
              alignSelf: 'center',
            }}
          >
            <MainButton
              title="Back Home"
              onPress={() =>
                navigation.navigate('IndexDrawer', { screen: 'SnapAlarm' })
              }
            />
          </View>
        </ScrollView>
        <Modal
          visible={visible}
          animationType="fade"
          presentationStyle="fullScreen"
        >
          {!showOracle ? (
            <ImageBackground
              source={timeImage}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            >
              <Image
                source={require('../../Assets/Ahead.png')}
                style={{
                  width: '80%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginTop: hp(15),
                  height: 160,
                  backgroundColor: '#BD2BAF33',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 30,
                  marginTop: hp(20),
                  fontFamily: fonts.bold,
                }}
              >
                Good {colorTime}
              </Text>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={images.mainImage}
              style={{
                flex: 1,
                backgroundColor: '#FFF8E5',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#00000099',
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    // if (mySubscription === 0) {
                    //   timer = setTimeout(() => {
                    //     setShowAheadChallenge(true);
                    //   }, 3000);
                    // } else {
                    //   setShowAheadChallenge(false);
                    // }
                  }}
                  style={{
                    position: 'absolute',
                    top: 30,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: 30,
                    zIndex: 1000,
                  }}
                >
                  <AntDesign name={'close'} size={24} color={Colors.black} />
                </TouchableOpacity>

                <Image
                  resizeMode="cover"
                  source={oracleCard?.image}
                  style={{
                    width: '100%',
                    height: 250,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                />
                <View
                  style={{
                    backgroundColor: '#BD2BAF4D',
                    height: 50,
                    alignItems: 'center',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: 'white',
                    }}
                  >
                    {oracleCard?.name}
                  </Text>
                </View>

                <Text style={{ marginTop: 20, color: 'white', fontSize: 16 }}>
                  {oracleCard?.Oracle}
                </Text>

                {showExtra && (
                  <Text style={{ marginTop: 20, color: 'white' }}>
                    {oracleCard?.Expand}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() =>
                    showExtra ? setVisible(false) : setShowExtra(true)
                  }
                >
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 20,
                      color: Colors.mainColor,
                    }}
                  >
                    {showExtra ? 'Close' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default AllSetAlarm;
