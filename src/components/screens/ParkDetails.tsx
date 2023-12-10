import React, { FC, useEffect, useRef, useState } from 'react';
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
import {
  homeNativeStackRouteState,
  sportSpaceState,
  userState,
} from '../../state/atoms';
import { HomeTabProps } from '../../pages/Home/HomeTabs';
import CarouselCardItem from '../CarouselCardItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CustomMarker from '../CustomMarker';
import { pb } from '../../utils/pocketbase';
import { DurationEnum, Space } from '../../types/types';

type Props = NativeStackScreenProps<HomeTabProps, 'ParkDetail'>;

const ParkDetail: FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const scrollRef = useRef<any>(null);
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);
  const sportSpaces = useRecoilValue(sportSpaceState);
  const [user, setUser] = useRecoilState(userState);
  const [percentageAvailable, setPercentageAvailable] = useState(0);
  const [favorite, setFavorite] = useState(false);
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

  const handleFavourite = () => {
    pb.collection('users')
      .update(
        user!.id,
        !favorite
          ? {
              'favorites+': id,
            }
          : { 'favorites-': id }
      )
      .then(({ email, username, id, token, favorites }) => {
        const newUser = {
          id,
          email,
          username,
          token,
          favorites,
        };
        setUser(newUser);
        setFavorite(!favorite);
      });
  };

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
    setHomeRoute('ParkDetail');
  }, []);

  useEffect(() => {
    setDetailPark(
      sportSpaces?.find((park) => {
        if (park.id === id) {
          setFavorite(user?.favorites.includes(park.id) ?? false);
          return true;
        }

        return false;
      })
    );
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    pb.collection('sportSpaces').subscribe(
      id,
      ({ record, action }: { action: string; record: unknown }) => {
        if (action === 'update') {
          setDetailPark(record as Space);
        }
      }
    );

    return () => {
      pb.collection('sportSpaces').unsubscribe(id);
    };
  }, [id]);

  useEffect(() => {
    setPercentageAvailable(Math.round((100 * availability) / maxAvailable));
  }, [availability, maxAvailable]);

  return (
    <ScrollView className="flex-1 bg-black" ref={scrollRef}>
      <Image className="w-max h-[125px]" source={{ uri: logo }} />
      <View className="p-5">
        <View className="flex-row justify-between">
          <Text className="text-white text-4xl font-bold mb-2">{name}</Text>
          <MaterialCommunityIcons
            name={favorite ? 'star' : 'star-outline'}
            color={favorite ? 'gold' : 'white'}
            size={30}
            onPress={handleFavourite}
          />
        </View>
        <View className="mt-3 mb-4">
          <Text className="text-white text-2xl font-semibold mb-2">
            Avalability {availability}/{maxAvailable} ({percentageAvailable}%)
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
              provider={PROVIDER_GOOGLE}
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
            className="p-5 mt-5 bg-[#23395d] rounded-xl w-[48%] flex items-center justify-between"
          >
            <Text className="text-white text-2xl">
              <MaterialCommunityIcons name="web" size={25} />
            </Text>
            <Text className="text-white mt-2 text-2xl text-center">
              Visit {name} here!
            </Text>
          </TouchableOpacity>
          <View className="p-5 mt-5 bg-[#23395d] rounded-xl w-[48%] flex">
            <View className="flex-row">
              <Text className="text-white text-2xl">
                <MaterialCommunityIcons name="cash" size={25} />
              </Text>
              <Text className="text-white text-2xl ml-3">Prices:</Text>
            </View>
            <View className="flex flex-1 justify-center items-center">
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
                  onPress={() => {
                    navigation.navigate('ParkDetail', { id });
                  }}
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
