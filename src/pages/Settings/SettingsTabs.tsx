import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './Screens/SettingsScreen';

export type SettingsTabProps = {
  MainSettings: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<SettingsTabProps>();

const HomeTabs = () => {
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
        name="MainSettings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Navigator>
  );
};

export default HomeTabs;
