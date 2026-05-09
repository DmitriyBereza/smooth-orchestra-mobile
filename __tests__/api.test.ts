import { ApiError, configure, get, post, setOnUnauthorized } from '../lib/api';

describe('API client', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();
    configure('https://example.com', 'test-token');
  });

  test('get sends Authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test' }),
    });

    await get('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  test('get returns parsed JSON on success', async () => {
    const data = { tasks: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => data,
    });

    const result = await get('/api/test');
    expect(result).toEqual(data);
  });

  test('post sends JSON body with Authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ token: 'abc' }),
    });

    await post('/api/login', { username: 'user', password: 'pass' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/api/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'user', password: 'pass' }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  test('throws ApiError with status 401 on unauthorized response', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

    await expect(get('/api/test')).rejects.toThrow(ApiError);
    await expect(get('/api/test').catch((e) => e.status)).resolves.toBe(401);
  });

  test('calls onUnauthorized callback on 401', async () => {
    const onUnauth = jest.fn();
    setOnUnauthorized(onUnauth);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });

    await expect(get('/api/test')).rejects.toThrow(ApiError);
    expect(onUnauth).toHaveBeenCalled();
  });

  test('wraps network errors as ApiError with status 0', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'));

    const error = await get('/api/test').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
  });

  test('throws error if get called before configure', async () => {
    // Reset configuration
    configure('', '');
    await expect(get('/api/test')).rejects.toThrow('API client not configured');
  });
});
