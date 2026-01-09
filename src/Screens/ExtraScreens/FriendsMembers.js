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
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const FriendsMembers = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);

  const [myFriends, setMyFriends] = useState([]);

  const getAllFriends = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        setMyFriends(res.data);
        console.log('response of all friends', JSON.stringify(res));
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };
  useEffect(() => {
    getAllFriends();
  }, []);

  const AddFriendsApi = id => {
    const formdata = new FormData();
    formdata.append('friend_id', id);
    setIsLoading(true);
    PostAPiwithToken({ url: 'delete-friend', Token: user?.api_token }, formdata)
      .then(res => {
        console.log('my deleted friend', JSON.stringify(res));
        setIsLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message,
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
        getAllFriends();
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
      });
  };
const {top}=useSafeAreaInsets()
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?35: 0 }}
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
              // marginRight: wp(7),
            }}
          >
           Friends/Members
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {myFriends.length < 1 ? (
            <View
              style={{
                width: wp(80),
                height: hp(70),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}
              >
                No Friends available
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  To add friends:{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AddMembers');
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: 'blue',
                      textDecorationLine: 'underline',
                    }}
                  >
                    Click Here
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                //   padding: wp(5),
                width: wp(100),
                alignItems: 'center',
                paddingHorizontal: wp(5),
                marginTop: wp(6),
              }}
            >
              {myFriends.map((item, index) => (
                <View
                  // key={item}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingVertical: wp(4),
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
                    {item.name}
                  </Text>

                  {/* Delete Icon */}
                  <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => AddFriendsApi(item.id)}
                    style={{
                      padding: wp(1),
                      marginRight: wp(2)
                    }}
                  >
                    <Feather
                      name="trash-2"
                      size={20}
                      color={Colors.red || 'red'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Conversation', {item: item})}
                    style={{
                      padding: wp(1),
                    }}
                  >
                    <Feather
                      name="message-circle"
                      size={22}
                      color={Colors.red || 'red'}
                    />
                  </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default FriendsMembers;
