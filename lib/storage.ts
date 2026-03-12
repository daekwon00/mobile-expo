import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * 토큰 저장소
 * - 네이티브: expo-secure-store (Keychain/Keystore)
 * - 웹: localStorage (SecureStore 미지원)
 */
async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const tokenStorage = {
  async getAccessToken() {
    return getItem(TOKEN_KEY);
  },

  async getRefreshToken() {
    return getItem(REFRESH_TOKEN_KEY);
  },

  async setTokens(accessToken: string, refreshToken: string) {
    await setItem(TOKEN_KEY, accessToken);
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  async clearTokens() {
    await deleteItem(TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
  },
};
