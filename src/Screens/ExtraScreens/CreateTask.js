// import {
//   View,
//   Text,
//   ImageBackground,
//   Image,
//   KeyboardAvoidingView,
//   StatusBar,
//   Platform,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   Alert,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { Colors, fonts, images, styles } from '../../Constant/Index';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MainButton from '../../Components/MainButton';
// import ImageCropPicker from 'react-native-image-crop-picker';
// import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
// import Loader from '../../Components/Loader';
// import { useSelector } from 'react-redux';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import Toast from 'react-native-toast-message';

// const CreateTask = ({ navigation }) => {
//   const user = useSelector(state => state.user.user);

//   // States
//   const [selectedImages, setSelectedImages] = useState([null, null, null]);
//   const [title, setTitle] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedPriority, setSelectedPriority] = useState(null);
//   const [modalVisiblemember, setModalVisibleMember] = useState(false);
//   const [allMembers, setAllMembers] = useState([]);
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [description, setDescription] = useState('');
//   const [isloading, setIsLoading] = useState(false);

//   // DateTime States
//   const [startDateTime, setStartDateTime] = useState(null);
//   const [endDateTime, setEndDateTime] = useState(null);
//   const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
//   const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

//   // Image Upload
//   const upload = async index => {
//     try {
//       const image = await ImageCropPicker.openPicker({
//         width: 400,
//         height: 400,
//         cropping: true,
//         compressImageQuality: 1,
//       });

//       const updatedImages = [...selectedImages];
//       updatedImages[index] = image.path;
//       setSelectedImages(updatedImages);
//     } catch (error) {
//       console.error('Error picking image:', error);
//     }
//   };

//   // Priority Selection
//   const handlePrioritySelect = priority => {
//     setSelectedPriority(priority);
//     setModalVisible(false);
//   };

//   // Member Selection (Multiple)
//   const handleMemberSelect = memberId => {
//     setSelectedMembers(prev =>
//       prev.includes(memberId)
//         ? prev.filter(m => m !== memberId)
//         : [...prev, memberId],
//     );
//   };

//   // DateTime Picker Handlers
//   const showStartPicker = () => setStartPickerVisibility(true);
//   const hideStartPicker = () => setStartPickerVisibility(false);
//   const showEndPicker = () => setEndPickerVisibility(true);
//   const hideEndPicker = () => setEndPickerVisibility(false);

//   const handleStartConfirm = date => {
//     setStartDateTime(date);
//     hideStartPicker();
//     // Optional: Auto-clear end date if it's before new start
//     if (endDateTime && endDateTime < date) {
//       setEndDateTime(null);
//     }
//   };

//   const handleEndConfirm = date => {
//     setEndDateTime(date);
//     hideEndPicker();
//   };

//   // UI Formatter
//   const formatDateTime = date => {
//     if (!date) return 'Select date & time';
//     return date.toLocaleString([], {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // API Formatter: 2025-11-13 12:00 PM
//   const formatForAPI = date => {
//     if (!date) return null;
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const day = String(d.getDate()).padStart(2, '0');

//     let hours = d.getHours();
//     const minutes = String(d.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     const strHours = String(hours).padStart(2, '0');

//     return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
//   };

//   // Fetch All Members
//   const getAllMembers = () => {
//     AllGetAPI({ url: 'friends', Token: user?.api_token })
//       .then(res => {
//         setAllMembers(res.data);
//       })
//       .catch(err => {
//         console.log('api error', err);
//       });
//   };

//   useEffect(() => {
//     getAllMembers();
//   }, []);

