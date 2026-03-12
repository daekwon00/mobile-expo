import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth-context';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !name.trim() || !email.trim()) {
      Alert.alert('알림', '모든 항목을 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        username: username.trim(),
        password,
        name: name.trim(),
        email: email.trim(),
      });
    } catch (error) {
      Alert.alert('회원가입 실패', error instanceof Error ? error.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-8 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* 헤더 */}
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            회원가입
          </Text>
          <Text className="mt-2 text-base text-gray-500 dark:text-gray-400">
            새 계정을 만들어보세요
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
              이름
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="이름을 입력하세요"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              이메일
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="이메일을 입력하세요"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
              returnKeyType="next"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              비밀번호 확인
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="비밀번호를 다시 입력하세요"
              placeholderTextColor="#9ca3af"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>
        </View>

        {/* 회원가입 버튼 */}
        <Pressable
          className="mt-6 items-center rounded-lg bg-blue-600 py-3.5 active:bg-blue-700"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">회원가입</Text>
          )}
        </Pressable>

        {/* 로그인 링크 */}
        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                로그인
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
