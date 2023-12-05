import React, { FC, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilState } from 'recoil';
import { userState } from '../../../state/atoms';
import { pb } from '../../../utils/pocketbase';
import { StorageKeys, setItem } from '../../../utils/asyncStorage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabProps } from '../SettingsTabs';

interface EditItemProps {
  title: string;
  value: string;
  onChange: (text: string) => void;
  onCancel: () => void;
}

const EditItem: FC<EditItemProps> = ({ title, value, onChange, onCancel }) => {
  const [showInput, setShowInput] = useState(false);

  return (
    <View className="flex-row justify-left items-center gap-4">
      <Text className="text-white text-xl">{title}:</Text>

      {showInput ? (
        <View className="min-w-[250px]">
          <TextInput
            value={value}
            placeholder="Input new information"
            onChangeText={onChange}
            style={{
              color: 'white',
              borderColor: 'gray',
              borderWidth: 2,
              borderRadius: 5,
              padding: 5,
            }}
          />
        </View>
      ) : (
        <Text className="text-white text-xl ml-2">{value}</Text>
      )}
      <MaterialCommunityIcons
        name={showInput ? 'close' : 'pencil'}
        color="white"
        onPress={() => {
          setShowInput(!showInput);
          onCancel();
        }}
        size={20}
      />
    </View>
  );
};

const SettingsScreen: FC<
  NativeStackScreenProps<SettingsTabProps, 'MainSettings'>
> = ({ navigation }) => {
  const [user, setUser] = useRecoilState(userState);
  const [newInfo, setNewInfo] = useState({ ...user });

  const handleLogout = () => {
    pb.authStore.clear();
    setItem(StorageKeys.USER, '');
    setUser(null);
  };

  const handleSave = () => {
    if (user) {
      pb.collection('users')
        .update(user.id, {
          username: newInfo.name,
        })
        .then(({ id, email, username, token }) => {
          const newUser = {
            id,
            email,
            name: username,
            token,
          };
          setUser(newUser);
          setNewInfo(newUser);
        });
    }
  };

  if (!user) navigation.goBack();

  return (
    <View className="bg-black w-[100vw] h-[100vh] p-4">
      <EditItem
        title="Name"
        value={newInfo.name!}
        onChange={(name) => setNewInfo({ ...newInfo, name })}
        onCancel={() => setNewInfo({ ...newInfo, name: user?.name })}
      />
      <View className="py-1"></View>
      <EditItem
        title="Email"
        value={newInfo.email!}
        onChange={(email) => setNewInfo({ ...newInfo, email })}
        onCancel={() => setNewInfo({ ...newInfo, email: user?.email })}
      />
      {JSON.stringify(newInfo) !== JSON.stringify(user) && (
        <View className="mt-4">
          <Button onPress={handleSave} textColor="#60a5fa" buttonColor="white">
            Save
          </Button>
        </View>
      )}
      <Button
        onPress={handleLogout}
        textColor="white"
        className="mt-4"
        buttonColor="#60a5fa"
      >
        Logout
      </Button>
    </View>
  );
};

export default SettingsScreen;
