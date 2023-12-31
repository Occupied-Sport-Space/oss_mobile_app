import React, { FC, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilState } from 'recoil';
import { userState } from '../../../state/atoms';
import { StorageKeys, getItem, setItem } from '../../../utils/asyncStorage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabProps } from '../SettingsTabs';
import { editUser } from '../../../utils/rest';

interface EditItemProps {
  title: string;
  value: string;
  showInput: boolean;
  setShowInput: (show: boolean) => void;
  onChange: (text: string) => void;
  onCancel: () => void;
}

const EditItem: FC<EditItemProps> = ({
  title,
  value,
  onChange,
  onCancel,
  showInput,
  setShowInput,
}) => {
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
  const [visibleInputs, setVisibleInputs] = useState({
    name: false,
  });

  const handleLogout = () => {
    setItem(StorageKeys.USER, '');
    setUser(null);
  };

  const handleSave = () => {
    if (user) {
      // ! TOOD: add update user func, when BE is ready
      editUser(user.token, newInfo).then(({ data }) => {
        getItem(StorageKeys.USER).then(({ password }) => {
          setUser(data);
          setItem(
            StorageKeys.USER,
            JSON.stringify({ email: data.email, password })
          );
          setVisibleInputs({ name: false });
        });
      });
    }
  };

  if (!user) navigation.goBack();

  return (
    <View className="bg-black w-[100vw] h-[100vh] p-4">
      <EditItem
        title="Username"
        value={newInfo.name!}
        showInput={visibleInputs.name}
        setShowInput={(show) =>
          setVisibleInputs({ ...visibleInputs, name: show })
        }
        onChange={(name) => setNewInfo({ ...newInfo, name })}
        onCancel={() => setNewInfo({ ...newInfo, name: user?.name })}
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
