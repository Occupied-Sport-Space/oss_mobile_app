import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userState } from '../../../state/atoms';
import { pb } from '../../../utils/pocketbase';
import { StorageKeys, setItem } from '../../../utils/asyncStorage';

const SettingsScreen = () => {
  const [_, setUser] = useRecoilState(userState);

  const handleLogout = () => {
    pb.authStore.clear();
    setItem(StorageKeys.USER, '');
    setUser(null);
  };

  return (
    <View className="bg-black w-[100vw] h-[100vh] py-5">
      <Button onPress={handleLogout} textColor="white" buttonColor="#60a5fa">
        Logout
      </Button>
    </View>
  );
};

export default SettingsScreen;
