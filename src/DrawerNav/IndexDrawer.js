import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Colors, styles, fonts, images } from '../Constant/Index';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomDrawer from './CustomDrawer';
import IndexBottom from '../BottomNav/IndexBottom';
import SnapAlarm from '../Screens/DrawerScreens/SnapAlarm';
import Planner from '../Screens/DrawerScreens/Planner';
import AboutUs from '../Screens/DrawerScreens/AboutUs';
// import Notification from '../Screens/DrawerScreens/Notification';
import MyJournal from '../Screens/DrawerScreens/MyJournal';
import JnlOnboard1 from '../Screens/ExtraScreens/JournalOnboard/JnlOnboard1';
import Stats from '../Screens/DrawerScreens/Stats';
import Routines from '../Screens/DrawerScreens/Routines';
import Podcast from '../Screens/DrawerScreens/Podcast';
import Communities from '../Screens/DrawerScreens/Communities';
import MyLanguages from '../Screens/DrawerScreens/MyLanguages';
import MyNotes from '../Screens/DrawerScreens/MyNotes';
import MyReminder from '../Screens/DrawerScreens/MyReminder';

import { useSelector } from 'react-redux';
import { AllGetAPI } from '../Components/ApiRoot';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Profile from '../Screens/BottomScreens/Profile';

