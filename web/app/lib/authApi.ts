/**
 * Authentication API Service
 * 对齐 kura-app 实现
 */

// Default backend URL - production environment
const DEFAULT_BACKEND_URL = 'https://kura-backend-642134687769.us-central1.run.app';
const AUTH_TOKEN_KEY = 'kura.auth.token';

export interface BackendUser {
  id: string;
  email: string;
}

export interface BackendUserProfile extends BackendUser {
  displayName: string;
  avatarUrl: string;
  membershipLabel: string;
}

export interface AuthResponse {
  token: string;
  user: BackendUserProfile;
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

export const getBackendBaseUrl = (): string => {
  // 总是使用生産URL，确保不会被错误的环境变量覆盖
  return DEFAULT_BACKEND_URL;
};

export const getStoredAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearStoredAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const baseUrl = getBackendBaseUrl();
  const url = `${baseUrl}${path}`;

  const headers = new Headers(options.headers ?? {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    console.log('[AuthAPI] Fetching:', {
      method: options.method || 'GET',
      url,
      hasAuth: !!token,
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('[AuthAPI] Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: {
        contentType: response.headers.get('content-type'),
      },
    });

    const raw = await response.text();
    let json: (ApiErrorBody & T) | null = null;
    if (raw) {
      try {
        json = JSON.parse(raw) as ApiErrorBody & T;
      } catch {
        json = null;
      }
    }

    if (!response.ok) {
      const message = json?.error || json?.message || `Request failed with status ${response.status}`;
      console.error('[AuthAPI] Response error:', { status: response.status, message });
      throw new AuthApiError(message, response.status);
    }

    console.log('[AuthAPI] Request successful', { response: json });
    return (json as T) ?? ({} as T);
  } catch (error) {
    let errorMessage = 'Unknown error';
    let errorStack: string | undefined = undefined;
    let isNetworkError = false;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack;
      
      // 检测 CORS 和网络错误
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Load failed')) {
        isNetworkError = true;
        const hint = 'Could be network error, CORS issue, or backend service unreachable';
        errorMessage = `${errorMessage} (${hint})`;
      }
    } else if (error instanceof AuthApiError) {
      errorMessage = error.message;
      errorStack = error.stack;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = String(error);
    }
    
    const errorLog: { url: string; error: string; stack?: string; isNetworkError?: boolean } = {
      url,
      error: errorMessage,
    };
    
    if (isNetworkError) {
      errorLog.isNetworkError = true;
    }
    
    // 只在有 stack 时才包含
    if (errorStack) {
      errorLog.stack = errorStack;
    }
    
    console.error('[AuthAPI] Request failed:', errorLog);
    throw error;
  }
}

/**
 * 用户注册
 */
export const registerUser = (email: string, password: string): Promise<AuthResponse> => {
  const normalizedEmail = email.toLowerCase().trim();
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
};

/**
 * 用户登录
 */
export const loginUser = (email: string, password: string): Promise<AuthResponse> => {
  const normalizedEmail = email.toLowerCase().trim();
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
};

/**
 * 获取当前用户资料
 */
export const fetchCurrentUserProfile = (token: string): Promise<{ user: BackendUserProfile }> => {
  return apiRequest<{ user: BackendUserProfile }>('/api/auth/me', { method: 'GET' }, token);
};

/**
 * 更新当前用户资料
 */
export const updateCurrentUserProfile = (
  token: string,
  payload: { displayName?: string; avatarUrl?: string }
): Promise<{ user: BackendUserProfile }> => {
  return apiRequest<{ user: BackendUserProfile }>(
    '/api/auth/me',
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    token
  );
};

/**
 * 改变密码
 */
export const changePassword = (
  token: string,
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(
    '/api/auth/change-password',
    {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    },
    token
  );
};

/**
 * 忘记密码 - 请求重置
 */
export const requestPasswordReset = (email: string): Promise<{ message: string; resetToken?: string }> => {
  // Normalize email: lowercase and trim
  const normalizedEmail = email.toLowerCase().trim();

  return apiRequest<{ message: string; resetToken?: string }>('/api/auth/request-reset', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail }),
  });
};

/**
 * 忘记密码 - 重置密码
 */
export const resetPassword = (
  resetToken: string,
  newPassword: string
): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword }),
  });
};

/**
 * 用户注册 - 第一步：请求注册令牌
 */
export const requestRegisterToken = (email: string): Promise<{ message: string; registerToken?: string }> => {
  const normalizedEmail = email.toLowerCase().trim();
  return apiRequest<{ message: string; registerToken?: string }>('/api/auth/register/request-token', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail }),
  });
};

/**
 * 用户注册 - 第二步：确认注册
 */
export const confirmRegister = (
  email: string,
  password: string,
  registerToken: string
): Promise<AuthResponse> => {
  const normalizedEmail = email.toLowerCase().trim();
  return apiRequest<AuthResponse>('/api/auth/register/confirm', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password, registerToken }),
  });
};
