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
    Alert,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../../Components/MainButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
const MyReminder = ({ navigation }) => {
    const user = useSelector(state => state.user.user);
    const [myReminders, setMyReminders] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [sheetOpened, setSheetOpened] = useState(false);

    // Form states
    const [mytitle, setTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingReminderId, setEditingReminderId] = useState(null);

    const titleInputRef = useRef(null);
    const { top } = useSafeAreaInsets();
    const refRBSheet = useRef();
    const reopenBottomSheet = () => {
        setTimeout(() => {
            if (refRBSheet.current) {
                refRBSheet.current.open();
            }
        }, 400);
    };
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
    const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => {
        reopenBottomSheet()
        setDatePickerVisibility(false)
    };
    const showStartPicker = () => setStartPickerVisibility(true);
    const hideStartPicker = () => {
        reopenBottomSheet();
        setStartPickerVisibility(false)
    };
    const showEndPicker = () => setEndPickerVisibility(true);
    const hideEndPicker = () => {
        reopenBottomSheet();
        setEndPickerVisibility(false)
    };



    // const handleStartConfirm = time => {
    //     const now = new Date();
    //     now.setSeconds(0, 0);
    //     time.setSeconds(0, 0);
    //     if (time <= now) {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Invalid Start Time',
    //             text2: 'Start time must be in the future',
    //         });
    //         hideStartPicker();
    //         return;
    //     }
    //     setStartTime(time);
    //     hideStartPicker();
    //     if (endTime && endTime <= time) setEndTime(null);
    // };
 const handleStartConfirm = (time) => {
    if (!selectedDate) {
        Toast.show({
            type: 'error',
            text1: 'Select a date first',
        });
        hideStartPicker();
        return;
    }

    // Combine selected date and selected time into one Date object
    const startDateTime = new Date(selectedDate);
    const selectedTime = new Date(time);

    startDateTime.setHours(selectedTime.getHours());
    startDateTime.setMinutes(selectedTime.getMinutes());
    startDateTime.setSeconds(0, 0); // clear seconds & milliseconds

    const now = new Date();
    now.setSeconds(0, 0);
    now.setMilliseconds(0);

    if (startDateTime <= now) {
        Toast.show({
            type: 'error',
            text1: 'Invalid Start Time',
            text2: 'Start time must be in the future',
        });
        hideStartPicker();
        return;
    }

    setStartTime(startDateTime);
    hideStartPicker();

    if (endTime && endTime <= startDateTime) {
        setEndTime(null);
    }
};
    // const handleEndConfirm = time => {
    //     if (!startTime) {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Select Start Time First',
    //             text2: 'Please choose start time before end time',
    //         });
    //         hideEndPicker();
    //         return;
    //     }
    //     if (time <= startTime) {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Invalid End Time',
    //             text2: 'End time must be after start time',
    //         });
    //         hideEndPicker();
    //         return;
    //     }
    //     setEndTime(time);
    //     hideEndPicker();
    // };
const handleEndConfirm = (time) => {
    if (!startTime || !selectedDate) {
        Toast.show({
            type: 'error',
            text1: 'Select Start Time First',
            text2: 'Please choose start time before end time',
        });
        hideEndPicker();
        return;
    }

    // Combine start date and selected end time
    const endDateTime = new Date(selectedDate);
    const selectedTime = new Date(time);

    endDateTime.setHours(selectedTime.getHours());
    endDateTime.setMinutes(selectedTime.getMinutes());
    endDateTime.setSeconds(0, 0);

    if (endDateTime <= startTime) {
        Toast.show({
            type: 'error',
            text1: 'Invalid End Time',
            text2: 'End time must be after start time',
        });
        hideEndPicker();
        return;
    }

    setEndTime(endDateTime);
    hideEndPicker();
};

    const handleDateConfirm = date => {
        setSelectedDate(date);
        hideDatePicker();
    };

    const formatDatenew = date => {
        if (!date) return 'Select Date';
        return moment(date).format('YYYY-MM-DD');
    };

    const formatTime = date => {
        if (!date) return 'Select time';
        return moment(date).format('hh:mm A');
    };

    const formatTimet = time => {
        if (!time) return 'Select time';
        return time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDateDisplay = date => {
        if (!date) return 'Select Date';
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const resetForm = () => {
        setTitle('');
        setSelectedDate(null);
        setStartTime(null);
        setEndTime(null);
        setIsEditMode(false);
        setEditingReminderId(null);
    };

    const getAllReminders = () => {
        setIsLoading(true);
        AllGetAPI({ url: 'view-all-reminder', Token: user?.api_token })
            .then(res => {
                setIsLoading(false);
                if (res.status === 'success') {
                    const notifications = res?.data?.reverse() || [];
                    setMyReminders(notifications);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log('Notification API error:', err);
            });
    };

    const CreateReminderApi = () => {
        if (!mytitle?.trim()) {
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
            Toast.show({ type: 'error', text1: 'Invalid Start Time', text2: 'Start time must be in the future' });
            return;
        }
        if (endTime <= startTime) {
            Toast.show({ type: 'error', text1: 'Invalid Time Range', text2: 'End time must be after start time' });
            return;
        }

        const formdata = new FormData();
        formdata.append('title', mytitle);
        formdata.append('date', formatDatenew(selectedDate));
        formdata.append('start_time', formatTime(startTime));
        formdata.append('end_time', formatTime(endTime));

        setIsLoading(true);
        PostAPiwithToken({ url: 'add-reminder', Token: user?.api_token }, formdata)
            .then(res => {
                setIsLoading(false);
                if (res.status === 'success') {
                    Toast.show({ type: 'success', text1: 'Success', text2: res.message || 'Reminder added!' });
                    resetForm();
                    getAllReminders();
                     setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 4000);
                    refRBSheet.current.close();
                } else {
                    Toast.show({ type: 'error', text1: 'Error', text2: res.message });
                }
            })
            .catch(err => {
                setIsLoading(false);
                Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong' });
            });
    };

    const UpdateReminderApi = () => {
        if (!mytitle?.trim()) {
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
            Toast.show({ type: 'error', text1: 'Invalid Start Time', text2: 'Start time must be in the future' });
            return;
        }
        if (endTime <= startTime) {
            Toast.show({ type: 'error', text1: 'Invalid Time Range', text2: 'End time must be after start time' });
            return;
        }

        const formdata = new FormData();
        formdata.append('id', editingReminderId);
        formdata.append('title', mytitle);
        formdata.append('date', formatDatenew(selectedDate));
        formdata.append('start_time', formatTime(startTime));
        formdata.append('end_time', formatTime(endTime));

        setIsLoading(true);
        PostAPiwithToken({ url: 'edit-reminder', Token: user?.api_token }, formdata)
            .then(res => {
                setIsLoading(false);
                if (res.status === 'success') {
                    Toast.show({ type: 'success', text1: 'Success', text2: res.message || 'Reminder updated!' });
                    resetForm();
                    getAllReminders();
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 4000);
                    refRBSheet.current.close();
                } else {
                    Toast.show({ type: 'error', text1: 'Error', text2: res.message || 'Failed to update' });
                }
            })
            .catch(err => {
                setIsLoading(false);
                Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong' });
            });
    };

    const handleSubmit = () => {
        if (isEditMode) {
            UpdateReminderApi();
        } else {
            CreateReminderApi();
        }
    };

    const openCreateSheet = () => {
        resetForm();
        setTimeout(() => refRBSheet.current.open(), 100);
    };

    const openEditSheet = (reminder) => {
        setIsEditMode(true);
        setEditingReminderId(reminder.id);

        setTitle(reminder.title || '');

        // Parse date and times carefully
        const dateObj = new Date(reminder.date);
        setSelectedDate(isNaN(dateObj) ? null : dateObj);

        // Assuming backend returns time in "hh:mm A" format
        const startDateTime = new Date(`${reminder.date} ${reminder.start_time}`);
        const endDateTime = new Date(`${reminder.date} ${reminder.end_time}`);

        setStartTime(isNaN(startDateTime) ? null : startDateTime);
        setEndTime(isNaN(endDateTime) ? null : endDateTime);

        setTimeout(() => {
            titleInputRef.current?.focus();
            refRBSheet.current.open();
        }, 150);
    };

    useFocusEffect(
        useCallback(() => {
            getAllReminders();
        }, [])
    );

    useEffect(() => {
        if (sheetOpened) {
            setTimeout(() => {
                titleInputRef.current?.focus();
            }, 400);
        }
    }, [sheetOpened]);

    const truncateToThreeWords = (text = '') => {
        const words = text.trim().split(/\s+/);
        return words.length <= 3 ? text : `${words.slice(0, 3).join(' ')}…`;
    };
    const translateXValue = useSharedValue(0);

    useEffect(() => {
        if (showSuccessModal) {
            translateXValue.value = withSequence(
                withTiming(-20, { duration: 1200 }),
                withTiming(20, { duration: 1200 }),
                withTiming(-15, { duration: 1200 }),
                withTiming(15, { duration: 1200 }),
                withTiming(0, {
                    duration: 600,
                    easing: Easing.out(Easing.ease),
                })
            );
        }
    }, [showSuccessModal]);

    const animatedStyle2 = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateXValue.value }],
        };
    });
    return (
        <ImageBackground
            source={images.myallbackbg}
            style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30 : 0 }}
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
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginRight: wp(7) }}>
                        My Reminders
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    </View>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(5), marginBottom: wp(10) }}>
                        <FlatList
                            data={myReminders}
                            keyExtractor={(item) => item?.id?.toString()}
                            inverted
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginTop: wp(30),
                                        color: Colors.darkgray,
                                        fontSize: 16,
                                        fontFamily: fonts.regular,
                                    }}
                                >
                                    No Reminder found
                                </Text>
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => openEditSheet(item)}
                                >
                                    <View
                                        style={{
                                            width: wp(90),
                                            paddingHorizontal: wp(3),
                                            paddingVertical: wp(2),
                                            backgroundColor: '#FAFAFA',
                                            borderWidth: 0.7,
                                            borderColor: '#BBBBBB',
                                            borderRadius: wp(3),
                                            alignSelf: 'center',
                                            marginTop: wp(3),
                                            elevation: 2,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 4,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DEDEDE', paddingBottom: wp(3) }}>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontFamily: fonts.medium,
                                                    color: Colors.black,
                                                    flex: 1,
                                                }}
                                            >
                                                {truncateToThreeWords(item.title)}
                                            </Text>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    source={images.calendarIcon}
                                                    resizeMode="contain"
                                                    style={{
                                                        width: wp(4.5),
                                                        height: wp(4.5),
                                                        marginRight: wp(1),
                                                    }}
                                                    tintColor={Colors.mainColor}
                                                />
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontFamily: fonts.medium,
                                                        color: Colors.black,
                                                    }}
                                                >
                                                    {item.date}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(3) }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontFamily: fonts.medium,
                                                    color: '#999999',
                                                    lineHeight: 18,
                                                }}
                                            >
                                                Start Time
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontFamily: fonts.medium,
                                                    color: '#999999',
                                                    lineHeight: 18,
                                                }}
                                            >
                                                End Time
                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(1) }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontFamily: fonts.medium,
                                                    color: Colors.black,
                                                    lineHeight: 18,
                                                }}
                                            >
                                                {item.start_time}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontFamily: fonts.medium,
                                                    color: Colors.black,
                                                    lineHeight: 18,
                                                }}
                                            >
                                                {item.end_time}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </ScrollView>

                {/* Floating Action Button */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: wp(28),
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        right: wp(6),
                    }}
                >
                    <TouchableOpacity
                        onPress={openCreateSheet}
                        style={{
                            width: wp(14),
                            height: wp(13),
                            borderRadius: wp(3),
                            backgroundColor: Colors.mainColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 2,
                        }}
                    >
                        <AntDesign name="plus" size={22} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Bottom Sheet */}
                <RBSheet
                    ref={refRBSheet}
                    height={hp(45)}
                    draggable={true}
                    openDuration={500}
                    closeDuration={350}
                    onOpen={() => setSheetOpened(true)}
                    onClose={() => {
                        setSheetOpened(false);
                        // resetForm();
                    }}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            backgroundColor: 'white',
                            shadowOffset: { height: 2, width: 2 },
                            shadowOpacity: 0.2,
                            shadowColor: '#4686D4',
                            elevation: 2,
                        },
                        draggableIcon: { backgroundColor: 'black', width: wp(15), height: wp(0.8) }
                    }}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: hp(5),
                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: wp(5),
                                paddingVertical: wp(4),
                            }}>
                                <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                                    <AntDesign name="close" size={24} color={Colors.black} />
                                </TouchableOpacity>

                                {/* <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black }}>
                    {isEditMode ? 'Edit Reminder' : 'Add Reminder'}
                  </Text> */}

                                <TouchableOpacity onPress={handleSubmit}>
                                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black }}>
                                        {isEditMode ? 'Edit Reminder' : 'Add Reminder'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginHorizontal: wp(5) }}>
                                <View
                                    style={{
                                        marginTop: wp(2),
                                        marginBottom: wp(4),
                                        borderBottomWidth: 0.7,
                                        borderBottomColor: '#DEDEDE',
                                        paddingBottom: wp(4)
                                    }}
                                >
                                    <TextInput
                                        ref={titleInputRef}
                                        placeholder="Title"
                                        onChangeText={setTitle}
                                        value={mytitle}
                                        placeholderTextColor={'#616161'}
                                        style={{
                                            width: wp(80),
                                            fontSize: 16,
                                            fontFamily: fonts.regular,
                                            color: Colors.black,
                                            paddingVertical: wp(2),
                                        }}
                                    />
                                </View>

                                <TouchableOpacity style={styles.optionRowStyle}
                                    onPress={() => {
                                        refRBSheet.current.close();
                                        setTimeout(() => showDatePicker(), 400);
                                    }}
                                >
                                    <Text style={[styles.optionTextStyle, { color: selectedDate ? 'black' : '#555' }]}>
                                        {selectedDate ? formatDateDisplay(selectedDate) : 'Select date'}
                                    </Text>
                                    <AntDesign name="right" color="#333" size={18} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.optionRowStyle} onPress={() => {
                                    refRBSheet.current.close();
                                    setTimeout(() => showStartPicker(), 400);
                                }} >
                                    <Text style={[styles.optionTextStyle, { color: startTime ? 'black' : '#555' }]}>
                                        {startTime ? formatTimet(startTime) : 'Select start time'}
                                    </Text>
                                    <AntDesign name="right" color="#333" size={18} />
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.optionRowStyle, { borderBottomWidth: 0 }]} onPress={() => {
                                    refRBSheet.current.close();
                                    setTimeout(() => showEndPicker(), 400);
                                }}>
                                    <Text style={[styles.optionTextStyle, { color: endTime ? 'black' : '#555' }]}>
                                        {endTime ? formatTimet(endTime) : 'Select end time'}
                                    </Text>
                                    <AntDesign name="right" color="#333" size={18} />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </RBSheet>
                <Modal
                    transparent={true}
                    visible={showSuccessModal}
                    animationType="fade"
                    onRequestClose={() => {
                        setShowSuccessModal(false);
                    }}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Animated.View style={animatedStyle2}>
                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: 50,
                                padding: wp(8),
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 15,
                                elevation: 15,
                            }}>
                                <Image
                                    source={
                                         images.happy      
                                    }
                                    style={{
                                        width: wp(60),
                                        height: wp(60),
                                        resizeMode: 'contain',
                                    }}
                                />

                            </View>
                        </Animated.View>
                    </View>
                </Modal>
                {/* Date & Time Pickers */}
                {/* <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    date={selectedDate || new Date()}
                    minimumDate={new Date()}
                /> */}

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    date={selectedDate || new Date()}
                    minimumDate={new Date()}
                //   maximumDate={new Date()}
                />

                {/* <DateTimePickerModal
                    isVisible={isStartPickerVisible}
                    mode="time"
                    onConfirm={handleStartConfirm}
                    onCancel={hideStartPicker}
                    date={startTime || new Date()}
                    minimumDate={new Date()}
                /> */}

                <DateTimePickerModal
                    isVisible={isStartPickerVisible}
                    mode="time"
                    onConfirm={handleStartConfirm}
                    onCancel={hideStartPicker}
                    date={startTime || new Date()}
                    minimumDate={new Date()}
                />
                {/* 
                <DateTimePickerModal
                    isVisible={isEndPickerVisible}
                    mode="time"
                    onConfirm={handleEndConfirm}
                    onCancel={hideEndPicker}
                    date={endTime || new Date()}
                    minimumDate={startTime ? new Date(startTime.getTime() + 60000) : new Date()}
                /> */}

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

export default MyReminder;