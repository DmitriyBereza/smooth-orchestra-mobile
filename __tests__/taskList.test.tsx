import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import TaskListScreen from '../app/(tabs)/index';
import * as api from '../lib/api';

jest.mock('../lib/api', () => ({
  get: jest.fn(),
  configure: jest.fn(),
  ApiError: class MockApiError extends Error {
    status: number;
    constructor(mockStatus: number, message: string) {
      super(message);
      this.status = mockStatus;
    }
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  router: { push: jest.fn() },
}));

const mockSession = {
  id: 'task-1',
  task: {
    id: 'task-1',
    title: 'Build mobile app',
    description: 'A cool task',
    createdAt: new Date().toISOString(),
  },
  currentStage: 'done',
  startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  error: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TaskListScreen', () => {
  test('shows loading spinner while fetching', async () => {
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    const { getByTestId } = render(<TaskListScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  test('shows task list when data is loaded', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce([mockSession]);
    const { getByText } = render(<TaskListScreen />);

    await waitFor(() => {
      expect(getByText('Build mobile app')).toBeTruthy();
    });
  });

  test('shows "No tasks yet" when list is empty', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce([]);
    const { getByText } = render(<TaskListScreen />);

    await waitFor(() => {
      expect(getByText('No tasks yet')).toBeTruthy();
    });
  });

  test('shows error banner with Retry button on fetch failure', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network failed'));
    const { getByText } = render(<TaskListScreen />);

    await waitFor(() => {
      expect(getByText('Retry')).toBeTruthy();
    });
  });

  test('retries fetch when Retry button is pressed', async () => {
    (api.get as jest.Mock)
      .mockRejectedValueOnce(new Error('Network failed'))
      .mockResolvedValueOnce([mockSession]);

    const { getByText } = render(<TaskListScreen />);

    await waitFor(() => expect(getByText('Retry')).toBeTruthy());
    fireEvent.press(getByText('Retry'));

    await waitFor(() => expect(getByText('Build mobile app')).toBeTruthy());
  });
});
