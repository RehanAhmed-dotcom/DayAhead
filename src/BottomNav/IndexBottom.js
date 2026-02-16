// import React, { useState, useEffect } from 'react';
// import {
//   Alert,
//   Animated,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   Image,
//   Text,
//   Modal,
//   ImageBackground,
//   Platform,
//   KeyboardAvoidingView,
// } from 'react-native';
// import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
// import Feather from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { Colors, fonts, images } from '../Constant/Index';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import Home from '../Screens/BottomScreens/Home';
// import Tasks from '../Screens/BottomScreens/Tasks';
// // import Profile from '../Screens/BottomScreens/Profile';
// import Chat from '../Screens/BottomScreens/Chat';
// import AddNew from '../Screens/ExtraScreens/AddNew';
// import Notification from '../Screens/DrawerScreens/Notification';
// import Profile from '../Screens/BottomScreens/Profile';

// export default function IndexBottom({ navigation }) {
//   const _renderIcon = (routeName, selectedTab) => {
//     let icon = require('../Assets/homepic.png');
//     let text = 'Home';

//     switch (routeName) {
//       case 'Notification':
//         icon = require('../Assets/mynotiIcon.png');
//         text = 'Notification';
//         break;
//       case 'Tasks':
//         icon = require('../Assets/taskspic.png');
//         text = 'Tasks';
//         break;
//       case 'Chat':
//         icon = require('../Assets/chatpic.png');
//         text = 'Chat';
//         break;

//        case 'Profile':
//         icon = require('../Assets/profilepic.png');
//         text = 'Profile';
//         break;
//         // case 'Add New':
//         // icon = require('../Assets/addnewIcon.png');
//         // text = 'AddNew';
//         // break;
//     }

//     return (
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Image
//           style={{
//             width: wp(6),
//             height: wp(6),
//             tintColor: routeName === selectedTab ? Colors.mainColor : '#9E9E9E',
//           }}
//           source={icon}
//           resizeMode="contain"
//         />
//         <Text
//           style={{
//             fontSize: 12,
//             color: Colors.mainColor,
//             opacity: routeName === selectedTab ? 1 : 0,
//             height: 16,
//             fontFamily: fonts.medium,
//           }}
//         >
//           {text}
//         </Text>
//       </View>
//     );
//   };

//   const renderTabBar = ({ routeName, selectedTab, navigate }) => {
//     return (
//       <TouchableOpacity
//         onPress={() => navigate(routeName)}
//         style={styles.tabbarItem}
//       >
//         {_renderIcon(routeName, selectedTab)}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <CurvedBottomBar.Navigator
//       type="Up"
//       style={styles.bottomBar}
//       shadowStyle={styles.shawdow}
//       circlePosition="CENTER"
//       height={75}
//       circleWidth={80}
//       bgColor="#F5F5F5"
//       strokeWidth={10}
//       initialRouteName="Home"  // Start on Home
//       borderTopLeftRight
//       renderCircle={({ selectedTab, navigate }) => (
//         <Animated.View style={styles.btnCircleUp}>
//           <TouchableOpacity
//             style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
//             onPress={() => navigate('Home')}
//           >
//             <Image
//               source={require('../Assets/homepic.png')}
//               style={{
//                 width: wp(8),
//                 height: wp(8),
//                 tintColor: Colors.white,
//               }}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         </Animated.View>
//       )}
//       tabBar={renderTabBar}
//       screenOptions={{
//         headerShown: false,
//         tabBarHideOnKeyboard: true,
//       }}
//     >
//       {/* Left tabs */}
//       {/* <CurvedBottomBar.Screen
//         name="Add New"
//           position="LEFT"
//         component={() => <AddNew navigation={navigation} />}
//       /> */}
//        <CurvedBottomBar.Screen
//         name="Notification"
//         position="LEFT"
//         component={() => <Notification navigation={navigation} />}
//       />
//       <CurvedBottomBar.Screen
//         name="Tasks"
//         position="LEFT"
//         component={() => <Tasks navigation={navigation} />}
//       />

//       <CurvedBottomBar.Screen
//         name="Chat"
//         position="RIGHT"
//         component={() => <Chat navigation={navigation} />}
//       />

//       {/* <CurvedBottomBar.Screen
//         name="Notification"
//         position="RIGHT"
//         component={() => <Notification navigation={navigation} />}
//       /> */}
//       <CurvedBottomBar.Screen
//         name="Profile"
//         position="RIGHT"
//         component={() => <Profile navigation={navigation} />}
//       />

