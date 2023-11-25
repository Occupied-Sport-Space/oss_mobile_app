import React, { FC, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { Searchbar } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import CustomMarker, { typeToLogo } from '../../../components/CustomMarker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MapTabProps } from '../MapTabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { sportSpaceState } from '../../../state/atoms';

const MapScreen: FC<NativeStackScreenProps<MapTabProps, 'MainMap'>> = ({
  navigation,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const sportSpaces = useRecoilValue(sportSpaceState);

  const filteredData = useMemo(
    () =>
      sportSpaces
        ? sportSpaces.filter(
            ({ name, markerLogo }) =>
              name.toLowerCase().includes(searchVal) ||
              markerLogo.includes(searchVal)
          )
        : [],
    [searchVal, sportSpaces]
  );

  const onNavigate = (id: number) => navigation.navigate('ParkDetail', { id });

  return (
    <View className="flex-1">
      <View className="flex items-center w-full absolute z-50 top-[7%]">
        <Searchbar
          value={searchVal}
          onChangeText={(val) => setSearchVal(val.toLowerCase())}
          className="w-[90%] bg-black"
          placeholder="Search for sport attractions!"
          iconColor="gray"
          inputStyle={{ color: '#FFF' }}
          placeholderTextColor="#999"
        />
        {searchVal && !!filteredData.length && (
          <View className="p-3 rounded-xl bg-black w-[90%] mt-3">
            {filteredData.map(({ name, markerLogo, id }) => (
              <TouchableOpacity
                onPress={() => onNavigate(id)}
                className="flex-row items-center"
                key={`search_${name}_${id}`}
              >
                <MaterialCommunityIcons
                  name={typeToLogo[markerLogo]}
                  size={25}
                  color="#FFF"
                />
                <Text className="text-white py-2 ml-2 font-bold text-md">
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <MapView
        initialRegion={{
          latitude: 54.6872,
          longitude: 25.2797,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        minZoomLevel={12}
        className="w-full h-full z-10"
      >
        {filteredData.map(({ id, name, ...park }) => (
          <CustomMarker onPress={() => onNavigate(id)} key={name} {...park} />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;
