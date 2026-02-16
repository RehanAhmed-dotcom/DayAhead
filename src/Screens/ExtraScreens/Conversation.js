// Conversation.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Keyboard,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import database from '@react-native-firebase/database';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import { sendMessage } from '../../Components/ChatComponent';
import { images, fonts, Colors } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const getChatRoomId = (u1, u2) => [u1, u2].sort().join('_');

const Conversation = ({ navigation, route }) => {
  const { item } = route.params;
  const user = useSelector(state => state.user.user);
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [confirm2, setconfirm2] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const currentUserKey = user?.email.replace(/[^a-zA-Z0-9 ]/g, '');
  const guestUserKey = item?.email.replace(/[^a-zA-Z0-9 ]/g, '');
  const chatRoomId = getChatRoomId(currentUserKey, guestUserKey);

  const guestData = {
    username: item?.username || item?.name,
    email: item?.email,
    image: item?.image,
  };
  const userData = {
    username: user?.name,
    email: user?.email,
    image: user?.image,
  };

  // Upload Image
  const uploadImage = async imagePath => {
    const formData = new FormData();
    formData.append('file', {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    setIsLoading(true);
    try {
      const res = await PostAPiwithToken(
        { url: 'upload-files', Token: user.api_token },
        formData,
      );
      setIsLoading(false);
      return res.data;
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      return null;
    }
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
    }).then(async img => {
      const url = await uploadImage(img.path);
      if (url) setImage({ data: url });
      setconfirm2(false);
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({}).then(async img => {
      const url = await uploadImage(img.path);
      if (url) setImage({ data: url });
      setconfirm2(false);
    });
  };

  // Send Message
  const handleSend = async () => {
    if (!message.trim() && !image) return;

    const imageUrl = image ? image.data : null;
    await sendMessage(
      message,
      currentUserKey,
      guestUserKey,
      imageUrl,
      guestData,
      userData,
    );

    setMessage('');
    setImage(null);
  };

  // Listen to Messages
  useEffect(() => {
    const msgRef = database().ref(`messages/${chatRoomId}`);

    const onUpdate = snapshot => {
      const list = [];
      snapshot.forEach(child => {
        list.push({
          id: child.key,
          ...child.val(),
        });
      });
      list.sort((a, b) => a.date - b.date); // oldest first
      setMessages(list);
    };

    msgRef.on('value', onUpdate);

    return () => msgRef.off('value', onUpdate);
  }, [chatRoomId]);

  // Reset unread counter when chat opens
  useFocusEffect(
    useCallback(() => {
      database()
        .ref(`users/${currentUserKey}/${guestUserKey}`)
        .update({ counter: 0 });
    }, [currentUserKey, guestUserKey]),
  );

  // Auto scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isMine = item.sender === currentUserKey;

    return (
      <View
        style={[styles.messageContainer, isMine ? styles.right : styles.left]}
      >
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
        >
          {item.image && (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.image);
                setImageModalVisible(true);
              }}
            >
              <Image source={{ uri: item.image }} style={styles.chatImage} />
            </TouchableOpacity>
          )}
          {item.msg ? (
            <Text style={isMine ? styles.myText : styles.theirText}>
              {item.msg}
            </Text>
          ) : null}
          <Text style={styles.timeText}>
            {moment(item.date).format('HH:mm')}
          </Text>
        </View>
      </View>
    );
  };
  const top = useSafeAreaInsets().top;
  const screenHeight = Dimensions.get('window').height;
  return (
    <ImageBackground
      source={images.mainImage}
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 15 : 0,
        height: '100%',
      }}
      resizeMode="cover"
    >
      {isloading && <Loader />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
            // shadowOffset: { width: 0, height: 3 },
            // shadowOpacity: 0.25,
            // shadowRadius: 4,
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              height: 25,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              width: 25,
            }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              marginRight: wp(5),
            }}
          >
            Conversation
          </Text>
          <Text></Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          contentContainerStyle={{
            padding: wp(4),
            paddingBottom: wp(5),
            marginTop: wp(0),
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* Image Preview */}
        {image && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image.data }} style={styles.previewImg} />
            <TouchableOpacity
              onPress={() => setImage(null)}
              style={styles.removeImg}
            >
              <AntDesign name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="white"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            onPress={() => setconfirm2(true)}
            style={styles.attachBtn}
          >
            <Image
              source={images.attach}
              tintColor={'white'}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSend} disabled={!message && !image}>
            <Ionicons
              name="send"
              size={24}
              color={message || image ? Colors.white : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* Attach Modal */}
      <Modal transparent visible={confirm2} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setconfirm2(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalItem} onPress={openCamera}>
                <Text style={styles.modalText}>Camera</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.modalItem} onPress={openGallery}>
                <Text style={styles.modalText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Full Image Modal */}
      <Modal visible={isImageModalVisible} transparent>
        <View style={styles.fullImageContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeFullImage}
            onPress={() => setImageModalVisible(false)}
          >
            <AntDesign name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(5),
    paddingTop: wp(10),
  },
  headerTitle: { fontSize: 18, color: 'white', fontFamily: fonts.bold },
  messageContainer: { marginVertical: 4 },
  right: { alignItems: 'flex-end' },
  left: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: wp(70),
    padding: wp(3),
    borderRadius: wp(4),
    paddingBottom: wp(1),
  },
  myBubble: { backgroundColor: Colors.mainColor },
  theirBubble: { backgroundColor: '#00000066' },
  myText: { color: 'white', fontSize: wp(4) },
  theirText: { color: 'white', fontSize: wp(4) },
  timeText: {
    fontSize: 10,
    color: 'white',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatImage: {
    width: wp(60),
    height: wp(60),
    borderRadius: 10,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BD2BAF4D',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: wp(3),
    // borderTopWidth: 1,
    borderColor: '#eee',
    marginBottom: Platform.OS == 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    // backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: wp(4),
    color: 'white',
    paddingVertical: wp(3),
    marginRight: wp(2),
    // marginBottom:wp(2)
  },
  attachBtn: { marginRight: wp(3) },
  imagePreview: {
    position: 'absolute',
    bottom: 80,
    left: wp(4),
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 5,
  },
  previewImg: { width: 60, height: 60, borderRadius: 8 },
  removeImg: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    marginBottom: Platform.OS === 'ios' ? 34 : 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalItem: { padding: 20, alignItems: 'center' },
  modalText: { fontSize: 16 },
  divider: { height: 1, backgroundColor: '#ddd', marginHorizontal: 20 },
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: { width: '100%', height: '100%' },
  closeFullImage: { position: 'absolute', top: 40, right: 20 },
});

export default Conversation;
