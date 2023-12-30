import React, { FC, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CarouselCardItem from '../../../components/CarouselCardItem';
import {
  homeNativeStackRouteState,
  sportSpaceState,
  userState,
} from '../../../state/atoms';
import { HomeTabProps } from '../HomeTabs';
import { getSpaces } from '../../../utils/rest';
import { socket } from '../../index';
import { Space } from '../../../types/types';

const HomeScreen: FC<NativeStackScreenProps<HomeTabProps, 'MainHome'>> = ({
  navigation,
}) => {
  const user = useRecoilValue(userState);
  const [sportSpaces, setSportSpaces] = useRecoilState(sportSpaceState);
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);

  useEffect(() => {
    setHomeRoute('MainHome');

    getSpaces(user!.token).then(({ data }) => {
      setSportSpaces(data);
      socket.on('update', (space: Space) => {
        const updatedData = [...data];
        updatedData[data.findIndex(({ id }: Space) => id === space.id)] = space;
        setSportSpaces(updatedData);
      });
    });
  }, []);

  if (!sportSpaces || !user)
    return (
      <View className="bg-black h-full flex justify-center items-center">
        <Text className="text-white text-xl">Loading...</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 bg-black bg-opacity-30 text-white">
      <Text className="text-white text-3xl my-5 mx-2">
        Welcome, <Text className="text-blue-300 text-4xl">{user.name}</Text>
      </Text>
      {user && user.favorites && !!user.favorites.length && (
        <>
          <Text className="text-white text-xl mt-2 mx-2">
            Favorite courts{' '}
            <MaterialCommunityIcons name={'star'} color={'gold'} size={20} />
          </Text>
          <ScrollView horizontal={true}>
            {sportSpaces &&
              sportSpaces
                .filter(({ id }) => user.favorites.includes(id))
                .map(({ id, ...park }) => (
                  <CarouselCardItem
                    onPress={() => navigation.navigate('ParkDetail', { id })}
                    key={id}
                    park={{ id, ...park }}
                  />
                ))}
          </ScrollView>
        </>
      )}
      <Text className="text-white text-xl mt-2 mx-2">Volleyball courts</Text>
      <ScrollView horizontal={true}>
        {sportSpaces &&
          sportSpaces
            .filter(({ markerLogo }) => markerLogo === 'volley')
            .map(({ id, ...park }) => (
              <CarouselCardItem
                onPress={() => navigation.navigate('ParkDetail', { id })}
                key={id}
                park={{ id, ...park }}
              />
            ))}
      </ScrollView>
      <Text className="text-white text-xl mt-2 mx-2">Basketball courts</Text>
      <ScrollView horizontal={true}>
        {sportSpaces &&
          sportSpaces
            .filter(({ markerLogo }) => markerLogo === 'basketball')
            .map(({ id, ...park }) => (
              <CarouselCardItem
                onPress={() => navigation.navigate('ParkDetail', { id })}
                key={id}
                park={{ id, ...park }}
              />
            ))}
      </ScrollView>
      <Text className="text-white text-xl mt-2 mx-2">Gym</Text>
      <ScrollView horizontal={true}>
        {sportSpaces &&
          sportSpaces
            .filter(({ markerLogo }) => markerLogo === 'gym')
            .map(({ id, ...park }) => (
              <CarouselCardItem
                onPress={() => navigation.navigate('ParkDetail', { id })}
                key={id}
                park={{ id, ...park }}
              />
            ))}
      </ScrollView>
    </ScrollView>
  );
};

export default HomeScreen;
