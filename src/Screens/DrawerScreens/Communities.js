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
import React, { useCallback, useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';
import { AllGetAPI } from '../../Components/ApiRoot';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Communities = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [communitydata, setCommunityData] = useState([]);

  const getAllCommunity = () => {
    AllGetAPI({ url: 'all-community', Token: user?.api_token })
      .then(res => {
        setCommunityData(res.data);
        console.log('response of all community', JSON.stringify(res));
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllCommunity();
    }, []),
  );
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1,paddingTop:Platform.OS === 'ios' ?30: 0, }}
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
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginRight: wp(7) }}>
                        Communities
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    </View>
                </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            {communitydata.length < 1 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  No Community found.
                </Text>
              </View>
            ) : (
              <FlatList
                key="grid-2"
                data={communitydata}
                keyExtractor={item => item?.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('JoinCommunity', { item })
                    }
                    style={[
                      styles.flatView,
                      {
                        backgroundColor: Colors.white,
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
                      <Text style={{ fontSize: 14, fontFamily: fonts.bold }}>
                        {item.title}
                      </Text>
                      <View
                        style={{
                          width: wp(20),
                          height: wp(6),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: wp(1),
                          backgroundColor:
                            item.title == 'Sensitive' ? '#FF0835' : '#00B102',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: fonts.medium,
                            color: Colors.white,
                          }}
                        >
                          {item.title?.split(/\s+/)[0] || ''}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginTop: wp(2) }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.medium,
                          color: '#747474',
                        }}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Communities;
