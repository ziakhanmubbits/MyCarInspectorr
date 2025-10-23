import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps,
} from 'react-native';
import { colors } from '../../utils/colors/colors';
import { styles } from './style';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textLight}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default TextInput;