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
import React, { useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { date } from 'yup';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';
import ImageCropPicker from 'react-native-image-crop-picker';
const TaskDetails = ({ navigation, route }) => {
  const { data } = route.params;
  const user = useSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showSucc,setShowSucc] = useState(false);
  const [showfailure,setShowfailure] = useState(false)
   console.log('my item data', JSON.stringify(data));

   const [completionImage, setCompletionImage] = useState(null); // Only one image (string path or null)
   const [showImagePickerModal, setShowImagePickerModal] = useState(false);
 
   // ... existing code (getTaskStart, etc.)
 
   const pickCompletionImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 0.8,
      });
  
      setCompletionImage(image.path); // Store only one
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Image pick error:', error);
      }
    }
  };
  
  const removeCompletionImage = () => {
    setCompletionImage(null);
  };


  const SuccessModal = ()=>(
    <Modal animationType="slide" transparent={true} visible={showSucc}>
    <View
      style={{
        flex: 1,
        // height: hp(100),
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        // position: 'absolute',
      }}>
      <View
        style={{
          height: 120,
          width: 120,

          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          borderRadius: 100,
          overflow: 'hidden',
        }}>
        
        <Image
          style={{height: 200, width: 200}}
          source={require('../../Assets/addreminderIcon.png')}
        />
       
      </View>
    </View>
   
  </Modal>
  );
  const FailureModal = ()=>(
    <Modal animationType="slide" transparent={true} visible={showfailure}>
    <View
      style={{
        flex: 1,
        // height: hp(100),
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        // position: 'absolute',
      }}>
      <View
        style={{
          height: 120,
          width: 120,

          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          borderRadius: 100,
          overflow: 'hidden',
        }}>
        
        <Image
          style={{height: 200, width: 200}}
          source={require('../../Assets/addreminderIcon.png')}
        />
       
      </View>
    </View>
   
  </Modal>
      );
  const getTaskStart = () => {
    setIsLoading(true);
    AllGetAPI({
      url: `start-task/${data?.id}`,
      Token: user?.api_token,
    })
      .then(res => {
        setIsLoading(false);
        console.log('my post details', JSON.stringify(res));
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          // navigation.navigate('IndexDrawer', {
          //   screen: 'IndexBottom',
          //   params: { screen: 'Tasks' },
          // });
          navigation.goBack();
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
        console.log('api error tasks', err);
      });
  };
  // const getTaskEnd = () => {
  //   if (!completionImage) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Required',
  //       text2: 'Please upload one photo as proof of completion',
  //     });
  //     return;
  //   }
  //   setIsLoading(true);
  //   AllGetAPI({
  //     url: `end-task/${data?.id}`,
  //     Token: user?.api_token,
  //   })
  //     .then(res => {
  //       setIsLoading(false);
  //       console.log('my post details', JSON.stringify(res));
  //       if (res.status === 'success') {
  //         Toast.show({
  //           type: 'success',
  //           text1: 'Success',
  //           text2: res.message,
  //           topOffset: Platform.OS === 'ios' ? 20 : 0,
  //           visibilityTime: 3000,
  //           autoHide: true,
  //         });
  //         navigation.navigate('IndexDrawer', {
  //           screen: 'IndexBottom',
  //           params: { screen: 'Tasks' },
  //         });
  //       } else {
  //         setIsLoading(false);
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error',
  //           text2: res.message,
  //           topOffset: Platform.OS === 'ios' ? 20 : 0,
  //           visibilityTime: 3000,
  //           autoHide: true,
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //       console.log('api error tasks', err);
  //     });
  // };

  const getTaskEnd = () => {
    if (!completionImage) {
      Toast.show({
        type: 'error',
        text1: 'Required',
        text2: 'Please upload one photo as proof of completion',
      });
      return;
    }
  
    const formdata = new FormData();
    formdata.append('image', {  
      uri: completionImage,
      type: 'image/jpeg',
      name: `proof_${Date.now()}.jpg`,
    });
    formdata.append('task_id', data?.id);
    setIsLoading(true);
  
    PostAPiwithToken(
      { url: 'end-task', Token: user?.api_token },
      formdata
    )
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message || 'Task completed successfully!',
          });
          setShowImagePickerModal(false);
          setCompletionImage(null);
          navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Failed to complete task',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('Complete task error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      });
  };

  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?top: 0 }}
      resizeMode="cover"
    >
      {isLoading && <Loader />}
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
            marginBottom:wp(3),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
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
           Tasks
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ marginHorizontal: wp(5) }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: wp(5),
                marginTop: wp(3),
              }}
            >
              {data?.attachments.length > 0 ? (
                <>
                  {data?.attachments.map(item => (
                    <Image
                      source={
                        item.attachment
                          ? { uri: item.attachment }
                          : images.taskpic1
                      }
                      resizeMode="contain"
                      style={{
                        width: wp(28),
                        height: wp(28),
                        borderRadius: wp(3),
                      }}
                    />
                  ))}
                </>
              ) : (
                // <>
                //   <Image
                //     source={images.taskpic1}
                //     resizeMode="contain"
                //     style={{
                //       width: wp(28),
                //       height: wp(28),
                //       borderRadius: wp(3),
                //     }}
                //   />
                //   <Image
                //     source={images.taskpic2}
                //     resizeMode="contain"
                //     style={{
                //       width: wp(28),
                //       height: wp(28),
                //       borderRadius: wp(3),
                //     }}
                //   />
                //   <Image
                //     source={images.taskpic3}
                //     resizeMode="contain"
                //     style={{
                //       width: wp(28),
                //       height: wp(28),
                //       borderRadius: wp(3),
                //     }}
                //   />
                // </
              null
              )}
            </View>
            <View
              style={{
                marginBottom: wp(5),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  // width:wp(34)
                }}
              >
                {data?.title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: Colors.black,
                  // width:wp(34)
                }}
              >
                Created: {moment(data?.created_at).format('MMM D, YYYY')}
              </Text>
            </View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  // width:wp(34)
                }}
              >
                Description
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: '#475467',
                  lineHeight: 18,
                  // width:wp(34)
                }}
              >
                {data?.description}
              </Text>
            </View>
            {data.status === 'completed' ? (
              <View></View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: wp(5),
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    Priority
                  </Text>
                  <View
                    style={{
                      width: 64,
                      height: 24,
                      backgroundColor:
                        data?.priority == 'High Priority'
                          ? '#F95555'
                          : data?.priority == 'Medium Priority'
                          ? 'blue'
                          : Colors.mainColor,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: wp(1),
                      flexDirection: 'row',
                    }}
                  >
                    <Image
                      source={images.flag}
                      style={{ width: 12, height: 12, marginRight: 2 }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                      }}
                    >
                      {data?.priority === 'High Priority'
                        ? 'High'
                        : data?.priority === 'Medium Priority'
                        ? 'Medium'
                        : 'Low'}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    Status
                  </Text>
                  <View
                    style={{
                      width: 76,
                      height: 24,
                      backgroundColor: '#7A5AF8',
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: wp(1),
                      flexDirection: 'row',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.medium,
                        color: Colors.white,
                      }}
                    >
                      {data?.status}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    Difficulty
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    {data?.period}
                  </Text>
                </View>
              </View>
            )}

            <View style={{ marginTop: wp(5), marginBottom: wp(4) }}>
              {data?.members.map(item => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Conversation', { item: item.member })
                  }
                  // key={member}
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
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}
                  >
                    {item?.member?.name}
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: '#96B4AA',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: wp(2),
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#96B4AA',
                      }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              // onPress={() =>
              //   navigation.navigate('IndexBottom', { screen: 'Tasks' })
              // }
              onPress={() => {
                if (data?.status === 'Pending') {
                  getTaskStart();
                } else if (data?.status === 'Inprogress') {
                  setShowImagePickerModal(true); 
                }
              }}
              disabled={data?.status == 'Completed'}
              style={{
                width: wp(88),
                height: wp(13),
                borderRadius: wp(15),
                backgroundColor: Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                elevation: 2,
                borderWidth: 1,
                borderColor: '#2CA57B',
                marginTop: wp(4),
                marginBottom: wp(14),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.mainColor,
                }}
              >
                {data?.status == 'Pending'
                  ? 'Start Task'
                  : data?.status == 'Inprogress'
                  ? 'End Task'
                  : 'Completed'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Completion Proof Modal - Only One Image */}
