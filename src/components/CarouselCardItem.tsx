import React, { FC, useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Space } from '../types/types';

const { Title, Cover, Content } = Card;

interface CardItemProps {
  park: Space;
  onPress: any;
}

const CarouselCardItem: FC<CardItemProps> = ({ park, onPress }) => {
  const { name, logo, availability, maxAvailable, address } = park;
  const [percentageAvailable, setPercentageAvailable] = useState(0);

  useEffect(() => {
    let usableAvailability = 0;
    availability.forEach((num) => (usableAvailability += num));

    setPercentageAvailable(
      Math.round((100 * usableAvailability) / maxAvailable)
    );
  }, [availability, maxAvailable]);

  return (
    <Card
      mode="elevated"
      style={{ backgroundColor: '#222', width: 180, margin: 5 }}
      onPress={onPress}
    >
      <Cover source={{ uri: logo }} />
      <Title
        title={name}
        className="max-w-[180px]"
        titleStyle={{ color: '#FFF' }}
      />
      <Content style={{ marginTop: -10 }}>
        <Text className="text-white">
          <MaterialCommunityIcons name="calendar-check" size={15} />:{' '}
          {percentageAvailable}%
        </Text>
        <Text className="text-white mt-2 whitespace-nowrap">
          <MaterialCommunityIcons name="map-marker" size={15} />: {address}
        </Text>
      </Content>
    </Card>
  );
};

export default CarouselCardItem;
