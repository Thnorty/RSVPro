import * as React from 'react';
import { View, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  withTiming,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Sheet({ isOpen, onClose, children }: SheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  React.useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(0, { damping: 25, stiffness: 120, mass: 0.5 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
    }
  }, [isOpen, translateY]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const nextY = event.translationY;
      if (nextY > 0) {
        translateY.value = nextY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { damping: 25, stiffness: 120, mass: 0.5 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: Math.max(0, translateY.value) }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, SCREEN_HEIGHT / 2],
      [0.6, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  return (
    <View 
      style={StyleSheet.absoluteFill} 
      pointerEvents={isOpen ? 'auto' : 'none'} 
      className="justify-end"
    >
      <Animated.View 
        style={[StyleSheet.absoluteFill, backdropStyle]}
        className="bg-black"
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      <Animated.View 
        style={animatedStyle}
        className="bg-[#121212] rounded-t-3xl pb-12"
      >
        <GestureDetector gesture={gesture}>
          <View className="w-full pt-6 pb-4 items-center bg-transparent">
            <View className="h-1 w-12 bg-[#2C2C2E] rounded-full" />
          </View>
        </GestureDetector>
        
        {children}
      </Animated.View>
    </View>
  );
}
