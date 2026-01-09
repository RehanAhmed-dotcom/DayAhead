import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,Image,
  Alert,
} from 'react-native';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../Components/Loader';
import { PostAPiwithToken } from '../../Components/ApiRoot';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddNew = ({ navigation }) => {
  const user = useSelector(state => state.user.user);

  // States
  const [modalAddReminder, setModalAddReminder] = useState(false);
  const [modalAddNotes, setModalAddNotes] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  // Reminder States
  const [title, setTitle] = useState('');
  const [selectedDateRmd, setSelectedDateRmd] = useState(null);
  const [startTimeRmd, setStartTimeRmd] = useState(null);
  const [endTimeRmd, setEndTimeRmd] = useState(null);

  // Date & Time Picker Visibility
  const [isDatePickerVisibleRmd, setDatePickerVisibilityRmd] = useState(false);
  const [isStartTimePickerVisibleRmd, setStartTimePickerVisibilityRmd] = useState(false);
  const [isEndTimePickerVisibleRmd, setEndTimePickerVisibilityRmd] = useState(false);

  // Notes States
  const [notetitle, setNoteTitle] = useState('');
  const [check, setcheck] = useState(false);

  const toglecheck = () => setcheck(!check);

  // Format Date: YYYY-MM-DD
  const formatDate = date => {
    if (!date) return 'Select Date';
    return moment(date).format('YYYY-MM-DD');
  };

  // Format Time: 02:30 PM
  const formatTime = date => {
    if (!date) return 'Select time';
    return moment(date).format('hh:mm A');
  };

  // === Safe Picker Helpers (iOS Fix) ===
  const openPicker = (showPicker) => {
    setModalAddReminder(false);
    setTimeout(() => showPicker(true), 400);
  };

  const closePickerAndReopenModal = () => {
    setTimeout(() => setModalAddReminder(true), 400);
  };

  // Date Picker
  const showDatePicker = () => openPicker(setDatePickerVisibilityRmd);
  const hideDatePicker = () => {
    setDatePickerVisibilityRmd(false);
    closePickerAndReopenModal();
  };
  const handleDateConfirm = (date) => {
    setSelectedDateRmd(date);
    hideDatePicker();
  };

  // Start Time Picker
  const showStartTimePicker = () => openPicker(setStartTimePickerVisibilityRmd);
  const hideStartTimePicker = () => {
    setStartTimePickerVisibilityRmd(false);
    closePickerAndReopenModal();
  };
  const handleStartTimeConfirm = (time) => {
    setStartTimeRmd(time);
    hideStartTimePicker();
  };

  // End Time Picker
  const showEndTimePicker = () => openPicker(setEndTimePickerVisibilityRmd);
  const hideEndTimePicker = () => {
    setEndTimePickerVisibilityRmd(false);
    closePickerAndReopenModal();
  };
  const handleEndTimeConfirm = (time) => {
    setEndTimeRmd(time);
    hideEndTimePicker();
  };

  // === Create Reminder API ===
  const CreateReminderApi = () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Title Required', text2: 'Please enter a title' });
      return;
    }
    if (!selectedDateRmd || !startTimeRmd) {
      Toast.show({ type: 'error', text1: 'Date & Time Required', text2: 'Select date and start time' });
      return;
    }
    if (!endTimeRmd) {
      Toast.show({ type: 'error', text1: 'End Time Required' });
      return;
    }
    if (startTimeRmd >= endTimeRmd) {
      Toast.show({ type: 'error', text1: 'Invalid Time', text2: 'End time must be after start time' });
      return;
    }

    const formdata = new FormData();
    formdata.append('title', title);
    formdata.append('date', formatDate(selectedDateRmd));
    formdata.append('start_time', formatTime(startTimeRmd));
    formdata.append('end_time', formatTime(endTimeRmd));

    setIsLoading(true);
    PostAPiwithToken({ url: 'add-reminder', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({ type: 'success', text1: 'Success', text2: res.message || 'Reminder added!' });
          setModalAddReminder(false);
          setTitle('');
          setSelectedDateRmd(null);
          setStartTimeRmd(null);
          setEndTimeRmd(null);
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: res.message });
        }
      })
      .catch(err => {
        setIsLoading(false);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong' });
      });
  };

  // === Create Note API ===
  const CreateNoteApi = () => {
    if (!notetitle.trim()) {
      Alert.alert('Error', 'Note is required');
      return;
    }

    const formdata = new FormData();
    formdata.append('description', notetitle);
    // formdata.append('is_private', check ? 1 : 0); // Uncomment if backend supports

    setIsLoading(true);
    PostAPiwithToken({ url: 'add-note', Token: user?.api_token }, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({ type: 'success', text1: 'Success', text2: 'Note added!' });
          setModalAddNotes(false);
          setNoteTitle('');
          setcheck(false);
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: res.message });
        }
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to add note');
      });
  };
  const {top} = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainbackground}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? top : 20 }}
      resizeMode="cover"
    >
      {isloading && <Loader />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={{ marginTop: wp(7), marginHorizontal: wp(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={20} color={Colors.white} />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.white }}>
              Add/Create
            </Text>
            <View style={{ width: 20 }} />
          </View>

          {/* Options */}
          <View style={{ marginHorizontal: wp(5), marginTop: wp(25) }}>
            <TouchableOpacity
              onPress={() => navigation?.navigate('CreateTask')}
              style={styles.tasksView}
              activeOpacity={0.7}
            >
              <View style={{ width: wp(73) }}>
                <Text style={[styles.titleText, { color: Colors.black }]}>Add Tasks</Text>
                <Text style={styles.descText}>You can prioritize your assignable work here</Text>
              </View>
              <Image source={images.addtaskIcon} resizeMode="contain" style={{ width: 37, height: 32 }} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalAddReminder(true)}
              style={styles.tasksView}
              activeOpacity={0.7}
            >
              <View style={{ width: wp(73) }}>
                <Text style={[styles.titleText, { color: Colors.black }]}>Add Reminder</Text>
                <Text style={styles.descText}>Set reminders for important events</Text>
              </View>
              <Image source={images.addreminderIcon} resizeMode="contain" style={{ width: 47, height: 47 }} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalAddNotes(true)}
              style={styles.tasksView}
              activeOpacity={0.7}
            >
              <View style={{ width: wp(73) }}>
                <Text style={[styles.titleText, { color: Colors.black }]}>Add Notes</Text>
                <Text style={styles.descText}>Add any documents or personal notes</Text>
              </View>
              <Image source={images.documentIcon} resizeMode="contain" style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ========== Add Reminder Modal ========== */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAddReminder}
          onRequestClose={() => setModalAddReminder(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: wp(6), marginHorizontal: wp(5), marginBottom: wp(8) }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.bold, textAlign: 'center', marginBottom: wp(4) }}>
                Add Reminder
              </Text>

              <TouchableOpacity
                style={{ position: 'absolute', top: 15, right: 15 }}
                onPress={() => setModalAddReminder(false)}
              >
                <AntDesign name="close" size={22} color="#000" />
              </TouchableOpacity>

              {/* Title */}
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, marginBottom: wp(2) }}>Title</Text>
              <TextInput
                placeholder="Enter reminder title"
                value={title}
                onChangeText={setTitle}
                style={{ backgroundColor: '#FAFAFA', borderRadius: 10, paddingHorizontal: 15, height: 50, fontSize: 14 }}
              />

              {/* Date */}
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, marginTop: wp(4), marginBottom: wp(2) }}>Date</Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={{ backgroundColor: '#FAFAFA', borderRadius: 10, padding: 15, height: 50, justifyContent: 'center' }}
              >
                <Text style={{ color: selectedDateRmd ? '#000' : '#888' }}>
                  {formatDate(selectedDateRmd)}
                </Text>
              </TouchableOpacity>

              {/* Time */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: wp(4) }}>
                <View style={{ flex: 1, marginRight: wp(3) }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 14, marginBottom: wp(2) }}>Start Time</Text>
                  <TouchableOpacity
                    onPress={showStartTimePicker}
                    style={{ backgroundColor: '#FAFAFA', borderRadius: 10, padding: 15, height: 50, justifyContent: 'center' }}
                  >
                    <Text style={{ color: startTimeRmd ? '#000' : '#888' }}>
                      {formatTime(startTimeRmd)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginLeft: wp(3) }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 14, marginBottom: wp(2) }}>End Time</Text>
                  <TouchableOpacity
                    onPress={showEndTimePicker}
                    style={{ backgroundColor: '#FAFAFA', borderRadius: 10, padding: 15, height: 50, justifyContent: 'center' }}
                  >
                    <Text style={{ color: endTimeRmd ? '#000' : '#888' }}>
                      {formatTime(endTimeRmd)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={CreateReminderApi}
                style={{ backgroundColor: Colors.mainColor, marginTop: wp(8), borderRadius: 12, padding: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: 16 }}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ========== Add Notes Modal ========== */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAddNotes}
          onRequestClose={() => setModalAddNotes(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: wp(6), marginHorizontal: wp(5), marginBottom: wp(8) }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.bold, textAlign: 'center', marginBottom: wp(4) }}>
                Add Note
              </Text>

              <TouchableOpacity
                style={{ position: 'absolute', top: 15, right: 15 }}
                onPress={() => setModalAddNotes(false)}
              >
                <AntDesign name="close" size={22} color="#000" />
              </TouchableOpacity>

              <Text style={{ fontFamily: fonts.bold, fontSize: 14, marginBottom: wp(2) }}>Note</Text>
              <TextInput
                placeholder="Write your note here..."
                value={notetitle}
                onChangeText={setNoteTitle}
                multiline
                style={{ backgroundColor: '#FAFAFA', borderRadius: 10, padding: 15, height: 120, textAlignVertical: 'top' }}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(3) }}>
                <TouchableOpacity onPress={toglecheck}>
                  <Ionicons
                    name={check ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={24}
                    color={check ? Colors.mainColor : '#888'}
                  />
                </TouchableOpacity>
                <Text style={{ marginLeft: 8, color: check ? Colors.mainColor : '#666' }}>Private note</Text>
              </View>

              <TouchableOpacity
                onPress={CreateNoteApi}
                style={{ backgroundColor: Colors.mainColor, marginTop: wp(6), borderRadius: 12, padding: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: 16 }}>Add Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ========== All Date/Time Pickers (iOS Safe) ========== */}
        <DateTimePickerModal
          isVisible={isDatePickerVisibleRmd}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />
        <DateTimePickerModal
          isVisible={isStartTimePickerVisibleRmd}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}
        />
        <DateTimePickerModal
          isVisible={isEndTimePickerVisibleRmd}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default AddNew;