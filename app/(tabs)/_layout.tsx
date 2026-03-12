import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/lib/auth-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '대시보드',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: '게시판',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'list.bullet.rectangle', android: 'list', web: 'list' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: '관리',
          href: isAdmin ? '/(tabs)/admin' : null,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
