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
  const FormJournal1 = ({ navigation }) => {
    
    const [gratitudedata, setGratitudedata] = useState([]);
  console.log('my gratitudedata',gratitudedata)
    const updateGratitude = (text, index) => {
      setGratitudedata(prev => {
        const newData = [...prev];
  
        while (newData.length <= index) {
          newData.push('');
        }
        newData[index] = text;
  
        return newData;
      });
    };
  
    // Handle navigation to next screen with only filled entries
    const handleNext = () => {
      const filledEntries = gratitudedata
        .map(item => item.trim())           // Remove extra spaces
        .filter(item => item !== '');       // Keep only non-empty
  
      navigation.navigate('FormJournal2', { gratitudedata: filledEntries });
    };
  const {top}=useSafeAreaInsets()
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
           
  
            <View style={{ flex: 1, marginTop: wp(6), marginHorizontal: wp(3) }}>
              {/* Title */}
              <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: wp(3) }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: Colors.black,
                    textAlign: 'center',
                    fontFamily: fonts.bold,
                    lineHeight: 26,
                  }}
                >
                  Start With Gratitude
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
                  Today I am grateful for
                </Text>
              </View>
  
              {/* Image */}
              <Image
                source={images.jnlonboard2}
                resizeMode="contain"
                style={{
                  width: wp(50),
                  height: wp(50),
                  alignSelf: 'center',
                  marginVertical: wp(5),
                }}
              />
  
              {/* Input Fields */}
              <View style={{ marginHorizontal: wp(2) }}>
                <Input
                  placeholder="E.g Morning coffee"
                  value={gratitudedata[0] || ''}
                  onChangeText={text => updateGratitude(text, 0)}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={50}
                />
  
                <Input
                  placeholder="E.g Good health"
                  value={gratitudedata[1] || ''}
                  onChangeText={text => updateGratitude(text, 1)}
                  type="default"
                  showBorder
                  inputColor="#F5F5F5"
                  labelColor="#212121"
                  placeFontSize={16}
                  maxLength={50}
                  marginTop={wp(-2)}
                />
  
                <Input
                  placeholder="E.g Peaceful evening"
                  value={gratitudedata[2] || ''}
                  onChangeText={text => updateGratitude(text, 2)}
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
                    alignSelf:'center'
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
  
  export default FormJournal1;