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
import React, { use, useCallback, useEffect, useState } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import { AllGetAPI } from '../../Components/ApiRoot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setJnlOnboardFalse } from '../../Redux/OnboardingSlice';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';

const MyJournal = ({ navigation }) => {
    const user = useSelector(state => state.user.user);
    const [isloading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [myallJournals, setMyallJournals] = useState([])
    const [todayResponse, setTodayResponse] = useState(0)

    const getAllJournals = () => {
        setIsLoading(true);
        AllGetAPI({ url: 'get-journal-info', Token: user?.api_token })
            .then(res => {
                setIsLoading(false);
                console.log('api my journals', JSON.stringify(res));

                if (res.status == 'success') {
                    setMyallJournals(res.data || []);
                    setTodayResponse(res?.todayData)
                }

            })
            .catch(err => {
                setIsLoading(false);
                console.log('api error tasks', err);
            });
    };
    useFocusEffect(
        useCallback(() => {
            getAllJournals();
        }, []),
    );

    const { top } = useSafeAreaInsets();
    return (
        <ImageBackground
            source={images.myallbackbg}
            style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 30 : 0, }}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? hp(10) : 0}
            >
                {isloading && <Loader />}
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
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: fonts.bold,
                            color: Colors.black,
                            marginLeft: wp(10)
                        }}
                    >
                        Journal
                    </Text>
                    <TouchableOpacity onPress={() => { dispatch(setJnlOnboardFalse()), navigation.navigate('JnlOnboard2') }} style={{
                        // width:28
                    }} >
                        <Text style={{ fontSize: 10, color: Colors.black }}>How it's Journal</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {todayResponse == 1? (
                        <View style={{ width: wp(90), paddingHorizontal: wp(3), paddingVertical: wp(2),elevation:2, backgroundColor: Colors.white, borderWidth: 1, borderColor: '#BBBBBB', borderRadius: wp(3), alignSelf: 'center', marginTop: wp(5) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <SimpleLineIcons name={'check'} size={22} color={Colors.black} />
                                <View style={{ marginLeft: wp(2), width: wp(75) }}>
                                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Today's Journal info Saved</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                        <Text>Great job! come back Tomorrow.</Text>
                                        {/* <AntDesign name={'right'} size={18} color={Colors.black} /> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{ width: wp(90), paddingHorizontal: wp(3), paddingVertical: wp(2),elevation:2, backgroundColor: Colors.white, borderWidth: 1, borderColor: '#BBBBBB', borderRadius: wp(3), alignSelf: 'center', marginTop: wp(5) }}>
                            <TouchableOpacity onPress={() => navigation.navigate('FormJournal')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                {/* <SimpleLineIcons name={'check'} size={27} color={Colors.black} /> */}
                                <Ionicons name={'create-outline'} size={22} color={Colors.black} />
                                <View style={{ marginLeft: wp(2), width: wp(70) }}>
                                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Save Your Today's Journal info</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                        <Text>Start creating today’s journal.</Text>
                                    </View>
                                </View>
                                <AntDesign name={'right'} size={22} color={Colors.black} />

                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={{ marginTop: wp(5), marginHorizontal: wp(5),marginBottom:wp(4) }}>
                        <Text style={{ fontSize: 16, color: Colors.black, fontFamily: fonts.bold }}>
                            Journals
                        </Text>

                        <FlatList
                            data={myallJournals}
                            keyExtractor={item => item?.id?.toString()}
                            inverted

                            renderItem={({ item }) => {
                                const formatDate = (dateString) => {
                                    const date = new Date(dateString);
                                    const today = new Date();

                                    const isToday =
                                        date.getDate() === today.getDate() &&
                                        date.getMonth() === today.getMonth() &&
                                        date.getFullYear() === today.getFullYear();

                                    const options = { month: 'long', day: 'numeric' };
                                    const formattedDate = date.toLocaleDateString('en-US', options);

                                    return isToday ? `Today, ${formattedDate}` : formattedDate;
                                };

                                return (
                                    <View style={{ width: wp(90), alignSelf: 'center',marginTop:wp(2) }}>
                                        <Text>{formatDate(item.created_at)}</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('JournalDetails', { Myitem: item })} style={{ width: wp(90),elevation:2, paddingHorizontal: wp(3), paddingVertical: wp(2), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#BBBBBB', borderRadius: wp(3), alignSelf: 'center', marginTop: wp(2) }}>
                                            {item?.gratitude?.some(itm => itm) && (
                                                <>
                                                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Gratitude:</Text>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {item?.gratitude
                                                            ?.filter(g => g)
                                                            .map((gratitudeItem, index) => (
                                                                <View
                                                                    key={index}
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        marginRight: wp(3),
                                                                        marginBottom: wp(2),
                                                                        marginTop:wp(1)
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            width: wp(2),
                                                                            height: wp(2),
                                                                            borderRadius: wp(2),
                                                                            backgroundColor: 'grey',
                                                                            marginRight: wp(1),
                                                                        }}
                                                                    />
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            fontFamily: fonts.medium,
                                                                            color: '#7E7E7E',
                                                                           
                                                                        }}
                                                                    >
                                                                        {gratitudeItem}
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                    </View>
                                                </>
                                            )}
                                            {item?.affirmation?.some(itm => itm) && (
                                                <>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Affirmations:</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {item?.affirmation
                                                            ?.filter(a => a) // removes null, undefined, empty string
                                                            .map((affirmationItem, index) => (
                                                                <View
                                                                    key={index}
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        marginRight: wp(3),
                                                                        marginBottom: wp(2),
                                                                        marginTop:wp(1)
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            width: wp(2),
                                                                            height: wp(2),
                                                                            borderRadius: wp(2),
                                                                            backgroundColor: 'grey',
                                                                            marginRight: wp(1),
                                                                        }}
                                                                    />
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 14,
                                                                            fontFamily: fonts.medium,
                                                                            color: '#7E7E7E',
                                                                        }}
                                                                    >
                                                                        {affirmationItem}
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                    </View>
                                                </>
                                            )}
                                            {item?.bigger_goal == null ? (
                                                null
                                            ) : (
                                                <View

                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginRight: wp(3),
                                                        marginBottom: wp(2),
                                                    }}
                                                >
                                                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black, marginRight: wp(3) }}>Big Goals:</Text>




                                                    <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: '#7E7E7E' }} numberOfLines={1}>{item?.bigger_goal}</Text>

                                                </View>
                                            )}
                                           <View style={{ position: 'absolute', right: wp(4), top: '50%', transform: [{ translateY: -9 }] }}>
  <AntDesign name={'right'} size={18} color={Colors.black} />
</View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default MyJournal;
