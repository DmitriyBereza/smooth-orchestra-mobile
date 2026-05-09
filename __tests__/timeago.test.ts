import { timeAgo } from '../lib/timeago';

describe('timeAgo', () => {
  const now = new Date('2024-01-15T12:00:00Z').getTime();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns "just now" for times less than 1 minute ago', () => {
    const thirtySecondsAgo = new Date(now - 30 * 1000).toISOString();
    expect(timeAgo(thirtySecondsAgo)).toBe('just now');
  });

  test('returns "Xm ago" for times less than 60 minutes ago', () => {
    const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000).toISOString();
    expect(timeAgo(thirtyMinutesAgo)).toBe('30m ago');
  });

  test('returns "1m ago" for exactly 1 minute ago', () => {
    const oneMinuteAgo = new Date(now - 60 * 1000).toISOString();
    expect(timeAgo(oneMinuteAgo)).toBe('1m ago');
  });

  test('returns "Xh ago" for times less than 24 hours ago', () => {
    const threeHoursAgo = new Date(now - 3 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe('3h ago');
  });

  test('returns "Xd ago" for times less than 30 days ago', () => {
    const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(fiveDaysAgo)).toBe('5d ago');
  });

  test('returns "Xmo ago" for times 30 days or more ago', () => {
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(sixtyDaysAgo)).toBe('2mo ago');
  });

  test('returns empty string for null/undefined input', () => {
    expect(timeAgo(null as any)).toBe('');
    expect(timeAgo(undefined as any)).toBe('');
  });

  test('returns empty string for empty string input', () => {
    expect(timeAgo('')).toBe('');
  });
});
