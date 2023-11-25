import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilValue } from 'recoil';
import { sportSpaceState } from '../../state/atoms';
import MapScreen from './Screens/Map';
import ParkDetailScreen from '../../components/screens/ParkDetails';

export type MapTabProps = {
  MainMap: undefined;
  ParkDetail: { id: number };
};

const { Navigator, Screen } = createNativeStackNavigator<MapTabProps>();

const MapTabs = () => {
  const sportSpaces = useRecoilValue(sportSpaceState);

  if (!sportSpaces) return null;

  return (
    <Navigator
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
        name="MainMap"
        options={{ headerShown: false }}
        component={MapScreen}
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

export default MapTabs;
