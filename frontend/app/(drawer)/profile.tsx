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
import { COLORS } from '@/theme/colors';

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
  const { colorScheme, setColorScheme, colors } = useColorScheme();
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
      <View className="flex-1 bg-background">
        <AppHeader
          title="Profile"
          showBack={true}
          rightContent={
            <TouchableOpacity className="active:scale-95 active:opacity-70">
              <Icon name="ellipsis" color={colors.primary} size={24} />
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
                className="h-24 w-24 rounded-full border-2 border-border"
              />
              <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary">
                <Icon name="pencil" color="white" size={12} />
              </View>
            </View>
            <Text variant="title1" className="mt-4 mb-1 text-foreground">
              Julian Thorne
            </Text>
            <Text variant="body" className="text-muted-foreground">
              j.thorne@performance.lab
            </Text>
          </View>

          {/* Statistics Grid */}
          <View className="mb-12 flex-col gap-4 md:flex-row">
            <View className="flex-1 items-center justify-center rounded-lg border border-border bg-card p-6">
              <Text className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                TOTAL WORDS READ
              </Text>
              <Text variant="title2" className="text-foreground">
                1.2M
              </Text>
              <View className="mt-2 h-1 w-1 rounded-full bg-primary" />
            </View>
            <View className="flex-1 items-center justify-center rounded-lg border border-border bg-card p-6">
              <Text className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                READING STREAK
              </Text>
              <Text variant="title2" className="text-foreground">
                42 Days
              </Text>
              <View className="mt-2 h-1 w-1 rounded-full bg-primary" />
            </View>
            <View className="flex-1 items-center justify-center rounded-lg border border-border bg-card p-6">
              <Text className="mb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                AVERAGE SPEED
              </Text>
              <Text variant="title2" className="text-foreground">
                450 WPM
              </Text>
              <View className="mt-2 h-1 w-1 rounded-full bg-primary" />
            </View>
          </View>

          {/* Settings Sections */}
          <View className="gap-10">
            {/* Reading Preferences */}
            <View>
              <Text className="mb-4 text-[12px] font-medium tracking-[0.2em] text-primary uppercase">
                READING PREFERENCES
              </Text>
              <View className="border-t border-border">
                <Pressable 
                  onPress={openSheet}
                  className="flex-row items-center justify-between border-b border-border py-6 active:opacity-70">
                  <View>
                    <Text variant="body" className="text-foreground">
                      Default WPM
                    </Text>
                    <Text className="text-[12px] text-muted-foreground">
                      Set your baseline reading pace
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-medium text-primary">{wpm}</Text>
                    <Icon name="chevron.right" color={colors.grey} size={20} />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Account */}
            <View>
              <Text className="mb-4 text-[12px] font-medium tracking-[0.2em] text-primary uppercase">
                ACCOUNT
              </Text>
              <View className="border-t border-border">
                <Pressable className="flex-row items-center justify-between border-b border-border py-6 active:opacity-70">
                  <Text variant="body" className="text-foreground">
                    Edit Profile
                  </Text>
                  <Icon name="person.circle" color={colors.grey} size={20} />
                </Pressable>
                <Pressable className="flex-row items-center justify-between border-b border-border py-6 active:opacity-70">
                  <Text variant="body" className="text-foreground">
                    Notifications
                  </Text>
                  <Icon name="bell" color={colors.grey} size={20} />
                </Pressable>
              </View>
            </View>

            {/* System */}
            <View>
              <Text className="mb-4 text-[12px] font-medium tracking-[0.2em] text-primary uppercase">
                SYSTEM
              </Text>
              <View className="border-t border-border">
                <Pressable
                  onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                  className="flex-row items-center justify-between border-b border-border py-6 active:opacity-70">
                  <View>
                    <Text variant="body" className="text-foreground">
                      Appearance
                    </Text>
                    <Text className="text-[12px] text-muted-foreground">
                      {colorScheme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled'}
                    </Text>
                  </View>
                  <Icon
                    name={colorScheme === 'dark' ? 'moon.stars' : 'sun.min'}
                    color={colors.grey}
                    size={20}
                  />
                </Pressable>
                <Pressable className="flex-row items-center justify-between border-b border-border py-6 active:opacity-70">
                  <Text variant="body" className="text-foreground">
                    Help & Support
                  </Text>
                  <Icon name="info.circle" color={colors.grey} size={20} />
                </Pressable>
              </View>
            </View>

            <Pressable className="mt-4 w-full rounded-lg border border-dashed border-destructive/30 py-6 active:bg-destructive/10 active:opacity-70">
              <Text className="text-center text-[12px] font-medium tracking-widest text-destructive uppercase">
                LOG OUT
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* WPM Bottom Sheet using reusable Sheet component */}
        <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
          <View className="mb-8 flex-row items-center justify-between">
            <Text variant="title3" className="text-foreground">Reading Speed</Text>
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-primary font-bold">{localWpm} WPM</Text>
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
              className="flex-1 bg-secondary py-4 rounded-xl items-center active:opacity-90">
              <Text className="text-foreground font-bold">Cancel</Text>
            </Pressable>

            <Pressable 
              onPress={applyWpm}
              className="flex-1 bg-primary py-4 rounded-xl items-center active:opacity-90">
              <Text className="text-primary-foreground font-bold">Apply</Text>
            </Pressable>
          </View>
        </Sheet>
      </View>
    </>
  );
}