<Modal
  animationType="slide"
  transparent={true}
  visible={showImagePickerModal}
  onRequestClose={() => {
    setShowImagePickerModal(false);
    setCompletionImage(null);
  }}
>
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end',
    }}
  >
    <View
      style={{
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: wp(5),
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wp(4) }}>
        <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black }}>
          Upload Proof of Completion
        </Text>
        <TouchableOpacity onPress={() => {
          setShowImagePickerModal(false);
          setCompletionImage(null);
        }}>
          <AntDesign name="close" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <Text style={{ color: '#666', fontSize: 14, marginBottom: wp(5) }}>
        Please upload one photo showing the task is completed.
      </Text>

      {/* Image Preview or Upload Box */}
      <View style={{ alignItems: 'center', marginBottom: wp(6) }}>
        {completionImage ? (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: completionImage }}
              style={{
                width: wp(70),
                height: wp(70),
                borderRadius: 12,
              }}
            />
            <TouchableOpacity
              onPress={removeCompletionImage}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 20,
                padding: 8,
              }}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickCompletionImage}
            style={{
              width: wp(70),
              height: wp(70),
              borderRadius: 12,
              backgroundColor: '#f5f5f5',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#ddd',
              borderStyle: 'dashed',
            }}
          >
            <Feather name="camera" size={40} color="#999" />
            <Text style={{ marginTop: 10, color: '#999', fontSize: 14 }}>
              Tap to take/upload photo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Submit Button */}
      <MainButton
        title="Submit & Complete Task"
        onPress={getTaskEnd}
        disabled={!completionImage} // Enabled only when image is selected
      />
    </View>
  </View>
</Modal>
      </KeyboardAvoidingView>
      {SuccessModal()}
      {FailureModal()}
    </ImageBackground>
  );
};

export default TaskDetails;
