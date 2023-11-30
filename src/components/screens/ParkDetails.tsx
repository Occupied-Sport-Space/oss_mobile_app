import React, { FC, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Image,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { homeNativeStackRouteState, sportSpaceState } from '../../state/atoms';
import { HomeTabProps } from '../../pages/Home/HomeTabs';
import CarouselCardItem from '../CarouselCardItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView from 'react-native-maps';
import CustomMarker from '../CustomMarker';
import { pb } from '../../utils/pocketbase';
import { DurationEnum, Park } from '../../types/types';

type Props = NativeStackScreenProps<HomeTabProps, 'ParkDetail'>;

const ParkDetail: FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);
  const sportSpaces = useRecoilValue(sportSpaceState);
  const [percentageAvailable, setPercentageAvailable] = useState(0);
  const [detailPark, setDetailPark] = useState(
    sportSpaces?.find((park) => park.id === id)
  );

  if (!detailPark) return null;
  const {
    logo,
    name,
    address,
    availability,
    maxAvailable,
    link,
    price,
    coords: { latitude, longitude },
    markerLogo,
  } = detailPark;

  const onMapPress = () => {
    Alert.alert(`How to get to ${name}`, undefined, [
      {
        text: 'Open on "Google Maps"',
        onPress: () =>
          Linking.openURL(`google.navigation:q=${latitude}+${longitude}`),
      },
      {
        text: 'Open on "Apple Maps"',
        onPress: () =>
          Linking.openURL(`maps://app?daddr=${latitude}+${longitude}`),
      },
      { text: 'Cancel', onPress: () => null, style: 'cancel' },
    ]);
  };

  useEffect(() => {
    setHomeRoute('ParkDetail');

    pb.collection('sportSpaces').subscribe(
      id,
      ({ record, action }: { action: string; record: unknown }) => {
        if (action === 'update') {
          setDetailPark(record as Park);
        }
      }
    );

    return () => {
      pb.collection('sportSpaces').unsubscribe();
    };
  }, []);

  const getText = (duration: DurationEnum) => {
    switch (duration) {
      case DurationEnum.DAY:
        return 'Day';
      case DurationEnum.MONTH:
        return 'Month';
      case DurationEnum.YEAR:
        return 'Year';
      default:
        return 'Day';
    }
  };

  useEffect(() => {
    setPercentageAvailable(Math.round((100 * availability) / maxAvailable));
  }, [availability, maxAvailable]);

  return (
    <ScrollView className="flex-1 bg-black">
      <Image className="w-max h-[125px]" source={{ uri: logo }} />
      <View className="p-5">
        <Text className="text-white text-4xl font-bold mb-2">{name}</Text>
        <View className="mt-3 mb-4">
          <Text className="text-white text-2xl font-semibold mb-2">
            Avalability ({percentageAvailable}%)
          </Text>
          <View className="bg-gray-400 rounded-md">
            <View
              className="bg-[#23395d] p-3 rounded-md"
              style={{ width: `${percentageAvailable}%` }}
            ></View>
          </View>
        </View>
        <View className="bg-gray-700 mt-2 rounded-xl">
          <TouchableOpacity
            className="rounded-xl overflow-hidden"
            onPress={onMapPress}
          >
            <MapView
              provider="google"
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 1,
                longitudeDelta: 1,
              }}
              maxZoomLevel={11}
              minZoomLevel={11}
              className="w-full h-[150px]"
              pitchEnabled={false}
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
            >
              <CustomMarker
                coords={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                markerLogo={markerLogo}
              />
            </MapView>
            <View className="p-5 bg-[#23395d] rounded-b-xl flex-row">
              <Text className="text-white text-2xl">
                <MaterialCommunityIcons name="map-marker" size={25} />
              </Text>
              <Text className="text-white text-2xl ml-3">{address}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(link);
            }}
            className="p-5 mt-5 bg-[#23395d] rounded-xl w-[48%] h-[160px] flex items-center justify-between"
          >
            <Text className="text-white text-2xl">
              <MaterialCommunityIcons name="web" size={25} />
            </Text>
            <Text className="text-white text-2xl text-center">
              Visit {name} here!
            </Text>
          </TouchableOpacity>
          <View className="p-5 mt-5 bg-[#23395d] rounded-xl w-[48%] h-[160px] flex justify-between">
            <View className="flex-row">
              <Text className="text-white text-2xl">
                <MaterialCommunityIcons name="cash" size={25} />
              </Text>
              <Text className="text-white text-2xl ml-3">Prices:</Text>
            </View>
            <View>
              {Array.isArray(price) ? (
                price.map(({ price, duration }) => (
                  <View className="mb-1" key={duration}>
                    <Text className="text-white text-xl">
                      {price}€ / {getText(duration)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-white text-2xl text-center">
                  Free of charge!
                </Text>
              )}
            </View>
          </View>
        </View>
        <Text className="text-white text-xl mt-4">Other alternatives!</Text>
        <ScrollView horizontal={true}>
          {sportSpaces &&
          sportSpaces?.filter(
            ({ markerLogo, id }) =>
              markerLogo === detailPark.markerLogo && id !== detailPark.id
          ).length ? (
            sportSpaces
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
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default ParkDetail;