const IndexDrawer = () => {
  const user = useSelector(state => state.user.user);
  // console.log('my user ddatt',JSON.stringify(user))
  const OnboardStatus = useSelector(
    state => state.onboarding.jnlBoardingStatus,
  );
  const [mySubscription, setmySubscription] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const Drawer = createDrawerNavigator();

  const CheckSubscription = () => {
    AllGetAPI({ url: 'check-subscription', Token: user?.api_token })
      .then(res => {
        // console.log('check subscription', JSON.stringify(res));
        setmySubscription(res.subscription || 0);
      })
      .catch(err => console.log('api error notes', err));
  };

  useFocusEffect(
    useCallback(() => {
      CheckSubscription();
    }, []),
  );

  const [isTrialActive, setIsTrialActive] = useState(true);

  // console.log('check subscription', JSON.stringify(isTrialActive));

  console.log('mytrail', isTrialActive);
  const checkTrialPeriod = () => {
    if (user?.created_at) {
      const createdAt = new Date(user.created_at);
      const trialEndDate = new Date(createdAt);
      trialEndDate.setDate(createdAt.getDate() + 7);
      const currentDate = new Date();
      if (currentDate > trialEndDate) {
        setIsTrialActive(false);
      } else {
        setIsTrialActive(true);
      }
    }
  };
  useEffect(() => {
    checkTrialPeriod();
  }, []);

  const modalClose = () => {
    setModalVisible(false);
    // navigation.closeDrawer
    navigation.navigate('IndexDrawer', {
      screen: 'IndexBottom',
    });
  };

  return (
    <>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        initialRouteName="IndexBottom"
        screenOptions={{
          drawerActiveBackgroundColor: 'transparent',
          // drawerActiveTintColor: Colors.buttoncolor,
          // drawerInactiveTintColor: Colors.buttoncolor,
          drawerItemStyle: { flex: 1, activeOpacity: 0.8, borderRadius: wp(3) },
          headerShown: false,
          drawerLabelStyle: { fontSize: 16 },
          drawerStyle: {
            // backgroundColor: Colors.lightgreen,
            width: 220,
            // borderTopRightRadius: wp(8),
            // borderBottomRightRadius: wp(8),
            overflow: 'hidden',
          },
        }}
      >
        <Drawer.Screen
          name="IndexBottom"
          component={IndexBottom}
          listeners={({ navigation }) => ({
            drawerItemPress: e => {
              e.preventDefault(); // prevent default drawer behavior
              navigation.navigate('IndexBottom', {
                screen: 'Home',
              });
            },
          })}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                {/* <TouchableOpacity onPress={()=>navigation.navigate('IndexBottom', {
  screen: 'Home',
})}> */}
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      // styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Home
                  </Text>
                </ImageBackground>
                {/* </TouchableOpacity> */}
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="SnapAlarm"
          component={SnapAlarm}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Snap Alarm
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        />

        {/* <Drawer.Screen
          name="Planner"
          component={Planner}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Planner
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        /> */}
        {/* <Drawer.Screen
          name="MyNotes"
          component={MyNotes}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    My Notes
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Account"
          component={Profile}
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="MyReminder"
          component={MyReminder}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    My Reminders
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        />
        */}

        <Drawer.Screen
          name="Communities"
          component={Communities}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Community
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        />
        {/* <Drawer.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    About Us
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        /> */}
        {/* <Drawer.Screen
          name="Notification"
          component={Notification}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(30),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Notification
                  </Text>
                </View>
              </View>
            ),
          }}
        /> */}

        {/* Journal */}
        {OnboardStatus === false &&
        mySubscription === 0 &&
        isTrialActive === true ? (
          <Drawer.Screen
            name="JnlOnboard1"
            component={JnlOnboard1}
            options={{
              drawerLabel: '',
              drawerIcon: ({ focused }) => (
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#EAEAEA',
                    paddingBottom: wp(3),
                    width: wp(40),
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={[
                        styles.screenname,
                        {
                          color: Colors.white,
                          fontFamily: fonts.bold,
                        },
                      ]}
                    >
                      Journals
                    </Text>
                  </View>
                </View>
              ),
            }}
          />
        ) : mySubscription === 1 || isTrialActive === true ? (
          <Drawer.Screen
            name="MyJournal"
            component={MyJournal}
            options={{
              drawerLabel: '',
              drawerIcon: ({ focused }) => (
                <View
                  style={{
                    borderBottomWidth: focused ? 0 : 1,
                    borderBottomColor: '#EAEAEA',
                    paddingBottom: wp(3),
                    width: wp(40),
                    alignItems: 'center',
                  }}
                >
                  <ImageBackground
                    source={
                      focused
                        ? require('../Assets/loginbuttonback_2.png')
                        : null
                    }
                    borderRadius={wp(3)}
                    resizeMode="cover"
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: wp(40),
                      height: focused ? wp(13) : null,
                    }}
                  >
                    <Text
                      style={[
                        styles.screenname,
                        {
                          color: Colors.white,
                          fontFamily: fonts.bold,
                        },
                      ]}
                    >
                      Journals
                    </Text>
                  </ImageBackground>
                </View>
              ),
            }}
          />
        ) : (
          <Drawer.Screen
            name="JournalLocked"
            component={() => null}
            listeners={{
              drawerItemPress: () => setModalVisible(true),
            }}
            options={{
              drawerLabel: '',
              drawerIcon: ({ focused }) => (
                <View
                  style={{
                    borderBottomWidth: focused ? 0 : 1,
                    borderBottomColor: '#EAEAEA',
                    paddingBottom: wp(3),
                    width: wp(40),
                    alignItems: 'center',
                  }}
                >
                  <ImageBackground
                    source={
                      focused
                        ? require('../Assets/loginbuttonback_2.png')
                        : null
                    }
                    borderRadius={wp(3)}
                    resizeMode="cover"
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: wp(40),
                      height: focused ? wp(13) : null,
                    }}
                  >
                    <Text
                      style={[
                        styles.screenname,
                        {
                          color: Colors.white,
                          fontFamily: fonts.bold,
                        },
                      ]}
                    >
                      Journals
                    </Text>
                  </ImageBackground>
                </View>
              ),
            }}
          />
        )}

        {/* Stats */}
        {mySubscription === 1 || isTrialActive === true ? (
          <Drawer.Screen
            name="Stats"
            component={Stats}
            options={{
              drawerLabel: '',
              drawerIcon: ({ focused }) => (
                <View
                  style={{
                    borderBottomWidth: focused ? 0 : 1,
                    borderBottomColor: '#EAEAEA',
                    paddingBottom: wp(3),
                    width: wp(40),
                    alignItems: 'center',
                  }}
                >
                  <ImageBackground
                    source={
                      focused
                        ? require('../Assets/loginbuttonback_2.png')
                        : null
                    }
                    borderRadius={wp(3)}
                    resizeMode="cover"
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: wp(40),
                      height: focused ? wp(13) : null,
                    }}
                  >
                    <Text
                      style={[
                        styles.screenname,
                        {
                          color: Colors.white,
                          fontFamily: fonts.bold,
                        },
                      ]}
                    >
                      Stats
                    </Text>
                  </ImageBackground>
                </View>
              ),
            }}
          />
        ) : (
          <Drawer.Screen
            name="StatsLocked"
            component={() => null}
            listeners={{
              drawerItemPress: () => setModalVisible(true),
            }}
            options={{
              drawerLabel: '',
              drawerIcon: ({ focused }) => (
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#EAEAEA',
                    paddingBottom: wp(3),
                    width: wp(40),
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={[
                        styles.screenname,
                        {
                          color: Colors.white,
                          fontFamily: fonts.bold,
                        },
                      ]}
                    >
                      Stats
                    </Text>
                  </View>
                </View>
              ),
            }}
          />
        )}

        {/* <Drawer.Screen
          name="Routines"
          component={Routines}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Routines
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        /> */}

        <Drawer.Screen
          name="Podcast"
          component={Podcast}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: focused ? 0 : 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(40),
                  alignItems: 'center',
                }}
              >
                <ImageBackground
                  source={
                    focused ? require('../Assets/loginbuttonback_2.png') : null
                  }
                  borderRadius={wp(3)}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(40),
                    height: focused ? wp(13) : null,
                  }}
                >
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Podcast
                  </Text>
                </ImageBackground>
              </View>
            ),
          }}
        />

        {/* <Drawer.Screen
          name="MyLanguages"
          component={MyLanguages}
          options={{
            drawerLabel: '',
            drawerIcon: ({ focused }) => (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#EAEAEA',
                  paddingBottom: wp(3),
                  width: wp(30),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.screenname,
                      {
                        color: Colors.white,
                        fontFamily: fonts.bold,
                      },
                    ]}
                  >
                    Languages
                  </Text>
                </View>
              </View>
            ),
          }}
        /> */}
      </Drawer.Navigator>

      {/* Modal - inline styles only */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ImageBackground
          source={images.mainImage}
          style={{
            flex: 1,
            // backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: wp(80),
              backgroundColor: '#00000033',
              borderRadius: 15,
              padding: 30,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 30,
                color: 'white',
                lineHeight: 22,
                fontFamily: fonts.medium || 'System',
              }}
            >
              Please subscribe to one of our plans to continue using this
              service.
            </Text>

            <View style={{ flexDirection: 'row', width: '100%' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: '#BD2BAF33',
                  borderRadius: 10,
                  marginRight: 10,
                  alignItems: 'center',
                }}
                onPress={() => {
                  // navigation.navigate('IndexDrawer', {
                  // screen: 'IndexBottom',
                  // params: { screen: 'Home' }}), setModalVisible(false)
                  modalClose();
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: 'white',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: Colors.mainColor,
                  borderRadius: 10,
                  marginLeft: 10,
                  alignItems: 'center',
                }}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Subscription');
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: 'white',
                  }}
                >
                  Subscribe
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Modal>
    </>
  );
};

export default IndexDrawer;
