import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/Home';
import ParkDetailScreen from '../../components/screens/ParkDetails';
import { useRecoilValue } from 'recoil';
import { sportSpaceState } from '../../state/atoms';

export type HomeTabProps = {
  MainHome: undefined;
  Login: undefined;
  ParkDetail: { id: string };
};

const { Navigator, Screen } = createNativeStackNavigator<HomeTabProps>();

const HomeTabs = () => {
  const sportSpaces = useRecoilValue(sportSpaceState);

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
        options={() => ({
          title: 'Occupied Sport Space',
        })}
      />
      <Screen
        name="ParkDetail"
        options={({ route }) => ({
          title: sportSpaces?.find(({ id }) => id === route.params.id)!.name,
        })}
        component={ParkDetailScreen}
      />
    </Navigator>
  );
};

export default HomeTabs;
