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
  Modal
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import SwitchToggle from 'react-native-switch-toggle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const AppBlocker = ({ navigation }) => {
  // State to manage switch toggle
  const [isSwitchOn, setIsSwitchOn] = useState(true);


const [modalVisible, setModalVisible] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [modalWeeklyReport, setModalWeeklyReport] = useState(false);
  const showTimePickerModal = () => {
    setModalVisible(true);
  };

  const hideTimePickerModal = () => {
    setModalVisible(false);
  };

  const handleTimeConfirm = () => {
    const timeString = `${selectedMinutes.toString().padStart(2, '0')}:${selectedSeconds.toString().padStart(2, '0')}`;
    console.log('Selected time:', timeString);
    // You can set this to your state or pass it to parent
    setModalVisible(false);
  };

  // Generate minute options (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  // Generate second options (0-59)
  const secondOptions = Array.from({ length: 60 }, (_, i) => i);

  const renderPickerItem = (options, selectedValue, onSelect, label) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView
        
        contentContainerStyle={[styles.pickerScroll,{flexDirection:'column',}]}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / 50);
          onSelect(Math.min(index, options.length - 1));
        }}
      >
        {options.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.pickerItem,
              selectedValue === item && styles.selectedPickerItem
            ]}
            onPress={() => onSelect(item)}
          >
            <Text style={[
              styles.pickerText,
              selectedValue === item && styles.selectedPickerText
            ]}>
              {item.toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
 const [isStartTimePickerVisible, setStartTimePickerVisibility] =
        useState(false);
               const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

           const handleStartTimeConfirm = date => {
    setStartTime(date);
    hideStartTimePicker();
  };

    const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };



  // Handler function for switch toggle
  const handleToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const [isSwitchOn2, setIsSwitchOn2] = useState(true);

  const handleToggleSwitch2 = () => {
    setIsSwitchOn2(!isSwitchOn2);
  };

    const [isSwitchOn3, setIsSwitchOn3] = useState(true);

  const handleToggleSwitch3 = () => {
    setIsSwitchOn3(!isSwitchOn3);
  };

    const [isSwitchOn4, setIsSwitchOn4] = useState(true);

  const handleToggleSwitch4 = () => {
    setIsSwitchOn4(!isSwitchOn4);
  };

  const timeDisplay = useMemo(() => {
  if (selectedMinutes !== null && selectedSeconds !== null) {
    return `${selectedMinutes.toString().padStart(2, '0')}:${selectedSeconds.toString().padStart(2, '0')}`;
  }
  return 'Select Time';
}, [selectedMinutes, selectedSeconds]);
  return (
    <ImageBackground
      source={images.mainbackground}
      style={{ flex: 1, paddingTop: 20 }}
      resizeMode="cover"
    >
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
            marginTop: wp(7),
            marginHorizontal: wp(5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: wp(15),
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={images.menuIcon}
              style={{ width: 28, height: 28, marginRight: wp(2) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              marginRight: wp(7),
            }}
          >
            App Blocker
          </Text>
          <Text></Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}
              >
                Focus Mode
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: '#848A94',
                }}
              >
                Eliminate distractions and boost your productivity
              </Text>
            </View>

            <View
              style={{
                width: wp(90),
                height: wp(15),
                backgroundColor: Colors.lightgreen,
                borderRadius: wp(3),
                elevation: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: wp(3),
                marginTop: wp(3), // Added some spacing
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  All Blocker
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                  }}
                >
                  Block distracting apps
                </Text>
              </View>

              <SwitchToggle
                switchOn={isSwitchOn}
                onPress={handleToggleSwitch}
                circleColorOff="#FFFFFF"
                circleColorOn={Colors.lightgreen}
                backgroundColorOn={Colors.mainColor}
                backgroundColorOff={Colors.white}
                buttonWidth={wp(4)}
                buttonHeight={wp(4)}
                duration={200}
                slideOffset={wp(4)}
                containerStyle={{
                  width: wp(8),
                  height: wp(4),
                  borderRadius: wp(6),
                }}
                circleStyle={{
                  borderRadius: wp(5),
                  width: wp(4),
                  height: wp(4),
                  elevation: 4,
                }}
                activeButtonPressedShadowColor="#6B48FF"
                inactiveButtonPressedShadowColor="#D3D3D3"
              />
            </View>
            <View style={{ marginTop: wp(3) }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}
              >
                Focus Mode
              </Text>
            </View>
            <View
              style={{
                width: wp(90),
                height: wp(15),
                backgroundColor: Colors.lightgreen,
                borderRadius: wp(3),
                elevation: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: wp(3),
                marginTop: wp(3), // Added some spacing
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  Social Media Apps
                </Text>
              </View>

              <SwitchToggle
                switchOn={isSwitchOn2}
                onPress={handleToggleSwitch2}
                circleColorOff="#FFFFFF"
                circleColorOn={Colors.lightgreen}
                backgroundColorOn={Colors.mainColor}
                backgroundColorOff={Colors.white}
                buttonWidth={wp(4)}
                buttonHeight={wp(4)}
                duration={200}
                slideOffset={wp(4)}
                containerStyle={{
                  width: wp(8),
                  height: wp(4),
                  borderRadius: wp(6),
                }}
                circleStyle={{
                  borderRadius: wp(5),
                  width: wp(4),
                  height: wp(4),
                  elevation: 4,
                }}
                activeButtonPressedShadowColor="#6B48FF"
                inactiveButtonPressedShadowColor="#D3D3D3"
              />
            </View>
              <View
              style={{
                width: wp(90),
                height: wp(15),
                backgroundColor: Colors.lightgreen,
                borderRadius: wp(3),
                elevation: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: wp(3),
                marginTop: wp(4), // Added some spacing
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  Games Apps
                </Text>
              </View>

              <SwitchToggle
                switchOn={isSwitchOn3}
                onPress={handleToggleSwitch3}
                circleColorOff="#FFFFFF"
                circleColorOn={Colors.lightgreen}
                backgroundColorOn={Colors.mainColor}
                backgroundColorOff={Colors.white}
                buttonWidth={wp(4)}
                buttonHeight={wp(4)}
                duration={200}
                slideOffset={wp(4)}
                containerStyle={{
                  width: wp(8),
                  height: wp(4),
                  borderRadius: wp(6),
                }}
                circleStyle={{
                  borderRadius: wp(5),
                  width: wp(4),
                  height: wp(4),
                  elevation: 4,
                }}
                activeButtonPressedShadowColor="#6B48FF"
                inactiveButtonPressedShadowColor="#D3D3D3"
              />
            </View>
              <View
              style={{
                width: wp(90),
                height: wp(15),
                backgroundColor: Colors.lightgreen,
                borderRadius: wp(3),
                elevation: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: wp(3),
                marginTop: wp(4), 
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}
                >
                  Messaging Apps 
                </Text>
              </View>

              <SwitchToggle
                switchOn={isSwitchOn4}
                onPress={handleToggleSwitch4}
                circleColorOff="#FFFFFF"
                circleColorOn={Colors.lightgreen}
                backgroundColorOn={Colors.mainColor}
                backgroundColorOff={Colors.white}
                buttonWidth={wp(4)}
                buttonHeight={wp(4)}
                duration={200}
                slideOffset={wp(4)}
                containerStyle={{
                  width: wp(8),
                  height: wp(4),
                  borderRadius: wp(6),
                }}
                circleStyle={{
                  borderRadius: wp(5),
                  width: wp(4),
                  height: wp(4),
                  elevation: 4,
                }}
                activeButtonPressedShadowColor="#6B48FF"
                inactiveButtonPressedShadowColor="#D3D3D3"
              />
            </View>
             <Text
                                            style={{
                                              fontSize: 14,
                            fontFamily: fonts.bold,
                            color: Colors.black,
                            marginTop:wp(3)
                        
                                            }}
                                          >
                                            Start Time
                                          </Text>
            <TouchableOpacity               style={{
                width: wp(90),
                height: wp(20),
                backgroundColor: Colors.lightgreen,
                borderRadius: wp(3),
                elevation: 1,
                flexDirection: 'row',
                // justifyContent: 'space-between',
                justifyContent:'center',
                alignItems: 'center',
                paddingHorizontal: wp(3),
                marginTop: wp(3), 
              }}       onPress={showTimePickerModal}>
        <Text style={{fontSize:18,color:Colors.mainColor,fontFamily:fonts.bold}}>{selectedMinutes !== null && selectedSeconds !== null 
      ? (
          <>
            <Text style={{fontSize:32,color:Colors.mainColor,fontFamily:fonts.bold, lineHeight: 30}}>
              {selectedMinutes.toString().padStart(2, '0')}{' '}   
            </Text>
            <Text style={{fontSize:14,color:Colors.mainColor,fontFamily:fonts.medium, marginTop: 2}}>
                min{' '}   
            </Text>
            <Text style={{fontSize:18,color:Colors.mainColor,fontFamily:fonts.bold, marginTop: 5}}>
              :{' '}   
            </Text>
            <Text style={{fontSize:32,color:Colors.mainColor,fontFamily:fonts.bold, lineHeight: 30, marginTop: 5}}>
              {selectedSeconds.toString().padStart(2, '0')}
            </Text>
            <Text style={{fontSize:14,color:Colors.mainColor,fontFamily:fonts.medium, marginTop: 2}}>
              {' '}sec
            </Text>
          </>
        )
      : 'Select Time'
    }</Text>
      </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={()=>setModalWeeklyReport(true)} style={{width:wp(90),height:wp(13),borderWidth:1,borderColor:Colors.mainColor,borderRadius:wp(8),alignSelf:'center',justifyContent:'center',alignItems:'center',marginTop:wp(10)}}> 
<Text style={{fontSize:16,fontFamily:fonts.bold,color:Colors.mainColor}}>Start Focus Mode</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideTimePickerModal}
      >
        <View style={styles.modalOverlay}>
            <View style={{width:wp(80),
            height:wp(120), backgroundColor:'white',borderRadius:wp(3),
            alignItems:'center'
            }}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            
            <View style={styles.pickerWrapper}>
              {renderPickerItem(
                minuteOptions,
                selectedMinutes,
                setSelectedMinutes,
                'Minutes'
              )}
           
              {renderPickerItem(
                secondOptions,
                selectedSeconds,
                setSelectedSeconds,
                'Seconds'
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={hideTimePickerModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleTimeConfirm}
              >
                <Text style={styles.confirmButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </View>
      </Modal>
         
             <Modal
                   animationType="slide"
                   transparent={true}
                   visible={modalWeeklyReport}
                   onRequestClose={() => setModalWeeklyReport(false)}
                 >
                   <View
                     style={{
                       flex: 1,
                       justifyContent: 'center',
                       alignItems: 'center',
                       backgroundColor: 'rgba(0, 0, 0, 0.5)',
                       paddingBottom: wp(25),
                     }}
                   >
                     <View
                       style={{
                         backgroundColor: Colors.white,
                         borderRadius: 10,
                         padding: wp(5),
                         width: wp(90),
                       }}
                     >
             
                       <View
                         style={{ position: 'absolute', top: 15, right: 15, padding: 5 }}
                         onTouchEnd={() => setModalWeeklyReport(false)}
                       >
                         <AntDesign name="close" size={18} color={Colors.black} />
                       </View>
         <Image source={images.modalLogo} resizeMode='contain' style={{width:wp(60),height:wp(50),alignSelf:'center'}}/>
                     
                  
                     <Text style={{fontSize:20,fontFamily:fonts.bold,color:Colors.mainColor,alignSelf:'center'}}>Send Weekly Report</Text>
                     <Text style={{fontSize:14,fontFamily:fonts.bold,color:Colors.black,alignSelf:'center',marginTop:wp(5)}}>30 minutes 30 seconds</Text>
<TouchableOpacity onPress={()=>setModalWeeklyReport(false)} style={{width:wp(70),height:wp(13),backgroundColor:Colors.mainColor,justifyContent:'center',alignItems:'center',alignSelf:'center',borderRadius:wp(8),marginTop:wp(15),marginBottom:wp(3)}}>
<Text style={{fontSize:16,fontFamily:fonts.bold,color:Colors.white}}>Finished</Text>
</TouchableOpacity>
                   
                     </View>
                   </View>
                 </Modal>
                
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default AppBlocker;
