/**
 * Exchange API Service Layer
 * Handles crypto exchange connections via CCXT backend
 * Aligns with backend routes: /api/exchange/*
 */

import { getBackendBaseUrl } from './authApi';
import Logger from '../utils/Logger';

export type ExchangeName = 'binance' | 'kraken' | 'coinbase' | 'okx' | 'huobi' | 'bybit' | 'kucoin' | 'bitget' | 'gateio';

export interface ExchangeCredentials {
  exchange: ExchangeName;
  apiKey: string;
  apiSecret: string;
  passphrase?: string; // Optional for some exchanges
}

export interface SupportedExchange {
  id: ExchangeName;
  displayName: string;
  requiresPassphrase: boolean;
  icon: string;
  website: string;
}

export interface ExchangeAccount {
  id: string;
  userId: string;
  exchange: ExchangeName;
  accountName: string;
  createdAt: string;
  lastSyncedAt: string | null;
}

export interface ExchangeBalance {
  symbol: string;
  free: number;
  used: number;
  total: number;
}

export interface ExchangeAsset {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  value: number; // amount * price in USD
  change24h: number;
  logo: string;
}

export interface ExchangeSnapshot {
  exchangeAccountId: string;
  exchange: ExchangeName;
  balances: ExchangeBalance[];
  assets: ExchangeAsset[];
  totalValueUSD: number;
  lastFetchedAt: string;
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export class ExchangeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ExchangeApiError';
    this.status = status;
  }
}

