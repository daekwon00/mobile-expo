import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await signIn(username.trim(), password);
    } catch (error) {
      Alert.alert('로그인 실패', error instanceof Error ? error.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-8">
        {/* 헤더 */}
        <View className="mb-10 items-center">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            YDK Lab
          </Text>
          <Text className="mt-2 text-base text-gray-500 dark:text-gray-400">
            모바일 포털에 로그인하세요
          </Text>
        </View>

        {/* 입력 폼 */}
        <View className="gap-4">
          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              아이디
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="아이디를 입력하세요"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              비밀번호
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>
        </View>

        {/* 로그인 버튼 */}
        <Pressable
          className="mt-6 items-center rounded-lg bg-blue-600 py-3.5 active:bg-blue-700"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">로그인</Text>
          )}
        </Pressable>

        {/* 회원가입 링크 */}
        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            계정이 없으신가요?{' '}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                회원가입
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
