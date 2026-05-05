import { Stack, Link, useRouter } from 'expo-router';
import * as React from 'react';
import { View, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Sheet } from '@/components/nativewindui/Sheet';
import { ActivityIndicator } from '@/components/nativewindui/ActivityIndicator';
import { useStore } from '@/store/store';
import { extractTextFromPDF } from '@/lib/parsePDF';
import { extractTextFromEPUB } from '@/lib/parseEPUB';
import { useColorScheme } from '@/lib/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

import { AppHeader } from '@/components/AppHeader';

export default function Home() {
  const router = useRouter();
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<string>('All');
  const { books, addBook, updateBook, wpm } = useStore();
  const { colors } = useColorScheme();

  const bgTransparent = colors.background.replace('rgb', 'rgba').replace(')', ', 0)');

  const filteredBooks = books.filter(
    (book) => activeFilter === 'All' || book.type === activeFilter
  );

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

      const newBookId = Math.random().toString(36).substring(7);

      if (isTxt) {
        content = await pickedFile.text();
        const totalWords = content.split(/\s+/).filter(Boolean).length;
        const newBook = {
          id: newBookId,
          title: file.name.replace(/\.[^/.]+$/, ''),
          content: content,
          progress: 0,
          totalWords,
          type: 'document' as const,
          dateAdded: Date.now(),
          status: 'ready' as const,
        };
        addBook(newBook);
        // Automatically navigate to the reader for simple text files since it is fast
        router.push({ pathname: '/reader', params: { bookId: newBook.id } });
      } else if (isPdf || isEpub) {
        const newBook = {
          id: newBookId,
          title: file.name.replace(/\.[^/.]+$/, ''),
          content: '',
          progress: 0,
          totalWords: 1,
          type: 'document' as const,
          dateAdded: Date.now(),
          status: 'processing' as const,
        };
        addBook(newBook);

        // Run extraction asynchronously without awaiting
        (async () => {
          try {
            let extractedContent = '';
            if (isPdf) {
              extractedContent = await extractTextFromPDF(file.uri);
            } else if (isEpub) {
              const buffer = await pickedFile.arrayBuffer();
              extractedContent = await extractTextFromEPUB(buffer);
            }
            const totalWords = extractedContent.split(/\s+/).filter(Boolean).length;
            updateBook(newBookId, { content: extractedContent, status: 'ready', totalWords });
          } catch (error) {
            console.error('Background processing error:', error);
            updateBook(newBookId, { status: 'error' });
          }
        })();
      } else {
        Alert.alert('Error', 'Unsupported file type selection.');
        return;
      }
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
      <View className="flex-1 bg-background">
        <AppHeader
          leftTitleContent={
            <>
              <Icon name="bolt" color={colors.primary} size={24} />
              <Text className="ml-1 font-sans text-lg font-black uppercase tracking-widest text-foreground">
                FOCUS
              </Text>
            </>
          }
          rightContent={
            <Link href="/profile" asChild>
              <Pressable className="h-8 w-8 overflow-hidden rounded-full border border-border bg-secondary active:opacity-70">
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfu7E3u9CZwmWezOlp4vmVaJN4PBUV6wbHhu9wtE32tAYgn4r9udiXcxaloDz-e814V3v2Luk6NOmxbhdPQPdveRCQ-cNsN0ovIM8AxsCMU2ICZi8LGJ9P7uEGlP-353qXXo686p2awEaGP8wg5EdIZdfqIvUWoFbDAYUkB-sjSgFGJVvgKoPf8criRXGZCqXFxe4ETOfTNzFiHTP8RbuBPDmDvqL1AufRxBt5JMwc0oiwH0HoRJMoWhMpD061XqQWC-KrBbf9LKGD',
                  }}
                  className="h-full w-full"
                />
              </Pressable>
            </Link>
          }
        />

        {/* Main Content Area */}
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="flex-1 px-6 pt-8">
          <View className="mb-8">
            <View>
              <Text variant="largeTitle" className="mb-2 text-foreground">
                Library
              </Text>
              <Text variant="body" className="text-muted-foreground">
                Continue where you left off.
              </Text>
            </View>
            <View className="relative -mx-6 mt-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingLeft: 30, paddingRight: 36 }}
                className="flex-row">
                <Pressable
                  onPress={() => setActiveFilter('All')}
                  className={`rounded-full border border-border px-4 py-2 hover:border-primary active:opacity-70 ${activeFilter === 'All' ? 'bg-secondary' : ''}`}>
                  <Text
                    variant="caption1"
                    className={
                      activeFilter === 'All' ? 'text-foreground' : 'text-muted-foreground'
                    }>
                    All
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveFilter('document')}
                  className={`rounded-full border border-border px-4 py-2 hover:border-primary active:opacity-70 ${activeFilter === 'document' ? 'bg-secondary' : ''}`}>
                  <Text
                    variant="caption1"
                    className={
                      activeFilter === 'document' ? 'text-foreground' : 'text-muted-foreground'
                    }>
                    Documents
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveFilter('article')}
                  className={`rounded-full border border-border px-4 py-2 hover:border-primary active:opacity-70 ${activeFilter === 'article' ? 'bg-secondary' : ''}`}>
                  <Text
                    variant="caption1"
                    className={
                      activeFilter === 'article' ? 'text-foreground' : 'text-muted-foreground'
                    }>
                    Web Pages
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveFilter('clipboard')}
                  className={`rounded-full border border-border px-4 py-2 hover:border-primary active:opacity-70 ${activeFilter === 'clipboard' ? 'bg-secondary' : ''}`}>
                  <Text
                    variant="caption1"
                    className={
                      activeFilter === 'clipboard' ? 'text-foreground' : 'text-muted-foreground'
                    }>
                    Clipboard
                  </Text>
                </Pressable>
              </ScrollView>
              <LinearGradient
                pointerEvents="none"
                colors={[colors.background, bgTransparent]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                className="absolute bottom-0 left-0 top-0 w-8"
              />
              <LinearGradient
                pointerEvents="none"
                colors={[bgTransparent, colors.background]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                className="absolute bottom-0 right-0 top-0 w-12"
              />
            </View>
          </View>

          {/* Grid */}
          <View className="flex-col gap-6">
            {filteredBooks.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20 opacity-50">
                <Icon
                  name={'books.vertical' as any}
                  materialIcon={{ name: 'library-books' }}
                  size={48}
                  color={colors.grey}
                />
                <Text variant="body" className="mt-4 text-center text-muted-foreground">
                  Your library is empty.
                </Text>
                <Text variant="caption1" className="mt-1 text-center text-muted-foreground">
                  Tap the + button to add a book or article.
                </Text>
              </View>
            ) : (
              filteredBooks.map((book) => {
                const isProcessing = book.status === 'processing';
                const isError = book.status === 'error';
                const percentage = Math.min(
                  100,
                  (book.progress /
                    (book.totalWords ||
                      Math.max(1, Math.ceil((book.content?.length || 0) / 5.5)))) *
                    100
                );

                const wordsRemaining = Math.max(0, (book.totalWords || 1) - book.progress);
                const minutesRemaining = Math.ceil(wordsRemaining / wpm);
                const timeToRead = minutesRemaining > 0 ? `${minutesRemaining} min read` : 'Done';

                const CardContent = (
                  <Pressable
                    className={`group w-full flex-col justify-between rounded-xl border border-border bg-card p-5 active:opacity-80 ${isProcessing ? 'opacity-50' : ''}`}
                    disabled={isProcessing}>
                    <View className="mb-4 flex-row items-start justify-between">
                      <View className="flex-row items-center gap-2">
                        <Icon
                          name={
                            (book.type === 'document'
                              ? 'doc.fill'
                              : book.type === 'article'
                                ? 'link'
                                : 'clipboard.fill') as any
                          }
                          materialIcon={{
                            name:
                              book.type === 'document'
                                ? 'insert-drive-file'
                                : book.type === 'article'
                                  ? 'public'
                                  : 'content-paste',
                          }}
                          size={16}
                          color={colors.grey}
                        />
                        <Text
                          variant="caption1"
                          className="uppercase tracking-wider text-muted-foreground">
                          {book.type === 'document'
                            ? 'Document'
                            : book.type === 'article'
                              ? 'Web Page'
                              : 'Clipboard'}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        {!isProcessing && !isError && (
                          <View className="rounded-full bg-secondary px-2 py-0.5">
                            <Text className="text-[10px] font-medium text-foreground">
                              {timeToRead}
                            </Text>
                          </View>
                        )}
                        {isProcessing && <ActivityIndicator size="small" />}
                        {isError && (
                          <Icon
                            name={'exclamationmark.triangle.fill' as any}
                            materialIcon={{ name: 'error' }}
                            size={16}
                            color={colors.destructive}
                          />
                        )}
                      </View>
                    </View>
                    <View>
                      <Text variant="title3" className="mb-2 text-foreground" numberOfLines={2}>
                        {book.title}
                      </Text>
                      {book.author && (
                        <Text variant="body" className="mb-6 text-muted-foreground">
                          {book.author}
                        </Text>
                      )}
                    </View>
                    {!isProcessing && !isError && (
                      <View>
                        <View className="mb-1.5 flex-row items-center justify-between">
                          <Text variant="caption2" className="text-muted-foreground">
                            Added{' '}
                            {new Date(book.dateAdded || Date.now()).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Text>
                          <Text variant="caption2" className="font-medium text-primary">
                            {Math.round(percentage)}%
                          </Text>
                        </View>
                        <View className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                          <View className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                        </View>
                      </View>
                    )}
                    {isProcessing && (
                      <View className="mt-4">
                        <Text variant="caption1" className="text-muted-foreground">
                          Processing...
                        </Text>
                      </View>
                    )}
                    {isError && (
                      <View className="mt-4">
                        <Text variant="caption1" className="text-destructive">
                          Failed to process document
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );

                if (isProcessing || isError) {
                  return <React.Fragment key={book.id}>{CardContent}</React.Fragment>;
                }

                return (
                  <Link
                    key={book.id}
                    href={{ pathname: '/reader', params: { bookId: book.id } }}
                    asChild>
                    {CardContent}
                  </Link>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <Pressable
          onPress={() => setIsAddSheetOpen(true)}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 active:scale-95 md:bottom-12 md:right-12">
          <Icon name="plus" color="#FFFFFF" size={28} />
        </Pressable>
      </View>

      <Sheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)}>
        <Text variant="title3" className="mb-6 font-bold text-foreground">
          Add to Library
        </Text>

        <View className="gap-2">
          <Pressable
            onPress={handlePickDocument}
            className="flex-row items-center gap-4 rounded-xl bg-card p-4 active:opacity-70">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Icon
                name={'doc.fill' as any}
                materialIcon={{ name: 'insert-drive-file' }}
                size={20}
                color={colors.primary}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">Document</Text>
              <Text variant="caption1" className="text-muted-foreground">
                PDF, TXT, EPUB
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handlePlaceholderAction('Web Page')}
            className="flex-row items-center gap-4 rounded-xl bg-card p-4 active:opacity-70">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#34C759]/20">
              <Icon
                name={'safari.fill' as any}
                materialIcon={{ name: 'public' }}
                size={20}
                color="#34C759"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">Web Page</Text>
              <Text variant="caption1" className="text-muted-foreground">
                Extract text from an article
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handlePlaceholderAction('Clipboard')}
            className="flex-row items-center gap-4 rounded-xl bg-card p-4 active:opacity-70">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FF9500]/20">
              <Icon
                name="doc.on.clipboard.fill"
                materialIcon={{ name: 'content-paste' }}
                size={20}
                color="#FF9500"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">Clipboard</Text>
              <Text variant="caption1" className="text-muted-foreground">
                Paste text directly
              </Text>
            </View>
          </Pressable>
        </View>
      </Sheet>
    </>
  );
}
