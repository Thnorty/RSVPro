import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Icon } from '@/components/nativewindui/Icon';
import { Slider } from '@/components/nativewindui/Slider';
import { useStore } from '@/store/store';

const MOCK_TEXT = `It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.`;

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
  const bookId = 'mock-book-1'; // Mock ID until we have real book routing
  const words = useMemo(() => MOCK_TEXT.split(/\s+/), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const defaultWpm = useStore((state) => state.wpm);
  const bookWpms = useStore((state) => state.bookWpms);
  const setBookWpm = useStore((state) => state.setBookWpm);
  
  const [wpm, setWpm] = useState(bookWpms[bookId] ?? defaultWpm);

  useEffect(() => {
    // Lock to landscape when opening the reader
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Revert to portrait (or unlock) when leaving
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
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

  const currentWord = words[currentIndex] || '';
  const orpData = getORP(currentWord);
  const hasPreviousWord = currentIndex > 0;

  // PLAYING STATE
  if (isPlaying) {
    return (
      <Pressable className="flex-1 items-center justify-center bg-black" onPress={togglePlay}>
        <StatusBar hidden />
        <View className="flex-row w-full items-center justify-center">
            <View className="flex-1 items-end">
              <Text className="text-[50px] font-bold text-[#e2e2e2]">{orpData.left}</Text>
            </View>
            <View className="relative items-center">
              <Text className="text-[50px] font-bold text-primary">{orpData.orp}</Text>
              <View className="absolute -bottom-4 h-1 w-1 rounded-full bg-[#007AFF]" />
            </View>
            <View className="flex-1 items-start">
              <Text className="text-[50px] font-bold text-[#e2e2e2]">{orpData.right}</Text>
            </View>
        </View>
      </Pressable>
    );
  }

  // PAUSED STATE
  return (
    <View className="flex-1 bg-[#131313]">
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Absolute Back Button */}
      <Pressable onPress={() => router.back()} className="absolute left-6 top-6 z-50 p-2.5">
        <Icon name="chevron.left" materialIcon={{ name: 'arrow-back' }} color="#c1c6d7" size={32} />
      </Pressable>

      <View className="flex-1 flex-row items-center justify-center gap-16 px-12 pt-4">
        {/* Left Side: RSVP Text Area */}
        <View className="flex-1 max-w-[600px] flex-col items-center justify-center">
          <View className="flex-row flex-wrap justify-center opacity-40">
            <Text className="text-lg leading-[28px] text-[#c1c6d7]">
                {words.slice(Math.max(0, currentIndex - 5), currentIndex).join(' ')}
            </Text>
          </View>
          
          <View className="relative my-5 flex-row w-full items-center justify-center py-4">
            {hasPreviousWord && <View className="absolute bottom-1/2 left-1/2 top-0 mb-10 w-[1px] bg-[#353535] opacity-30" />}
            <View className="absolute bottom-0 left-1/2 top-1/2 mt-10 w-[1px] bg-[#353535] opacity-30" />
            <View className="flex-1 items-end">
              <Text className="text-[64px] font-bold text-primary" style={{ textShadowColor: 'rgba(173, 198, 255, 0.15)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 40 }}>{orpData.left}</Text>
            </View>
            <View className="relative items-center">
              {hasPreviousWord && (
                <View 
                  className="absolute -top-6 h-1.5 w-1.5 rounded-full bg-primary" 
                  style={{ shadowColor: 'rgba(173,198,255,0.8)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 5 }} 
                />
              )}
              <Text className="text-[64px] font-bold text-primary" style={{ textShadowColor: 'rgba(173, 198, 255, 0.15)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 40 }}>{orpData.orp}</Text>
              <View 
                className="absolute -bottom-6 h-1.5 w-1.5 rounded-full bg-primary" 
                style={{ shadowColor: 'rgba(173,198,255,0.8)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 5 }} 
              />
            </View>
            <View className="flex-1 items-start">
              <Text className="text-[64px] font-bold text-primary" style={{ textShadowColor: 'rgba(173, 198, 255, 0.15)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 40 }}>{orpData.right}</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-center opacity-40">
            <Text className="text-lg leading-[28px] text-[#c1c6d7]">
                {words.slice(currentIndex + 1, currentIndex + 6).join(' ')}
            </Text>
          </View>
        </View>

        {/* Right Side: Controls Cluster */}
        <View className="flex-1 max-w-[400px] flex-col items-center justify-center gap-10">
          <View className="flex-row w-full items-center">
            <Icon name="timer" materialIcon={{ name: 'speed' }} size={20} color="#8b90a0" />
            <View className="mx-4 flex-1">
              <Slider
                value={wpm}
                onValueChange={(newWpm) => {
                  setWpm(newWpm);
                  setBookWpm(bookId, newWpm);
                }}
                minimumValue={100}
                maximumValue={1000}
                step={10}
              />
            </View>
            <View className="min-w-[48px] flex-col items-end">
              <Text className="text-xs font-medium tracking-[0.6px] text-primary">{wpm}</Text>
              <Text className="text-[9px] font-medium tracking-[0.6px] text-[#8b90a0]">WPM</Text>
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
        </View>
      </View>
    </View>
  );
}