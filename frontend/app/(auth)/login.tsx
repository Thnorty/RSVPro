import React, { useState, useRef } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Link, useRouter } from 'expo-router';
import { useStore } from '@/store/store';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    let loginEmail = identifier.trim();

    // If it doesn't look like an email, assume it's a username and fetch the associated email
    if (!loginEmail.includes('@')) {
      const { data, error: rpcError } = await supabase.rpc('get_email_by_username', {
        p_username: loginEmail,
      });

      if (rpcError || !data) {
        useStore.getState().showAlert('Login Failed', 'Username not found.');
        setLoading(false);
        return;
      }
      loginEmail = data as string;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (error) useStore.getState().showAlert('Login Failed', error.message);
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <View className="mb-10 items-center">
          <Text variant="title1" className="text-foreground text-4xl font-bold mb-2">RSVPro</Text>
          <Text variant="body" className="text-muted-foreground text-center">
            Sign in to access your reading stats and settings
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium mb-1 text-foreground">Email or Username</Text>
            <TextInput
              onChangeText={(text) => setIdentifier(text)}
              value={identifier}
              placeholder="Email or username"
              autoCapitalize="none"
              keyboardType="email-address"
              className="h-12 border border-border rounded-lg px-4 bg-card text-foreground"
              placeholderTextColor="#888"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
            />
          </View>
          <View>
            <Text className="text-sm font-medium mb-1 text-foreground">Password</Text>
            <TextInput
              ref={passwordRef}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize="none"
              className="h-12 border border-border rounded-lg px-4 bg-card text-foreground"
              placeholderTextColor="#888"
              returnKeyType="done"
              onSubmitEditing={() => signInWithEmail()}
            />
          </View>

          <Button 
            onPress={() => signInWithEmail()} 
            disabled={loading}
            className="mt-4"
            size="lg"
          >
            <Text className="text-primary-foreground font-bold">
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Button>

          <View className="flex-row justify-center mt-4">
            <Text className="text-muted-foreground">Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}