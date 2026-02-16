import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility functions for managing target language in AsyncStorage
 */

const STORAGE_KEY = 'targetLang';

/**
 * Save target language to AsyncStorage
 * @param {string} languageCode - Language code (e.g., 'es', 'fr', 'de')
 * @returns {Promise<boolean>} - Success status
 */
export const saveTargetLanguage = async languageCode => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, languageCode);
    console.log(`Target language saved: ${languageCode}`);
    return true;
  } catch (error) {
    console.error('Error saving target language:', error);
    return false;
  }
};

/**
 * Get target language from AsyncStorage
 * @returns {Promise<string|null>} - Language code or null
 */
export const getTargetLanguage = async () => {
  try {
    const languageCode = await AsyncStorage.getItem(STORAGE_KEY);
    return languageCode;
  } catch (error) {
    console.error('Error getting target language:', error);
    return null;
  }
};

/**
 * Remove target language from AsyncStorage
 * @returns {Promise<boolean>} - Success status
 */
export const removeTargetLanguage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('Target language removed');
    return true;
  } catch (error) {
    console.error('Error removing target language:', error);
    return false;
  }
};

/**
 * Check if target language is set
 * @returns {Promise<boolean>} - True if language is set
 */
export const hasTargetLanguage = async () => {
  try {
    const languageCode = await AsyncStorage.getItem(STORAGE_KEY);
    return languageCode !== null;
  } catch (error) {
    console.error('Error checking target language:', error);
    return false;
  }
};

export default {
  saveTargetLanguage,
  getTargetLanguage,
  removeTargetLanguage,
  hasTargetLanguage,
  STORAGE_KEY,
};
