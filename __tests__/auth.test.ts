import * as SecureStore from 'expo-secure-store';
import { saveToken, loadToken, clearToken, saveServerUrl, loadServerUrl, clearAll } from '../lib/auth';
import { __resetStore } from '../__mocks__/expo-secure-store';

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore> & { __resetStore: () => void };

beforeEach(() => {
  jest.clearAllMocks();
  (SecureStore as any).__resetStore();
});

describe('auth storage', () => {
  test('saveToken stores token under orchestra_jwt_token', async () => {
    await saveToken('my-token');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('orchestra_jwt_token', 'my-token');
  });

  test('loadToken retrieves token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('my-token');
    const result = await loadToken();
    expect(result).toBe('my-token');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('orchestra_jwt_token');
  });

  test('loadToken returns null when no token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    const result = await loadToken();
    expect(result).toBeNull();
  });

  test('clearToken deletes token key', async () => {
    await clearToken();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('orchestra_jwt_token');
  });

  test('saveServerUrl stores URL under orchestra_server_url', async () => {
    await saveServerUrl('https://example.com');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('orchestra_server_url', 'https://example.com');
  });

  test('loadServerUrl retrieves server URL', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('https://example.com');
    const result = await loadServerUrl();
    expect(result).toBe('https://example.com');
  });

  test('clearAll deletes both token and server URL', async () => {
    await clearAll();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('orchestra_jwt_token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('orchestra_server_url');
  });
});
