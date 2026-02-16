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
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors, fonts, images } from '../../Constant/Index';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list';

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
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mainImage}
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 15 : 0 }}
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
          // backgroundColor: '#FAFAFA',
          paddingHorizontal: wp(4),
          paddingTop: wp(5),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 }, // push shadow down
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={images.menuIcon}
            style={{ width: 26, height: 26 }}
            tintColor="white"
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
          Podcast
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}></View>
      </View>

      {/* TABS */}
      <View
        style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontFamily: fonts.medium,
            marginRight: 5,
          }}
        >
          Podcast For You
        </Text>
        <Image
          source={require('../../Assets/Star 1.png')}
          style={{ height: 20, width: 20 }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: wp(5),
          marginBottom: wp(3),
          marginTop: wp(5),
        }}
      >
        {['1', '2', '3', '4'].map(id => (
          <TouchableOpacity key={id} onPress={() => setTab(id)}>
            <View
              style={{
                width: wp(21),
                height: 32,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: tab === id ? Colors.mainColor : '#BD2BAF33',
              }}
            >
              <Text
                style={{
                  color: tab === id ? Colors.white : Colors.white,
                  fontFamily: tab === id ? fonts.bold : fonts.medium,
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
            {/* <FlatList
              data={podcasts}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={{
                paddingTop: wp(5),
                paddingHorizontal: wp(3),
              }}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#BD2BAF33',
                    borderRadius: 10,
                    padding: 10,
                    margin: 10,
                  }}
                  onPress={() => openPodcast(item.id)}
                  activeOpacity={0.8}
                >
                  <ImageBackground
                    source={{ uri: item.images?.[0]?.url }}
                    resizeMode="cover"
                    style={{
                      width: '100%',
                      height: 150,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                  />

                  <Text
                    style={{
                      color: 'white',
                      marginTop: 10,
                      fontFamily: fonts.bold,
                      textAlign: 'left',
                    }}
                    // numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            /> */}
            <MasonryList
              data={podcasts}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={{ padding: wp(3) }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => openPodcast(item.id)}
                >
                  <ImageBackground
                    source={{ uri: item.images?.[0]?.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  {/* Fully dynamic text height */}
                  <Text style={styles.title} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#BD2BAF33',
    borderRadius: 12,
    padding: 10,
    margin: 5, // spacing between cards
  },
  image: {
    width: '100%',
    height: 150, // you can randomize this for better masonry effect
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    color: 'white',
    fontFamily: fonts.bold,
    marginTop: 8,
    lineHeight: 20,
  },
});

export default Podcast;
