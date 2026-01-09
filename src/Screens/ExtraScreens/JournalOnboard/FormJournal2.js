import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ImageBackground
  } from 'react-native';
  import React, { useState } from 'react';
  import { Colors, fonts, images, styles } from '../../../Constant/Index';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import Input from '../../../Components/Input/Index';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
  const FormJournal2 = ({ navigation, route }) => {
    const { gratitudedata } = route.params;
    console.log('Received gratitudedata:', gratitudedata);
  
    // Dynamic array for believes — starts empty, grows as user types
    const [believesdata, setBelievesdata] = useState([]);
  console.log('my data',believesdata)
    // Update believes entry at specific index
    const updateBelieve = (text, index) => {
      setBelievesdata(prev => {
        const newData = [...prev];
  
        // Extend array if needed (e.g., typing in 3rd field first)
        while (newData.length <= index) {
          newData.push('');
        }
  
        newData[index] = text;
        return newData;
      });
    };
  
    // Handle Next button press
    const handleNext = () => {
      // Filter out empty entries
      const filledBelieves = believesdata
        .map(item => item.trim())
        .filter(item => item !== '');
  
      // Navigate and pass both gratitude and believes data
      navigation.navigate('FormJournal3', {
        gratitudedata,          // from previous screen
        believesdata: filledBelieves,  // newly collected, only non-empty
      });
    };
    const{top}=useSafeAreaInsets()
  
    return (
        <ImageBackground
        source={images.myallbackbg}
        style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?30: 0 }}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : 0}
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
            Journal
          </Text>

          {/* Empty View to balance the row */}
          <View style={{ width: 20 }} />
        </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
           
  
            <View style={{ flex: 1, marginTop: wp(7), marginHorizontal: wp(3) }}>
              {/* Title */}
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
                  What you choose to believe
                </Text>
              </View>
  
              {/* Subtitle */}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: wp(7),
                  marginHorizontal: wp(3),
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
                  Something I want to achieve
                </Text>
              </View>
  
              {/* Image */}
              <Image
                source={images.jnlonboard3}
                resizeMode="contain"
                style={{
                  width: wp(50),
                  height: wp(50),
                  alignSelf: 'center',
                  marginTop: wp(5),
                  marginVertical: wp(5),
                }}
              />
  
              {/* Input Fields */}
              <View style={{ marginHorizontal: wp(2) }}>
                <Input
                  placeholder="I am..."
                  value={believesdata[0] || ''}
                  onChangeText={text => updateBelieve(text, 0)}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={50}
                />
  
                <Input
                  placeholder="I can..."
                  value={believesdata[1] || ''}
                  onChangeText={text => updateBelieve(text, 1)}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={50}
                  marginTop={wp(-2)}
                />
  
                <Input
                  placeholder="I deserve..."
                  value={believesdata[2] || ''}
                  onChangeText={text => updateBelieve(text, 2)}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={50}
                  marginTop={wp(-2)}
                />
              </View>
  
              {/* Next Button */}
              <TouchableOpacity
                onPress={handleNext}
                style={[
                  styles.btnView,
                  {
                    backgroundColor: Colors.mainColor,
                    marginTop: wp(15),
                    marginBottom: wp(4),
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.titleText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  };
  
  export default FormJournal2;