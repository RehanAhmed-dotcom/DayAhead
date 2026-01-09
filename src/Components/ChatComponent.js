// ChatComponent.js
import database from '@react-native-firebase/database';

// Generate consistent chat room ID
const getChatRoomId = (userId1, userId2) => {
  const sorted = [userId1, userId2].sort();
  return `${sorted[0]}_${sorted[1]}`;
};

export const sendMessage = async (
  messageText = '',
  currentUserId,
  guestUserId,
  imageUrl = null,
  guestData,
  userData
) => {
  try {
    const chatRoomId = getChatRoomId(currentUserId, guestUserId);

    const msgData = {
      msg: messageText,
      image: imageUrl,
      sender: currentUserId,
      receiver: guestUserId,
      date: Date.now(),
    };

    // Send message to shared chat room
    await database()
      .ref(`messages/${chatRoomId}`)
      .push(msgData);

    const lastMsg = messageText || '(Image)';

    // Update both users' chat list
    const updates = {};

    updates[`users/${currentUserId}/${guestUserId}`] = {
      latestMessage: lastMsg,
      timestamp: database.ServerValue.TIMESTAMP,
      counter: 0,
      user: {
        email: guestUserId,
        username: guestData.username, // or pass real name
        image: guestData.image
      },
    };

    updates[`users/${guestUserId}/${currentUserId}`] = {
      latestMessage: lastMsg,
      timestamp: database.ServerValue.TIMESTAMP,
      counter: database.ServerValue.increment(1),
      user: {
        email: currentUserId,
        username: userData.username,
        image: userData.image
      },
    };

    await database().ref().update(updates);

  } catch (error) {
    console.log('Send message error:', error);
  }
};