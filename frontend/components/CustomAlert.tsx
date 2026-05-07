import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { Text } from '@/components/nativewindui/Text';
import { Button } from '@/components/nativewindui/Button';
import { useStore } from '@/store/store';

export function CustomAlert() {
  const { isAlertVisible, alertTitle, alertMessage, alertButtons, hideAlert } = useStore();

  if (!isAlertVisible) return null;

  return (
    <Modal transparent animationType="fade" visible={isAlertVisible} onRequestClose={hideAlert}>
      <Pressable className="flex-1 justify-center items-center bg-black/50 px-6" onPress={hideAlert}>
        <Pressable className="bg-card w-full max-w-sm rounded-2xl p-6 border border-border shadow-lg">
          <Text variant="title3" className="text-foreground font-bold mb-2">
            {alertTitle}
          </Text>
          {alertMessage && (
            <Text variant="body" className="text-muted-foreground mb-6">
              {alertMessage}
            </Text>
          )}
          
          <View className="flex-col gap-3 mt-4 w-full">
            {alertButtons?.map((btn, index) => (
              <Button
                key={index}
                variant={btn.style === 'destructive' ? 'secondary' : (btn.style === 'cancel' ? 'tonal' : 'primary')}
                onPress={() => {
                  hideAlert();
                  if (btn.onPress) btn.onPress();
                }}
                className="w-full"
              >
                <Text className={btn.style === 'destructive' ? 'text-destructive font-bold' : (btn.style === 'cancel' ? 'text-foreground font-bold' : 'text-primary-foreground font-bold')}>
                  {btn.text}
                </Text>
              </Button>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
