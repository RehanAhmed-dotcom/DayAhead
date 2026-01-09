import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const PlayerScreen = ({ route }) => {
  const { episodeId } = route.params;

  if (!episodeId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No episode selected</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: `https://open.spotify.com/embed/episode/${episodeId}` }}
      style={{ flex: 1 }}
    />
  );
};

export default PlayerScreen;
