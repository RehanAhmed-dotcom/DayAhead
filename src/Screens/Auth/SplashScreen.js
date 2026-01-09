import React, { useEffect } from 'react';
import { View, Text, Image, ImageBackground, Animated } from 'react-native';
import { Colors, fonts, images } from '../../Constant/Index';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const SplashScreen = ({}) => {
  const backgroundScale = new Animated.Value(1);   
  const logoOpacity = new Animated.Value(0);      
  const textOpacity = new Animated.Value(0);        
  const textTranslateY = new Animated.Value(50);    

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backgroundScale, {
        toValue: 1.2,
        duration: 8000, 
        useNativeDriver: true,
      }),

      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1800,
        delay: 500,
        useNativeDriver: true,
      }),

      Animated.stagger(400, [
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 2000,
          delay: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 2000,
          delay: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.Image
        source={images.mySplash3}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          transform: [{ scale: backgroundScale }],
        }}
        resizeMode="cover"
      />

      {/* Content Overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginTop: wp(10),
          marginBottom: wp(30),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
       
        <Animated.View style={{ opacity: logoOpacity }}>
          <Image
            source={require('../../Assets/mymainlogo.png')}
            style={{
              width: wp(100),
              height: wp(50),
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </Animated.View>

       
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 30,
              color: Colors.white,
              textAlign: 'center',
            }}
          >
            BECOME YOUR {'\n'} FIRST SELF
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 16,
              color: Colors.white,
              textAlign: 'center',
              lineHeight: 18,
              marginTop: wp(2),
            }}
          >
            Clarity, focus and calm{'\n'}one day ahead
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashScreen;