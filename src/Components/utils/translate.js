// src/utils/translate.js
import { translate } from 'google-translate-api-x';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cache = new Map();
const CACHE_KEY = 'translation_cache_direct';

let isCacheLoaded = false;

export const loadCache = async () => {
  if (isCacheLoaded) return;
  try {
    const saved = await AsyncStorage.getItem(CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([key, value]) => cache.set(key, value));
    }
    isCacheLoaded = true;
  } catch (e) {
    console.log('Cache load failed', e);
  }
};

export const saveCache = async () => {
  try {
    const obj = Object.fromEntries(cache);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.log('Cache save failed', e);
  }
};

export const t = async (text, targetLang = 'en') => {
  if (!text || typeof text !== 'string') return text;
  if (targetLang === 'en') return text;

  const trimmedText = text.trim();
  const cacheKey = `${trimmedText}|||${targetLang}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await translate(trimmedText, { to: targetLang });
    const translated = res.text || trimmedText;

    cache.set(cacheKey, translated);
    // Save cache after each new translation (simple but effective)
    saveCache();

    return translated;
  } catch (err) {
    console.warn('Translation failed:', trimmedText, err.message || err);
    return trimmedText; // fallback
  }
};