import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      <Pressable style={styles.playingContainer} onPress={togglePlay}>
        <StatusBar hidden />
        <View style={styles.wordContainer}>
            <View style={styles.leftPart}>
              <Text style={styles.wordText}>{orpData.left}</Text>
            </View>
            <View style={styles.orpPart}>
              <Text style={[styles.wordText, styles.orpText]}>{orpData.orp}</Text>
              <View style={styles.orpPip} />
            </View>
            <View style={styles.rightPart}>
              <Text style={styles.wordText}>{orpData.right}</Text>
            </View>
        </View>
      </Pressable>
    );
  }

  // PAUSED STATE
  return (
    <View style={styles.pausedContainer}>
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Absolute Back Button */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Icon name="chevron.left" materialIcon={{ name: 'arrow-back' }} color="#c1c6d7" size={32} />
      </Pressable>

      <View style={styles.mainContent}>
        {/* Left Side: RSVP Text Area */}
        <View style={styles.textArea}>
          <View style={styles.contextContainer}>
            <Text style={styles.contextText}>
                {words.slice(Math.max(0, currentIndex - 5), currentIndex).join(' ')}
            </Text>
          </View>
          
          <View style={styles.pausedWordContainer}>
            {hasPreviousWord && <View style={styles.verticalLineTop} />}
            <View style={styles.verticalLineBottom} />
            <View style={styles.leftPart}>
              <Text style={styles.pausedWordText}>{orpData.left}</Text>
            </View>
            <View style={styles.orpPart}>
              {hasPreviousWord && <View style={styles.orpPipTop} />}
              <Text style={[styles.pausedWordText, styles.orpText]}>{orpData.orp}</Text>
              <View style={styles.orpPipBottom} />
            </View>
            <View style={styles.rightPart}>
              <Text style={styles.pausedWordText}>{orpData.right}</Text>
            </View>
          </View>

          <View style={styles.contextContainer}>
            <Text style={styles.contextText}>
                {words.slice(currentIndex + 1, currentIndex + 6).join(' ')}
            </Text>
          </View>
        </View>

        {/* Right Side: Controls Cluster */}
        <View style={styles.controlsArea}>
          <View style={styles.sliderContainer}>
            <Icon name="timer" materialIcon={{ name: 'speed' }} size={20} color="#8b90a0" />
            <View style={{ flex: 1, marginHorizontal: 16 }}>
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
            <View style={styles.wpmDisplay}>
              <Text style={styles.wpmValue}>{wpm}</Text>
              <Text style={styles.wpmLabel}>WPM</Text>
            </View>
          </View>

          <View style={styles.playbackControls}>
            <Pressable style={styles.secondaryButton} onPress={seekBackward}>
              <Icon name="gobackward.10" materialIcon={{ name: 'replay-10' }} size={28} color="#c1c6d7" />
            </Pressable>
            
            <Pressable style={styles.playButton} onPress={togglePlay}>
              <Icon name="play.fill" materialIcon={{ name: 'play-arrow' }} size={36} color="#002e69" />
            </Pressable>
            
            <Pressable style={styles.secondaryButton} onPress={seekForward}>
              <Icon name="goforward.10" materialIcon={{ name: 'forward-10' }} size={28} color="#c1c6d7" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedContainer: {
    flex: 1,
    backgroundColor: '#131313',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 50,
    padding: 10,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingTop: 16,
    gap: 64,
  },
  textArea: {
    flex: 1,
    maxWidth: 600,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsArea: {
    flex: 1,
    maxWidth: 400,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pausedWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
    position: 'relative',
    paddingVertical: 16,
  },
  verticalLineTop: {
    position: 'absolute',
    top: 0,
    bottom: '50%',
    left: '50%',
    width: 1,
    backgroundColor: '#353535',
    opacity: 0.3,
    marginBottom: 40,
  },
  verticalLineBottom: {
    position: 'absolute',
    top: '50%',
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: '#353535',
    opacity: 0.3,
    marginTop: 40,
  },
  leftPart: {
    flex: 1,
    alignItems: 'flex-end',
  },
  orpPart: {
    alignItems: 'center',
    position: 'relative',
  },
  rightPart: {
    flex: 1,
    alignItems: 'flex-start',
  },
  wordText: {
    color: '#e2e2e2',
    fontSize: 50,
    fontWeight: '700',
  },
  pausedWordText: {
    color: '#adc6ff',
    fontSize: 64,
    fontWeight: '700',
    textShadowColor: 'rgba(173, 198, 255, 0.15)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  orpText: {
    color: '#adc6ff',
  },
  orpPipTop: {
    position: 'absolute',
    top: -24,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#adc6ff',
    shadowColor: 'rgba(173,198,255,0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  orpPipBottom: {
    position: 'absolute',
    bottom: -24,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#adc6ff',
    shadowColor: 'rgba(173,198,255,0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  orpPip: {
    position: 'absolute',
    bottom: -16,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
  contextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    opacity: 0.4,
  },
  contextText: {
    color: '#c1c6d7',
    fontSize: 18,
    lineHeight: 28,
  },
  sliderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  wpmDisplay: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: 48,
  },
  wpmValue: {
    color: '#adc6ff',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  wpmLabel: {
    color: '#8b90a0',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
  },
  secondaryButton: {
    padding: 12,
    borderRadius: 9999,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#adc6ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(173,198,255,0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
});