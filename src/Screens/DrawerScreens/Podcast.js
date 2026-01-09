import {
  View,
  Text,
  ImageBackground,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { useSelector } from 'react-redux';
import Loader from '../../Components/Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Podcast = ({ navigation }) => {
  const [tab, setTab] = useState('1');
  const [loading, setLoading] = useState(true);
  const [podcasts, setPodcasts] = useState([]);

  // 👉 Get token from Redux
  const token = useSelector(state => state.user?.user?.api_token);

  const categoryKeywords = {
    1: 'relationship',
    2: 'family',
    3: 'friends',
    4: 'motivation',
  };

  useEffect(() => {
    if (token) loadSpotify();
  }, [tab, token]);

  // ------------------------
  // 🎧 FETCH PODCASTS
  // ------------------------
  const searchPodcasts = async keyword => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://plantflipsapp.com/dayAhead/api/podcast_search?query=${keyword}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      const json = await res.json();
      setLoading(false);
      return json.shows?.items || [];
    } catch (e) {
      return [];
    }
  };

  // ------------------------
  // 🎧 LOAD DATA
  // ------------------------
  const loadSpotify = async () => {
    setLoading(true);

    const keyword = categoryKeywords[tab];
    const data = await searchPodcasts(keyword);

    setPodcasts(data);
    setLoading(false);
  };

  // ------------------------
  // OPEN PODCAST DETAILS
  // ------------------------
  const openPodcast = showId => {
    navigation.navigate('SpotifyEpisodes', { showId, token });
  };
const {top}=useSafeAreaInsets()
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS === 'ios' ?30: 0, }}
    >
      {loading && <Loader />}
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
                        Podcast
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    </View>
                </View>

      {/* TABS */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: wp(5),
          marginBottom: wp(3),
          marginTop:wp(5)
        }}
      >
        {['1', '2', '3', '4'].map(id => (
          <TouchableOpacity key={id} onPress={() => setTab(id)}>
            <View
              style={{
                width: wp(21),
                height: 32,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: tab === id ? Colors.mainColor : '#ECF7F3',
              }}
            >
              <Text
                style={{
                  color: tab === id ? Colors.white : Colors.black,
                  fontFamily: fonts.bold,
                  fontSize: 12,
                }}
              >
                {id === '1' && 'Relation'}
                {id === '2' && 'Family'}
                {id === '3' && 'Friends'}
                {id === '4' && 'Feel Free'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {/* Loading */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.white}
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={{ marginBottom: wp(5) }}>
            <FlatList
              data={podcasts}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={{ marginTop: wp(5) }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openPodcast(item.id)}>
                  <ImageBackground
                    source={{ uri: item.images?.[0]?.url }}
                    resizeMode="cover"
                    style={{
                      width: wp(45),
                      height: 200,
                      margin: wp(2),
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        padding: wp(3),
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontFamily: fonts.bold,
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default Podcast;
