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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const CommunityScreen = ({ navigation, route }) => {
  const user = useSelector(state => state.user.user);
  const { item } = route.params;
  // console.log('my item new data', JSON.stringify(item));
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // console.log('my image data', JSON.stringify(image));
  const [CommunityPosts, setCommunityPosts] = useState([]);
  // console.log('my post data', JSON.stringify(CommunityPosts));
  const [isloading, setIsLoading] = useState(false);
  const getCommunityPosts = () => {
    const itemID = Number(item?.redirect || item?.id);
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
          getCommunityPosts();
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
  useEffect(() => {
    getCommunityPosts();
    // getLikesofPosts();
  }, []);
  const upload = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 1,
      });
      console.log('image', image);
      setImage(image.path);
      if (image && image.path) {
      } else {
        console.error('No image path found');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const AddPostCommunityApi = () => {
    const formdata = new FormData();
    formdata.append('community_id', item.id);

    formdata.append('description', description);
    {
      image &&
        formdata.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });
    }
    setIsLoading(true);
    PostAPiwithToken(
      { url: 'add-community-post', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        console.log('community join', JSON.stringify(res));
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
          getCommunityPosts();
          setImage(null), setDescription('');
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
        Alert.alert('Error', 'Failed to create task');
      });
  };
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 35 : 0 }}
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color={Colors.black} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.black,
              // marginLeft: wp(15),
            }}
          >
            {item.title}
          </Text>
          {/* <TouchableOpacity
            style={{
              width: wp(20),
              height: wp(6),
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.white,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontFamily: fonts.bold,
                color: Colors.white,
              }}
            >
              Add To Group
            </Text>
          </TouchableOpacity> */}
          <Text></Text>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              width: wp(90),
              backgroundColor: 'white',
              marginVertical: wp(2),
              borderRadius: wp(3),
              alignSelf: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              paddingHorizontal: wp(3),
              paddingVertical: wp(3),
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.black,
              }}
            >
              Share your progress
            </Text>
            {image ? (
              <Image
                source={{ uri: image }}
                resizeMode="contain"
                style={{ width: wp(90), height: wp(40) }}
              />
            ) : null}
            <View
              style={{
                width: wp(80),
                height: wp(30),
                borderRadius: wp(3),
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
                backgroundColor: '#EAFFEA',
                alignSelf: 'center',
                marginBottom: wp(3),
                marginTop: wp(3),
              }}
            >
              <TextInput
                style={{
                  paddingHorizontal: wp(3),
                  color: Colors.black,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  width: wp(75),
                  marginHorizontal: wp(2),
                }}
                multiline
                placeholder="Write here..."
                placeholderTextColor={Colors.lightgrey}
                value={description}
                onChangeText={text => setDescription(text)}
              />
              <TouchableOpacity
                onPress={() => upload()}
                style={{ position: 'absolute', bottom: wp(3), right: wp(3) }}
              >
                <Entypo name="attachment" size={18} color="grey" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => AddPostCommunityApi()}
              style={{
                width: wp(80),
                height: wp(13),
                borderRadius: wp(10),
                backgroundColor: Colors.mainColor,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.white,
                }}
              >
                Check In
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginHorizontal: wp(3), marginBottom: wp(4) }}>
            {CommunityPosts?.length < 1 ? (
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
                    marginTop: wp(40),
                  }}
                >
                  No Community Posts found.
                </Text>
              </View>
            ) : (
              <FlatList
                data={CommunityPosts}
                keyExtractor={item =>
                  item?.id?.toString() || Math.random().toString()
                }
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: wp(90),
                      backgroundColor: 'white',
                      marginVertical: wp(2),
                      borderRadius: wp(3),
                      alignSelf: 'center',
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.18,
                      shadowRadius: 8,
                      paddingHorizontal: wp(3),
                      paddingVertical: wp(3),
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
                          width: 34,
                          height: 34,
                          borderRadius: 18,
                          marginRight: wp(2),
                        }}
                      />
                      <View>
                        <Text>{item?.user?.name}</Text>
                        <Text>
                          {moment(item?.created_at)
                            .subtract(0, 'days')
                            .calendar()}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('CommunityDetails', {
                          postdata: item,
                        })
                      }
                    >
                      <View style={{ marginTop: wp(2) }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: fonts.medium,
                            color: '#747474',
                            lineHeight: 14,
                          }}
                          numberOfLines={4}
                        >
                          {item?.description}
                        </Text>
                      </View>
                      {item?.image ? (
                        <Image
                          source={item?.image ? { uri: item?.image } : null}
                          resizeMode="cover"
                          style={{
                            width: wp(80),
                            height: wp(50),
                            alignSelf: 'center',
                            borderRadius: 8,
                            marginTop: wp(2),
                          }}
                        />
                      ) : null}
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: wp(2),
                      }}
                    >
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <TouchableOpacity
                          onPress={() => getLikesofPosts(item.id)}
                          style={{ marginRight: wp(3) }}
                        >
                          <Entypo
                            name={
                              item?.is_like === 1 ? 'heart' : 'heart-outlined'
                            }
                            size={18}
                            color={'#8EB9AB'}
                          />
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
                          onPress={() =>
                            navigation.navigate('CommunityDetails', {
                              postdata: item,
                            })
                          }
                        >
                          <Image
                            source={images.messageIcon}
                            resizeMode="contain"
                            style={{
                              width: 17,
                              height: 17,
                              marginRight: wp(3),
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Image
                            source={images.shareIcon}
                            resizeMode="contain"
                            style={{ width: 17, height: 17 }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        {item?.likes.slice(0, 4).map((data, index) => (
                          <Image
                            key={index}
                            source={
                              data?.user?.image
                                ? { uri: data?.user?.image }
                                : images.statuspic4
                            }
                            resizeMode="contain"
                            style={[
                              {
                                width: 17,
                                height: 17,
                                borderRadius: 10,
                                marginLeft: index === 0 ? 0 : -8,
                                zIndex: index,
                              },
                            ]}
                          />
                        ))}
                        {/* // <Image
                        //   source={images.statuspic3}
                        //   resizeMode="contain"
                        //   style={{
                        //     width: 17,
                        //     height: 17,
                        //     marginLeft: wp(-1.5),
                        //   }}
                        // />
                        // <Image
                        //   source={images.statuspic4}
                        //   resizeMode="contain"
                        //   style={{
                        //     width: 17,
                        //     height: 17,
                        //     marginLeft: wp(-1.5),
                        //   }}
                        // />
                        // <Image
                        //   source={images.statuspic3}
                        //   resizeMode="contain"
                        //   style={{
                        //     width: 17,
                        //     height: 17,
                        //     marginLeft: wp(-1.5),
                        //   }}
                        // /> */}
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: fonts.medium,
                            color: Colors.black,
                            marginLeft: wp(2),
                          }}
                        >
                          {item?.likes.length} people liked this
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default CommunityScreen;