//   // Create Task API
//   const CreateTasApi = () => {
//     // Validation
//     // if (selectedImages.filter(img => img).length === 0) {
//     //   Toast.show({
//     //     type: 'error',
//     //     text1: 'Error',
//     //     text2: 'At least one image is required',
//     //   });
//     //   return;
//     // }
//     if (!title.trim()) {
//       Toast.show({ type: 'error', text1: 'Error', text2: 'Title is required' });
//       return;
//     }
//     // if (selectedMembers.length === 0) {
//     //   Toast.show({
//     //     type: 'error',
//     //     text1: 'Error',
//     //     text2: 'At least one member is required',
//     //   });
//     //   return;
//     // }
//     if (!startDateTime) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Start date & time is required',
//       });
//       return;
//     }
//     if (!endDateTime) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'End date & time is required',
//       });
//       return;
//     }
//     // if (!selectedPriority) {
//     //   Toast.show({
//     //     type: 'error',
//     //     text1: 'Error',
//     //     text2: 'Priority is required',
//     //   });
//     //   return;
//     // }
//     // if (!description.trim()) {
//     //   Toast.show({
//     //     type: 'error',
//     //     text1: 'Error',
//     //     text2: 'Description is required',
//     //   });
//     //   return;
//     // }

//     const formdata = new FormData();
//     formdata.append('title', title);
//     selectedMembers.forEach(id => formdata.append('members[]', id));
//     formdata.append('start_datetime', formatForAPI(startDateTime));
//     formdata.append('end_datetime', formatForAPI(endDateTime));
//     formdata.append('description', description);
//     formdata.append('priority', selectedPriority);

//     selectedImages.forEach(img => {
//       if (img) {
//         formdata.append('attachment[]', {
//           uri: img,
//           type: 'image/jpeg',
//           name: `image_${Date.now()}.jpg`,
//         });
//       }
//     });

//     setIsLoading(true);
//     PostAPiwithToken({ url: 'add-task', Token: user?.api_token }, formdata)
//       .then(res => {
//         setIsLoading(false);
//         if (res.status === 'success') {
//           Toast.show({ type: 'success', text1: 'Success', text2: res.message });
//           navigation.goBack();
//         } else {
//           Toast.show({
//             type: 'error',
//             text1: 'Error',
//             text2: res.message || 'Something went wrong',
//           });
//         }
//       })
//       .catch(err => {
//         setIsLoading(false);
//         console.log('API error:', err);
//         Alert.alert('Error', 'Failed to create task');
//       });
//   };

//   return (
//     <ImageBackground
//       source={images.mainbackground}
//       style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?40: 20 }}
//       resizeMode="cover"
//     >
//       {isloading && <Loader />}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
//       >
//         <StatusBar
//           translucent
//           backgroundColor={'transparent'}
//           barStyle={'light-content'}
//         />

//         {/* Header */}
//         <View
//           style={{
//             marginTop: wp(7),
//             marginHorizontal: wp(5),
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: wp(15),
//           }}
//         >
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <AntDesign name="left" size={20} color={Colors.white} />
//           </TouchableOpacity>
//           <Text
//             style={{
//               fontSize: 16,
//               fontFamily: fonts.bold,
//               color: Colors.white,
//               marginRight: wp(7),
//             }}
//           >
//             Add/Create Tasks
//           </Text>
//           <Text></Text>
//         </View>

//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           {/* Attachment */}
//           <View style={{ marginTop: wp(3) }}>
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: fonts.bold,
//                 color: Colors.black,
//                 paddingHorizontal: wp(5),
//               }}
//             >
//               Attachment
//             </Text>
//             {/* <Text
//               style={{
//                 fontSize: 12,
//                 fontFamily: fonts.medium,
//                 color: '#667085',
//                 paddingHorizontal: wp(5),
//               }}
//             >
//               Format should be in .pdf .jpeg .png.
//             </Text> */}
//           </View>

//           <View
//             style={{
//               paddingHorizontal: wp(5),
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginTop: wp(3),
//             }}
//           >
//             {[0, 1, 2].map(index => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.uploadpicView}
//                 onPress={() => upload(index)}
//               >
//                 <Image
//                   source={
//                     selectedImages[index]
//                       ? { uri: selectedImages[index] }
//                       : images.uploadIcon
//                   }
//                   resizeMode="contain"
//                   style={{
//                     width: selectedImages[index] ? wp(28) : 33,
//                     height: selectedImages[index] ? wp(28) : 33,
//                     borderRadius: selectedImages[index] ? wp(3) : 0,
//                   }}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Title */}
//           <View style={{ marginTop: wp(3), paddingHorizontal: wp(5) }}>
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: fonts.bold,
//                 color: Colors.black,
//               }}
//             >
//               Add title
//             </Text>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 borderRadius: 8,
//                 paddingHorizontal: 10,
//                 backgroundColor: '#FAFAFA',
//                 marginTop: wp(2),
//                 paddingVertical: wp(4),
//                 elevation: 2,
//                 shadowOffset: { height: 2, width: 4 },
//                 shadowOpacity: 0.2,
//                 shadowColor: 'grey',
//                 shadowRadius: 8,
//               }}
//             >
//               <TextInput
//                 placeholder="Enter title"
//                 onChangeText={setTitle}
//                 value={title}
//                 placeholderTextColor={'#616161'}
//                 style={{
//                   width: wp(80),
//                   fontSize: 14,
//                   fontFamily: fonts.regular,
//                   color: Colors.black,
                  
