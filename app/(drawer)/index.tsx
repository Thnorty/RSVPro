import { Stack, Link, useRouter } from 'expo-router';
import * as React from 'react';
import { View, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Sheet } from '@/components/nativewindui/Sheet';
import { useStore } from '@/store/store';
import { extractTextFromPDF } from '@/lib/parsePDF';
import { extractTextFromEPUB } from '@/lib/parseEPUB';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);
  const { books, addBook } = useStore();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/epub+zip'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setIsAddSheetOpen(false);

      let content = '';

      const pickedFile = new File(file.uri);
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      const isEpub = file.name.toLowerCase().endsWith('.epub');
      const isTxt = file.name.toLowerCase().endsWith('.txt');

      if (isTxt) {
        content = await pickedFile.text();
      } else if (isPdf) {
        Alert.alert('Processing', 'Extracting text from PDF...');
        const buffer = await pickedFile.arrayBuffer();
        content = await extractTextFromPDF(buffer);
      } else if (isEpub) {
        Alert.alert('Processing', 'Extracting text from EPUB...');
        const buffer = await pickedFile.arrayBuffer();
        content = await extractTextFromEPUB(buffer);
      } else {
        Alert.alert('Error', 'Unsupported file type selection.');
        return;
      }

      const newBook = {
        id: Math.random().toString(36).substring(7),
        title: file.name.replace(/\.[^/.]+$/, ""),
        content: content,
        progress: 0,
        type: 'book' as const,
        dateAdded: Date.now(),
      };

      addBook(newBook);
      // Automatically navigate to the reader for the new book
      router.push({ pathname: '/reader', params: { bookId: newBook.id } });
      
    } catch (error) {
      console.error('Error picking document', error);
      Alert.alert('Error', 'Failed to pick or read document');
    }
  };

  const handlePlaceholderAction = (action: string) => {
    setIsAddSheetOpen(false);
    console.log(`Action selected: ${action}, not yet implemented.`);
  };

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
            {books.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20 opacity-50">
                <Icon name={'books.vertical' as any} materialIcon={{ name: 'library-books' }} size={48} color="#8b90a0" />
                <Text variant="body" className="mt-4 text-muted-foreground text-center">
                  Your library is empty.
                </Text>
                <Text variant="caption1" className="text-muted-foreground text-center mt-1">
                  Tap the + button to add a book or article.
                </Text>
              </View>
            ) : (
              books.map((book) => (
                <Link key={book.id} href={{ pathname: '/reader', params: { bookId: book.id } }} asChild>
                  <Pressable className="group min-h-[240px] w-full md:w-[48%] lg:w-[31%] flex-col justify-between rounded-xl border border-[#2C2C2E] bg-[#0e0e0e] p-6 active:opacity-80">
                    <View className="mb-4 flex-row items-start justify-between">
                      <View className="flex-row items-center gap-2">
                        <Icon name={book.type === 'book' ? 'book' : 'doc'} size={16} color="#8b90a0" />
                        <Text variant="caption1" className="tracking-wider text-muted-foreground uppercase">
                          {book.type}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text variant="title3" className="mb-2 text-white" numberOfLines={2}>
                        {book.title}
                      </Text>
                      {book.author && (
                        <Text variant="body" className="mb-6 text-muted-foreground">
                          {book.author}
                        </Text>
                      )}
                    </View>
                    <View className="h-1 w-full overflow-hidden rounded-full bg-[#121212]">
                      <View 
                        className="h-full bg-[#007AFF]" 
                        style={{ width: `${Math.min(100, (book.progress / (book.content.split(/\s+/).length || 1)) * 100)}%` }} 
                      />
                    </View>
                  </Pressable>
                </Link>
              ))
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <Pressable
          onPress={() => setIsAddSheetOpen(true)}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-[#007AFF] shadow-lg shadow-[#007AFF]/30 active:scale-95 md:bottom-12 md:right-12">
          <Icon name="plus" color="#FFFFFF" size={28} />
        </Pressable>
      </View>

      <Sheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)}>
        <View className="px-6 pb-8 pt-2">
          <Text variant="title3" className="mb-6 font-bold text-white">
            Add to Library
          </Text>
          
          <View className="gap-2">
            <Pressable 
              onPress={handlePickDocument}
              className="flex-row items-center gap-4 rounded-xl bg-[#1C1C1E] p-4 active:opacity-70"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#007AFF]/20">
                <Icon name="doc.fill" materialIcon={{ name: 'insert-drive-file' }} size={20} color="#007AFF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">Document</Text>
                <Text variant="caption1" className="text-muted-foreground">PDF, TXT, EPUB</Text>
              </View>
            </Pressable>

            <Pressable 
              onPress={() => handlePlaceholderAction('Web Page')}
              className="flex-row items-center gap-4 rounded-xl bg-[#1C1C1E] p-4 active:opacity-70"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#34C759]/20">
                <Icon name={'safari.fill' as any} materialIcon={{ name: 'public' }} size={20} color="#34C759" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">Web Page</Text>
                <Text variant="caption1" className="text-muted-foreground">Extract text from an article</Text>
              </View>
            </Pressable>

            <Pressable 
              onPress={() => handlePlaceholderAction('Clipboard')}
              className="flex-row items-center gap-4 rounded-xl bg-[#1C1C1E] p-4 active:opacity-70"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FF9500]/20">
                <Icon name="doc.on.clipboard.fill" materialIcon={{ name: 'content-paste' }} size={20} color="#FF9500" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">Clipboard</Text>
                <Text variant="caption1" className="text-muted-foreground">Paste text directly</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Sheet>
    </>
  );
}
