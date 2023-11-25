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

type Props = NativeStackScreenProps<HomeTabProps, 'ParkDetail'>;

const ParkDetail: FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);
  const sportSpaces = useRecoilValue(sportSpaceState);
  const detailPark = sportSpaces?.find((park) => park.id === id);

  if (!detailPark) return null;
  const {
    logo,
    name,
    address,
    availability,
    coords: { latitude, longitude },
    markerLogo,
  } = detailPark;
  const [visibleAvailability, setAvailability] = useState(
    Math.round(availability * 100)
  );

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

    // The most dumb thing I've written this year.. Only for pitch
    const intervalId = setInterval(() => {
      const max = visibleAvailability + 10;
      const min = visibleAvailability - 10;
      const randomAvailability = Math.floor(Math.random() * (max - min) + min);
      setAvailability(
        randomAvailability > 100
          ? 100
          : randomAvailability < 0
          ? 0
          : randomAvailability
      );
    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ScrollView className="flex-1 bg-black">
      <Image className="w-max h-[125px]" source={{ uri: logo }} />
      <View className="p-5">
        <Text className="text-white text-4xl font-bold mb-2">{name}</Text>
        <View className="mt-3 mb-4">
          <Text className="text-white text-2xl font-semibold mb-2">
            Avalability ({visibleAvailability}%)
          </Text>
          <View className="bg-gray-400 rounded-md">
            <View
              className="bg-[#23395d] p-3 rounded-md"
              style={{ width: `${visibleAvailability}%` }}
            ></View>
          </View>
        </View>
        <View className="bg-gray-700 mt-2 rounded-xl">
          <TouchableOpacity
            className="rounded-xl overflow-hidden"
            onPress={onMapPress}
          >
            <MapView
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
