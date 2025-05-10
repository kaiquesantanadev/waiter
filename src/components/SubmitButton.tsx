import React from 'react';
import { Button } from 'react-native-paper';
import colors from '../styles/colors';

interface SubmitButtonProps {
  onPress: () => void;
  label: string;
  loading?: boolean; 
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress, label }) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={{ backgroundColor: colors.primary, paddingVertical: 8 }}
      labelStyle={{ color: colors.white, fontWeight: 'bold' }}
    >
      {label}
    </Button>
  );
};
