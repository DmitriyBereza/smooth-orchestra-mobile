import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import * as SecureStore from 'expo-secure-store';
import * as api from '../lib/api';

jest.mock('../lib/api', () => ({
  configure: jest.fn(),
  setOnUnauthorized: jest.fn(),
  post: jest.fn(),
  get: jest.fn(),
  ApiError: class MockApiError extends Error {
    status: number;
    constructor(mockStatus: number, message: string) {
      super(message);
      this.status = mockStatus;
    }
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  router: { replace: jest.fn() },
}));

const TestConsumer = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <>
      <Text testID="loading">{isLoading ? 'loading' : 'done'}</Text>
      <Text testID="auth">{isAuthenticated ? 'authed' : 'not-authed'}</Text>
    </>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  (SecureStore as any).__resetStore();
});

describe('AuthContext', () => {
  test('starts loading, then not authenticated when no stored token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Initially loading
    // Wait for async init to complete
    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('done');
    });

    expect(getByTestId('auth').props.children).toBe('not-authed');
  });

  test('sets isAuthenticated = true when stored token exists', async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce('stored-token')
      .mockResolvedValueOnce('https://example.com');

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('done');
    });

    expect(getByTestId('auth').props.children).toBe('authed');
    expect(api.configure).toHaveBeenCalledWith('https://example.com', 'stored-token');
  });

  test('signIn success sets isAuthenticated and stores credentials', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (api.post as jest.Mock).mockResolvedValueOnce({
      token: 'new-token',
      expiresAt: '2025-01-01',
      userId: 'user1',
    });

    const SignInConsumer = () => {
      const { signIn, isAuthenticated } = useAuth();
      return (
        <>
          <Text testID="auth">{isAuthenticated ? 'authed' : 'not-authed'}</Text>
          <Text testID="trigger" onPress={() => signIn('https://server.com', 'user@test.com', 'pass123')} />
        </>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <SignInConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('auth').props.children).toBe('not-authed'));

    await act(async () => {
      getByTestId('trigger').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('auth').props.children).toBe('authed');
    });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('orchestra_jwt_token', 'new-token');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('orchestra_server_url', 'https://server.com');
  });

  test('signOut clears storage and sets isAuthenticated = false', async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce('token')
      .mockResolvedValueOnce('https://example.com');

    const SignOutConsumer = () => {
      const { signOut, isAuthenticated } = useAuth();
      return (
        <>
          <Text testID="auth">{isAuthenticated ? 'authed' : 'not-authed'}</Text>
          <Text testID="trigger" onPress={() => signOut()} />
        </>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <SignOutConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('auth').props.children).toBe('authed'));

    await act(async () => {
      getByTestId('trigger').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('auth').props.children).toBe('not-authed');
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('orchestra_jwt_token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('orchestra_server_url');
  });
});
