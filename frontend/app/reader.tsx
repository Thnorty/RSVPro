import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  interpolate,
  Easing as REasing,
} from 'react-native-reanimated';
import { Icon } from '@/components/nativewindui/Icon';
import { Slider } from '@/components/nativewindui/Slider';
import { useStore } from '@/store/store';

function getORP(word: string) {
  const length = word.length;
  let orpIndex = 0;
  if (length === 1) orpIndex = 0;
  else if (length <= 5) orpIndex = 1;
  else if (length <= 9) orpIndex = 2;
  else if (length <= 13) orpIndex = 3;
  else orpIndex = 4;
  return {
    left: word.substring(0, orpIndex),
    orp: word.substring(orpIndex, orpIndex + 1),
    right: word.substring(orpIndex + 1),
  };
}

const DURATION = 350;
const EASING = REasing.out(REasing.quad);

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [isReady, setIsReady] = useState(false);
  const books = useStore((state) => state.books);
  const updateBookProgress = useStore((state) => state.updateBookProgress);
  const book = books.find((b) => b.id === bookId);

  const words = useMemo(() => {
    if (!book) return [];
    return book.content.split(/\s+/).filter((w) => w.length > 0);
  }, [book]);

  const [currentIndex, setCurrentIndex] = useState(book?.progress ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultWpm = useStore((state) => state.wpm);
  const bookWpms = useStore((state) => state.bookWpms);
  const setBookWpm = useStore((state) => state.setBookWpm);
  const [wpm, setWpm] = useState(bookId ? (bookWpms[bookId] ?? defaultWpm) : defaultWpm);

  // 0 = playing, 1 = paused — single source of truth for all animations
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isPlaying ? 0 : 1, { duration: DURATION, easing: EASING });
  }, [isPlaying]);

  useEffect(() => {
    if (bookId) updateBookProgress(bookId, currentIndex);
  }, [currentIndex, bookId]);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setTimeout(() => setIsReady(true), 50);
    };
    lockOrientation();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (isPlaying && words.length > 0) {
      const msPerWord = 60000 / wpm;
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, msPerWord);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, wpm, words.length]);

  // Word container: slides between center and left panel
  const wordAreaStyle = useAnimatedStyle(() => ({
    left: interpolate(progress.value, [0, 1], [0, 40]),
    right: interpolate(progress.value, [0, 1], [0, 430]),
  }));

  // Non-ORP text: color + font size animated
  const wordPartStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#e2e2e2', '#5B8BFF']),
    fontSize: interpolate(progress.value, [0, 1], [50, 60]),
  }));

  // ORP character: font size only (color stays primary)
  const orpStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(progress.value, [0, 1], [50, 60]),
  }));

  // Dot: fades out in first half of pause transition, slides with word container
  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 1], [1, 0, 0]),
  }));

  // Context text: fades in when pausing
  const contextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.4]),
    pointerEvents: progress.value > 0.1 ? 'none' : 'none',
  }));

  // Controls panel: fades in when pausing (with slight delay feel via curve)
  const controlsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0, 1]),
    pointerEvents: progress.value > 0.5 ? 'box-none' : 'none',
  }));

  // Header: fades in when pausing
  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0, 1]),
    pointerEvents: progress.value > 0.5 ? 'box-none' : 'none',
  }));

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const seekBackward = () => setCurrentIndex((prev) => Math.max(0, prev - 10));
  const seekForward = () => setCurrentIndex((prev) => Math.min(words.length - 1, prev + 10));

  if (!isReady) return <View className="flex-1 bg-black" />;

  if (!book) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Book not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4 rounded-lg bg-primary px-4 py-2">
          <Text className="text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (book.status === 'processing') {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Processing book...</Text>
        <Pressable onPress={() => router.back()} className="mt-4 rounded-lg bg-primary px-4 py-2">
          <Text className="text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const currentWord = words[currentIndex] || '';
  const orpData = getORP(currentWord);

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />

      <Pressable style={StyleSheet.absoluteFillObject} onPress={togglePlay} />

      {/* Header — always mounted, opacity animated */}
      <Animated.View
        style={[
          headerStyle,
          {
            position: 'absolute',
            left: 32,
            right: 32,
            top: 32,
            zIndex: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}>
        <Pressable onPress={() => router.back()} className="p-2">
          <Icon
            name="chevron.left"
            materialIcon={{ name: 'arrow-back' }}
            color="#c1c6d7"
            size={32}
          />
        </Pressable>
        <View className="items-center">
          <Text className="text-xs font-bold uppercase tracking-widest text-[#8b90a0]">
            {book.type}
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-white" numberOfLines={1}>
            {book.title}
          </Text>
        </View>
        <View className="w-12" />
      </Animated.View>

      <View className="flex-1 overflow-hidden" pointerEvents="box-none">
        {/* Context text ABOVE — always mounted, opacity animated */}
        <Animated.View
          pointerEvents="none"
          style={[
            contextStyle,
            {
              position: 'absolute',
              left: 40,
              right: 430,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <View
            style={{ position: 'absolute', bottom: '50%', marginBottom: 80, paddingHorizontal: 8 }}>
            <Text className="text-center text-lg leading-7 text-[#c1c6d7]">
              {words.slice(Math.max(0, currentIndex - 5), currentIndex).join(' ')}
            </Text>
          </View>
        </Animated.View>

        {/* Context text BELOW — always mounted, opacity animated */}
        <Animated.View
          pointerEvents="none"
          style={[
            contextStyle,
            {
              position: 'absolute',
              left: 40,
              right: 430,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <View style={{ position: 'absolute', top: '50%', marginTop: 80, paddingHorizontal: 8 }}>
            <Text className="text-center text-lg leading-7 text-[#c1c6d7]">
              {words.slice(currentIndex + 1, currentIndex + 6).join(' ')}
            </Text>
          </View>
        </Animated.View>

        {/* Word container — slides, always mounted */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            wordAreaStyle,
            { alignItems: 'center', justifyContent: 'center' },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              paddingVertical: 16,
            }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Animated.Text style={[wordPartStyle, { fontWeight: 'bold' }]} numberOfLines={1}>
                {orpData.left}
              </Animated.Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Animated.Text
                style={[orpStyle, { fontWeight: 'bold', color: '#5B8BFF' }]}
                numberOfLines={1}>
                {orpData.orp}
              </Animated.Text>
              <Animated.View
                style={[
                  dotStyle,
                  {
                    position: 'absolute',
                    bottom: -16,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#007AFF',
                  },
                ]}
              />
            </View>

            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Animated.Text style={[wordPartStyle, { fontWeight: 'bold' }]} numberOfLines={1}>
                {orpData.right}
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

        {/* Controls — always mounted, opacity animated */}
        <Animated.View
          style={[
            controlsStyle,
            {
              position: 'absolute',
              bottom: 0,
              right: 40,
              top: 0,
              width: 350,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 40,
            },
          ]}>
          <View className="w-full flex-row items-center">
            <Icon name="timer" materialIcon={{ name: 'speed' }} size={20} color="#8b90a0" />
            <View className="mx-4 flex-1">
              <Slider
                value={wpm}
                onValueChange={(newWpm) => {
                  setWpm(newWpm);
                  if (bookId) setBookWpm(bookId, newWpm);
                }}
                minimumValue={100}
                maximumValue={1000}
                step={10}
              />
            </View>
            <View className="min-w-[48px] flex-col items-end">
              <Text className="text-xs font-medium tracking-wider text-primary">{wpm}</Text>
              <Text className="text-[9px] font-medium uppercase tracking-wider text-[#8b90a0]">
                WPM
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-12">
            <Pressable className="rounded-full p-3" onPress={seekBackward}>
              <Icon
                name={'gobackward.10' as any}
                materialIcon={{ name: 'replay-10' }}
                size={28}
                color="#c1c6d7"
              />
            </Pressable>
            <Pressable
              className="h-20 w-20 items-center justify-center rounded-full bg-primary"
              style={{
                shadowColor: 'rgba(173,198,255,0.3)',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 30,
                elevation: 10,
              }}
              onPress={togglePlay}>
              <Icon
                name="play.fill"
                materialIcon={{ name: 'play-arrow' }}
                size={36}
                color="#002e69"
              />
            </Pressable>
            <Pressable className="rounded-full p-3" onPress={seekForward}>
              <Icon
                name={'goforward.10' as any}
                materialIcon={{ name: 'forward-10' }}
                size={28}
                color="#c1c6d7"
              />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
