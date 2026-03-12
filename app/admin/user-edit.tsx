import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { api } from '@/lib/api';
import type { AdminUser } from '@/types';

export default function UserEditScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<AdminUser>(`/api/v1/admin/users/${userId}`);
        const u = res.data;
        setUser(u);
        setName(u.name);
        setEmail(u.email);
        setPhone(u.phone ?? '');
        setRole(u.role);
        setDepartment(u.department ?? '');
        setPosition(u.position ?? '');
      } catch {
        Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('알림', '이름과 이메일은 필수입니다.');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/api/v1/admin/users/${userId}`, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        role,
        department: department.trim() || undefined,
        position: position.trim() || undefined,
      });
      Alert.alert('완료', '사용자 정보가 수정되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '사용자 수정',
          headerRight: () => (
            <Pressable onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="text-sm font-semibold text-blue-600">저장</Text>
              )}
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* 사용자 정보 헤더 */}
          <View className="items-center bg-white px-4 py-5 dark:bg-gray-800">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Text className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                {user?.name.charAt(0)}
              </Text>
            </View>
            <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              @{user?.username} · 가입일 {user?.createdAt ? formatDate(user.createdAt) : '-'}
            </Text>
          </View>

          {/* 수정 폼 */}
          <View className="mt-4">
            <Text className="px-4 pb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              기본 정보
            </Text>
            <View className="bg-white dark:bg-gray-800">
              <FormRow label="이름" value={name} onChangeText={setName} />
              <FormRow label="이메일" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <FormRow label="전화번호" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <FormRow label="부서" value={department} onChangeText={setDepartment} />
              <FormRow label="직급" value={position} onChangeText={setPosition} isLast />
            </View>
          </View>

          {/* 권한 */}
          <View className="mt-4">
            <Text className="px-4 pb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              권한
            </Text>
            <View className="flex-row gap-3 bg-white px-4 py-3 dark:bg-gray-800">
              <Pressable
                className={`flex-1 items-center rounded-lg py-2.5 ${
                  role === 'ROLE_USER' ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-700'
                }`}
                onPress={() => setRole('ROLE_USER')}
              >
                <Text className={`text-sm font-medium ${
                  role === 'ROLE_USER' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  일반 사용자
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 items-center rounded-lg py-2.5 ${
                  role === 'ROLE_ADMIN' ? 'bg-red-600' : 'bg-gray-100 dark:bg-gray-700'
                }`}
                onPress={() => setRole('ROLE_ADMIN')}
              >
                <Text className={`text-sm font-medium ${
                  role === 'ROLE_ADMIN' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  관리자
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function FormRow({ label, value, onChangeText, keyboardType, isLast = false }: {
  label: string; value: string; onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad'; isLast?: boolean;
}) {
  return (
    <View className={`flex-row items-center px-4 py-3 ${
      !isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''
    }`}>
      <Text className="w-20 text-sm text-gray-500 dark:text-gray-400">{label}</Text>
      <TextInput
        className="flex-1 text-sm text-gray-900 dark:text-white"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}
