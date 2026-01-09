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
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import * as Progress from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';
import { AllGetAPI } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Reports = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [firstMonthReport, setFirstMonthReport] = useState({});
  const [secondMonthReport, setSecondMonthReport] = useState({});
  const [thirdMonthReport, setThirdMonthReport] = useState({});
  const [isloading, setIsLoading] = useState(false);

  const currentPointsFirst = firstMonthReport?.earned_points ?? 0;
  const totalPointsFirst = firstMonthReport?.total_points ?? 0;
  const [progress, setProgress] = useState(0);

  const totalPointsSecond = secondMonthReport.total_points;
  const currentPointsSecond = secondMonthReport.earned_points;
  const [progressSecond, setProgressSecond] = useState(0);

  const totalPointsThird = thirdMonthReport.total_points;
  const currentPointsThird = thirdMonthReport.earned_points;
  const [progressThird, setProgressThird] = useState(0);

  useEffect(() => {
    if (firstMonthReport && totalPointsFirst > 0) {
      const ratio = currentPointsFirst / totalPointsFirst;
      const validProgress = isNaN(ratio) ? 0 : Math.min(1, Math.max(0, ratio));
      setProgress(validProgress);
    } else {
      setProgress(0);
    }
    if (secondMonthReport && totalPointsSecond > 0) {
      const ratio = currentPointsSecond / totalPointsSecond;
      const validProgress = isNaN(ratio) ? 0 : Math.min(1, Math.max(0, ratio));
      setProgressSecond(validProgress);
    } else {
      setProgressSecond(0);
    }
    if (thirdMonthReport && totalPointsThird > 0) {
      const ratio = currentPointsThird / totalPointsThird;
      const validProgress = isNaN(ratio) ? 0 : Math.min(1, Math.max(0, ratio));
      setProgressThird(validProgress);
    } else {
      setProgressThird(0);
    }
  }, [
    firstMonthReport,
    currentPointsFirst,
    totalPointsFirst,
    currentPointsSecond,
    totalPointsSecond,
    currentPointsThird,
    totalPointsThird,
  ]);
  // Debug progress value
  useEffect(() => {
    console.log('Progress value:', progress);
  }, [progress]);

  const getAllReports = () => {
    setIsLoading(true);
    AllGetAPI({ url: 'stats_detail', Token: user?.api_token })
      .then(res => {
        setIsLoading(false);
        console.log('api response stats detail', JSON.stringify(res));

        if (res.success == true) {
          setFirstMonthReport(res.data.month_1 || []);
          setSecondMonthReport(res.data.month_2 || []);
          setThirdMonthReport(res.data.month_3 || []);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error tasks', err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getAllReports();
    }, []),
  );
  const {top} =useSafeAreaInsets()
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
            Reports
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              //   alignItems: 'center',
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
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.black,
                textAlign: 'left',
              }}
            >
              1st Month completed task
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp(3),
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
                    {currentPointsFirst}
                    <Text style={styles.pointsSmall}>/{totalPointsFirst}</Text>
                  </Text>

                  <Text style={styles.subtitle}>1st{'\n'}Month Points</Text>
                </View>
              </Progress.Circle>
            </View>
          </View>
          <View
            style={{
              //   alignItems: 'center',
              //   marginTop: wp(5),
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
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.black,
                textAlign: 'left',
              }}
            >
              2nd Month completed task
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp(3),
              }}
            >
              <Progress.Circle
                size={hp(22)} // Big circle size
                progress={progressSecond}
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
                    {currentPointsSecond}
                    <Text style={styles.pointsSmall}>/{totalPointsSecond}</Text>
                  </Text>

                  <Text style={styles.subtitle}>2nd{'\n'}Month Points</Text>
                </View>
              </Progress.Circle>
            </View>
          </View>
          <View
            style={{
              //   alignItems: 'center',
              //   marginTop: wp(5),
              marginHorizontal: wp(5),
              padding: wp(4),
              backgroundColor: Colors.lightgreen,
              borderRadius: wp(3),
              marginBottom: wp(15),
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.black,
                textAlign: 'left',
              }}
            >
              3rd Month completed task
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp(3),
              }}
            >
              <Progress.Circle
                size={hp(22)} // Big circle size
                progress={progressThird}
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
                    {currentPointsThird}
                    <Text style={styles.pointsSmall}>/{totalPointsThird}</Text>
                  </Text>

                  <Text style={styles.subtitle}>3rd{'\n'}Month Points</Text>
                </View>
              </Progress.Circle>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Reports;
