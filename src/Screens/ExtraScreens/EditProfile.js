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
import Input from '../../Components/Input/Index';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import Toast from 'react-native-toast-message';
import { setUser } from '../../Redux/Auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Input1 from '../../Components/Input1';
const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const [username, setUsername] = useState(user?.name);
  const [isloading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(user?.email);
  const [goals, setGoals] = useState(user?.goals);
  const [preferences, setPreferences] = useState(user?.preferences);
  const [image, setimage] = useState(null);
  // const upload = async setFieldValue => {
  //   try {
  //     const image = await ImageCropPicker.openPicker({
  //       width: 400,
  //       height: 400,
  //       cropping: true,
  //       compressImageQuality: 1,
  //     });
  //     console.log('image', image);
  //     setImage(image.path);
  //     if (image && image.path) {
  //       setFieldValue('image', image.path);
  //     } else {
  //       console.error('No image path found');
  //     }
  //   } catch (error) {
  //     console.error('Error picking image:', error);
  //   }
  // };
  const upload = async () => {
    try {
      const selectedImage = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 1,
      });
      console.log('Selected Image:', selectedImage);
      if (selectedImage && selectedImage.path) {
        setimage(selectedImage.path); // Update the state with the selected image path
      } else {
        console.error('No image path found');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const _editAPI = () => {
    const token = user?.api_token;
    const formdata = new FormData();
    if (username) {
      formdata.append('name', username);
    }
    if (goals) {
      formdata.append('goals', goals);
    }
    if (preferences) {
      formdata.append('preferences', preferences);
    }

    if (image) {
      formdata.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });
    }

    setIsLoading(true);

    PostAPiwithToken({ url: 'edit', Token: token }, formdata)
      .then(res => {
        setIsLoading(false);
        // console.log('my Response:', res);
        if (res?.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res?.message || 'Profile updated successfully.',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          console.log('Response Data:', res);
          dispatch(setUser(res.userdata));

          navigation.goBack();
        } else {
          const errorMessage =
            res?.message?.email || res?.message || 'An error occurred.';
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMessage,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          console.error('Error Response:', res);
        }
      })
      .catch(err => {
        setIsLoading(false);

        console.error('API Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again later.',
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };
  const { top } = useSafeAreaInsets();
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
            elevation: 4,
            width: wp(100),
            height: wp(25),
            // backgroundColor: '#FAFAFA',
            paddingHorizontal: wp(4),
            paddingTop: wp(5),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, // push shadow down
            shadowOpacity: 0.2,
            shadowRadius: 3,
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

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              // marginRight: wp(7),
            }}
          >
            Edit Profile
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingHorizontal: wp(5) }}>
            <View>
              {/* <Image
                source={images.avatarpic}
                style={{ width: wp(40), height: wp(40), alignSelf: 'center', marginTop: wp(10) }}
                resizeMode='contain'
              /> */}
              {image ? (
                <TouchableOpacity
                  onPress={upload}
                  style={{ alignSelf: 'center' }}
                >
                  <Image
                    source={image ? { uri: image } : images.avatarpic}
                    style={{
                      width: wp(22),
                      height: wp(22),
                      alignSelf: 'center',
                      marginTop: wp(10),
                      borderRadius: wp(15),
                    }}
                    resizeMode="contain"
                  />
                  <Image
                    source={images.editprofile}
                    style={{
                      width: 19,
                      height: 19,
                      alignSelf: 'flex-end',
                      marginTop: wp(-4),
                      marginRight: wp(1),
                    }}
                    tintColor={Colors.mainColor}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={upload}
                  style={{ alignSelf: 'center' }}
                >
                  <Image
                    source={user.image ? { uri: user.image } : images.avatarpic}
                    style={{
                      width: wp(22),
                      height: wp(22),
                      alignSelf: 'center',
                      marginTop: wp(10),
                      borderRadius: wp(15),
                    }}
                    resizeMode="contain"
                  />
                  <Image
                    source={images.editprofile}
                    style={{
                      width: 19,
                      height: 19,
                      alignSelf: 'flex-end',
                      marginTop: wp(-4),
                      marginRight: wp(1),
                    }}
                    tintColor={Colors.white}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Input1
              // label="Username"
              placeholder="Enter username"
              value={username}
              onChangeText={text => setUsername(text)}
              type="default"
              showBorder
              inputColor="#00000066"
              color="white"
              labelColor="#212121"
              placeFontSize={16}
              maxLength={50}
            />
            <Input1
              // label="Email"
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              type="default"
              showBorder
              inputColor="#00000066"
              color="white"
              labelColor="#212121"
              placeFontSize={16}
              maxLength={50}
              nonEditable
            />
            <Input1
              // label="Goals"
              placeholder="Enter goals"
              value={goals}
              onChangeText={text => setGoals(text)}
              type="default"
              // showBorder
              inputColor="#00000066"
              color="white"
              labelColor="#212121"
              placeFontSize={16}
              maxLength={50}
            />
            <Input1
              // label="Preferences"
              placeholder="Enter preferences"
              value={preferences}
              onChangeText={text => setPreferences(text)}
              type="default"
              showBorder
              inputColor="#00000066"
              color="white"
              labelColor="#212121"
              placeFontSize={16}
              maxLength={50}
            />

            <View style={{ marginTop: wp(35), marginBottom: wp(5) }}>
              <MainButton
                title="Update Profile"
                // onPress={() => navigation.navigate('AllSet')}
                onPress={() => _editAPI()}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default EditProfile;
