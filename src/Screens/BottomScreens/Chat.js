// Chat.js - Complete Fixed Version
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import database from '@react-native-firebase/database';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AllGetAPI } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Chat = ({ navigation }) => {
  const [onchangeTab, setOnChangeTab] = useState('1');
  const user = useSelector(state => state.user.user);
  const [List, setList] = useState([]);
  const [communitydata, setCommunityData] = useState([]);

  // Clean email key (Firebase doesn't allow . @ etc.)
  const getCleanKey = (email) => email?.replace(/[^a-zA-Z0-9 ]/g, '') || '';

  // Real-time listener for chat list
  useEffect(() => {
    if (!user?.email) return;

    const myKey = getCleanKey(user.email);
    const chatListRef = database().ref(`users/${myKey}`);

    const onChatUpdate = (snapshot) => {
      const chats = [];

      snapshot.forEach((child) => {
        const data = child.val();
        if (data?.user) {
          chats.push({
            key: child.key,
            latestMessage: data.latestMessage || '',
            timestamp: data.timestamp || 0,
            counter: data.counter || 0,
            user: {
              username: data.user.username || child.key.split('@')[0],
              email: child.key,
              image: data.user.image || null,
            },
          });
        }
      });

      // Sort by latest message time
      chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setList(chats);
    };

    chatListRef.on('value', onChatUpdate);

    // Cleanup listener
    return () => {
      chatListRef.off('value', onChatUpdate);
    };
  }, [user?.email]);

  // Load communities
  const getAllCommunity = () => {
    AllGetAPI({ url: 'view-all-community', Token: user?.api_token })
      .then(res => {
        setCommunityData(res.data || []);
      })
      .catch(err => {
        console.log('Community API error:', err);
      });
  };

  useEffect(() => {
    getAllCommunity();
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Conversation', { item: item.user })}
      style={{
        width: wp(90),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: wp(3),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={item.user.image ? { uri: item.user.image } : images.avatarpic}
          style={{ width: wp(14), height: wp(14), borderRadius: wp(7) }}
          resizeMode="cover"
        />
        <View style={{ marginLeft: wp(3), maxWidth: wp(50) }}>
          <Text style={{ fontSize: 15, fontFamily: fonts.bold, color: Colors.black }}>
            {item.user.username}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: Colors.lightgrey,
              fontFamily: fonts.regular,
            }}
          >
            {item.latestMessage || 'Start chatting...'}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 10, color: Colors.lightgrey, marginBottom: 4 }}>
          {item.timestamp
            ? moment(item.timestamp).calendar({
                sameDay: 'HH:mm',
                lastDay: '[Yesterday]',
                lastWeek: 'DD/MM',
                sameElse: 'DD/MM/YYYY',
              })
            : ''}
        </Text>

        {item.counter > 0 && (
          <View
            style={{
              backgroundColor: '#F54975',
              minWidth: wp(6),
              height: wp(6),
              borderRadius: wp(3),
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 11, fontFamily: fonts.bold }}>
              {item.counter > 99 ? '99+' : item.counter}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground source={images.myallbackbg} style={{ flex: 1,paddingTop:Platform.OS === 'ios' ?35: 0 }} resizeMode="cover">
    

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
          Chat / Community
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           
          </View>
        </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: wp(8),
          marginBottom: wp(4),
        }}
      >
        <TouchableOpacity onPress={() => setOnChangeTab('1')}>
          <View
            style={{
              paddingHorizontal: wp(10),
              paddingVertical: wp(2),
              borderRadius: 30,
              backgroundColor: onchangeTab === '1' ? Colors.mainColor : '#ECF7F3',
              marginRight: wp(3),
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: fonts.bold,
                color: onchangeTab === '1' ? 'white' : Colors.black,
              }}
            >
              Chats
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setOnChangeTab('2')}>
          <View
            style={{
              paddingHorizontal: wp(10),
              paddingVertical: wp(2),
              borderRadius: 30,
              backgroundColor: onchangeTab === '2' ? Colors.mainColor : '#ECF7F3',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: fonts.bold,
                color: onchangeTab === '2' ? 'white' : Colors.black,
              }}
            >
              Community
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {onchangeTab === '1' ? (
          <View style={{ flex: 1, marginTop: wp(4) }}>
            {List.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: wp(60),
                }}
              >
                <Text style={{ fontSize: 18, color: Colors.white, fontFamily: fonts.medium }}>
                  No chats yet
                </Text>
                <Text style={{ fontSize: 14, color: Colors.lightgrey, marginTop: 10 }}>
                  Start a conversation!
                </Text>
              </View>
            ) : (
              <FlatList
                data={List}
                keyExtractor={(item) => item.key}
                renderItem={renderChatItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        ) : (
          // Community Tab
          <View style={{ flex: 1, paddingHorizontal: wp(5), marginTop: wp(4) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wp(4) }}>
              <View>
                <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black }}>
                  Community
                </Text>
                <Text style={{ fontSize: 12, color: Colors.lightgrey }}>
                  Communities you have joined
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateCommunity')}
                style={{
                  backgroundColor: Colors.mainColor,
                  paddingHorizontal: wp(6),
                  paddingVertical: wp(2.5),
                  borderRadius: wp(5),
                }}
              >
                <Text style={{ color: 'white', fontSize: 11, fontFamily: fonts.bold }}>
                  + Create
                </Text>
              </TouchableOpacity>
            </View>
<View style={{marginBottom:wp(22)}}>
            <FlatList
              data={communitydata}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('CommunityScreen', { item })}
                  style={{
                    backgroundColor: 'white',
                    marginBottom: wp(3),
                    borderRadius: wp(3),
                    elevation:3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    width:wp(89),
                    padding: wp(4),
                    alignSelf:'center',
                    marginTop:wp(0.5)
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 15, fontFamily: fonts.bold }}>{item.title}</Text>
                    <View
                      style={{
                        backgroundColor: item.title === 'Sensitive' ? '#FF0835' : Colors.mainColor,
                        paddingHorizontal: wp(3),
                        paddingVertical: wp(1),
                        borderRadius: wp(2),
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 10 }}>
                        {item.title.split(' ')[0]}
                      </Text>
                    </View>
                  </View>
                  <Text numberOfLines={2} style={{ marginTop: 5, color: '#666', fontSize: 12 }}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center', marginTop: 50, color: 'white' }}>
                  No communities joined
                </Text>
              )}
            />
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default Chat;