//                 }}
//               />
//             </View>

//             {/* Members */}
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: fonts.bold,
//                 color: Colors.black,
//                 marginTop: wp(3),
//               }}
//             >
//               Add member
//             </Text>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 borderRadius: 8,
//                 paddingHorizontal: 10,
//                 backgroundColor: '#FAFAFA',
//                 marginTop: wp(2),
//                 paddingVertical: 13,
//                 elevation: 2,
//                 shadowOffset: { height: 2, width: 4 },
//                 shadowOpacity: 0.2,
//                 shadowColor: 'grey',
//                 shadowRadius: 8,
                
                
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontFamily: fonts.regular,
//                   color: selectedMembers.length > 0 ? Colors.black : '#616161',
//                   width: wp(70),
//                 }}
//               >
//                 {selectedMembers.length > 0
//                   ? allMembers
//                       .filter(m => selectedMembers.includes(m.id))
//                       .map(m => m.name)
//                       .join(', ')
//                   : 'Select members'}
//               </Text>
//               <TouchableOpacity onPress={() => setModalVisibleMember(true)}>
//                 <AntDesign name="down" color={Colors.mainColor} size={18} />
//               </TouchableOpacity>
//             </View>

//             {/* Start & End DateTime */}
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: fonts.bold,
//                 color: Colors.black,
//                 marginTop: wp(3),
//               }}
//             >
//               Task Period
//             </Text>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginTop: wp(2),
//               }}
//             >
//               <View>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontFamily: fonts.medium,
//                     color: Colors.black,
//                   }}
//                 >
//                   Start Date & Time
//                 </Text>
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: '#FAFAFA',
//                     width: wp(42),
//                     height: wp(12),
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     borderRadius: wp(2),
//                     marginTop: wp(1),
//                     elevation: 2,
//                 shadowOffset: { height: 2, width: 4 },
//                 shadowOpacity: 0.2,
//                 shadowColor: 'grey',
//                 shadowRadius: 8,
//                   }}
//                   onPress={showStartPicker}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       fontFamily: fonts.medium,
//                       color: Colors.lightblack,
//                     }}
//                   >
//                     {formatDateTime(startDateTime)}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontFamily: fonts.medium,
//                     color: Colors.black,
//                   }}
//                 >
//                   End Date & Time
//                 </Text>
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: '#FAFAFA',
//                     width: wp(42),
//                     height: wp(12),
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     borderRadius: wp(2),
//                     marginTop: wp(1),
//                     elevation: 2,
//                 shadowOffset: { height: 2, width: 4 },
//                 shadowOpacity: 0.2,
//                 shadowColor: 'grey',
//                 shadowRadius: 8,
//                   }}
//                   onPress={showEndPicker}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       fontFamily: fonts.medium,
//                       color: Colors.lightblack,
//                     }}
//                   >
//                     {formatDateTime(endDateTime)}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Priority */}
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: fonts.bold,
//                 color: Colors.black,
//                 marginTop: wp(3),
//               }}
//             >
//               Add Priority
//             </Text>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 borderRadius: 8,
//                 paddingHorizontal: 10,
//                 backgroundColor: '#FAFAFA',
//                 marginTop: wp(2),
//                 paddingVertical: 13,
//                 elevation: 2,
//                 shadowOffset: { height: 2, width: 4 },
//                 shadowOpacity: 0.2,
//                 shadowColor: 'grey',
//                 shadowRadius: 8,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontFamily: fonts.regular,
//                   color: selectedPriority ? Colors.black : '#616161',
//                 }}
//               >
//                 {selectedPriority || 'Select priority'}
//               </Text>
//               <TouchableOpacity onPress={() => setModalVisible(true)}>
//                 <AntDesign name="down" color={Colors.mainColor} size={18} />
//               </TouchableOpacity>
//             </View>

