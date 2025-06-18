import React from 'react';
import { View, StyleSheet, Text, Linking, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

interface VideoPlayerProps {
  videoKey: string;
  videoName: string;
  videoType?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoKey, videoName, videoType }) => {
  const youtubeUrl = `https://www.youtube.com/embed/${videoKey}`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoKey}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.videoName}>{videoName}</Text>
        {videoType && (
          <Text style={styles.videoType}>{videoType}</Text>
        )}
      </View>
      
      <WebView
        source={{ uri: youtubeUrl }}
        style={styles.webview}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
      />
      
      <TouchableOpacity 
        style={styles.openButton}
        onPress={() => Linking.openURL(watchUrl)}
      >
        <Text style={styles.buttonText}>Open in YouTube</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  header: {
    marginBottom: 10,
  },
  videoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  videoType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  webview: {
    height: 200,
    borderRadius: 8,
  },
  openButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VideoPlayer;