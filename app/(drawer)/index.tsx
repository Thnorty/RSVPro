import { Stack, Link } from 'expo-router';
import * as React from 'react';
import { View, Image, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-black">
        {/* Header - Assuming it acts like the HTML top app bar */}
        <View
          style={{ paddingTop: insets.top }}
          className="flex-row items-center justify-between border-b border-[#2C2C2E] bg-black px-6 pb-4">
          <View className="flex-row items-center gap-2">
            <Icon name="bolt" color="#007AFF" size={24} />
            <Text className="font-sans text-lg font-black tracking-widest text-white uppercase">
              FOCUS
            </Text>
          </View>
          <Link href="/profile" asChild>
            <Pressable
              className="h-8 w-8 overflow-hidden rounded-full border border-[#2C2C2E] bg-surface-variant active:opacity-70">
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfu7E3u9CZwmWezOlp4vmVaJN4PBUV6wbHhu9wtE32tAYgn4r9udiXcxaloDz-e814V3v2Luk6NOmxbhdPQPdveRCQ-cNsN0ovIM8AxsCMU2ICZi8LGJ9P7uEGlP-353qXXo686p2awEaGP8wg5EdIZdfqIvUWoFbDAYUkB-sjSgFGJVvgKoPf8criRXGZCqXFxe4ETOfTNzFiHTP8RbuBPDmDvqL1AufRxBt5JMwc0oiwH0HoRJMoWhMpD061XqQWC-KrBbf9LKGD',
                }}
                className="h-full w-full"
              />
            </Pressable>
          </Link>
        </View>

        {/* Main Content Area */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          className="flex-1 px-6 pt-8 md:px-16">
          <View className="mb-8 flex-row items-end justify-between">
            <View>
              <Text variant="largeTitle" className="mb-2 text-white">
                Library
              </Text>
              <Text variant="body" className="text-muted-foreground">
                Continue where you left off.
              </Text>
            </View>
            <View className="hidden flex-row gap-2 md:flex">
              <Pressable className="rounded-full border border-[#2C2C2E] px-4 py-2 hover:border-primary active:opacity-70">
                <Text variant="caption1" className="text-white">
                  All
                </Text>
              </Pressable>
              <Pressable className="rounded-full border border-[#2C2C2E] px-4 py-2 hover:border-primary active:opacity-70">
                <Text variant="caption1" className="text-muted-foreground">
                  Books
                </Text>
              </Pressable>
              <Pressable className="rounded-full border border-[#2C2C2E] px-4 py-2 hover:border-primary active:opacity-70">
                <Text variant="caption1" className="text-muted-foreground">
                  Articles
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Grid */}
          <View className="flex-col gap-6 md:flex-row md:flex-wrap">
            {/* Card 1 */}
            <Pressable className="group min-h-[240px] flex-1 justify-between rounded-xl border border-[#2C2C2E] bg-[#0e0e0e] p-6 md:min-w-[60%] active:opacity-80">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon name="book" size={16} color="#8b90a0" />
                  <Text variant="caption1" className="tracking-wider text-muted-foreground">
                    BOOK
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 rounded-full border border-[#2C2C2E] bg-[#121212] px-3 py-1">
                  <View className="h-1.5 w-1.5 rounded-full bg-[#007AFF]" />
                  <Text variant="caption1" className="text-white">
                    12 min left
                  </Text>
                </View>
              </View>
              <View>
                <Text variant="title2" className="mb-2 text-white">
                  The Design of Everyday Things
                </Text>
                <Text variant="body" className="mb-6 text-muted-foreground">
                  Don Norman
                </Text>
              </View>
              <View className="h-1 w-full overflow-hidden rounded-full bg-[#121212]">
                <View className="h-full w-[65%] rounded-full bg-[#007AFF]" />
              </View>
            </Pressable>

            {/* Card 2 */}
            <Pressable className="group min-h-[240px] flex-1 justify-between rounded-xl border border-[#2C2C2E] bg-[#0e0e0e] p-6 active:opacity-80">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon name="doc" size={16} color="#8b90a0" />
                  <Text variant="caption1" className="tracking-wider text-muted-foreground">
                    ARTICLE
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 rounded-full border border-[#2C2C2E] bg-[#121212] px-3 py-1">
                  <Text variant="caption1" className="text-muted-foreground">
                    5 min read
                  </Text>
                </View>
              </View>
              <View>
                <Text variant="heading" className="mb-2 text-white">
                  Why we need to rethink the modern web architecture
                </Text>
                <Text variant="caption1" className="mb-6 text-muted-foreground">
                  Medium • Saved yesterday
                </Text>
              </View>
              <View className="h-1 w-full overflow-hidden rounded-full bg-[#121212]">
                <View className="h-full w-[10%] rounded-full bg-[#007AFF] opacity-50" />
              </View>
            </Pressable>

            {/* Card 3 */}
            <Pressable className="group min-h-[240px] flex-1 justify-between rounded-xl border border-[#2C2C2E] bg-[#0e0e0e] p-6 active:opacity-80">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon name="doc.on.doc" size={16} color="#8b90a0" />
                  <Text variant="caption1" className="tracking-wider text-muted-foreground">
                    PASTED TEXT
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 rounded-full border border-[#2C2C2E] bg-[#121212] px-3 py-1">
                  <Text variant="caption1" className="text-muted-foreground">
                    2 min read
                  </Text>
                </View>
              </View>
              <View>
                <Text variant="heading" className="mb-2 text-white">
                  Meeting Notes: Q3 Strategy Alignment
                </Text>
                <Text variant="caption1" className="mb-6 text-muted-foreground">
                  Pasted 2 hours ago
                </Text>
              </View>
              <View className="h-1 w-full overflow-hidden rounded-full bg-[#121212]">
                <View className="h-full w-[0%] rounded-full bg-[#007AFF]" />
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <Pressable
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-[#007AFF] shadow-lg shadow-[#007AFF]/30 active:scale-95 md:bottom-12 md:right-12">
          <Icon name="plus" color="#FFFFFF" size={28} />
        </Pressable>
      </View>
    </>
  );
}
