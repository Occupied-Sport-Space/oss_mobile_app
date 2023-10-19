import React, { FC } from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface InputProps {
  value: string;
  label: string;
  onChangeText: (val: string) => void;
  error?: string;
  type?: string;
  styles?: string;
}

const Input: FC<InputProps> = ({
  value,
  label,
  onChangeText,
  error,
  styles,
  type = 'text',
}) => {
  return (
    <View className={styles}>
      <TextInput
        label={label}
        error={!!error}
        style={{
          textAlign: 'auto',
        }}
        autoCapitalize="none"
        value={value}
        secureTextEntry={type === 'password'}
        mode="outlined"
        onChangeText={onChangeText}
        outlineColor="#60a5fa"
        activeOutlineColor="#60a5fa"
      />
      {error && (
        <Text className="text-red-400 mb-1 mt-1 font-semibold">{error}</Text>
      )}
    </View>
  );
};

export default Input;
