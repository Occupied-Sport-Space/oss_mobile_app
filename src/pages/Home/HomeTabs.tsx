import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/Home';
import ParkDetailScreen from '../../components/screens/ParkDetails';
import { useRecoilValue } from 'recoil';
import { sportSpaceState } from '../../state/atoms';
import { View, Text } from 'react-native';

export type HomeTabProps = {
  MainHome: undefined;
  Login: undefined;
  ParkDetail: { id: number };
};

const { Navigator, Screen } = createNativeStackNavigator<HomeTabProps>();

const HomeTabs = () => {
  const sportSpaces = useRecoilValue(sportSpaceState);

  if (!sportSpaces)
    return (
      <View className="bg-black h-full flex justify-center items-center">
        <Text className="text-white text-xl">Loading...</Text>
      </View>
    );

  return (
    <Navigator
      initialRouteName="MainHome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#23395d',
        },
        headerTitleStyle: {
          color: '#FFF',
        },
      }}
    >
      <Screen
        name="MainHome"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Occupied Sport Society',
        })}
      />
      <Screen
        name="ParkDetail"
        options={({ route }) => ({
          title: sportSpaces.find(({ id }) => id === route.params.id)!.name,
        })}
        component={ParkDetailScreen}
      />
    </Navigator>
  );
};

export default HomeTabs;
