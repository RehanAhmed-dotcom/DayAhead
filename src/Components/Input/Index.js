import React, { JSX, useState } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Colors, fonts } from '../../Constant/Index';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  value: string;
  type?: string;
  image1?: JSX.Element;
  image2?: JSX.Element;
  short?: boolean;
  error?: string;
  bigInput?: boolean;
  nonEditable?: boolean;
  secureText?: boolean;
  secureToggle?: () => void;
  selectCountry?: (text: string) => void;
  touched?: boolean;
  inputColor?: string;
  showBorder?: boolean;
  phoneNumber?: boolean;
  labelFontFamily?: string;
  labelFontSize?: number;
  countryCode?: string;
  maxLength?: number;
  elevation?: boolean;
  elevationNumber?: number;
  labelColor?: string;
  placeFontSize?: number;
  color?: string;
  customBorderColor?: string;
  showInfo?: boolean;
  info?: JSX.Element;
  marginTop:JSX.Element;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  onChangeText,
  value,
  type,
  onBlur,
  onFocus,
  elevation,
  elevationNumber,
  image1,
  placeFontSize,
  color,
  nonEditable,
  labelFontFamily,
  labelFontSize,
  showBorder,
  inputColor,
  short,
  secureText,
  customBorderColor,
  labelColor,
  error,
  image2,
  bigInput,
  touched,
  secureToggle,
  maxLength,
  marginTop
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.mainInputView}>
      {label ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              styles.label,
              {
                fontSize: labelFontSize ?? 14,
                fontFamily: fonts.medium,
                color: nonEditable
                  ? '#ADADAD'
                  : labelColor ?? '#212121',
                top: 5,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      ) : (
        <View style={{ height: 16 }} />
      )}

      <View
        style={[
          styles.row,
          {
            borderWidth: showBorder ? 1 : 0,
            backgroundColor: inputColor ?? '#FAFAFA',
            marginTop:marginTop?? widthPercentageToDP(2),
            borderColor: error && touched
              ? '#FF0000'
              : isFocused
              ? Colors.mainColor
              : customBorderColor ?? '#EDF1F3',
            elevation: elevation && elevationNumber ? elevationNumber : 0,
          },
        ]}
      >
        {image1}
        <TextInput
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          maxLength={maxLength}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          returnKeyType="done"
          editable={!nonEditable}
          keyboardType={type === 'Number' ? 'phone-pad' : 'default'}
          placeholderTextColor={color ?? '#616161'}
          secureTextEntry={secureText}
          style={[
            styles.inputView,
            {
              fontFamily: fonts.medium,
              fontSize: placeFontSize ?? 14,
              width: short ? widthPercentageToDP(70) : image1 ? '80%' : '90%',
              height: bigInput ? 200 : 50,
              color: nonEditable ? '#ADADAD' : '#616161',
            },
          ]}
        />
        {secureToggle && (
          <TouchableOpacity onPress={secureToggle}>
            {image2}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = {
  mainInputView: {
    marginVertical: 4,
    
  },
  label: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputView: {
    paddingVertical: 0,
  },
};

export default Input;