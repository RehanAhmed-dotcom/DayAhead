// Components/AheadChallengeModal.js

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  ImageBackground,
  Image,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors, fonts } from '../Constant/Index';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const DATA = [
  {
    id: 'free',
    subtitle: 'DAY AHEAD',
    options: [
      'Free access with ads',
      'Watch ads, use free',
      'Ad-supported free version',
      'Free plan includes ads',
    ],
    buttonText: 'Start Now',
    buttonColor: '#4CAF50',
  },
  {
    id: 'premium',
    subtitle: 'PREMIUM PLAN',
    options: [
      'Ad-free experience',
      'No ads. Just features.',
      '100% ad-free',
      'Enjoy without interruptions',
    ],
    buttonText: 'Go Premium',
    buttonColor: '#FFD700',
  },
];

const AheadChallengeModal = ({ visible = false, onClose = () => {onClose}, navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../Assets/sbglogo.png')}
          style={{ width: wp(50) }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.optionsList}>
        {item.options.map((option, index) => (
          <View key={index} style={styles.option}>
            <Ionicons name="checkmark-circle-outline" color="white" size={20} />
            <Text style={styles.optionText}>{option}</Text>
          </View>
        ))}
      </View>
 
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.mainColor }]}
        onPress={() => item.buttonText == 'Go Premium'||item.buttonText == 'Start Now' ? [onClose(), navigation.navigate('Subscription')] : onClose()}
      >
        <Text style={styles.buttonText}>{item.buttonText}</Text>
      </TouchableOpacity>

      <View style={styles.dots}>
        <View style={[styles.dot, activeIndex === 0 && styles.activeDot]} />
        <View style={[styles.dot, activeIndex === 1 && styles.activeDot]} />
      </View>
    </View>
  );

  const handleScrollEnd = (event) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / (width * 0.9)
    );
    setActiveIndex(newIndex);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        {/* Backdrop - tap to close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Rounded Modal Content with Background Image */}
        {/* <View style={styles.modalContainer}> */}
          <ImageBackground
            source={require('../Assets/sbg.png')}
            resizeMode="cover"
            style={styles.modalContainer}
            imageStyle={{ borderRadius: wp(10) }} // This rounds the image itself
          >
            <FlatList
              ref={flatListRef}
              data={DATA}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollEnd}
              getItemLayout={(data, index) => ({
                length: width * 0.9,
                offset: (width * 0.9) * index,
                index,
              })}
            />
          </ImageBackground>
        {/* </View> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(90),
    height: 500,
    borderRadius: wp(10),  
    backgroundColor: 'red',         // Main rounded corners
    overflow: 'hidden',             // Crucial: clips children (FlatList) to rounded corners
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: wp(90),
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  optionsList: {
    width: '60%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: 'white',
    marginLeft: wp(2),
    fontFamily: fonts.medium,
  },
  button: {
    width: wp(60),
    height: wp(13),
    borderRadius: wp(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(12),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  dots: {
    flexDirection: 'row',
    marginTop: wp(8),
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: 'white',
  },
});

export default AheadChallengeModal;