import { View, Text, ImageBackground } from 'react-native';
import React from 'react';
import { images } from '../../Constant/Index';

const AudioScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={images.recordingpic}
      resizeMode="cover"
      style={{ flex: 1 }}
    ></ImageBackground>
  );
};

export default AudioScreen;
