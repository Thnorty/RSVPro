import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import Animated, { FadeIn, FadeOut, LinearTransition, Easing } from 'react-native-reanimated';
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
    right: word.substring(orpIndex + 1)
  };
}

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

  useEffect(() => {
    if (bookId) {
      updateBookProgress(bookId, currentIndex);
    }
  }, [currentIndex, bookId]);

  useEffect(() => {
    // Lock to landscape when opening the reader
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      // Small delay to ensure the OS layout has stabilized in landscape
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

  const togglePlay = () => setIsPlaying(!isPlaying);

  const seekBackward = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 10));
  };

  const seekForward = () => {
    setCurrentIndex((prev) => Math.min(words.length - 1, prev + 10));
  };

  if (!isReady) {
    return <View className="flex-1 bg-black" />;
  }

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
  const hasPreviousWord = currentIndex > 0;

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Absolute Header Info */}
      {!isPlaying && (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} className="absolute left-8 right-8 top-8 z-50 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-2">
            <Icon name="chevron.left" materialIcon={{ name: 'arrow-back' }} color="#c1c6d7" size={32} />
          </Pressable>
          <View className="items-center">
            <Text className="text-xs font-bold uppercase tracking-widest text-[#8b90a0]">{book.type}</Text>
            <Text className="mt-0.5 text-sm font-semibold text-white" numberOfLines={1}>{book.title}</Text>
          </View>
          <View className="w-12" />
        </Animated.View>
      )}

      {isPlaying && (
        <Pressable className="absolute inset-0 z-50" onPress={togglePlay} />
      )}

      <View className={`flex-1 flex-row items-center justify-center ${isPlaying ? 'px-0 pt-0' : 'gap-12 px-10 pt-10'}`}>
        {/* Left Side: RSVP Text Area */}
        <Animated.View layout={LinearTransition.duration(300).easing(Easing.out(Easing.quad))} className={`items-center justify-center ${isPlaying ? 'flex-none w-full' : 'flex-1 max-w-[600px] min-w-[300px]'}`}>
          {!isPlaying && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} className="flex-row flex-wrap justify-center opacity-40">
              <Text className="text-center text-lg leading-7 text-[#c1c6d7]">
                  {words.slice(Math.max(0, currentIndex - 5), currentIndex).join(' ')}
              </Text>
            </Animated.View>
          )}
          
          <View className="relative my-5 w-full flex-row items-center justify-center py-4">
            {!isPlaying && hasPreviousWord && <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute bottom-1/2 left-1/2 top-0 mb-10 w-[1px] bg-[#353535] opacity-30" />}
            {!isPlaying && <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute bottom-0 left-1/2 top-1/2 mt-10 w-[1px] bg-[#353535] opacity-30" />}
            
            <View className="flex-1 items-end">
              <Text className={`font-bold ${isPlaying ? 'text-[50px] text-[#e2e2e2]' : 'text-6xl text-primary'}`} numberOfLines={1}>{orpData.left}</Text>
            </View>
            <View className="relative items-center">
              {!isPlaying && hasPreviousWord && <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute -top-6 h-1.5 w-1.5 rounded-full bg-primary shadow-primary/80 elevation-5" />}
              <Text className={`font-bold text-primary ${isPlaying ? 'text-[50px]' : 'text-6xl'}`} numberOfLines={1}>{orpData.orp}</Text>
              {!isPlaying ? (
                <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute -bottom-6 h-1.5 w-1.5 rounded-full bg-primary shadow-lg shadow-primary/80 elevation-5" />
              ) : (
                <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute -bottom-4 h-1 w-1 rounded-full bg-[#007AFF]" />
              )}
            </View>
            <View className="flex-1 items-start">
              <Text className={`font-bold ${isPlaying ? 'text-[50px] text-[#e2e2e2]' : 'text-6xl text-primary'}`} numberOfLines={1}>{orpData.right}</Text>
            </View>
          </View>

          {!isPlaying && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} className="flex-row flex-wrap justify-center opacity-40">
              <Text className="text-center text-lg leading-7 text-[#c1c6d7]">
                  {words.slice(currentIndex + 1, currentIndex + 6).join(' ')}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Right Side: Controls Cluster */}
        {!isPlaying && (
          <Animated.View layout={LinearTransition.duration(300).easing(Easing.out(Easing.quad))} entering={FadeIn.delay(150).duration(200)} exiting={FadeOut.duration(200)} className="w-[350px] flex-none items-center justify-center gap-10">
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
                <Text className="text-[9px] font-medium uppercase tracking-wider text-[#8b90a0]">WPM</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center gap-12">
              <Pressable className="rounded-full p-3" onPress={seekBackward}>
                <Icon name={'gobackward.10' as any} materialIcon={{ name: 'replay-10' }} size={28} color="#c1c6d7" />
              </Pressable>
              
              <Pressable 
                className="h-20 w-20 items-center justify-center rounded-full bg-primary" 
                style={{ shadowColor: 'rgba(173,198,255,0.3)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 10 }}
                onPress={togglePlay}
              >
                <Icon name="play.fill" materialIcon={{ name: 'play-arrow' }} size={36} color="#002e69" />
              </Pressable>
              
              <Pressable className="rounded-full p-3" onPress={seekForward}>
                <Icon name={'goforward.10' as any} materialIcon={{ name: 'forward-10' }} size={28} color="#c1c6d7" />
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}