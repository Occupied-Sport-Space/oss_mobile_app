import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRecoilState } from 'recoil';
import { sportSpaceState } from '../../state/atoms';
import { Park } from '../../../src/types/types';
import parkData from '../../mock_data/parks.json';
import MapScreen from './Screens/Map';
import ParkDetailScreen from '../../components/screens/ParkDetails';

export type MapTabProps = {
  MainMap: undefined;
  ParkDetail: { id: number };
};

const { Navigator, Screen } = createNativeStackNavigator<MapTabProps>();

const MapTabs = () => {
  const [parks, setParks] = useRecoilState(sportSpaceState);

  useEffect(() => {
    new Promise((res) => {
      setTimeout(() => {
        res(parkData);
      }, 1000);
    }).then((data) => {
      setParks(data as Park[]);
    });
  }, []);

  if (!parks) return null;

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
          title: parks.find(({ id }) => id === route.params.id)!.name,
        })}
        component={ParkDetailScreen}
      />
    </Navigator>
  );
};

export default MapTabs;
