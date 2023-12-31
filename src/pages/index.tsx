import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTabs from './Home/HomeTabs';
import MapTabs from './Map/MapTabs';
import SettingsTabs from './Settings/SettingsTabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRecoilState, useRecoilValue } from 'recoil';
import { homeNativeStackRouteState, userState } from '../state/atoms';
import LoginScreen from './Home/Screens/Authentication/LoginScreen';
import { StorageKeys, getItem, setItem } from '../utils/asyncStorage';
import { getLogin } from '../utils/rest';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Map: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();
export const socket = io('https://oss-be.up.railway.app');

const AppRouter = () => {
  const [user, setUser] = useRecoilState(userState);
  const homeNativeTab = useRecoilValue(homeNativeStackRouteState);

  useEffect(() => {
    getItem(StorageKeys.USER).then((data) => {
      if (data) {
        const { email, password } = data;

        getLogin(email, password)
          .then(({ data }) => {
            setUser(data);
            setItem(StorageKeys.USER, JSON.stringify({ email, password }));
          })
          .catch(() => setUser(null));
      }
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName = 'home';
            let rn = route.name;

            switch (rn) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Settings':
                iconName = focused ? 'cog' : 'cog-outline';
                break;
              case 'Map':
                iconName = focused ? 'map' : 'map-outline';
                break;
            }

            return (
              <MaterialCommunityIcons name={iconName} size={30} color={color} />
            );
          },
          tabBarActiveTintColor: '#60a5fa',
          headerTitleStyle: {
            color: '#FFF',
          },
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#000',
            display: homeNativeTab === 'Login' ? 'none' : 'flex',
          },
          headerStyle: {
            backgroundColor: '#60a5fa',
          },
        })}
      >
        <Screen
          name="Home"
          options={{
            headerShown: false,
          }}
          component={HomeTabs}
        />
        <Screen
          name="Map"
          component={MapTabs}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="Settings"
          component={SettingsTabs}
          options={{
            headerShown: false,
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;
