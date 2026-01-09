// src/context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCache } from '../../Components/utils/translate';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadCache();
      const saved = await AsyncStorage.getItem('app_language');
      const detected = saved || RNLocalize.getLocales()[0]?.languageCode || 'en';
      setLanguage(detected);
      setReady(true);
    };
    init();
  }, []);

  const changeLanguage = async (lng) => {
    setLanguage(lng);
    await AsyncStorage.setItem('app_language', lng);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, ready }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);