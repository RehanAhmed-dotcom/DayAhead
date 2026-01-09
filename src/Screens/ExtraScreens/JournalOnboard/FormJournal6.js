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
  import React, { useState } from 'react';
  import { Colors, fonts, images,styles } from '../../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import MainButton from '../../../Components/MainButton';
import Loader from '../../../Components/Loader';
import { PostAPiwithToken } from '../../../Components/ApiRoot';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

  
  const FormJournal6 = ({ navigation,route }) => {
    const {gratitudedata,believesdata,goals,oneStep,promise}= route.params
    const user = useSelector(state => state.user.user);
    const [isloading, setIsLoading] = useState(false);

    const CreateJournalApi = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const formdata = new FormData();
        gratitudedata.forEach(item => {
            formdata.append('gratitude[]', item);
          });
          believesdata.forEach(item => {
            formdata.append('affirmation[]', item);
          });
        formdata.append('bigger_goal', goals);
        formdata.append('small_step', oneStep);
        formdata.append('promise-today', promise);
        formdata.append('date', currentDate);
        setIsLoading(true);
        PostAPiwithToken({ url: 'save-journal-info', Token: user?.api_token }, formdata)
          .then(res => {
            setIsLoading(false);
            console.log('my journal status',JSON.stringify(res))
            if (res.status === 'success') {
              Toast.show({ type: 'success', text1: 'Success', text2: res.message });
              navigation.navigate('IndexDrawer',{screen:'MyJournal'})
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
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white,paddingTop:Platform.OS === 'ios' ?40: 20 }}>
        {isloading && <Loader/>}
       <StatusBar
        translucent={false}
        backgroundColor={Colors.white}
        barStyle="dark-content"
        />
        <ScrollView>
        <View style={{ flex: 1, marginTop: wp(30), marginHorizontal: wp(3) }}>

       
      
          <Image
          source={images.jnlonboard7}
          resizeMode="contain"
          style={{
            width: wp(80),
            marginTop:wp(5),
            height: wp(80),
            // position: 'absolute',
            // bottom: wp(10),
            alignSelf: 'center',
          }}
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
                fontSize: 22,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: fonts.bold,
                lineHeight: 26,
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
              alignSelf:'center'
            }}
          >
            
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: fonts.medium,
                lineHeight: 22,
              }}
            >
Be honest. Keep it simple.{'\n'}
If you miss a day, just come back{'\n'} tomorrow            </Text>
          </View>
      
        <TouchableOpacity onPress={()=>CreateJournalApi()}  style={[styles.btnView,{backgroundColor:Colors.mainColor,marginTop:wp(20)}]}  activeOpacity={0.7}>
    <Text style={styles.titleText}>Next</Text>
</TouchableOpacity>
    
        </View>
        </ScrollView>
      
      </View>
    );
  };
  
  export default FormJournal6;
  