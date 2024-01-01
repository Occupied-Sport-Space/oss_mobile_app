import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

const Spinner = () => {
  const [spinValue, _] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{ transform: [{ rotate: spin }] }}
      className="w-[30px] h-[30px] rounded-full border-solid border-[5px] border-[#60a5fa] border-t-gray-200"
    />
  );
};

export default Spinner;
