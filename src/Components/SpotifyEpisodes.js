import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { getEpisodes } from '../api/spotify';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { Colors, fonts, images } from '../Constant/Index';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Loader from './Loader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Optional: Use FastImage for better performance & blur support on Android
// import FastImage from 'react-native-fast-image';

export default function SpotifyEpisodes({ navigation, route }) {
  const { showId } = route.params;
  const user = useSelector(state => state.user.user);
  const token = user.api_token;
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEpisodes();
  }, [showId]);

  const loadEpisodes = async () => {
    setLoading(true);
    const data = await getEpisodes(showId, token);
    setEpisodes(data);
    setLoading(false);
  };

  // Reusable Episode Card with Blurred Background
  const EpisodeCard = ({ item }) => {
    const imageUrl = item.images?.[1]?.url || item.images?.[0]?.url;

    if (!imageUrl) {
      return (
        <View style={styles.card}>
          <View style={styles.placeholder} />
          <Text style={styles.title}>{item.name}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('PlayerScreen', { episodeId: item.id })
        }
        style={styles.card}
      >
        {/* Blurred + Slightly Enlarged Background */}
        <Image
          source={{ uri: imageUrl }}
          style={styles.blurredBg}
          resizeMode="cover"
          blurRadius={30} // iOS & Android (works natively)
        />

        {/* Optional dark overlay for better text readability */}
        <View style={styles.overlay} />

        {/* Sharp centered image */}
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="contain"
        />

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {item.description
              ? item.description.replace(/<[^>]*>/g, '').substring(0, 120) +
                '...'
              : 'No description'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
const {top}=useSafeAreaInsets()
  return (
    <ImageBackground
      source={images.myallbackbg}
      style={{ flex: 1, paddingTop:Platform.OS=='ios'?30: 0 }}
    >
      {loading && <Loader />}
    

      {/* Header */}
      <View style={styles.header}>
      <StatusBar backgroundColor="transparent" translucent />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color={Colors.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Episodes</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{}}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.white}
            style={{ marginTop: 60 }}
          />
        ) : episodes.length === 0 ? (
          <Text style={styles.emptyText}>No episodes found</Text>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              data={episodes}
              keyExtractor={item => item.id}
              scrollEnabled={false} // Because we're inside ScrollView
              renderItem={({ item }) => <EpisodeCard item={item} />}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
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
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.black,
  },
  listContainer: {
    marginHorizontal: wp(4),
    marginBottom: wp(10),
    marginTop: wp(4),
  },
  card: {
    marginBottom: wp(8),
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  blurredBg: {
    ...StyleSheet.absoluteFillObject,
    width: '140%',
    height: '140%',
    left: '-20%',
    top: '-20%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  mainImage: {
    width: '100%',
    height: wp(50),
  },
  textContainer: {
    padding: wp(4),
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: wp(1),
  },
  description: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 18,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  placeholder: {
    width: '100%',
    height: wp(50),
    backgroundColor: '#333',
  },
});
