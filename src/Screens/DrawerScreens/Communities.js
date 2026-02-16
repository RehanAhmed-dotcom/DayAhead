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
  const [onchangeTab, setOnChangeTab] = useState('1');
  const [myCommunitydata, setMyCommunityData] = useState([]);
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
  const getMyCommunity = () => {
    AllGetAPI({ url: 'view-all-community', Token: user?.api_token })
      .then(res => {
        setMyCommunityData(res.data || []);
      })
      .catch(err => {
        console.log('Community API error:', err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getAllCommunity();
      getMyCommunity();
    }, []),
  );
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30 : 0 }}
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
            // elevation: 4,
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
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={images.menuIcon}
              style={{ width: 26, height: 26 }}
              tintColor="white"
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
            Community
          </Text>
          <View />
        </View>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-evenly',
            justifyContent: 'center',
            marginTop: wp(8),
            marginBottom: wp(4),
          }}
        >
          <TouchableOpacity onPress={() => setOnChangeTab('1')}>
            <View
              style={{
                // paddingHorizontal: wp(10),
                width: wp(42),
                alignItems: 'center',
                height: 40,
                // paddingVertical: wp(2),
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor:
                  onchangeTab === '1' ? Colors.mainColor : '#BD2BAF33',
                marginRight: wp(3),
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.bold,
                  color: onchangeTab === '1' ? 'white' : Colors.white,
                }}
              >
                My Communities
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOnChangeTab('2')}>
            <View
              style={{
                // paddingHorizontal: wp(10),
                width: wp(42),
                alignItems: 'center',
                // paddingVertical: wp(2),
                justifyContent: 'center',
                height: 40,
                borderRadius: 10,
                backgroundColor:
                  onchangeTab === '2' ? Colors.mainColor : '#BD2BAF33',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.bold,
                  color: onchangeTab === '2' ? 'white' : Colors.white,
                }}
              >
                Other Communities
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            {onchangeTab == 1 ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: fonts.bold }}>
                    Community
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CreateCommunity')}
                    style={{
                      backgroundColor: Colors.mainColor,
                      borderRadius: 5,
                      paddingHorizontal: 20,
                      height: 30,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: wp(5),
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontFamily: fonts.medium,
                      }}
                    >
                      + Create
                    </Text>
                  </TouchableOpacity>
                </View>

                {myCommunitydata.length !== 0 ? (
                  <FlatList
                    data={myCommunitydata}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        // onPress={()=>console.log("iem",item.attachments[0].attachment)}
                        onPress={() =>
                          navigation.navigate('CommunityScreen', { item })
                        }
                        style={{
                          backgroundColor: '#BD2BAF33',

                          marginBottom: wp(3),
                          borderRadius: wp(3),
                          height: 100,
                          // elevation: 3,
                          shadowColor: '#000',
                          flexDirection: 'row',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.18,
                          shadowRadius: 8,
                          width: wp(89),
                          // padding: wp(4),

                          alignSelf: 'center',
                          marginTop: wp(0.5),
                        }}
                      >
                        <Image
                          style={{
                            height: 100,
                            width: 90,
                            borderRadius: wp(3),
                          }}
                          source={
                            item?.attachments[0]?.attachment
                              ? { uri: item?.attachments[0]?.attachment }
                              : require('../../Assets/RelaxFull.png')
                          }
                        />
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                color: 'white',
                                marginTop: 10,
                                marginLeft: 10,
                                fontFamily: fonts.bold,
                              }}
                            >
                              {item.title}
                            </Text>
                          </View>
                          <Text
                            numberOfLines={2}
                            style={{
                              marginTop: 5,
                              marginLeft: 10,
                              width: 200,
                              color: '#DFDFDF',
                              fontSize: 12,
                            }}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      flex: 1,
                      verticalAlign: 'middle',
                    }}
                  >
                    You haven’t created any community yet.
                  </Text>
                )}
              </>
            ) : (
              <>
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
                        color: Colors.white,
                      }}
                    >
                      No Community found.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      style={{
                        color: 'white',
                        paddingLeft: 20,
                        marginTop: 5,
                        fontSize: 10,
                        marginBottom: 20,
                      }}
                    >
                      Communities that you have joined
                    </Text>
                    <FlatList
                      key="grid-2"
                      data={communitydata}
                      keyExtractor={item => item?.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('JoinCommunity', { item })
                          }
                          // onPress={()=>console.log("iem",item)}
                          style={{
                            // backgroundColor: "#BD2BAF33",
                            // height:100,

                            backgroundColor: '#BD2BAF33',
                            marginBottom: wp(3),
                            borderRadius: wp(3),
                            height: 100,
                            // elevation: 3,
                            shadowColor: '#000',
                            flexDirection: 'row',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.18,
                            shadowRadius: 8,
                            width: wp(89),
                            // padding: wp(4),

                            alignSelf: 'center',
                            marginTop: wp(0.5),
                          }}
                        >
                          <Image
                            resizeMode="cover"
                            style={{
                              height: 100,
                              width: 90,
                              borderRadius: wp(3),
                            }}
                            source={
                              item?.attachments[0]?.attachment
                                ? { uri: item?.attachments[0]?.attachment }
                                : require('../../Assets/RelaxFull.png')
                            }
                          />
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: 'white',
                                  marginTop: 10,
                                  marginLeft: 10,
                                  fontFamily: fonts.bold,
                                }}
                              >
                                {item.title}
                              </Text>
                            </View>
                            <Text
                              numberOfLines={2}
                              style={{
                                marginTop: 5,
                                marginLeft: 10,
                                width: 200,
                                color: '#DFDFDF',
                                fontSize: 12,
                              }}
                            >
                              {item.description}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Communities;
