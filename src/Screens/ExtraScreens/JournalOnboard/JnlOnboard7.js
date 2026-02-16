import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, fonts, images, styles } from '../../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import { useDispatch, useSelector } from 'react-redux';
import { setJnlOnboard } from '../../../Redux/OnboardingSlice';
import IndexDrawer from '../../../DrawerNav/IndexDrawer';

const JnlOnboard7 = ({ navigation }) => {
  const dispatch = useDispatch();
  const OnboardStatus = useSelector(
    state => state.onboarding.jnlBoardingStatus,
  );
  console.log('my journal sttatus', OnboardStatus);
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
      resizeMode="cover"
    >
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      <View
        style={{
          flex: 1,
          // backgroundColor: Colors.white,
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
        }}
      >
        {/* {isloading && <Loader />} */}

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
            // shadowOffset: { width: 0, height: 6 }, // push shadow down
            // shadowOpacity: 0.2,
            // shadowRadius: 3,
          }}
        >
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
            Journal
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView>
          <View style={{ flex: 1, marginTop: wp(30), marginHorizontal: wp(3) }}>
            {/* <Image
              source={images.jnlonboard7}
              resizeMode="contain"
              style={{
                width: wp(80),
                // marginTop ),
                height: wp(80),
                // position: 'absolute',
                // bottom: wp(10),
                alignSelf: 'center',
              }}
            /> */}
            <Image
              source={require('../../../Assets/mymainlogo.png')}
              style={{
                width: wp(90),
                height: wp(45),
                alignSelf: 'center',
                // paddingVertical:20,
                backgroundColor: '#BD2BAF15',
                borderRadius: 20,
                marginTop: wp(0),
              }}
              resizeMode="contain"
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: wp(3),
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.white,
                  textAlign: 'center',
                  fontFamily: fonts.bold,
                  lineHeight: 26,
                  marginTop: hp(10),
                }}
              >
                You Are All Set
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp(4),
                marginHorizontal: wp(3),
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.white,
                  textAlign: 'center',
                  fontFamily: fonts.medium,
                  lineHeight: 22,
                }}
              >
                Be honest. Keep it simple.{'\n'}
                If you miss a day, just come back{'\n'} tomorrow{' '}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                dispatch(
                  setJnlOnboard(),
                  navigation.navigate('IndexDrawer', { screen: 'MyJournal' }),
                );
              }}
              // onPress={() => CreateJournalApi()}
              style={[
                styles.btnView,
                { backgroundColor: Colors.mainColor, marginTop: wp(20) },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.titleText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default JnlOnboard7;
//     <TouchableOpacity  onPress={() => {dispatch(setJnlOnboard(),navigation.navigate('IndexDrawer',{screen:'MyJournal'}))}}  style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(20)}]}  activeOpacity={0.7}>
//     <Text style={styles.titleText}>Finish</Text>
// </TouchableOpacity>
