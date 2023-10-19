import React, { FC, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, View, Text } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { homeNativeStackRouteState, parkState } from '../../state/atoms';
import { HomeTabProps } from '../../pages/Home/HomeTabs';
import CarouselCardItem from '../CarouselCardItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<HomeTabProps, 'ParkDetail'>;

const ParkDetail: FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);
  const parks = useRecoilValue(parkState);
  const detailPark = parks?.find((park) => park.id === id);

  if (!detailPark) return null;
  const { logo, name, availability, address } = detailPark;

  useEffect(() => {
    setHomeRoute('ParkDetail');
  }, []);

  return (
    <View className="flex-1 bg-black">
      <Image className="w-max h-[125px]" source={{ uri: logo }} />
      <View className="p-5">
        <Text className="text-white text-4xl font-bold mb-2">{name}</Text>
        <Text className="text-white text-2xl mb-5">
          <MaterialCommunityIcons name="map-marker" size={25} /> {address}
        </Text>
        {/* TODO: Add wait time and other sections */}
        <Text className="text-white text-xl mt-3">Other alternatives!</Text>
        <View className="flex-row">
          {parks &&
          parks?.filter(
            ({ markerLogo, id }) =>
              markerLogo === detailPark.markerLogo && id !== detailPark.id
          ).length ? (
            parks
              ?.filter(
                ({ markerLogo, id }) =>
                  markerLogo === detailPark.markerLogo && id !== detailPark.id
              )
              .map(({ id, ...park }) => (
                <CarouselCardItem
                  onPress={() => navigation.navigate('ParkDetail', { id })}
                  key={id}
                  park={{ id, ...park }}
                />
              ))
          ) : (
            <Text className="text-white text-md mt-5 text-center w-[100%]">
              There are no available alternatives at this point and time!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ParkDetail;