async function exchangeRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  // Validate path to prevent undefined/null URLs
  if (!path || typeof path !== 'string') {
    throw new ExchangeApiError('Invalid path: path must be a non-empty string', 400);
  }
  
  if (path.includes('undefined') || path.includes('null')) {
    throw new ExchangeApiError(`Invalid path: path contains invalid values (${path})`, 400);
  }

  const baseUrl = getBackendBaseUrl();
  const url = `${baseUrl}/api/exchange${path}`;

  const headers = new Headers(options.headers ?? {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    Logger.debug('ExchangeAPI', 'Fetching:', {
      method: options.method || 'GET',
      url,
      hasAuth: !!token,
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let body: T & ApiErrorBody;
    try {
      body = (await response.json()) as T & ApiErrorBody;
    } catch (jsonError) {
      // If JSON parsing fails, it might be HTML error page from 5xx error
      const parseError = jsonError instanceof Error ? jsonError.message : 'Failed to parse response';
      Logger.error('ExchangeAPI', 'Failed to parse response JSON', {
        url,
        status: response.status,
        parseError,
      });
      throw new ExchangeApiError(
        `Server error (${response.status}): ${parseError}`,
        response.status
      );
    }

    if (!response.ok) {
      const errorMessage = body?.message || body?.error || `HTTP ${response.status}`;
      Logger.error('ExchangeAPI', 'Request failed:', {
        status: response.status,
        message: errorMessage,
        url,
      });
      throw new ExchangeApiError(errorMessage, response.status);
    }

    Logger.debug('ExchangeAPI', 'Request succeeded:', { url });
    return body;
  } catch (error) {
    if (error instanceof ExchangeApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    Logger.error('ExchangeAPI', 'Request error:', {
      error: errorMessage,
      url,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });
    throw new ExchangeApiError(errorMessage, 0);
  }
}

/**
 * Get list of supported exchanges
 * Optional: can be called without authentication, but if token provided will be used
 */
export async function getSupportedExchanges(token?: string): Promise<SupportedExchange[]> {
  try {
    const baseUrl = getBackendBaseUrl();
    const url = `${baseUrl}/api/exchange/supported`;

    Logger.debug('ExchangeAPI', 'Fetching supported exchanges:', { url, hasAuth: !!token });

    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { headers });
    const data = (await response.json()) as { exchanges?: SupportedExchange[] } & ApiErrorBody;

    if (!response.ok) {
      throw new ExchangeApiError(
        data?.error || data?.message || `HTTP ${response.status}`,
        response.status
      );
    }

    Logger.info('ExchangeAPI', 'Supported exchanges fetched', {
      count: data.exchanges?.length ?? 0,
    });

    return data.exchanges || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch supported exchanges';
    Logger.error('ExchangeAPI', 'Failed to fetch supported exchanges:', { error: errorMessage });
    throw error;
  }
}

/**
 * Connect a crypto exchange account
 * Backend will use CCXT to validate and store credentials
 */
export async function connectExchangeAccount(
  credentials: ExchangeCredentials,
  token: string
): Promise<ExchangeAccount> {
  // Response might be wrapped in { success, account } or direct ExchangeAccount
  const response = await exchangeRequest<{ success?: boolean; account?: ExchangeAccount } | ExchangeAccount>(
    '/connect',
    {
      method: 'POST',
      body: JSON.stringify({
        exchange: credentials.exchange,
        apiKey: credentials.apiKey,
        apiSecret: credentials.apiSecret,
        passphrase: credentials.passphrase,
      }),
    },
    token
  );

  // Handle both wrapped and direct response formats
  if (response && 'account' in response && (response as any).account) {
    return (response as any).account as ExchangeAccount;
  }

  return response as ExchangeAccount;
}

/**
 * Fetch balances from a connected exchange account
 */
export async function fetchExchangeBalances(
  exchangeAccountId: string,
  token: string
): Promise<ExchangeSnapshot> {
  if (!exchangeAccountId) {
    throw new ExchangeApiError('exchangeAccountId is required', 400);
  }
  const response = await exchangeRequest<{ snapshot?: ExchangeSnapshot } | ExchangeSnapshot>(
    `/${exchangeAccountId}/balances`,
    { method: 'GET' },
    token
  );

  // Log raw response for debugging
  Logger.debug('ExchangeAPI', 'Raw balance response', {
    isSnapshot: !('snapshot' in response),
    hasSnapshot: 'snapshot' in response,
    response: JSON.stringify(response).substring(0, 300),
  });

  // Handle both wrapped and direct response formats
  let snapshot: ExchangeSnapshot;
  if (response && 'snapshot' in response && (response as any).snapshot) {
    snapshot = (response as any).snapshot as ExchangeSnapshot;
  } else {
    snapshot = response as ExchangeSnapshot;
  }

  // Validate response structure before returning
  if (!snapshot) {
    throw new ExchangeApiError('Invalid balance response: snapshot is empty', 400);
  }

  if (!Array.isArray(snapshot.balances)) {
    Logger.warn('ExchangeAPI', 'Balance response missing balances array', {
      exchangeAccountId,
      hasBalances: !!snapshot.balances,
      balancesType: typeof snapshot.balances,
    });
    // Return with empty balances array to prevent crashes
    return {
      ...snapshot,
      balances: [],
    };
  }

  return snapshot;
}

/**
 * Fetch assets/holdings from a connected exchange account
 */
export async function fetchExchangeAssets(
  exchangeAccountId: string,
  token: string
): Promise<ExchangeAsset[]> {
  if (!exchangeAccountId) {
    throw new ExchangeApiError('exchangeAccountId is required', 400);
  }
  const response = await exchangeRequest<{ assets: ExchangeAsset[] }>(
    `/${exchangeAccountId}/assets`,
    { method: 'GET' },
    token
  );
  return response.assets || [];
}

/**
 * List all connected exchange accounts for the user
 */
export async function getConnectedExchangeAccounts(
  token: string
): Promise<ExchangeAccount[]> {
  const response = await exchangeRequest<{ accounts?: ExchangeAccount[] } | ExchangeAccount[]>(
    '/accounts',
    { method: 'GET' },
    token
  );

  // Handle both wrapped and direct response formats
  if (response && 'accounts' in response && Array.isArray((response as any).accounts)) {
    return (response as any).accounts as ExchangeAccount[];
  }

  // If it's already an array, return it
  if (Array.isArray(response)) {
    return response as ExchangeAccount[];
  }

  // Fallback to empty array if response is invalid
  Logger.warn('ExchangeAPI', 'Invalid exchange accounts response format', {
    response: JSON.stringify(response).substring(0, 200),
  });
  return [];
}

/**
 * Disconnect an exchange account
 */
export async function disconnectExchangeAccount(
  exchangeAccountId: string,
  token: string
): Promise<void> {
  if (!exchangeAccountId) {
    throw new ExchangeApiError('exchangeAccountId is required', 400);
  }
  await exchangeRequest<void>(
    `/${exchangeAccountId}`,
    { method: 'DELETE' },
    token
  );
}
