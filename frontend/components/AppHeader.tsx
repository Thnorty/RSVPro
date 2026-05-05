import { View, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import * as React from 'react';
import { useColorScheme } from '@/lib/useColorScheme';

interface AppHeaderProps {
  title?: string;
  leftTitleContent?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
  onLeftPress?: () => void;
  showBack?: boolean;
}

export function AppHeader({
  title,
  leftTitleContent,
  leftIcon,
  rightContent,
  onLeftPress,
  showBack,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else if (showBack) {
      router.back();
    }
  };

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-row items-center justify-between bg-background px-6 pb-4">
      <View className="h-8 flex-row items-center gap-2">
        {(showBack || leftIcon) && (
          <TouchableOpacity onPress={handleLeftPress} className="active:scale-95 active:opacity-70">
            {leftIcon || (showBack && <Icon name="arrow.left" color={colors.primary} size={24} />)}
          </TouchableOpacity>
        )}
        {leftTitleContent ? (
          leftTitleContent
        ) : title ? (
          <Text className="ml-2 font-sans text-sm font-medium tracking-tight text-foreground">
            {title}
          </Text>
        ) : null}
      </View>
      <View className="h-8 flex-row items-center justify-end">{rightContent}</View>
    </View>
  );
}