//             {/* Description */}
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: fonts.bold,
//                 color: Colors.black,
//                 marginTop: wp(3),
//               }}
//             >
//               Description
//             </Text>
//             <View
//               style={{
//                 width: wp(90),
//                 height: wp(45),
//                 borderRadius: wp(3),
//                 elevation: 2,
//                 shadowOffset: { height: 2, width: 4 },
//                 shadowOpacity: 0.2,
//                 shadowColor: 'grey',
//                 shadowRadius: 8,
//                 backgroundColor: '#FAFAFA',
//                 alignSelf: 'center',
//                 marginTop: wp(3),
//               }}
//             >
//               <TextInput
//                 style={{
//                   paddingHorizontal: wp(3),
//                   color: Colors.black,
//                   fontFamily: fonts.regular,
//                   fontSize: 14,
//                   textAlignVertical: 'top',
//                   paddingTop: wp(3),
//                 }}
//                 multiline
//                 placeholder="Write here..."
//                 placeholderTextColor={Colors.lightgrey}
//                 value={description}
//                 onChangeText={setDescription}
//               />
//             </View>

//             {/* Submit Button */}
//             <View style={{ alignSelf: 'center', marginVertical: wp(8) }}>
//               <MainButton title="Create Task" onPress={CreateTasApi} />
//             </View>
//           </View>
//         </ScrollView>

//         {/* Priority Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'flex-end',
//               backgroundColor: 'rgba(0,0,0,0.5)',
//             }}
//           >
//             <View
//               style={{
//                 backgroundColor: Colors.white,
//                 borderRadius: 10,
//                 padding: wp(5),
//                 width: wp(90),
//                 alignSelf: 'center',
//                 marginBottom: wp(5),
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 16,
//                   fontFamily: fonts.bold,
//                   color: Colors.black,
//                   marginBottom: wp(4),
//                 }}
//               >
//                 Select Priorities
//               </Text>
//               <TouchableOpacity
//                 style={{ position: 'absolute', top: 15, right: 15 }}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <AntDesign name="close" size={20} color={Colors.black} />
//               </TouchableOpacity>

//               {['Low Priority', 'Medium Priority', 'High Priority'].map(
//                 priority => (
//                   <TouchableOpacity
//                     key={priority}
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       paddingVertical: wp(3),
//                       paddingHorizontal: wp(3),
//                       backgroundColor: Colors.lightgreen,
//                       borderRadius: wp(2),
//                       marginBottom: wp(3),
//                     }}
//                     onPress={() => handlePrioritySelect(priority)}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 14,
//                         fontFamily: fonts.medium,
//                         color: Colors.black,
//                       }}
//                     >
//                       {priority}
//                     </Text>
//                     {selectedPriority === priority && (
//                       <AntDesign
//                         name="checkcircle"
//                         size={22}
//                         color={Colors.mainColor}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 ),
//               )}

//               <TouchableOpacity
//                 style={{
//                   marginTop: wp(4),
//                   backgroundColor: Colors.mainColor,
//                   paddingVertical: wp(3.5),
//                   borderRadius: wp(8),
//                   alignItems: 'center',
//                 }}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text
//                   style={{
//                     color: Colors.white,
//                     fontFamily: fonts.bold,
//                     fontSize: 15,
//                   }}
//                 >
//                   Save
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* Member Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisiblemember}
//           onRequestClose={() => setModalVisibleMember(false)}
//         >
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'flex-end',
//               backgroundColor: 'rgba(0,0,0,0.5)',
//             }}
//           >
//             <View
//               style={{
//                 backgroundColor: Colors.white,
//                 borderRadius: 10,
//                 padding: wp(5),
//                 width: wp(90),
//                 height: hp(80),
//                 alignSelf: 'center',
//                 marginBottom: wp(5),
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 16,
//                   fontFamily: fonts.bold,
//                   color: Colors.black,
//                   marginBottom: wp(4),
//                 }}
//               >
//                 Add Friends/Members
//               </Text>
//               <TouchableOpacity
//                 style={{ position: 'absolute', top: 15, right: 15 }}
//                 onPress={() => setModalVisibleMember(false)}
//               >
//                 <AntDesign name="close" size={20} color={Colors.black} />
//               </TouchableOpacity>

