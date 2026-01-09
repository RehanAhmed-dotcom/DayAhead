import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import SwitchToggle from 'react-native-switch-toggle';
import MainButton from '../../Components/MainButton';
import * as Progress from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stats = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [allStats, setAllStats] = useState({});

  const [progress, setProgress] = useState(0);
  const [isloading, setIsLoading] = useState(false);

  const productivityScore = allStats?.productivity_score;
  console.log('api my prssssod', allStats);
  const currentPoints = productivityScore?.current_points ?? 0;
  const totalPoints = productivityScore?.max_points ?? 0;

  useEffect(() => {
    if (productivityScore && totalPoints > 0) {
      const ratio = currentPoints / totalPoints;
      const validProgress = isNaN(ratio) ? 0 : Math.min(1, Math.max(0, ratio));
      setProgress(validProgress);
    } else {
      setProgress(0);
    }
  }, [allStats, currentPoints, totalPoints]);

  useEffect(() => {
    console.log('Progress value:', progress);
  }, [progress]);

  const getAllTasks = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'stats', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        if (res.success == true) {
          setAllStats(res.data || []);
        }

        console.log('api my stats', JSON.stringify(res.data));
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error tasks', err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getAllTasks();
    }, []),
  );
  const {top}=useSafeAreaInsets()

  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?30: 0, }}
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
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginRight: wp(7) }}>
                        Productivity Score
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    </View>
                </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Circular Progress Bar Section */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Reports')}
            style={{
              alignItems: 'center',
              marginTop: wp(5),
              marginHorizontal: wp(5),
              padding: wp(4),
              backgroundColor: Colors.lightgreen,
              borderRadius: wp(3),
              marginBottom: wp(5),
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}
          >
            <Progress.Circle
              size={hp(22)} // Big circle size
              progress={progress}
              thickness={20} // Thick ring
              color="#2CC8A6" // Green filled part
              unfilledColor="#F95555" // Red unfilled part
              borderWidth={0}
              animated={true}
              showsText={false} // We use custom center content
              style={{}}
            >
              {/* Custom Center Content */}
              <View style={styles.centerContent}>
                <Text style={styles.pointsBig}>
                  {currentPoints}
                  <Text style={styles.pointsSmall}>/{totalPoints}</Text>
                </Text>

                <Text style={styles.subtitle}>Total{'\n'}Base Points</Text>
              </View>
            </Progress.Circle>
          </TouchableOpacity>

          <View style={{ marginTop: wp(10) }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.black,
                paddingHorizontal: wp(5),
              }}
            >
              Monthly
            </Text>
            {/* <FlatList
              data={mynotifications}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => ( */}
            <View
              style={{
                backgroundColor: Colors.lightgreen,
                marginHorizontal: wp(5),
                borderRadius: wp(3),
                padding: wp(3),
                marginBottom: wp(3),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop:wp(2),
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
            >
              <View style={{ width: wp(73) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.darkgray,
                  }}
                >
                  Pending
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.regular,
                    color: Colors.darkgray,
                  }}
                >
                  {allStats.monthly_tasks?.pending?.label}
                </Text>
              </View>
              <Image
                source={images.PendingImg}
                resizeMode="contain"
                style={{ width: 37, height: 32, marginRight: wp(3) }}
              />
            </View>
            <View
              style={{
                backgroundColor: Colors.lightgreen,
                marginHorizontal: wp(5),
                borderRadius: wp(3),
                padding: wp(3),
                marginBottom: wp(3),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
            >
              <View style={{ width: wp(73) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.darkgray,
                  }}
                >
                  Inprogress
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.regular,
                    color: Colors.darkgray,
                  }}
                >
                  {allStats.monthly_tasks?.in_progress?.label}
                </Text>
              </View>
              <Image
                source={images.InprogressImg}
                resizeMode="contain"
                style={{ width: 37, height: 32, marginRight: wp(3) }}
              />
            </View>
            <View
              style={{
                backgroundColor: Colors.lightgreen,
                marginHorizontal: wp(5),
                borderRadius: wp(3),
                padding: wp(3),
                marginBottom: wp(3),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
            >
              <View style={{ width: wp(73) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.darkgray,
                  }}
                >
                  Completed
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.regular,
                    color: Colors.darkgray,
                  }}
                >
                  {allStats.monthly_tasks?.completed?.label}
                </Text>
              </View>
              <Image
                source={images.statsIcon}
                resizeMode="contain"
                style={{ width: 37, height: 32, marginRight: wp(3) }}
              />
            </View>
            {/* )}
            /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Stats;
