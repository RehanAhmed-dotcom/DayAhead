import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import translate from 'google-translate-api-x';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * TranslatableText - A custom Text component with automatic translation
 *
 * Props:
 * - children: The text to display/translate
 * - targetLang: Target language code (optional - if not provided, reads from AsyncStorage)
 * - sourceLang: Source language code (default: 'auto' for auto-detection)
 * - enableTranslation: Boolean to enable/disable translation (default: true)
 * - onTranslationComplete: Callback when translation is done
 * - showOriginal: Show original text below translation (default: false)
 * - storageKey: AsyncStorage key for target language (default: 'targetLang')
 * - All standard Text props (style, numberOfLines, etc.)
 */
const TranslatableText = ({
  children,
  targetLang,
  sourceLang = 'auto',
  enableTranslation = true,
  onTranslationComplete,
  showOriginal = false,
  storageKey = 'targetLang',
  style,
  ...textProps
}) => {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);
  const [langFromStorage, setLangFromStorage] = useState(null);

  // Fetch target language from AsyncStorage
  useEffect(() => {
    const fetchTargetLang = async () => {
      try {
        const storedLang = await AsyncStorage.getItem(storageKey);
        if (storedLang) {
          setLangFromStorage(storedLang);
        }
      } catch (err) {
        console.error('Error reading target language from AsyncStorage:', err);
      }
    };

    // Only fetch from storage if targetLang prop is not provided
    if (!targetLang) {
      fetchTargetLang();
    }
  }, [targetLang, storageKey]);

  useEffect(() => {
    const translateText = async () => {
      // Determine which target language to use (prop takes priority)
      const finalTargetLang = targetLang || langFromStorage || 'en';

      // If translation is disabled or no text, show original
      if (!enableTranslation || !children) {
        setTranslatedText(children);
        return;
      }

      // Wait for storage to be checked if no targetLang prop provided
      if (!targetLang && langFromStorage === null) {
        return; // Wait for AsyncStorage to load
      }

      // If target language is same as source, no need to translate
      if (sourceLang !== 'auto' && sourceLang === finalTargetLang) {
        setTranslatedText(children);
        return;
      }

      setIsTranslating(true);
      setError(null);

      try {
        const result = await translate(children, {
          from: sourceLang,
          to: finalTargetLang,
        });

        setTranslatedText(result.text);
        setDetectedLang(result.from.language.iso);

        if (onTranslationComplete) {
          onTranslationComplete({
            original: children,
            translated: result.text,
            detectedLanguage: result.from.language.iso,
            targetLanguage: finalTargetLang,
          });
        }
      } catch (err) {
        console.error('Translation error:', err);
        setError(err.message);
        setTranslatedText(children); // Fallback to original text
      } finally {
        setIsTranslating(false);
      }
    };

    translateText();
  }, [children, targetLang, langFromStorage, sourceLang, enableTranslation]);

  if (isTranslating) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#666" />
        <Text style={[{ marginLeft: 8, color: '#666' }, style]} {...textProps}>
          Translating...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <Text style={[{ color: '#ff6b6b' }, style]} {...textProps}>
        {children} (Translation failed)
      </Text>
    );
  }

  return (
    <View>
      <Text style={style} {...textProps}>
        {translatedText}
      </Text>
      {showOriginal && translatedText !== children && (
        <Text
          style={[{ fontSize: 12, color: '#888', marginTop: 4 }, style]}
          {...textProps}
        >
          Original: {children}
        </Text>
      )}
    </View>
  );
};

export default TranslatableText;
