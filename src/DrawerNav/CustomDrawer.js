import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, { useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { images, fonts, Colors, styles } from '../Constant/Index';
import { useNavigation } from '@react-navigation/native';

const CustomDrawer = props => {
  return (
    // <View style={{ flex: 1, backgroundColor: Colors.white }}>
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1 }}
      // imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../Assets/logintop.png')}
          resizeMode="cover"
          style={{ width: 250, height: wp(45) }}
        />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* </View> */}
    </ImageBackground>
  );
};

export default CustomDrawer;
