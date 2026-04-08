/**
 * Plaid API Service Layer
 * 对齐 kura-app 实现
 */

import { getBackendBaseUrl } from './authApi';

export interface BackendFinanceAccount {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'saving' | 'credit' | 'crypto';
  logo: string;
}

export interface BackendFinanceTransaction {
  id: string;
  accountId: string;
  accountName: string;
  accountType: 'checking' | 'saving' | 'credit' | 'crypto';
  amount: string;
  date: string;
  merchant: string;
  category: string;
  type: 'credit' | 'deposit' | 'transfer';
}

export interface BackendFinanceInvestmentAccount {
  id: string;
  name: string;
  type: 'Broker' | 'Exchange' | 'Web3 Wallet';
  logo: string;
}

export interface BackendFinanceInvestment {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  holdings: number;
  currentPrice: number;
  change24h: number;
  type: 'crypto' | 'stock';
  logo: string;
}

export interface BackendFinanceSnapshot {
  accounts: BackendFinanceAccount[];
  transactions: BackendFinanceTransaction[];
  investmentAccounts: BackendFinanceInvestmentAccount[];
  investments: BackendFinanceInvestment[];
}

export interface UpdatePlaidAccountOrderPayload {
  accountIds?: string[];
  investmentAccountIds?: string[];
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export class PlaidApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PlaidApiError';
    this.status = status;
  }
}

async function plaidRequest<T>(
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
    console.debug('[PlaidAPI] Fetching:', {
      method: options.method || 'GET',
      url,
      hasAuth: !!token,
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.debug('[PlaidAPI] Response received:', {
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
      console.error('[PlaidAPI] Response error', { message, status: response.status });
      throw new PlaidApiError(message, response.status);
    }

    console.debug('[PlaidAPI] Response successful', { status: response.status });
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
    } else if (error instanceof PlaidApiError) {
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
    
    console.error('[PlaidAPI] Request failed:', errorLog);
    throw error;
  }
}

/**
 * 创建 Plaid Link Token
 * 用户打开 Plaid Link 时需要此 token
 */
export const createPlaidLinkToken = (token: string): Promise<{ link_token: string }> => {
  return plaidRequest<{ link_token: string }>(
    '/api/plaid/create-link-token',
    { method: 'POST' },
    token
  );
};

/**
 * 交换 Plaid Public Token 为 Access Token
 * 用户在 Plaid 完成授权后调用
 */
export const exchangePlaidPublicToken = (
  token: string,
  payload: { public_token: string; institution_name?: string }
): Promise<{ status: string; message: string }> => {
  return plaidRequest<{ status: string; message: string }>(
    '/api/plaid/exchange-public-token',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token
  );
};

/**
 * 获取财务数据快照
 * 包括银行账户、交易、投资账户和投资产品
 */
export const fetchPlaidFinanceSnapshot = (token: string): Promise<BackendFinanceSnapshot> => {
  return plaidRequest<BackendFinanceSnapshot>(
    '/api/plaid/finance-snapshot',
    { method: 'GET' },
    token
  );
};

/**
 * 断开 Plaid 银行账户连接
 */
export const disconnectPlaidAccount = (
  token: string,
  accountId: string
): Promise<{ status: string; message: string }> => {
  return plaidRequest<{ status: string; message: string }>(
    '/api/plaid/account',
    {
      method: 'DELETE',
      body: JSON.stringify({ accountId }),
    },
    token
  );
};

/**
 * 更新 Plaid 账户顺序（用于 UI 排序）
 */
export const updatePlaidAccountOrder = (
  token: string,
  payload: UpdatePlaidAccountOrderPayload
): Promise<{ status: string; message: string }> => {
  return plaidRequest<{ status: string; message: string }>(
    '/api/plaid/account-order',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token
  );
};
