// src/hooks/useTranslate.js
import { useState, useEffect } from 'react';
import { t } from '../../Components/utils/translate';
import { useLanguage } from '../../Components/context/LanguageContext';

export const useTranslate = (originalText) => {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(originalText);

  useEffect(() => {
    if (!originalText || language === 'en') {
      setTranslated(originalText);
      return;
    }

    let isMounted = true;

    t(originalText, language).then((result) => {
      if (isMounted) {
        setTranslated(result);
      }
    }).catch(() => {
      if (isMounted) {
        setTranslated(originalText);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [originalText, language]);

  return translated;
};