//               <ScrollView showsVerticalScrollIndicator={false}>
//                 {allMembers.length === 0 ? (
//                   <View
//                     style={{
//                       flex: 1,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}
//                   >
//                     <Text style={{ fontSize: 18, fontFamily: fonts.bold }}>
//                       No Friends available
//                     </Text>
//                     <TouchableOpacity
//                       onPress={() => {
//                         setModalVisibleMember(false);
//                         navigation.navigate('AddMembers');
//                       }}
//                     >
//                       <Text
//                         style={{
//                           color: 'blue',
//                           textDecorationLine: 'underline',
//                           marginTop: 10,
//                         }}
//                       >
//                         Click Here to add
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   allMembers.map(member => (
//                     <TouchableOpacity
//                       key={member.id}
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         paddingVertical: wp(3),
//                         paddingHorizontal: wp(3),
//                         backgroundColor: Colors.lightgreen,
//                         borderRadius: wp(2),
//                         marginBottom: wp(3),
//                       }}
//                       onPress={() => handleMemberSelect(member.id)}
//                     >
//                       <Text
//                         style={{
//                           fontSize: 14,
//                           fontFamily: fonts.medium,
//                           color: Colors.black,
//                         }}
//                       >
//                         {member.name}
//                       </Text>
//                       {selectedMembers.includes(member.id) && (
//                         <AntDesign
//                           name="checkcircle"
//                           size={22}
//                           color={Colors.mainColor}
//                         />
//                       )}
//                     </TouchableOpacity>
//                   ))
//                 )}
//               </ScrollView>

//               <TouchableOpacity
//                 style={{
//                   marginTop: wp(4),
//                   backgroundColor: Colors.mainColor,
//                   paddingVertical: wp(3.5),
//                   borderRadius: wp(8),
//                   alignItems: 'center',
//                 }}
//                 onPress={() => setModalVisibleMember(false)}
//               >
//                 <Text
//                   style={{
//                     color: Colors.white,
//                     fontFamily: fonts.bold,
//                     fontSize: 15,
//                   }}
//                 >
//                   Add Now
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* START DATE PICKER - NO PAST DATES */}
//         <DateTimePickerModal
//           isVisible={isStartPickerVisible}
//           mode="datetime"
//           onConfirm={handleStartConfirm}
//           onCancel={hideStartPicker}
//           minimumDate={new Date()} // Blocks past dates
//           date={startDateTime || new Date()} // Opens on current time if none selected
//         />

//         {/* END DATE PICKER - CANNOT BE BEFORE START */}
//         <DateTimePickerModal
//           isVisible={isEndPickerVisible}
//           mode="datetime"
//           onConfirm={handleEndConfirm}
//           onCancel={hideEndPicker}
//           minimumDate={
//             startDateTime
//               ? new Date(startDateTime.getTime() + 60 * 1000) // At least 1 minute after start
//               : new Date()
//           }
//           date={
//             endDateTime ||
//             (startDateTime
//               ? new Date(startDateTime.getTime() + 60 * 1000)
//               : new Date())
//           }
//         />
//       </KeyboardAvoidingView>
//     </ImageBackground>
//   );
// };

// export default CreateTask;

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
  Modal,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainButton from '../../Components/MainButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import { useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';

const CreateTask = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const titleInputRef = useRef(null);
  // States
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  console.log('my imagge',JSON.stringify(selectedImages))
  const [title, setTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [modalVisiblemember, setModalVisibleMember] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [description, setDescription] = useState('');
  const [isloading, setIsLoading] = useState(false);

  // Date & Time States
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null); // null = not selected yet
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  // Image Upload
  const upload = async index => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 1,
      });

      const updatedImages = [...selectedImages];
      updatedImages[index] = image.path;
      setSelectedImages(updatedImages);
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Priority Selection
  const handlePrioritySelect = priority => {
    setSelectedPriority(priority);
    setModalVisible(false);
  };

  // Member Selection
  const handleMemberSelect = memberId => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(m => m !== memberId)
        : [...prev, memberId],
    );
  };

  // Date Picker Handlers
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = date => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    if (selected.getTime() !== todayStart.getTime()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date',
        text2: 'You can only select today’s date',
      });
      return;
    }

    setSelectedDate(date);
    hideDatePicker();
  };

  // Time Picker Handlers
  const showStartPicker = () => setStartPickerVisibility(true);
  const hideStartPicker = () => setStartPickerVisibility(false);
  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => setEndPickerVisibility(false);

  const handleStartConfirm = time => {
    const now = new Date();
    now.setSeconds(0, 0);
    time.setSeconds(0, 0);

    if (time <= now) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Start Time',
        text2: 'Start time must be in the future',
      });
      hideStartPicker();
      return;
    }

    setStartTime(time);
    hideStartPicker();

    if (endTime && endTime <= time) {
      setEndTime(null);
    }
  };

  const handleEndConfirm = time => {
    if (!startTime) {
      Toast.show({
        type: 'error',
        text1: 'Select Start Time First',
        text2: 'Please choose start time before end time',
      });
      hideEndPicker();
      return;
    }

    if (time <= startTime) {
      Toast.show({
        type: 'error',
        text1: 'Invalid End Time',
        text2: 'End time must be after start time',
      });
      hideEndPicker();
      return;
    }

    setEndTime(time);
    hideEndPicker();
  };

  // Format time for display
  const formatTime = time => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format date for display
  // const formatDateDisplay = date => {
  //   if (!date) return 'Select Date';
  //   return date.toLocaleDateString('en-US', {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });
  // };
  const formatDateDisplay = date => {
    if (!date) return 'Select Date';
    
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format full datetime for API
  const formatDateTimeForAPI = time => {
    if (!time) return null;

    const date = selectedDate || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const strHours = String(hours).padStart(2, '0');

    return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
  };

  // Fetch members
  const getAllMembers = () => {
    AllGetAPI({ url: 'friends', Token: user?.api_token })
      .then(res => setAllMembers(res.data))
      .catch(err => console.log('api error', err));
  };

  useEffect(() => {
    getAllMembers();
  }, []);

  // Create Task API
  const CreateTasApi = () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Title is required' });
      return;
    }

    if (!selectedDate) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please select date' });
      return;
    }

    if (!startTime) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Start time is required' });
      return;
    }

    if (!endTime) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'End time is required' });
      return;
    }

    const now = new Date();
    now.setSeconds(0, 0);

    if (startTime <= now) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Start Time',
        text2: 'Start time must be in the future',
      });
      return;
    }

    if (endTime <= startTime) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time Range',
        text2: 'End time must be after start time',
      });
      return;
    }

    const formdata = new FormData();
    formdata.append('title', title);
    selectedMembers.forEach(id => formdata.append('members[]', id));
    formdata.append('start_datetime', formatDateTimeForAPI(startTime));
    formdata.append('end_datetime', formatDateTimeForAPI(endTime));
    formdata.append('description', description);
    formdata.append('priority', selectedPriority);

    selectedImages.forEach(img => {
      if (img) {
        formdata.append('attachment[]', {
          uri: img,
          type: 'image/jpeg',
          name: `image_${Date.now()}.jpg`,
        });
      }
    });

    setIsLoading(true);
    PostAPiwithToken({ url: 'add-task', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({ type: 'success', text1: 'Success', text2: res.message });
          navigation.goBack();
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
    <ImageBackground
      source={images.mainbackground}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 40 : 20 }}
      resizeMode="cover"
    >
      {isloading && <Loader />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        {/* Header */}
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              color: Colors.white,
              marginRight: wp(7),
            }}
          >
            Add/Create Tasks
          </Text>
          <Text></Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Attachment */}
          <View style={{ marginTop: wp(3) }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                paddingHorizontal: wp(5),
              }}
            >
              Attachment
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: wp(5),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: wp(3),
            }}
          >
            {[0, 1, 2].map(index => (
              <TouchableOpacity key={index} style={styles.uploadpicView} onPress={() => upload(index)}>
                <Image
                  source={
                    selectedImages[index] ? { uri: selectedImages[index] } : images.uploadIcon
                  }
                  resizeMode="contain"
                  style={{
                    width: selectedImages[index] ? wp(28) : 33,
                    height: selectedImages[index] ? wp(28) : 33,
                    borderRadius: selectedImages[index] ? wp(3) : 0,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <View style={{ marginTop: wp(3), paddingHorizontal: wp(5) }}>
            <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>
              Add title
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: wp(4),
                elevation: 2,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'grey',
                shadowRadius: 8,
              }}
            >
              <TextInput
                placeholder="Enter title"
                ref={titleInputRef}
                onChangeText={setTitle}
                value={title}
                placeholderTextColor={'#616161'}
                style={{
                  width: wp(80),
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: Colors.black,
                }}
              />
            </View>

            {/* Members */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Add member
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: 13,
                elevation: 2,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'grey',
                shadowRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: selectedMembers.length > 0 ? Colors.black : '#616161',
                  width: wp(70),
                }}
              >
                {selectedMembers.length > 0
                  ? allMembers
                      .filter(m => selectedMembers.includes(m.id))
                      .map(m => m.name)
                      .join(', ')
                  : 'Select members'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisibleMember(true)}>
                <AntDesign name="down" color={Colors.mainColor} size={18} />
              </TouchableOpacity>
            </View>

            {/* Task Period - Date + Start & End Time */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Task Period
            </Text>

            <View style={{ marginTop: wp(2) }}>
              {/* Date Field */}
              <View style={{ marginBottom: wp(3) }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    marginBottom: wp(1),
                  }}
                >
                  Date
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FAFAFA',
                    height: wp(12),
                    justifyContent: 'center',
                    // alignItems: 'center',
                    paddingLeft:wp(3),
                    borderRadius: wp(2),
                    elevation: 2,
                    shadowOffset: { height: 2, width: 4 },
                    shadowOpacity: 0.2,
                    shadowColor: 'grey',
                    shadowRadius: 8,
                  }}
                  onPress={showDatePicker}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: fonts.medium,
                      color: selectedDate ? Colors.lightblack : '#616161',
                    }}
                  >
                    {formatDateDisplay(selectedDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Start & End Time */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                      marginBottom: wp(1),
                    }}
                  >
                    Start Time
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FAFAFA',
                      height: wp(12),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: wp(2),
                      elevation: 2,
                      shadowOffset: { height: 2, width: 4 },
                      shadowOpacity: 0.2,
                      shadowColor: 'grey',
                      shadowRadius: 8,
                    }}
                    onPress={showStartPicker}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: fonts.medium,
                        color: Colors.lightblack,
                      }}
                    >
                      {formatTime(startTime)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ width: '48%' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                      marginBottom: wp(1),
                    }}
                  >
                    End Time
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FAFAFA',
                      height: wp(12),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: wp(2),
                      elevation: 2,
                      shadowOffset: { height: 2, width: 4 },
                      shadowOpacity: 0.2,
                      shadowColor: 'grey',
                      shadowRadius: 8,
                    }}
                    onPress={showEndPicker}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: fonts.medium,
                        color: Colors.lightblack,
                      }}
                    >
                      {formatTime(endTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Priority */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Add Priority
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: '#FAFAFA',
                marginTop: wp(2),
                paddingVertical: 13,
                elevation: 2,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'grey',
                shadowRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.regular,
                  color: selectedPriority ? Colors.black : '#616161',
                }}
              >
                {selectedPriority || 'Select priority'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <AntDesign name="down" color={Colors.mainColor} size={18} />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(3),
              }}
            >
              Description
            </Text>
            <View
              style={{
                width: wp(90),
                height: wp(45),
                borderRadius: wp(3),
                elevation: 2,
                shadowOffset: { height: 2, width: 4 },
                shadowOpacity: 0.2,
                shadowColor: 'grey',
                shadowRadius: 8,
                backgroundColor: '#FAFAFA',
                alignSelf: 'center',
                marginTop: wp(3),
              }}
            >
              <TextInput
                style={{
                  paddingHorizontal: wp(3),
                  color: Colors.black,
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  textAlignVertical: 'top',
                  paddingTop: wp(3),
                }}
                multiline
                placeholder="Write here..."
                placeholderTextColor={Colors.lightgrey}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Submit */}
            <View style={{ alignSelf: 'center', marginVertical: wp(8) }}>
              <MainButton title="Create Task" onPress={CreateTasApi} />
            </View>
          </View>
        </ScrollView>

        {/* Priority Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                padding: wp(5),
                width: wp(90),
                alignSelf: 'center',
                marginBottom: wp(5),
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  marginBottom: wp(4),
                }}
              >
                Select Priorities
              </Text>
              <TouchableOpacity
                style={{ position: 'absolute', top: 15, right: 15 }}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={20} color={Colors.black} />
              </TouchableOpacity>

              {['Low Priority', 'Medium Priority', 'High Priority'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: wp(3),
                    paddingHorizontal: wp(3),
                    backgroundColor: Colors.lightgreen,
                    borderRadius: wp(2),
                    marginBottom: wp(3),
                  }}
                  onPress={() => handlePrioritySelect(priority)}
                >
                  <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>
                    {priority}
                  </Text>
                  {selectedPriority === priority && (
                    <AntDesign name="checkcircle" size={22} color={Colors.mainColor} />
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={{
                  marginTop: wp(4),
                  backgroundColor: Colors.mainColor,
                  paddingVertical: wp(3.5),
                  borderRadius: wp(8),
                  alignItems: 'center',
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: Colors.white, fontFamily: fonts.bold, fontSize: 15 }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Member Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisiblemember}
          onRequestClose={() => setModalVisibleMember(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                padding: wp(5),
                width: wp(90),
                height: hp(80),
                alignSelf: 'center',
                marginBottom: wp(5),
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  marginBottom: wp(4),
                }}
              >
                Add Friends/Members
              </Text>
              <TouchableOpacity
                style={{ position: 'absolute', top: 15, right: 15 }}
                onPress={() => setModalVisibleMember(false)}
              >
                <AntDesign name="close" size={20} color={Colors.black} />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                {allMembers.length === 0 ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontFamily: fonts.bold }}>
                      No Friends available
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisibleMember(false);
                        navigation.navigate('AddMembers');
                      }}
                    >
                      <Text
                        style={{
                          color: 'blue',
                          textDecorationLine: 'underline',
                          marginTop: 10,
                        }}
                      >
                        Click Here to add
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  allMembers.map(member => (
                    <TouchableOpacity
                      key={member.id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: wp(3),
                        paddingHorizontal: wp(3),
                        backgroundColor: Colors.lightgreen,
                        borderRadius: wp(2),
                        marginBottom: wp(3),
                      }}
                      onPress={() => handleMemberSelect(member.id)}
                    >
                      <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>
                        {member.name}
                      </Text>
                      {selectedMembers.includes(member.id) && (
                        <AntDesign name="checkcircle" size={22} color={Colors.mainColor} />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity
                style={{
                  marginTop: wp(4),
                  backgroundColor: Colors.mainColor,
                  paddingVertical: wp(3.5),
                  borderRadius: wp(8),
                  alignItems: 'center',
                }}
                onPress={() => setModalVisibleMember(false)}
              >
                <Text style={{ color: Colors.white, fontFamily: fonts.bold, fontSize: 15 }}>
                  Add Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          date={selectedDate || new Date()}
          minimumDate={new Date()}
          maximumDate={new Date()}
        />

        {/* Start Time Picker */}
        <DateTimePickerModal
          isVisible={isStartPickerVisible}
          mode="time"
          onConfirm={handleStartConfirm}
          onCancel={hideStartPicker}
          date={startTime || new Date()}
          minimumDate={new Date()}
        />

        {/* End Time Picker */}
        <DateTimePickerModal
          isVisible={isEndPickerVisible}
          mode="time"
          onConfirm={handleEndConfirm}
          onCancel={hideEndPicker}
          date={endTime || new Date()}
          minimumDate={startTime ? new Date(startTime.getTime() + 60000) : new Date()}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default CreateTask;