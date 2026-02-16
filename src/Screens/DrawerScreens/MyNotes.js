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
    Alert,
    Modal
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Colors, fonts, images, styles } from '../../Constant/Index';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { AllGetAPI, PostAPiwithToken } from '../../Components/ApiRoot';
import Loader from '../../Components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
const MyNotes = ({ navigation }) => {
    const user = useSelector(state => state.user.user);
    const [myNotess, setMyNotes] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [sheetOpened, setSheetOpened] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
    // ── Added for edit functionality ──
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [mytitle, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const titleInputRef = useRef(null);
    const { top } = useSafeAreaInsets();
    const refRBSheet = useRef();

    const getAllNotes = () => {
        setIsLoading(true);
        AllGetAPI({ url: 'view-all-note', Token: user?.api_token })
            .then(res => {
                setIsLoading(false);
                if (res.status === 'success') {
                    setMyNotes(res?.data?.reverse() || []);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log('Notification API error:', err);
            });
    };

    useFocusEffect(
        useCallback(() => {
            getAllNotes();
        }, [])
    );

    useEffect(() => {
        if (sheetOpened) {
            setTimeout(() => {
                titleInputRef.current?.focus();
            }, 400);
        }
    }, [sheetOpened]);

    // Reset form when closing sheet
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setIsEditMode(false);
        setSelectedNote(null);
    };

    const openCreate = () => {
        resetForm();
        refRBSheet.current.open();
    };

    const openEdit = (note) => {
        setIsEditMode(true);
        setSelectedNote(note);
        setTitle(note.title || '');
        setDescription(note.description || '');
        refRBSheet.current.open();
    };

    const saveNote = () => {
        if (!mytitle.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Description is required');
            return;
        }

        const formdata = new FormData();
        formdata.append('title', mytitle);
        formdata.append('description', description);

        if (isEditMode) {
            formdata.append('id', selectedNote?.id);
        }

        setIsLoading(true);
        const url = isEditMode ? 'edit-note' : 'add-note';

        PostAPiwithToken({ url, Token: user?.api_token }, formdata)
            .then(res => {
                setIsLoading(false);
                if (res.status === 'success') {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: isEditMode ? 'Note updated!' : 'Note added!'
                    });
                       setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 4000);
                    resetForm();

                    refRBSheet.current.close();
                    getAllNotes();
                } else {
                    Toast.show({ type: 'error', text1: 'Error', text2: res.message });
                }
            })
            .catch(err => {
                setIsLoading(false);
                Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'add'} note`);
            });
    };

    const truncateToThreeWords = (text = '') => {
        const words = text.trim().split(/\s+/);
        return words.length <= 3 ? text : `${words.slice(0, 3).join(' ')}…`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        });
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
            style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30 : 0, }}
            resizeMode="cover"
        >
            {isloading && <Loader />}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
            >
                {/* Header - exactly same as your original */}
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
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                    }}
                >
                    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image source={images.menuIcon} style={{ width: 26, height: 26 }} tintColor="black" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginRight: wp(7) }}>
                        My Notes
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* empty space - same as original */}
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
                        <FlatList
                            data={myNotess}
                            keyExtractor={(item) => item?.id?.toString()}
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
                                    No notes found
                                </Text>
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => openEdit(item)}
                                >
                                    <View
                                        style={{
                                            width: wp(90),
                                            paddingHorizontal: wp(3),
                                            paddingVertical: wp(2),
                                            backgroundColor: '#FAFAFA',
                                            borderWidth: 1,
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
                                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DEDEDE', paddingBottom: wp(3), justifyContent: 'space-between', alignItems: 'center' }}>
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
                                            <View style={{ backgroundColor: '#ECF7F3', paddingHorizontal: wp(2), paddingVertical: wp(1), borderRadius: wp(2) }}>
                                                <Text
                                                    style={{
                                                        fontSize: 10,
                                                        fontFamily: fonts.medium,
                                                        color: '#616161',
                                                    }}
                                                >
                                                    {formatDate(item.created_at)}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: fonts.medium,
                                                color: Colors.black,
                                                lineHeight: 18,
                                                marginTop: wp(3)
                                            }}
                                        >
                                            {item.description}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {/* Floating button - same position & style */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: wp(28),
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            right: wp(6)
                        }}
                    >
                        <TouchableOpacity
                            onPress={openCreate}
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
                </ScrollView>

                {/* Bottom Sheet - kept almost identical look */}
                <RBSheet
                    ref={refRBSheet}
                    height={hp(30)}
                    draggable={true}
                    openDuration={500}
                    closeDuration={350}
                    onOpen={() => setSheetOpened(true)}
                    onClose={() => {
                        setSheetOpened(false);
                        resetForm();
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
                                paddingBottom: wp(2),
                            }}>
                                <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                                    <AntDesign name="close" size={24} color={Colors.black} />
                                </TouchableOpacity>

                                {/* <Text style={{ fontSize: 16, fontFamily: fonts.bold }}>
                                    {isEditMode ? 'Edit Note' : 'Add Note'}
                                </Text> */}
<Text></Text>
                                <TouchableOpacity onPress={saveNote}>
                                    <Text style={{ fontSize: 14, fontFamily: fonts.bold,textDecorationLine:'underline' }}>
                                        {isEditMode ? 'Update' : 'Add Note'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginHorizontal: wp(5) }}>
                                <View
                                    style={{
                                        marginTop: wp(4),
                                        marginBottom: wp(4),
                                        borderBottomWidth: 1,
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
                                            fontSize: 14,
                                            fontFamily: fonts.regular,
                                            color: Colors.black,
                                            paddingVertical: wp(2),
                                        }}
                                    />
                                </View>

                                <View
                                    style={{
                                        width: wp(90),
                                        height: wp(30),
                                        borderRadius: wp(3),
                                    }}
                                >
                                    <TextInput
                                        style={{
                                            color: Colors.black,
                                            fontFamily: fonts.regular,
                                            fontSize: 14,
                                            textAlignVertical: 'top',
                                        }}
                                        multiline
                                        placeholder="Description..."
                                        placeholderTextColor={Colors.lightgrey}
                                        value={description}
                                        onChangeText={setDescription}
                                    />
                                </View>
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
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default MyNotes;