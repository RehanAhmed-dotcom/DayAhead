import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Platform, StatusBar, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { images, fonts, Colors, styles } from '../Constant/Index';
import { useNavigation } from '@react-navigation/native';

const CustomDrawer = props => {
  return (
    <View  style={{ flex: 1, backgroundColor: Colors.white, }}>
  <View
  style={{
    // padding: wp(4),
    alignItems: 'center',
    // shadowColor: '#2CA57B',
    // shadowOffset: { width: 20, height: 22 }, 
    // shadowOpacity: 9,
    // shadowRadius: 4, 
    // elevation: 15, 
  }}
>
  <Image
    source={require('../Assets/logintop.png')}
    resizeMode="cover"
    style={{ width:250, height: wp(45) }}
  />
</View>

      <DrawerContentScrollView {...props} contentContainerStyle={{  paddingTop: 10 }}>
        <View style={{ }}>
          <DrawerItemList {...props} />
        </View>
   
      </DrawerContentScrollView>

     
    </View>
  )
}

export default CustomDrawer