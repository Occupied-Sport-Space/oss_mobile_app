import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/Home';
import ParkDetailScreen from '../../components/screens/ParkDetails';
import parks from '../../mock_data/parks.json';

export type HomeTabProps = {
  MainHome: undefined;
  Login: undefined;
  ParkDetail: { id: number };
};

const { Navigator, Screen } = createNativeStackNavigator<HomeTabProps>();

const HomeTabs = () => {
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
          title: parks.find(({ id }) => id === route.params.id)!.name,
        })}
        component={ParkDetailScreen}
      />
    </Navigator>
  );
};

export default HomeTabs;