//       {/* Home screen – must be included for navigation to work */}
//       <CurvedBottomBar.Screen
//         name="Home"
//         component={() => <Home navigation={navigation} />}
//       />
//     </CurvedBottomBar.Navigator>
//   );
// }

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   shawdow: {
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 5, // 👈 for Android
//   },
//   button: {
//     justifyContent: 'center',
//     borderRadius: 15,
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   bottomBar: {
//     // marginBottom:wp(12),
//     alignItems: 'center',
//     justifyContent: 'center',
//     // borderTopWidth: 1,
//     // borderTopColor: '#E0E0E0',
//   },
//   btnCircleUp: {
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.mainColor,
//     // bottom: 35,
//     shadowColor: 'purple',
//     shadowOffset: {
//       width: 4,
//       height: 4,
//     },
//     shadowOpacity: 0.7,
//     shadowRadius: 7,
//     elevation: 5,
//   },
//   imgCircle: {
//     width: 30,
//     height: 30,
//     tintColor: '#9E9E9E',
//   },
//   tabbarItem: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: wp(7),
//   },
//   img: {
//     width: 30,
//     height: 30,
//   },

//   activityIndicatorWrapper: {
//     backgroundColor: '#fff',
//     height: hp(72),
//     width: wp(90),
//     borderRadius: 10,
//     display: 'flex',
//     alignItems: 'center',
//     // justifyContent: 'space-around',
//   },
//   MemIconimg: {
//     width: 200,
//     height: 200,
//   },
//   dollrimg: {
//     width: 300,
//     height: 90,
//     alignSelf: 'center',
//     marginTop: 40,
//     // alignItems:'center',
//     justifyContent: 'center',
//   },
//   dollrtxt: {
//     fontSize: 14,
//     fontFamily: fonts.bold,
//     color: '#FFFFFF',
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, fonts, images } from '../Constant/Index';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Home from '../Screens/BottomScreens/Home';
import Tasks from '../Screens/BottomScreens/Tasks';
// import Profile from '../Screens/BottomScreens/Profile';
import Chat from '../Screens/BottomScreens/Chat';
import AddNew from '../Screens/ExtraScreens/AddNew';
import Notification from '../Screens/DrawerScreens/Notification';
import Profile from '../Screens/BottomScreens/Profile';

export default function IndexBottom({ navigation }) {
  const _renderIcon = (routeName, selectedTab) => {
    let icon = require('../Assets/homepic.png');
    let text = 'Home';

    switch (routeName) {
      case 'Notification':
        icon = require('../Assets/mynotiIcon.png');
        text = 'Notification';
        break;
      case 'Tasks':
        icon = require('../Assets/taskspic.png');
        text = 'Tasks';
        break;
      case 'Chat':
        icon = require('../Assets/chatpic.png');
        text = 'Chat';
        break;

      case 'Profile':
        icon = require('../Assets/profilepic.png');
        text = 'Profile';
        break;
      // case 'Add New':
      // icon = require('../Assets/addnewIcon.png');
      // text = 'AddNew';
      // break;
    }

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{
            width: wp(6),
            height: wp(6),
            tintColor: '#FFFFFF',
          }}
          source={icon}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 12,
            color: Colors.white,
            opacity: routeName === selectedTab ? 1 : 0,
            height: 16,
            marginTop: 5,
            fontFamily: fonts.medium,
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      type="Up"
      style={[styles.bottomBar]}
      shadowStyle={styles.shawdow}
      circlePosition="CENTER"
      height={75}
      circleWidth={80}
      bgColor="#BD2BAF"
      strokeWidth={10}
      initialRouteName="Home" // Start on Home
      borderTopLeftRight
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigate('Home')}
          >
            <Image
              source={require('../Assets/homepic.png')}
              style={{
                width: wp(8),
                height: wp(8),
                tintColor: '#BD2BAF',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Left tabs */}
      {/* <CurvedBottomBar.Screen
        name="Add New"  
          position="LEFT"
        component={() => <AddNew navigation={navigation} />}
      /> */}
      <CurvedBottomBar.Screen
        name="Tasks"
        position="LEFT"
        component={() => <Tasks navigation={navigation} />}
      />
      <CurvedBottomBar.Screen
        name="Chat"
        position="LEFT"
        component={() => <Chat navigation={navigation} />}
      />
      <CurvedBottomBar.Screen
        name="Notification"
        position="RIGHT"
        component={() => <Notification navigation={navigation} />}
      />

      {/* <CurvedBottomBar.Screen
        name="Notification"
        position="RIGHT"
        component={() => <Notification navigation={navigation} />}
      /> */}
      <CurvedBottomBar.Screen
        name="Profile"
        position="RIGHT"
        component={() => <Profile navigation={navigation} />}
      />

      {/* Home screen – must be included for navigation to work */}
      <CurvedBottomBar.Screen
        name="Home"
        component={() => <Home navigation={navigation} />}
      />
    </CurvedBottomBar.Navigator>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5, // 👈 for Android
  },
  button: {
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  bottomBar: {
    // backgroundColor: '#BD2BAF',
    // marginBottom:wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    // borderTopWidth: 1,
    // borderTopColor: '#E0E0E0',
  },
  btnCircleUp: {
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    // bottom: 35,
    shadowColor: 'purple',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7,
    elevation: 5,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: '#9E9E9E',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(7),
  },
  img: {
    width: 30,
    height: 30,
  },

  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: hp(72),
    width: wp(90),
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  MemIconimg: {
    width: 200,
    height: 200,
  },
  dollrimg: {
    width: 300,
    height: 90,
    alignSelf: 'center',
    marginTop: 40,
    // alignItems:'center',
    justifyContent: 'center',
  },
  dollrtxt: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
});
