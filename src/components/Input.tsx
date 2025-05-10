import React from 'react';
import { TextInput } from 'react-native-paper';
import colors from '../styles/colors';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, value, onChangeText, secureTextEntry = false }) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      mode="outlined"
      style={{ marginBottom: 16 }}
      theme={{ colors: { primary: colors.primary, text: colors.white, background: colors.white } }}
    />
  );
};
