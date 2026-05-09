import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/(auth)/login';
import { useAuth } from '../lib/AuthContext';
import { ApiError } from '../lib/api';

jest.mock('../lib/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  router: { replace: jest.fn() },
  Stack: { Screen: () => null },
}));

const mockSignIn = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue({
    signIn: mockSignIn,
    isAuthenticated: false,
    isLoading: false,
  });
});

describe('LoginScreen', () => {
  test('renders server URL, email, and password fields', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText('https://your-server.com')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  test('renders Connect button', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Connect')).toBeTruthy();
  });

  test('calls signIn with entered values on submit', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('https://your-server.com'), 'https://myserver.com');
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'secret123');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('https://myserver.com', 'user@example.com', 'secret123');
    });
  });

  test('shows "Invalid email or password" on 401 error', async () => {
    mockSignIn.mockRejectedValueOnce(new ApiError(401, 'Unauthorized'));
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('https://your-server.com'), 'https://myserver.com');
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(getByText('Invalid email or password')).toBeTruthy();
    });
  });

  test('shows "Could not connect to server" on network error', async () => {
    mockSignIn.mockRejectedValueOnce(new ApiError(0, 'Network error'));
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('https://your-server.com'), 'https://myserver.com');
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(getByText(/Could not connect to server/)).toBeTruthy();
    });
  });
});
