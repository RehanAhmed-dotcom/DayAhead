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
  Alert,
  Dimensions,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MainButton from '../../Components/MainButton';
import { useFocusEffect } from '@react-navigation/native';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import { useStripe } from '@stripe/stripe-react-native';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Subscription = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [mySubscription, setmySubscription] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const { width } = Dimensions.get('window');
  // const [MySubscription] = useState([
  //   {
  //     id: 1,
  //     feature1: 'AI Smart Replies',
  //     feature2: 'Weekly Coaching Prompts',
  //     feature3: 'Advance Productivity Analytics',
  //     price: '83.90',
  //     duration: 'Yearly',
  //     price_id: 'price_1Shl6rFbGcTzrHeUjSDVQO73'
  //   },
  //   {
  //     id: 2,
  //     feature1: 'AI Smart Replies',
  //     feature2: 'Weekly Coaching Prompts',
  //     feature3: 'Advance Productivity Analytics',
  //     price: '9.99',
  //     duration: 'Monthly',
  //     price_id: 'price_1Shl5rFbGcTzrHeU3X9rJFKk'
  //   },
  // ]);

  const DATA = [
    {
      id: 1,
      subtitle: 'PREMIUM PLAN',
      options: [
        'Ad-free experience',
        'No ads. Just features.',
        '100% ad-free',
        'Enjoy without interruptions',
      ],
      buttonText: 'Try Free & Subscribe',
      buttonColor: '#4CAF50',
      price: '9.99',
      duration: 'Monthly',
      price_id: 'price_1Shl5rFbGcTzrHeU3X9rJFKk'

    },
    {
      id: 2,
      subtitle: 'PREMIUM PLAN',
      options: [
        'Ad-free experience',
        'No ads. Just features.',
        '100% ad-free',
        'Enjoy without interruptions',
      ],
      buttonText: 'Try Free & Subscribe',
      buttonColor: '#FFD700',
      price: '83.90',
      duration: 'Yearly',
      price_id: 'price_1Shl6rFbGcTzrHeUjSDVQO73'
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const handleScrollEnd = (event) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / (width * 0.9)
    );
    setActiveIndex(newIndex);
  };

  // if (!visible) return null;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const CheckSubscription = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'check-subscription', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        console.log('check subscription', res);
        setmySubscription(res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error check-subscription', err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      CheckSubscription();
    }, []),
  );

  const _paymentIntentApi = item => {
    const formdata = new FormData();
    formdata.append('price_id', item.price_id);
    formdata.append('duration', item.duration);

    setIsLoading(true);

    PostAPiwithToken({ url: 'subscribe', Token: user?.api_token }, formdata)
      .then(res => {
        console.log('Subscribe API Response:', res);
        setIsLoading(false);

        if (res.status === 'success') {
          initializePaymentSheet(res.setup_intent_client_secret);
        } else {
          Alert.alert('Error', res.message || 'Something went wrong');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Subscribe API Error:', err);
        Alert.alert('Error', 'Failed to start payment');
      });
  };

  const initializePaymentSheet = async (clientSecret) => {
    console.log(clientSecret)
    try {
      await initPaymentSheet({
        merchantDisplayName: 'Dayahead',
        setupIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          email: user?.email
        },
        returnURL: 'dayahead://stripe-redirect', // Required for iOS
        // Remove style: 'alwaysDark' → causes crashes on many Android devices
      });

      console.log('PaymentSheet initialized successfully');
      openPaymentSheet();
    } catch (error) {
      console.error('initPaymentSheet ERROR:', error);
      let msg = 'Failed to load payment screen.';
      if (error.message) msg += ` ${error.message}`;
      Alert.alert('Payment Error', msg);
      setIsLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log('presentPaymentSheet Error:', error);

      if (error.code === 'Canceled') {
        Toast.show({ type: 'info', text1: 'Payment cancelled' });
      } else {
        Alert.alert(
          'Payment Failed',
          error.message || 'Unknown error occurred',
        );
      }
      setIsLoading(false);
    } else {
      console.log('Payment successful! Confirming subscription...');
      // _paymentConfirmApi(paymentData);
      navigation.navigate('IndexDrawer');
    }
  };
  const cancelSubscription = async () => {
    setIsLoading(true);

    try {
      const res = await PostAPiwithToken(
        { url: 'cancel-subscription', Token: user?.api_token },
        {}
      );

      setIsLoading(false);

      if (res.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Subscription canceled',
        });
        CheckSubscription();
      } else {
        Alert.alert('Error', res.message);
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to cancel subscription');
    }
  };

  // const _paymentConfirmApi = ({ amount, duration }) => {
  //   const formdata = new FormData();
  //   formdata.append('name', duration);
  //   formdata.append('amount', amount);

  //   setIsLoading(true);

  //   PostAPiwithToken(
  //     { url: 'confirm-subscription', Token: user?.api_token },
  //     formdata,
  //   )
  //     .then(res => {
  //       setIsLoading(false);
  //       console.log('Confirm Subscription Response:', res);

  //       if (res.status === 'success') {
  //         Toast.show({
  //           type: 'success',
  //           text1: 'Success!',
  //           text2: `You're now on ${duration} Premium Plan`,
  //         });
  //         navigation.navigate('IndexDrawer');
  //       } else {
  //         Alert.alert('Error', res.message || 'Subscription update failed');
  //       }
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //       console.log('Confirm API Error:', err);
  //       Alert.alert('Error', 'Failed to confirm subscription');
  //     });
  // };


  const renderItem = ({ item }) => (
    <View style={{
      width: wp(90),
      alignItems: 'center',
      paddingTop: 30,
    }}>
      <View style={{ marginBottom: 10, }}>
        <Image
          source={require('../../Assets/premiumIcon.png')}
          style={{ width: 80, height: 60 }}
          resizeMode="contain"
        />
      </View>
      <Text style={{ fontSize: 22, fontFamily: fonts.bold, color: Colors.white }}>${item.price}<Text style={{ fontFamily: fonts.medium, color: Colors.white, fontSize: 12 }}>/{item?.duration}</Text></Text>

      <View style={{ width: '60%', }}>
        {item.options.map((option, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
            <Ionicons name="checkmark-circle-outline" color="white" size={20} />
            <Text style={{
              fontSize: 14,
              color: 'white',
              marginLeft: wp(2),
              fontFamily: fonts.medium,
            }}>{option}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[{
          backgroundColor: Colors.mainColor, width: wp(60),
          height: wp(13),
          borderRadius: wp(15),
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: wp(12),
        }]}
        onPress={() => _paymentIntentApi(item)}
      >
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: fonts.bold,
        }}>{item.buttonText}</Text>
      </TouchableOpacity>


    </View>
  );
  const{top}=useSafeAreaInsets()
  return (
    <View style={{ flex: 1,backgroundColor:"#FAFAFA", paddingTop: Platform.OS === 'ios' ? 30 : 0 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        {isloading && <Loader />}
       

        <View
          style={{
            // marginTop: wp(7),
           
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation:4,
            width:wp(100),
            height:wp(25),
            backgroundColor:'#FAFAFA',
            paddingHorizontal:wp(4),
            paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
           <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
          <TouchableOpacity onPress={() => navigation.navigate('IndexDrawer')}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
              marginRight: wp(7),
            }}
          >Subscription Plan</Text>
          <Text></Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <Image
              source={images.modalLogo}
              resizeMode="contain"
              style={{ width: wp(80), height: wp(30), alignSelf: 'center',marginTop:wp(4) }}
            />
          </View>

          {/* {mySubscription?.subscription == 1 ? (
            <View
              style={{
                backgroundColor: '#ECF7F3',
                width: wp(90),
                alignSelf: 'center',
                paddingHorizontal: wp(3),
                paddingVertical: wp(3),
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: wp(3),
                marginTop: wp(2),
                elevation: 1,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'white',
                shadowRadius: 8,
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
                  Premium {mySubscription?.data?.plan?.interval=='month'&&'Monthly'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                  }}
                >
                  Renews on: {mySubscription?.expires_at}
                </Text>
              </View>
              <Image
                source={images.inviteuser}
                resizeMode="contain"
                style={{ width: 41, height: 41 }}
              />
            </View>
          ) : null} */}

          <View style={{ marginHorizontal: wp(5) }}>
            {mySubscription?.subscription == '1' ? (
              <View
                style={{
                  alignSelf: 'center',
                  marginHorizontal: wp(5),
                  borderRadius: wp(4),
                  // overflow: 'hidden',
                  // elevation: 5,
                  // shadowColor: '#000',
                  // shadowOffset: { width: 0, height: 2 },
                  // shadowOpacity: 0.2,
                  // shadowRadius: 4,
                  marginTop: wp(10),
                }}
              >
                <ImageBackground
                  source={require('../../Assets/completesub.png')}
                  resizeMode="contain"
                  style={{
                    width: wp(90),
                    height: wp(90),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}

                ></ImageBackground>
                <View style={{ marginTop: wp(10) }}>
                  <Text style={{ fontSize: 12, fontFamily: fonts.bold, color: Colors.black, textAlign: 'center' }}>You have subscribed <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black }}>${(mySubscription.data.plan.amount / 100)}</Text>/{mySubscription.data.plan.interval} plan</Text>
                </View>
                <TouchableOpacity style={{ width: wp(60), height: wp(13), borderRadius: wp(10), marginTop: wp(15), backgroundColor: '#FF080C', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => cancelSubscription()}>
                  <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.white }}>Cancel Subscription</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // <FlatList
              //   data={MySubscription}
              //   keyExtractor={item => item?.id?.toString()}
              //   renderItem={({ item }) => (
              //     <ImageBackground
              //       source={images.subbackground}
              //       resizeMode="contain"
              //       style={{
              //         width: wp(90),
              //         height: wp(60),
              //         borderRadius: wp(3),
              //         alignSelf: 'center',
              //         paddingHorizontal: wp(4),
              //         paddingVertical: wp(3),
              //         marginLeft: wp(5),
              //       }}
              //     >
              //       <View style={{ marginTop: wp(8) }}>
              //         <Text
              //           style={{
              //             fontSize: 14,
              //             fontFamily: fonts.bold,
              //             color: Colors.black,
              //           }}
              //         >
              //           {item?.duration}
              //         </Text>
              //       </View>
              //       <View style={{}}>
              //         <Text
              //           style={{
              //             fontSize: 22,
              //             fontFamily: fonts.bold,
              //             color: Colors.mainColor,
              //           }}
              //         >
              //           $ {item?.price}
              //         </Text>
              //       </View>
              //       <View
              //         style={{ flexDirection: 'row', alignItems: 'center' }}
              //       >
              //         <SimpleLineIcons
              //           name="check"
              //           size={12}
              //           color={Colors.mainColor}
              //         />
              //         <Text
              //           style={{
              //             fontSize: 12,
              //             fontFamily: fonts.medium,
              //             color: Colors.mainColor,
              //             marginLeft: wp(1),
              //           }}
              //         >
              //           {item.feature1}
              //         </Text>
              //       </View>
              //       <View
              //         style={{ flexDirection: 'row', alignItems: 'center' }}
              //       >
              //         <SimpleLineIcons
              //           name="check"
              //           size={12}
              //           color={Colors.mainColor}
              //         />
              //         <Text
              //           style={{
              //             fontSize: 12,
              //             fontFamily: fonts.medium,
              //             color: Colors.mainColor,
              //             marginLeft: wp(1),
              //           }}
              //         >
              //           {item.feature2}
              //         </Text>
              //       </View>
              //       {item.feature3 ? (
              //         <View
              //           style={{ flexDirection: 'row', alignItems: 'center' }}
              //         >
              //           <SimpleLineIcons
              //             name="check"
              //             size={12}
              //             color={Colors.mainColor}
              //           />
              //           <Text
              //             style={{
              //               fontSize: 12,
              //               fontFamily: fonts.medium,
              //               color: Colors.mainColor,
              //               marginLeft: wp(1),
              //             }}
              //           >
              //             {item.feature3}
              //           </Text>
              //         </View>
              //       ) : null}

              //       <View
              //         style={{
              //           width: wp(75),
              //           height: wp(0.3),
              //           backgroundColor: '#E9E9E9',
              //           alignSelf: 'center',
              //           marginTop: item.feature3 ? wp(1) : wp(6),
              //         }}
              //       ></View>
              //       <TouchableOpacity
              //         disabled={
              //           mySubscription.subscription == '1' ? true : false
              //         }
              //         onPress={() => _paymentIntentApi(item)}
              //       >
              //         <Text
              //           style={{
              //             fontSize: 14,
              //             fontFamily: fonts.bold,
              //             color: Colors.mainColor,
              //             textAlign: 'center',
              //             marginTop: wp(2),
              //           }}
              //         >
              //           Upgrade To {item.duration}
              //         </Text>
              //       </TouchableOpacity>
              //     </ImageBackground>

              //   )}
              // />
              <View>

                <ImageBackground
                  source={require('../../Assets/sbg.png')}
                  resizeMode="cover"
                  style={{
                    width: wp(90),
                    height: 400,
                    borderRadius: wp(5),
                    // backgroundColor: 'red',      
                    overflow: 'hidden',
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    marginTop: wp(10)
                  }}
                  imageStyle={{ borderRadius: wp(10) }}
                >
                  <FlatList
                    ref={flatListRef}
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScrollEnd}
                    getItemLayout={(data, index) => ({
                      length: width * 0.9,
                      offset: (width * 0.9) * index,
                      index,
                    })}
                  />
                </ImageBackground>
                <View style={{
                  flexDirection: 'row',
                  marginTop: wp(3),
                  alignSelf:"center"
                }}>
                  <View style={[{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderColor:Colors.mainColor,
                    borderWidth:1,
                    marginHorizontal: 6,
                  }, activeIndex === 0 && {
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.mainColor,
                    marginHorizontal: 6,
                  }]} />
                  <View style={[{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderColor:Colors.mainColor,
                    borderWidth:1,
                    marginHorizontal: 6,
                  }, activeIndex === 1 && { backgroundColor: Colors.mainColor, }]} />
                </View>
                <View style={{ marginTop: wp(7), marginHorizontal: wp(5) }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: Colors.black, textAlign: 'center', lineHeight: 18 }}>Start with the 7-day free trial. After the trial, the selected plan will be auto-charged, and the user can cancel the subscription at any time.</Text>
                </View>
              </View>

            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Subscription;
