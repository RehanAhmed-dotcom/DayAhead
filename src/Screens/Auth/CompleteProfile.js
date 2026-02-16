import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useState } from 'react';
import Input from '../../Components/Input/Index';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainButton from '../../Components/MainButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import * as yup from 'yup';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { setUser } from '../../Redux/Auth';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Input1 from '../../Components/Input1';

const CompleteProfile = ({ navigation, route }) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  // const { response } = route.params;
  // State to manage input values
  const [username, setUsername] = useState(user?.name);
  const dispatch = useDispatch();

  const [email, setEmail] = useState(user?.email);
  const _validationSchema = yup.object({
    goals: yup.string().required('Goals is required'),
    preferences: yup.string().required('Preferences is required'),
  });
  const _editAPI = (goals, preferences) => {
    const token = user.api_token;

    const formdata = new FormData();

    formdata.append('goals', goals);
    formdata.append('preferences', preferences);

    setIsLoading(true);
    PostAPiwithToken({ url: 'edit', Token: token }, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('response data-------', res);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          console.log('mydata', res);

          dispatch(setUser(res?.userdata));
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        console.log('res of register ', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };
  const { top } = useSafeAreaInsets();
  return (
    <Formik
      initialValues={{
        goals: '',
        preferences: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        _editAPI(values.goals, values.preferences);
      }}
      // validationSchema={_validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
        setFieldValue,
      }) => (
        <ImageBackground
          source={images.mainImage}
          style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 35 : 0 }}
          resizeMode="cover"
        >
          <View
            style={[
              styles.mainContainer,
              {
                paddingHorizontal: 20,
                backgroundColor: 'transparent',
                paddingTop: Platform.OS == 'ios' ? top : 50,
              },
            ]}
          >
            {isloading && <Loader />}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <StatusBar
                  translucent
                  backgroundColor={'transparent'}
                  barStyle={'light-content'}
                />
                <View
                  style={{
                    marginTop: wp(4),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ width: '100%' }}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: Colors.white,
                        textAlign: 'center',
                        fontFamily: fonts.bold,
                      }}
                    >
                      Congratulations
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: 'white',
                        width: 250,
                        // textAlign:'center',
                        alignSelf: 'center',
                        // backgroundColor:"red",
                        marginTop: 10,
                        fontFamily: fonts.medium,
                        lineHeight: 18,
                      }}
                    >
                      Your Dayahead profile is all set. Get ready to boost your
                      productivity and well being.
                    </Text>
                  </View>
                  {/* <Image
                source={images.tickcong}
                resizeMode="contain"
                style={{ width: wp(10), height: wp(10), marginLeft: wp(4) }}
              /> */}
                </View>
                <View>
                  {/* <Image
              source={images.avatarpic}
              style={{ width: wp(40), height: wp(40), alignSelf: 'center', marginTop: wp(10) }}
              resizeMode='contain'
            /> */}
                  <View>
                    <Image
                      source={
                        user.image ? { uri: user.image } : images.avatarpic
                      }
                      style={{
                        width: wp(30),
                        height: wp(30),
                        alignSelf: 'center',
                        marginTop: wp(10),
                        borderRadius: wp(15),
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <Input1
                  // label="Username"
                  placeholder="Enter username"
                  value={username}
                  onChangeText={setUsername}
                  color="white"
                  type="default"
                  showBorder
                  inputColor="#00000066"
                  labelColor="#FFFFFF"
                  placeFontSize={16}
                  maxLength={50}
                  nonEditable
                />
                <Input1
                  // label="Email"
                  placeholder="Enter email"
                  value={email}
                  onChangeText={setEmail}
                  type="default"
                  color="white"
                  showBorder
                  inputColor="#00000066"
                  labelColor="#FFFFFF"
                  placeFontSize={16}
                  maxLength={50}
                  nonEditable
                />
                <Input1
                  label="Goals"
                  placeholder="Enter goals"
                  type="default"
                  showBorder
                  color="white"
                  inputColor="#00000066"
                  labelColor="#FFFFFF"
                  placeFontSize={16}
                  maxLength={50}
                  onChangeText={handleChange('goals')}
                  onBlur={handleBlur('goals')}
                  value={values.goals}
                />
                {/* {errors.goals && touched.goals && (
              <Text style={[styles.errortxt]}>{errors.goals}</Text>
            )} */}
                <Input1
                  label="Preferences"
                  placeholder="Enter preferences"
                  type="default"
                  showBorder
                  color="white"
                  inputColor="#00000066"
                  labelColor="#FFFFFF"
                  placeFontSize={16}
                  maxLength={50}
                  onChangeText={handleChange('preferences')}
                  onBlur={handleBlur('preferences')}
                  value={values.preferences}
                />
                {/* {errors.preferences && touched.preferences && (
              <Text style={[styles.errortxt]}>{errors.preferences}</Text>
            )} */}

                <View style={{ marginTop: wp(5), marginBottom: wp(5) }}>
                  <MainButton
                    title="Go To Daily Dashboard"
                    onPress={() => {
                      handleSubmit();
                    }}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      )}
    </Formik>
  );
};

export default CompleteProfile;
