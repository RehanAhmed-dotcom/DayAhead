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
  Alert,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/MaterialIcons';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import database from '@react-native-firebase/database';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AllGetAPI } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const Chat = ({ navigation }) => {
  const [onchangeTab, setOnChangeTab] = useState('1');
  const user = useSelector(state => state.user.user);
  const [List, setList] = useState([]);
  const [communitydata, setCommunityData] = useState([]);

  // Clean email key (Firebase doesn't allow . @ etc.)
  const getCleanKey = email => email?.replace(/[^a-zA-Z0-9 ]/g, '') || '';

  // Real-time listener for chat list
  useEffect(() => {
    if (!user?.email) return;

    const myKey = getCleanKey(user.email);
    const chatListRef = database().ref(`users/${myKey}`);

    const onChatUpdate = snapshot => {
      const chats = [];

      snapshot.forEach(child => {
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

      console.log(chats);
    };

    chatListRef.on('value', onChatUpdate);

    // Cleanup listener
    return () => {
      chatListRef.off('value', onChatUpdate);
    };
  }, [user?.email]);

  const deleteChat = async chatKey => {
    try {
      if (!user?.email) return;

      const myKey = getCleanKey(user.email);
      const otherUserKey = getCleanKey(chatKey); // chatKey is the other user's email

      // References to both users' chat entries
      const myChatRef = database().ref(`users/${myKey}/${chatKey}`);
      const otherUserChatRef = database().ref(`users/${otherUserKey}/${myKey}`);

      // Remove from both sides
      await Promise.all([myChatRef.remove(), otherUserChatRef.remove()]);

      Alert.alert('Success', 'Chat deleted successfully');

      // Also delete all messages between users if needed
      await deleteAllMessagesBetweenUsers(myKey, otherUserKey);
    } catch (error) {
      console.error('Error deleting chat:', error);
      Alert.alert('Error', 'Failed to delete chat');
    }
  };

  const deleteAllMessagesBetweenUsers = async (user1Key, user2Key) => {
    try {
      // Create a unique chat ID (sorted to ensure consistency)
      const chatIds = [user1Key, user2Key].sort();
      const chatId = `${chatIds[0]}_${chatIds[1]}`;

      // Reference to messages node
      const messagesRef = database().ref(`messages/${chatId}`);

      // Remove all messages
      await messagesRef.remove();
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  const handleDeleteChat = (chatKey, username) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete your conversation with ${username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChat(chatKey),
        },
      ],
    );
  };

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

  const renderChatItem = ({ item }) => {
    const renderRightActions = () => {
      return (
        <TouchableOpacity
          style={[
            {
              backgroundColor: '#BD2BAF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginr: 12,
              padding: 8,
              marginVertical: 16,
              borderRadius: wp(2),
            },
          ]}
          onPress={() => handleDeleteChat(item.key, item.user.username)}
        >
          <Fontisto name="delete" color="white" size={35} />
        </TouchableOpacity>
      );
    };
    return (
      <ReanimatedSwipeable renderRightActions={() => renderRightActions()}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Conversation', { item: item.user })
          }
          style={{
            width: wp(90),
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: wp(3),
            // borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={
                item.user.image ? { uri: item.user.image } : images.avatarpic
              }
              style={{
                width: wp(14),
                borderWidth: 1,
                borderColor: 'white',
                height: wp(14),
                borderRadius: wp(7),
              }}
              resizeMode="cover"
            />
            <View style={{ marginLeft: wp(3), maxWidth: wp(50) }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                }}
              >
                {item.user.username}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  marginTop: 5,
                  color: Colors.white,
                  fontFamily: fonts.regular,
                }}
              >
                {item.latestMessage || 'Start chatting...'}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={{ fontSize: 10, color: Colors.white, marginBottom: 4 }}
            >
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
                  backgroundColor: Colors.mainColor,
                  minWidth: wp(6),
                  height: wp(6),
                  borderRadius: wp(3),
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 11,
                    fontFamily: fonts.bold,
                  }}
                >
                  {item.counter > 99 ? '99+' : item.counter}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    );
  };
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
      resizeMode="cover"
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
          // shadowColor: '#000',
          // shadowOffset: { width: 0, height: 6 }, // push shadow down
          // shadowOpacity: 0.2,
          // shadowRadius: 3,
        }}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <TouchableOpacity
          style={{ width: 45 }}
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={images.menuIcon}
            style={{ width: 26, height: 26 }}
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.white }}
        >
          Chat
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChatAI')}>
          <ImageBackground
            source={images.mainImage}
            style={{
              width: 35,
              height: 35,
              borderRadius: 40,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('../../Assets/AIBot.png')}
              style={{ width: 30, height: 30 }}
            />
          </ImageBackground>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {/* <View
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
      </View> */}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginTop: wp(0) }}>
          {List.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor:"red",
                marginTop: wp(5),
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.white,
                  fontFamily: fonts.medium,
                }}
              >
                No chats yet
              </Text>
              <Text
                style={{ fontSize: 14, color: Colors.white, marginTop: 10 }}
              >
                Start a conversation!
              </Text>
            </View>
          ) : (
            <FlatList
              data={List}
              keyExtractor={item => item.key}
              renderItem={renderChatItem}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('FriendsMembers')}
      >
        <Fontisto name="add" size={24} color="white" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Chat;
