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
import React, { useCallback, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';

const ShareWithMembers = ({ navigation, route }) => {
  const { image, alarmData } = route.params;
  // State to track selected members
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  // List of members
  console.log('my all members', selectedMembers);
  const getAllMembers = () => {
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => {
        setMembers(res.data);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };
  // Toggle selection of a member
  const toggleSelection = (members) => {
    if (selectedMembers.includes(members)) {
      setSelectedMembers(selectedMembers.filter((item) => item !== members));
    } else {
      setSelectedMembers([...selectedMembers, members]);
    }
  };

  const CreateShareWithMembersApi = () => {
    // Validation
    
    if (!image) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Selfie is required' });
      return;
    }
    if (!alarmData) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Alaram id is required' });
      return;
    }
    if (selectedMembers.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'At least one member is required',
      });
      return;
    }

    const formdata = new FormData();
    formdata.append('alaram_id', alarmData.id);
    selectedMembers.forEach(item => formdata.append('members[]', item.id));

      if (image) {
        formdata.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: `image_${Date.now()}.jpg`,
        });
      }

    setIsLoading(true);
    PostAPiwithToken({ url: 'send-alaram-selfie', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({ type: 'success', text1: 'Success', text2: res.message });
          navigation.navigate('AllSetAlarm');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
        Alert.alert('Error', 'Failed to create task');
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllMembers();
    }, []),
  );
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?40: 20, }}
      resizeMode="cover"
    >
      {isloading && <Loader />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />

        {/* <View
          style={{
            marginTop: wp(7),
            marginHorizontal: wp(5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: wp(15),
          }}
        >
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
            Sending To....
          </Text>
          <Text></Text>
        </View> */}
       
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
            shadowOffset: { width: 0, height: 6 }, 
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
            Sending To....
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              width: wp(100),
              alignItems: 'center',
              paddingHorizontal: wp(5),
              marginTop: wp(6),
            }}
          >
            {members.map((member) => (
              <TouchableOpacity
                key={member}
                onPress={() => toggleSelection(member)}
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
                  {member.name}
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
                  {selectedMembers.includes(member) && (
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
          </View>
            <View style={{marginBottom:wp(10),marginTop:wp(20)}}>
            <MainButton title="Send Now" onPress={() => CreateShareWithMembersApi()} />
                </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ShareWithMembers;