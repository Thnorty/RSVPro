import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { View, Image, ScrollView, Switch, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Slider } from '@/components/nativewindui/Slider';
import { Sheet } from '@/components/nativewindui/Sheet';
import { useColorScheme } from '@/lib/useColorScheme';
import { useStore } from '@/store/store';

import { AppHeader } from '@/components/AppHeader';

// Memoized slider to prevent React re-renders from interfering with native slider physics
const WpmSlider = React.memo(({ initialValue, onChange }: { initialValue: number, onChange: (val: number) => void }) => (
  <Slider
    value={initialValue}
    onValueChange={onChange}
    minimumValue={100}
    maximumValue={1000}
    step={10}
  />
));

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { wpm, setWpm } = useStore();
  
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [localWpm, setLocalWpm] = React.useState(wpm);

  const openSheet = () => {
    setLocalWpm(wpm);
    setIsSheetOpen(true);
  };

  const applyWpm = () => {
    setWpm(localWpm);
    setIsSheetOpen(false);
  };

  const handleSliderChange = React.useCallback((val: number) => {
    setLocalWpm(Math.round(val));
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-black">
        <AppHeader
          title="Profile"
          showBack={true}
          rightContent={
            <TouchableOpacity className="active:scale-95 active:opacity-70">
              <Icon name="ellipsis" color="#007AFF" size={24} />
            </TouchableOpacity>
          }
        />

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
          {/* Header Section */}
          <View className="mb-12 items-center">
            <View className="relative">
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj6zzpVH7XuOvGN5T3Fg3weFmT_miOmoGWAau7vhOF8Do3cQWPOXwzmvyXOf7BnHK7SMA46KHhukV140UkCFIeBwZT4KLz5rA4o5yeQJgFbqOrn3IqiOXe1x1A_jeGnxzk4yHz0dEFblzQQZPGiVxQbGp9Y4t8hWai8mdrqpxQQJkZJfWxdDJKlGkeScx6CwZzXDw_TvnvfScSomHZ5bUh0rSa0__MvFwfvyysj16G2jt2CSlqs8H6KrLW4uobIPkkomMmtz4-cXhk',
                }}
                className="h-24 w-24 rounded-full border-2 border-[#2C2C2E]"
              />
              <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-[#007AFF]">
                <Icon name="pencil" color="white" size={12} />
              </View>
            </View>
            <Text variant="title1" className="mt-4 mb-1 text-white">
              Julian Thorne
            </Text>
            <Text variant="body" className="text-muted-foreground">
              j.thorne@performance.lab
            </Text>
          </View>

          {/* Statistics Grid */}
          <View className="mb-12 flex-col gap-4 md:flex-row">
            <View className="flex-1 items-center justify-center rounded-lg border border-[#2C2C2E] bg-[#0e0e0e] p-6">
              <Text className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                TOTAL WORDS READ
              </Text>
              <Text variant="title2" className="text-white">
                1.2M
              </Text>
              <View className="mt-2 h-1 w-1 rounded-full bg-[#007AFF]" />
            </View>
            <View className="flex-1 items-center justify-center rounded-lg border border-[#2C2C2E] bg-[#0e0e0e] p-6">
              <Text className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                READING STREAK
              </Text>
              <Text variant="title2" className="text-white">
                42 Days
              </Text>
              <View className="mt-2 h-1 w-1 rounded-full bg-[#007AFF]" />
            </View>
            <View className="flex-1 items-center justify-center rounded-lg border border-[#2C2C2E] bg-[#0e0e0e] p-6">
              <Text className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                AVERAGE SPEED
              </Text>
              <Text variant="title2" className="text-white">
                450 WPM
              </Text>
              <View className="mt-2 h-1 w-1 rounded-full bg-[#007AFF]" />
            </View>
          </View>

          {/* Settings Sections */}
          <View className="gap-10">
            {/* Reading Preferences */}
            <View>
              <Text className="mb-4 text-[12px] font-medium tracking-[0.2em] text-[#007AFF] uppercase">
                READING PREFERENCES
              </Text>
              <View className="border-t border-[#2C2C2E]">
                <Pressable 
                  onPress={openSheet}
                  className="flex-row items-center justify-between border-b border-[#2C2C2E] py-6 active:opacity-70">
                  <View>
                    <Text variant="body" className="text-white">
                      Default WPM
                    </Text>
                    <Text className="text-[12px] text-muted-foreground">
                      Set your baseline reading pace
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-medium text-[#007AFF]">{wpm}</Text>
                    <Icon name="chevron.right" color="#8b90a0" size={20} />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Account */}
            <View>
              <Text className="mb-4 text-[12px] font-medium tracking-[0.2em] text-[#007AFF] uppercase">
                ACCOUNT
              </Text>
              <View className="border-t border-[#2C2C2E]">
                <Pressable className="flex-row items-center justify-between border-b border-[#2C2C2E] py-6 active:opacity-70">
                  <Text variant="body" className="text-white">
                    Edit Profile
                  </Text>
                  <Icon name="person.circle" color="#8b90a0" size={20} />
                </Pressable>
                <Pressable className="flex-row items-center justify-between border-b border-[#2C2C2E] py-6 active:opacity-70">
                  <Text variant="body" className="text-white">
                    Notifications
                  </Text>
                  <Icon name="bell" color="#8b90a0" size={20} />
                </Pressable>
              </View>
            </View>

            {/* System */}
            <View>
              <Text className="mb-4 text-[12px] font-medium tracking-[0.2em] text-[#007AFF] uppercase">
                SYSTEM
              </Text>
              <View className="border-t border-[#2C2C2E]">
                <Pressable
                  onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                  className="flex-row items-center justify-between border-b border-[#2C2C2E] py-6 active:opacity-70">
                  <View>
                    <Text variant="body" className="text-white">
                      Appearance
                    </Text>
                    <Text className="text-[12px] text-muted-foreground">
                      {colorScheme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled'}
                    </Text>
                  </View>
                  <Icon
                    name={colorScheme === 'dark' ? 'moon.stars' : 'sun.min'}
                    color="#8b90a0"
                    size={20}
                  />
                </Pressable>
                <Pressable className="flex-row items-center justify-between border-b border-[#2C2C2E] py-6 active:opacity-70">
                  <Text variant="body" className="text-white">
                    Help & Support
                  </Text>
                  <Icon name="info.circle" color="#8b90a0" size={20} />
                </Pressable>
              </View>
            </View>

            <Pressable className="mt-4 w-full rounded-lg border border-dashed border-red-500/30 py-6 active:bg-red-500/10 active:opacity-70">
              <Text className="text-center text-[12px] font-medium tracking-widest text-red-500 uppercase">
                LOG OUT
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* WPM Bottom Sheet using reusable Sheet component */}
        <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
          <View className="px-6">
            <View className="mb-8 flex-row items-center justify-between">
              <Text variant="title3" className="text-white">Reading Speed</Text>
              <View className="bg-[#007AFF]/10 px-3 py-1 rounded-full">
                <Text className="text-[#007AFF] font-bold">{localWpm} WPM</Text>
              </View>
            </View>

            <WpmSlider
              initialValue={wpm}
              onChange={handleSliderChange}
            />
            
            <View className="flex-row justify-between mt-4">
              <Text className="text-[10px] text-muted-foreground">100 WPM</Text>
              <Text className="text-[10px] text-muted-foreground">1000 WPM</Text>
            </View>

            <View className="flex-row items-center justify-between gap-4 mt-10">
              <Pressable 
                onPress={() => setIsSheetOpen(false)}
                className="flex-1 bg-[#2C2C2E] py-4 rounded-xl items-center active:opacity-90">
                <Text className="text-white font-bold">Cancel</Text>
              </Pressable>

              <Pressable 
                onPress={applyWpm}
                className="flex-1 bg-[#007AFF] py-4 rounded-xl items-center active:opacity-90">
                <Text className="text-white font-bold">Apply</Text>
              </Pressable>
            </View>
          </View>
        </Sheet>
      </View>
    </>
  );
}
