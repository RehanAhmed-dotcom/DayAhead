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
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
const CreateCommunity = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  // State to store selected images
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const [title, setTitle] = useState('');
  // State for modal visibility and selected priority
  const [allMembers, setAllMembers] = useState([]);
  const [modalVisiblemember, setModalVisibleMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]); // Changed to array
   const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [description, setDescription] = useState('');

  // Function to handle image upload
  const upload = async index => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 1,
      });
      console.log('image', image);

      const updatedImages = [...selectedImages];
      updatedImages[index] = image.path;
      setSelectedImages(updatedImages);
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleMemberSelect = member => {
    setSelectedMembers(prev =>
      prev.includes(member)
        ? prev.filter(m => m !== member)
        : [...prev, member],
    );
  };

  const getAllMembers = () => {
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => {
        setAllMembers(res.data);
        console.log('response of all users', JSON.stringify(res));
      })
      .catch(err => {
        console.log('api error', err);
      });
  };
  useEffect(() => {
    getAllMembers();
  }, []);

  const CreateCommunityApi = () => {
    const formdata = new FormData();
    if (selectedImages?.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'At least one image is required',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (!title) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Title name is required.',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    if (!selectedMembers) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'At least one member is required.',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    if (!description) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Descriptions are required.',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    formdata.append('title', title);
    selectedMembers.forEach(element => {
      formdata.append('members[]', element);
    });
    formdata.append('description', description);
    selectedImages.forEach(element => {
      if (element) {
        formdata.append('attachment[]', {
          uri: element,
          type: 'image/jpeg',
          name: 'image' + new Date() + '.jpg',
        });
      }
    });

    setIsLoading(true);
    PostAPiwithToken({ url: 'add-community', Token: user?.api_token }, formdata)
      .then(res => {
        console.log('my create community data--------', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') {
          setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                          navigation.navigate('IndexDrawer', {
            screen: 'IndexBottom',
            params: { screen: 'Chat' },
          });
                    }, 4000);
         
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
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
      });
  };

      const translateXValue = useSharedValue(0);
    
        useEffect(() => {
            if (showSuccessModal) {
                translateXValue.value = withSequence(
                    withTiming(-20, { duration: 1200 }),
                    withTiming(20, { duration: 1200 }),
                    withTiming(-15, { duration: 1200 }),
                    withTiming(15, { duration: 1200 }),
                    withTiming(0, {
                        duration: 600,
                        easing: Easing.out(Easing.ease),
                    })
                );
            }
        }, [showSuccessModal]);
    
            const animatedStyle2 = useAnimatedStyle(() => {
                return {
                    transform: [{ translateX: translateXValue.value }],
                };
            });
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?35: 0, }}
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
              // marginRight: wp(7),
            }}
          >
        Create Community
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ marginTop: wp(3) }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                paddingHorizontal: wp(5),
              }}
            >
              Attachments
            </Text>
            {/* <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                color: '#667085',
                paddingHorizontal: wp(5),
              }}
            >
              Format should be in .pdf .jpeg .png.
            </Text> */}
          </View>
          <View
            style={{
              paddingHorizontal: wp(5),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: wp(3),
            }}
          >
            {[0, 1, 2].map(index => (
              <TouchableOpacity
                key={index}
                style={styles.uploadpicView}
                onPress={() => upload(index)}
              >
                <Image
                  source={
                    selectedImages[index]
                      ? { uri: selectedImages[index] }
                      : images.uploadIcon
                  }
                  resizeMode="contain"
                  style={{
                    width: selectedImages[index] ? wp(28) : 33,
                    height: selectedImages[index] ? wp(28) : 33,
                    borderRadius: selectedImages[index] ? wp(3) : wp(0),
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ marginTop: wp(3), paddingHorizontal: wp(5) }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
              }}
            >
              Add title
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: wp(1),
                elevation: 1,
              }}
            >
              <TextInput
                placeholder="Select Text"
                onChangeText={text => setTitle(text)}
                value={title}
                placeholderTextColor={'#616161'}
                style={{
                  width: wp(80),
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: Colors.black,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Add member
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: 13,
                elevation: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: selectedMembers.length > 0 ? Colors.black : '#616161',
                  width: wp(70),
                }}
              >
                {selectedMembers.length > 0
                  ? allMembers
                      .filter(m => selectedMembers.includes(m.id))
                      .map(m => m.name)
                      .join(', ')
                  : 'Select members'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisibleMember(true)}>
                <AntDesign name="down" color={Colors.mainColor} size={18} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Description
            </Text>
            <View
              style={{
                width: wp(90),
                height: wp(45),
                borderRadius: wp(3),
                elevation: 1,
                backgroundColor: '#FAFAFA',
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
                  width: wp(85),
                  marginHorizontal: wp(2),
                }}
                multiline
                placeholder="Write here..."
                placeholderTextColor={Colors.lightgrey}
                value={description}
                onChangeText={text => setDescription(text)}
              />
            </View>
          </View>
          <View
            style={{
              //   position: 'absolute',
              //   bottom: wp(45),
              alignSelf: 'center',
              marginBottom: wp(20),
              marginTop: wp(4),
            }}
          >
            <MainButton
              title={'Add Community'}
              onPress={() => CreateCommunityApi()}
            />
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisiblemember}
          onRequestClose={() => setModalVisibleMember(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingBottom: wp(5),
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                padding: wp(5),
                width: wp(90),
                alignItems: 'center',
                height: hp(80),
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  marginBottom: wp(4),
                }}
              >
                Add Friends/Members
              </Text>
              <View
                style={{ position: 'absolute', top: 15, right: 15, padding: 5 }}
                onTouchEnd={() => setModalVisibleMember(false)}
              >
                <AntDesign name="close" size={18} color={Colors.black} />
              </View>
              <ScrollView>
                {allMembers.map(item => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingVertical: wp(3),
                      backgroundColor: Colors.lightgreen,
                      marginBottom: wp(3),
                      paddingHorizontal: wp(3),
                      borderRadius: wp(2),
                    }}
                    onPress={() => handleMemberSelect(item.id)}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        color: Colors.black,
                      }}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: Colors.mainColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: wp(2),
                      }}
                    >
                      {selectedMembers.includes(item.id) && (
                        <View
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: Colors.mainColor,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{
                  marginTop: wp(4),
                  paddingVertical: wp(2),
                  paddingHorizontal: wp(5),
                  backgroundColor: Colors.mainColor,
                  borderRadius: wp(8),
                  width: wp(80),
                  height: wp(13),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setModalVisibleMember(false)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Add Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

          <Modal
                                                    transparent={true}
                                                    visible={showSuccessModal}
                                                    animationType="fade"
                                                    onRequestClose={() => {
                                                        setShowSuccessModal(false);
                                                    }}
                                                >
                                                    <View style={{
                                                        flex: 1,
                                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Animated.View style={animatedStyle2}>
                                                            <View style={{
                                                                backgroundColor: 'white',
                                                                borderRadius: 50,
                                                                padding: wp(8),
                                                                alignItems: 'center',
                                                                shadowColor: '#000',
                                                                shadowOffset: { width: 0, height: 8 },
                                                                shadowOpacity: 0.3,
                                                                shadowRadius: 15,
                                                                elevation: 15,
                                                            }}>
                                                                <Image
                                                                    source={
                                                                         images.happy      
                                                                    }
                                                                    style={{
                                                                        width: wp(60),
                                                                        height: wp(60),
                                                                        resizeMode: 'contain',
                                                                    }}
                                                                />
                                
                                                            </View>
                                                        </Animated.View>
                                                    </View>
                                                </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default CreateCommunity;
