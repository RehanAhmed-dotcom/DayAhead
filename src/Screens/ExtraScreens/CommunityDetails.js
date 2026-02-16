import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  Share,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
// import MaterialIcons from 'react-native-vector-icons/MaterialDesignIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const CommunityDetails = ({ navigation, route }) => {
  const { postdata } = route.params;
  // console.log('my post community', JSON.stringify(postdata));
  const user = useSelector(state => state.user.user);
  const [newComment, setnewComment] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [communityDetails, setCommunityDetails] = useState({});
  const [postComments, setPostComments] = useState([]);
  // console.log('my post comments', JSON.stringify(postComments));
  const [isloading, setIsLoading] = useState(false);
  const [modalReport, setModalReport] = useState(false);
  const [reporttitle, setReportTitle] = useState('');
  const dotOptions = [
    { label: 'Share', value: 'Share', icon: 'share' },
    { label: 'Report', value: 'Report', icon: 'flag' },
  ];

  const getCommunityPostsDetails = () => {
    const postID = Number(postdata?.redirect || postdata?.id);
    AllGetAPI({
      url: `view-community-post-detail/${postID}`,
      Token: user?.api_token,
    })
      .then(res => {
        setCommunityDetails(res.data || []);
        setPostComments(res?.data?.comments);
        console.log('my post details', JSON.stringify(res));
      })
      .catch(err => {
        console.log('api error tasks', err);
      });
  };
  useEffect(() => {
    getCommunityPostsDetails();
  }, []);

  const AddPostCommunityApi = () => {
    const formdata = new FormData();
    formdata.append('post_id', postdata?.id);
    formdata.append('comment', newComment);
    setIsLoading(true);
    PostAPiwithToken(
      { url: 'comment-community-post', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        console.log('add comment data', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          getCommunityPostsDetails();
          setnewComment('');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
        Alert.alert('Error', 'Failed to comment task');
      });
  };
  const addReportApi = () => {
    if (!reporttitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Reason is required',
      });
      return;
    }
    const formdata = new FormData();
    formdata.append('post_id', postdata?.id);
    formdata.append('reason', reporttitle);
    setIsLoading(true);
    PostAPiwithToken(
      { url: 'community-post-report', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        console.log('my report response', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          setModalReport(false);
          setReportTitle('');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
        Alert.alert('Error', 'Failed to comment task');
      });
  };

  // State to control dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const getCommunityPosts = () => {
    const itemID = Number(communityDetails?.id);
    setIsLoading(true);
    AllGetAPI({
      url: `view-all-community-post/${itemID}`,
      Token: user?.api_token,
    })
      .then(res => {
        setIsLoading(false);
        console.log('my post data new', JSON.stringify(res));

        if (res.status === 'success') {
          setCommunityPosts(res.data || []);
        } else {
          setIsLoading(false);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error tasks', err);
      });
  };

  const getLikesofPosts = id => {
    setIsLoading(true);
    AllGetAPI({
      url: `like-community-post/${id}`,
      Token: user?.api_token,
    })
      .then(res => {
        setIsLoading(false);
        // console.log('my post like', JSON.stringify(res));
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          //  getCommunityPosts();
          getCommunityPostsDetails();
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error tasks', err);
      });
  };
  // Handle option selection
  // if (option.value === 'Share') {
  //   // Handle share functionality
  //   console.log('Share selected');
  // } else if (option.value === 'Report') {
  //   // Handle report functionality
  //   console.log('Report selected');
  // }
  const shareFunction = async () => {
    const postId = postdata?.id || postdata?.redirect || communityDetails?.id;

    // Generate the deep link URL
    const deepLinkUrl = `https://plantflipsapp.com/community/post/${postId}`;
    console.log('deepLinking dd', deepLinkUrl);
    const shareMessage = `Check out this community post: ${
      deepLinkUrl || 'View this post in the app'
    }`;

    try {
      const result = await Share.share({
        message: shareMessage,
        url: deepLinkUrl,
        title: 'Community Post',
      });

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Share Error', 'Unable to share the post. Please try again.');
      console.log('Share error:', error.message);
    }
  };

  // Close dropdown when touching outside
  const handleBackdropPress = () => {
    setIsDropdownVisible(false);
  };

  // Render icon for each option
  const renderOptionIcon = iconName => {
    switch (iconName) {
      case 'share':
        return (
          <Image
            source={images.shareImg}
            resizeMode="contain"
            style={{ width: 16, height: 16 }}
          />
        );
      case 'flag':
        return (
          <Image
            source={images.reportImg}
            resizeMode="contain"
            style={{ width: 16, height: 16 }}
          />
        );
      default:
        return null;
    }
  };
  const { top } = useSafeAreaInsets();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
      resizeMode="cover"
    >
      {isloading && <Loader />}
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
            marginBottom: wp(4),
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
            style={{
              backgroundColor: 'white',
              width: 25,
              height: 25,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              // marginLeft: wp(12),
              alignItems: 'center',
            }}
          >
            {/* <Image
              source={
                postdata?.user?.image || postdata?.image
                  ? { uri: postdata?.user?.image || postdata?.image }
                  : images.avatarpic
              }
              resizeMode="contain"
              style={{
                width: 42,
                height: 42,
                marginRight: wp(2),
                borderRadius: 22,
              }}
            /> */}
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                }}
              >
                Post Detail
              </Text>
              {/* <Text
                style={{
                  fontSize: 8,
                  fontFamily: fonts.medium,
                  color: Colors.white,
                }}
              >
                6m ago
              </Text> */}
            </View>
          </View>

          <View
            style={{ flexDirection: 'row', width: 25, alignItems: 'center' }}
          >
            {/* <TouchableOpacity
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              style={{ padding: wp(2) }}
            >
              <Entypo
                name="dots-three-vertical"
                size={20}
                color={Colors.black}
              />
            </TouchableOpacity> */}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {communityDetails?.image ? (
            <View
              style={{
                width: wp(90),
                // backgroundColor: 'white',
                // marginVertical: wp(2),
                marginTop: wp(1),
                borderRadius: wp(3),
                alignSelf: 'center',
                // elevation: 2,
                // shadowColor: '#000',
                // shadowOffset: { width: 0, height: 4 },
                // shadowOpacity: 0.18,
                // shadowRadius: 8,
                // paddingHorizontal: wp(3),
                paddingVertical: wp(3),
              }}
            >
              <Image
                source={
                  communityDetails?.image
                    ? { uri: communityDetails?.image }
                    : postdata?.image
                }
                resizeMode="cover"
                style={{
                  width: wp(90),
                  height: wp(50),
                  alignSelf: 'center',
                  borderRadius: 8,
                }}
              />
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 30,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => getLikesofPosts(communityDetails?.id)}
                style={{
                  marginRight: wp(3),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Entypo
                  name={
                    communityDetails?.is_like === 1 ? 'heart' : 'heart-outlined'
                  }
                  size={18}
                  color={'white'}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.white,
                    marginLeft: 5,
                  }}
                >
                  {`(${communityDetails?.likes?.length})`}
                </Text>
                {/* <Image
                            source={images.heartIcon}
                            resizeMode="contain"
                            style={{
                              width: 17,
                              height: 17,
                              marginRight: wp(3),
                            }}
                          /> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  shareFunction();
                }}
              >
                <Image
                  tintColor={'white'}
                  source={images.shareIcon}
                  resizeMode="contain"
                  style={{ width: 17, height: 17 }}
                />
              </TouchableOpacity>
            </View>
            {/* <MaterialIcons
              name={'comment-alert-outline'}
              size={20}
              color={'white'}
            /> */}
            {communityDetails?.user?.id == user?.id ? null : (
              <TouchableOpacity
                onPress={() => {
                  setModalReport(true);
                }}
              >
                <Image
                  source={require('../../Assets/Q.png')}
                  style={{ width: 15, height: 15 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ marginHorizontal: wp(5), marginTop: wp(4) }}>
            {/* <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
              }}
            >
              What Can You Do on Marketplace?{' '}
            </Text> */}
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                color: Colors.white,
                lineHeight: 16,
              }}
            >
              {communityDetails?.description}
            </Text>
          </View>
          <View style={{ marginHorizontal: wp(3) }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.white,
                marginLeft: wp(2),
                marginTop: wp(2),
              }}
            >
              Comments ({postComments?.length})
            </Text>

            <View
              style={{
                marginBottom: isKeyboardVisible ? wp(15) : wp(1),
              }}
            >
              <FlatList
                data={postComments}
                keyExtractor={item =>
                  item?.id?.toString() || Math.random().toString()
                }
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: wp(90),
                      backgroundColor: '#BD2BAF33',
                      marginVertical: wp(2),
                      borderRadius: wp(3),
                      alignSelf: 'center',
                      // elevation: 2,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.18,
                      shadowRadius: 8,
                      paddingHorizontal: wp(3),
                      paddingVertical: wp(3),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Image
                          source={
                            item?.user?.image
                              ? { uri: item?.user?.image }
                              : images.avatarpic
                          }
                          resizeMode="contain"
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            marginRight: wp(1),
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            marginLeft: 5,
                            fontFamily: fonts.medium,
                            color: Colors.white,
                          }}
                        >
                          {item?.user?.name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: fonts.medium,
                          color: Colors.white,
                        }}
                      >
                        {moment(item?.created_at)
                          .subtract(0, 'days')
                          .calendar()}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={4}
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                        marginTop: wp(3),
                        lineHeight: 16,
                      }}
                    >
                      {item?.comment}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            width: wp(100),
            height: wp(25),
            position: 'absolute',
            bottom: wp(1),
            // backgroundColor: 'white',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
              width: wp(90),
              paddingHorizontal: wp(4),
              height: wp(13),
              backgroundColor: '#BD2BAF',
              borderRadius: 12,
              borderColor: Colors.mainColor,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Image
                source={images.cameraIcon}
                style={{ width: wp(6), height: wp(6), marginRight: wp(2) }}
                resizeMode="contain"
              /> */}
              <TextInput
                // style={styles.inputtext}
                style={{ color: 'white' }}
                placeholder="Write a comment"
                placeholderTextColor={'white'}
                value={newComment}
                onChangeText={text => setnewComment(text)}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => AddPostCommunityApi()}
                // onPress={handleSend}
                // style={[
                //   styles.sendButton,
                //   { backgroundColor: message ? '#41AD88' : '#C6DEFB' },
                // ]}
              >
                <Ionicons
                  name="send"
                  size={18}
                  color={newComment ? Colors.white : Colors.grey}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Modal for Dropdown Menu */}
        <Modal
          transparent
          visible={isDropdownVisible}
          animationType="fade"
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    position: 'absolute',
                    top: wp(15),
                    right: wp(5),
                    width: wp(35),
                    backgroundColor: Colors.white,
                    borderRadius: wp(4),
                    // elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                  }}
                >
                  {dotOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleOptionSelect(option)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: wp(3),
                        paddingHorizontal: wp(4),
                        borderBottomWidth:
                          index === dotOptions.length - 1 ? 0 : 0.5,
                        borderBottomColor: '#E0E0E0',
                      }}
                    >
                      {/* Icon */}
                      <View style={{ marginRight: wp(3) }}>
                        {renderOptionIcon(option.icon)}
                      </View>

                      {/* Text */}
                      <Text
                        style={{
                          fontSize: 14,
                          color: Colors.black,
                          fontFamily: fonts.medium,
                          flex: 1,
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalReport}
          onRequestClose={() => setModalReport(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            <ImageBackground resizeMode="cover" source={images.mainImage}>
              <View
                style={{
                  // backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: wp(6),
                  marginHorizontal: wp(5),
                  marginBottom: wp(8),
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: wp(8),
                  }}
                >
                  Report
                </Text>

                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 22,
                    backgroundColor: 'white',
                    right: 15,
                    borderRadius: 30,
                    width: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setModalReport(false)}
                >
                  <AntDesign name="close" size={16} color="#000" />
                </TouchableOpacity>

                {/* <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 14,
                    marginBottom: wp(2),
                  }}
                >
                  Reason
                </Text> */}
                <TextInput
                  placeholder="Description here..."
                  placeholderTextColor={Colors.white}
                  value={reporttitle}
                  onChangeText={setReportTitle}
                  numberOfLines={5}
                  multiline
                  style={{
                    // backgroundColor: '#FAFAFA',
                    backgroundColor: '#00000080',
                    borderRadius: 10,
                    padding: 15,
                    color: 'white',
                    height: 120,
                    textAlignVertical: 'top',
                    // elevation: 3,
                  }}
                />

                <TouchableOpacity
                  onPress={() => addReportApi()}
                  style={{
                    backgroundColor: Colors.mainColor,
                    marginTop: wp(6),
                    borderRadius: 12,
                    padding: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: fonts.bold,
                      fontSize: 16,
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default CommunityDetails;
