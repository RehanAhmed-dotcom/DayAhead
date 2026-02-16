// TaskCompletionWithShare.jsx
// Complete component with ViewShot for capturing and sharing
// Install: npm install react-native-view-shot react-native-share

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import moment from 'moment';

const TaskCompletionWithShare = forwardRef(({ taskData, onClose }, ref) => {
  const viewShotRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // Capture screenshot of the completion card
  const captureCard = async () => {
    try {
      setIsCapturing(true);
      // Wait for layout
      await new Promise(resolve => setTimeout(resolve, 300));
      const uri = await viewShotRef.current.capture();
      setCapturedImage(uri);
      setIsCapturing(false);
      return uri;
    } catch (error) {
      setIsCapturing(false);
      Alert.alert('Error', 'Failed to capture image');
      console.error('Capture error:', error);
      return null;
    }
  };

  //   useEffect(() => {
  //     if (onShare) {
  //       onShare(handleShare);
  //     }
  //   }, []);
  // Share with captured image
  const handleShare = async () => {
    const imageUri = await captureCard();

    if (!imageUri) {
      return;
    }

    const shareMessage = `🎉 Task Complete!\nCrushed my Focused Work session today!\n\n#WinTheDay #StayFocused`;

    const shareOptions = {
      title: 'Task Complete! 🎉',
      message: shareMessage,
      url: `file://${imageUri}`,
      //   url: imageUri,
      type: 'image/png',
      failOnCancel: false,
    };

    try {
      const result = await Share.open(shareOptions);
      console.log('Share result:', result);
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
      }
    }
  };

  // 🔥 Expose function to parent
  useImperativeHandle(ref, () => ({
    share: handleShare,
  }));

  return (
    <View style={styles.container}>
      {/* Capturable Card */}
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 1.0,
          result: 'tmpfile',
        }}
        style={styles.viewShotContainer}
      >
        <View style={[styles.card]}>
          {/* Main Content */}
          <View style={styles.content}>
            {/* Done Section */}
            <View style={styles.doneSection}>
              <View style={styles.confetti}>
                <Text style={styles.confettiText}>✨ 💎 ⭐ </Text>
                <Text style={styles.doneText}>DONE!</Text>
                <Text style={styles.confettiText}> ✨ 💎 ⭐</Text>
              </View>

              {/* Trophy */}
              <View style={styles.trophyContainer}>
                <Text style={styles.trophy}>🏆</Text>
              </View>

              {/* Focused Work Badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>✅</Text>
                <Text style={styles.badgeText}>{taskData?.title}</Text>
              </View>

              {/* Activity Details */}
              <View style={styles.activityRow}>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>✅</Text>
                  <Text style={styles.activityText}>{taskData?.tag}</Text>
                </View>
                <Text style={styles.timeText}>
                  {moment(
                    taskData?.start_datetime,
                    'YYYY-MM-DD hh:mm A',
                  ).format('hh:mm A')}{' '}
                  -{' '}
                  {moment(taskData?.end_datetime, 'YYYY-MM-DD hh:mm A').format(
                    'hh:mm A',
                  )}
                </Text>
              </View>

              {/* Hashtags */}
              <View style={styles.hashtags}>
                <Text style={styles.hashtag}>#WinTheDay</Text>
                <Text style={styles.hashtag}>#StayFocused</Text>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>

      {/* Share Buttons Section */}
      <View style={styles.shareSection}>
        <Text style={styles.shareTitle}>Share Your Achievement! 🎉</Text>

        {/* Loading Indicator */}
        {isCapturing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Preparing image...</Text>
          </View>
        )}

        {/* Primary Share Button */}
        <TouchableOpacity
          style={styles.primaryShareButton}
          onPress={handleShare}
          disabled={isCapturing}
        >
          <Text style={styles.primaryShareText}>📱 Share Now</Text>
        </TouchableOpacity>

        {/* Close Button */}
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    opacity: 0,
  },
  viewShotContainer: {
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  checkmark: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#65676b',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
  },
  completedSection: {
    backgroundColor: '#f0f2f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  completedLabel: {
    fontSize: 12,
    color: '#65676b',
    marginBottom: 4,
  },
  completedTask: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  doneSection: {
    backgroundColor: '#e0e7ff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  confetti: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  confettiText: {
    fontSize: 16,
  },
  doneText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F6FFF',
    marginHorizontal: 8,
  },
  trophyContainer: {
    marginVertical: 12,
  },
  trophy: {
    fontSize: 60,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  timeText: {
    fontSize: 13,
    color: '#65676b',
  },
  achievements: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  achievementText: {
    fontSize: 13,
    color: '#000',
  },
  hashtags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  hashtag: {
    fontSize: 13,
    color: '#4F6FFF',
    fontWeight: '500',
  },
  appPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  appIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  appInfo: {
    flex: 1,
  },
  appTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  appSubtitle: {
    fontSize: 11,
    color: '#65676b',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  shareSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#65676b',
  },
  primaryShareButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryShareText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareSubtitle: {
    fontSize: 14,
    color: '#65676b',
    textAlign: 'center',
    marginBottom: 12,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  socialEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  socialText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  instagramButton: {
    backgroundColor: '#E4405F',
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#65676b',
    fontSize: 16,
  },
});

export default TaskCompletionWithShare;
