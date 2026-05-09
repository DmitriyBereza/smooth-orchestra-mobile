export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

let baseUrl = '';
let authToken = '';
let onUnauthorizedCallback: (() => void) | null = null;

export function configure(serverUrl: string, token: string): void {
  baseUrl = serverUrl;
  authToken = token;
}

export function setOnUnauthorized(callback: () => void): void {
  onUnauthorizedCallback = callback;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };
  return headers;
}

export async function get<T>(path: string): Promise<T> {
  if (!baseUrl) {
    throw new ApiError(0, 'API client not configured. Call configure() first.');
  }
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (response.status === 401) {
      onUnauthorizedCallback?.();
      throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(response.status, body.message || 'Request failed');
    }

    return response.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, `Could not connect to server: ${baseUrl}`);
  }
}

export async function post<T>(path: string, body: object): Promise<T> {
  if (!baseUrl) {
    throw new ApiError(0, 'API client not configured. Call configure() first.');
  }
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      onUnauthorizedCallback?.();
      throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
      const responseBody = await response.json().catch(() => ({}));
      throw new ApiError(response.status, responseBody.message || 'Request failed');
    }

    return response.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, `Could not connect to server: ${baseUrl}`);
  }
}
