import { Platform, Alert } from 'react-native';

let Notifications = null;
try {
  Notifications = require('expo-notifications');
  if (Notifications && typeof Notifications.setNotificationHandler === 'function') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {
  console.warn('expo-notifications native module not available (e.g. Expo Go limitation):', e.message);
}

/**
 * Yêu cầu quyền thông báo từ người dùng
 */
export const requestNotificationPermission = async () => {
  try {
    if (!Notifications || Platform.OS === 'web') {
      return false;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Lỗi xin quyền notification:', error.message);
    return false;
  }
};

/**
 * Bắn thông báo cục bộ (Local Notification)
 * Có fallback an toàn sang Alert nếu chạy trong Expo Go hoặc người dùng từ chối quyền
 */
export const triggerLocalNotification = async (title, body) => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission && Notifications?.scheduleNotificationAsync && Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // Bắn ngay lập tức
      });
      return true;
    } else {
      // Fallback hiển thị Alert trực tiếp, không bao giờ để crash app
      Alert.alert(title, body);
      return false;
    }
  } catch (error) {
    console.warn('Lỗi triggerLocalNotification:', error.message);
    Alert.alert(title, body);
    return false;
  }
};
