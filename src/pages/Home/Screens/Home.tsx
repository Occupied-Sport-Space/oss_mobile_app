import React, { FC, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CarouselCardItem from '../../../components/CarouselCardItem';
import {
  homeNativeStackRouteState,
  parkState,
  userState,
} from '../../../state/atoms';
import { HomeTabProps } from '../HomeTabs';
import parkData from '../../../mock_data/parks.json';
import { Park } from 'src/types/types';

const HomeScreen: FC<NativeStackScreenProps<HomeTabProps, 'MainHome'>> = ({
  navigation,
}) => {
  const user = useRecoilValue(userState);
  const [parks, setParks] = useRecoilState(parkState);
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);

  useEffect(() => {
    setParks(parkData as Park[]);
    setHomeRoute('MainHome');
  }, []);

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-black bg-opacity-30 text-white">
      <Text className="text-white text-3xl my-5 mx-2">
        Welcome, <Text className="text-blue-300 text-4xl">{user.name}</Text>
      </Text>
      <Text className="text-white text-xl mt-2 mx-2">Volleyball courts</Text>
      <View className="flex-row">
        {parks &&
          parks
            .filter(({ markerLogo }) => markerLogo === 'volley')
            .map(({ id, ...park }) => (
              <CarouselCardItem
                onPress={() => navigation.navigate('ParkDetail', { id })}
                key={id}
                park={{ id, ...park }}
              />
            ))}
      </View>
      <Text className="text-white text-xl mt-2 mx-2">Basketball courts</Text>
      <View className="flex-row">
        {parks &&
          parks
            .filter(({ markerLogo }) => markerLogo === 'basketball')
            .map(({ id, ...park }) => (
              <CarouselCardItem
                onPress={() => navigation.navigate('ParkDetail', { id })}
                key={id}
                park={{ id, ...park }}
              />
            ))}
      </View>
      <Text className="text-white text-xl mt-2 mx-2">Gym</Text>
      <View className="flex-row">
        {parks &&
          parks
            .filter(({ markerLogo }) => markerLogo === 'gym')
            .map(({ id, ...park }) => (
              <CarouselCardItem
                onPress={() => navigation.navigate('ParkDetail', { id })}
                key={id}
                park={{ id, ...park }}
              />
            ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
