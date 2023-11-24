import React, { FC } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CustomMarkerProps {
  coords: {
    latitude: number;
    longitude: number;
  };
  markerLogo: string;
  onPress?: () => void;
}

export enum typeToLogo {
  volley = 'volleyball',
  basketball = 'basketball',
  gym = 'dumbbell',
}

const CustomMarker: FC<CustomMarkerProps> = ({
  coords,
  markerLogo,
  onPress,
}) => {
  return (
    <Marker coordinate={coords} onPress={onPress}>
      <View className="flex flex-col items-center">
        <View
          style={{
            backgroundColor: '#23395d',
            padding: 5,
            borderRadius: 100,
            marginBottom: -3,
          }}
        >
          <MaterialCommunityIcons
            name={typeToLogo[markerLogo]}
            size={25}
            color="#FFF"
          />
        </View>
        <View className="w-[0px] h-[0px] border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent border-t-[10px] border-t-[#23395d]"></View>
      </View>
    </Marker>
  );
};

export default CustomMarker;
