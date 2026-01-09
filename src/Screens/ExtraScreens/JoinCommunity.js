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
import ImageCropPicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';

const JoinCommunity = ({ navigation, route }) => {
  const user = useSelector(state => state.user.user);
  const { item } = route.params;
  console.log('my item data', JSON.stringify(item));
  const [saveduration, setSaveDuration] = useState(false);

  const [isloading, setIsLoading] = useState(false);

  const JoinCommunityApi = () => {
    const formdata = new FormData();

    formdata.append('communityId', item.id);
    setIsLoading(true);
    PostAPiwithToken(
      { url: 'join-community', Token: user?.api_token },
      formdata,
    )
      .then(res => {
        console.log('community join', res);
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: 80,
          });
          setSaveDuration(false), navigation.goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: 80,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
        Alert.alert('Error', 'Failed to create task');
      });
  };
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?40: 0, }}
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
              marginRight: wp(7),
            }}
          >
            {item?.title ? item?.title : 'Sensitive Community'}
          </Text>
          <Text></Text>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <View
              style={{
                width: wp(90),
                paddingVertical: wp(5),
                backgroundColor: Colors.white,
                elevation: 3,
                alignSelf: 'center',
                borderRadius: wp(3),
              }}
            >
              <Image
                source={images.joincommunityImg}
                resizeMode="contain"
                style={{ width: wp(25), height: wp(25), alignSelf: 'center' }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  textAlign: 'center',
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: fonts.medium,
                  color: '#747474',
                  textAlign: 'center',
                  lineHeight: 14,
                }}
              >
                Choose how you want to participate
              </Text>
              <TouchableOpacity
                onPress={() => setSaveDuration(true)}
                style={{
                  width: wp(80),
                  height: wp(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#00BF63',
                  borderRadius: wp(6),
                  marginTop: wp(5),
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 16,
                    color: Colors.white,
                  }}
                >
                  Join Community
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={saveduration}
          onRequestClose={() => setSaveDuration(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingBottom: wp(25),
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                padding: wp(5),
                width: wp(90),
              }}
            >
              <View
                style={{ position: 'absolute', top: 20, right: 15, padding: 5 }}
                onTouchEnd={() => setSaveDuration(false)}
              >
                <AntDesign name="close" size={18} color={Colors.black} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  alignSelf: 'center',
                }}
              >
                Join {item.title}
              </Text>
              <View style={{ marginTop: wp(5) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: '#C94242',
                    alignSelf: 'center',
                  }}
                >
                  ⚠️ This is a Sensitive community
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: '#717171',
                    alignSelf: 'center',
                    marginTop: wp(5),
                    textAlign: 'center',
                  }}
                >
                  For your safety, you will participate anonymously. A random
                  username will be assigned to you.
                </Text>
              </View>
              <View
                style={{
                  width: wp(75),
                  paddingVertical: wp(4),
                  marginTop: wp(5),
                  borderWidth: 1,
                  borderColor: Colors.mainColor,
                  borderRadius: wp(3),
                  alignSelf: 'center',
                  backgroundColor: Colors.lightgreen,
                }}
              >
                <Text
                  style={{
                    color: '#717171',
                    fontFamily: fonts.medium,
                    fontSize: 12,
                    textAlign: 'center',
                    lineHeight: 18,
                  }}
                >
                  You will appear as an anonymous user with a system-generated
                  username.
                </Text>
              </View>
              <TouchableOpacity
                // onPress={() => {
                //   setSaveDuration(false),
                //     navigation.navigate('CommunityScreen', { item });
                // }}
                onPress={() => JoinCommunityApi()}
                style={{
                  width: wp(70),
                  height: wp(13),
                  backgroundColor: Colors.mainColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderRadius: wp(8),
                  marginTop: wp(15),
                  marginBottom: wp(3),
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.white,
                  }}
                >
                  Save duration
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default JoinCommunity;
