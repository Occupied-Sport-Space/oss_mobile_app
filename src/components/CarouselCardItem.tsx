import React, { FC } from 'react';
import { Card } from 'react-native-paper';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Park } from '../types/types';

const { Title, Cover, Content } = Card;

interface CardItemProps {
  park: Park;
  onPress: any;
}

const CarouselCardItem: FC<CardItemProps> = ({ park, onPress }) => {
  const { name, logo, availability, estimateWait } = park;

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
          {Math.round(availability * 100)}%
        </Text>
        <Text className="text-white mt-2">
          <MaterialCommunityIcons name="clock-outline" size={15} />:{' '}
          {estimateWait}
        </Text>
      </Content>
    </Card>
  );
};

export default CarouselCardItem;
