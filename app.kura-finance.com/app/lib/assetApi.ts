/**
 * Asset History API Service
 * Fetches server-side asset history for the dashboard chart
 */

import { getBackendBaseUrl } from './authApi';
import { handleFetchError, handleResponseError, logResponse, logSuccess, extractErrorMessage } from './errorHandler';

// ============= Types =============

export interface AssetHistoryPoint {
  timestamp: string; // ISO 8601
  value: number;
  name: string;
  type: string;
}

export interface AssetHistorySummary {
  minValue: number;
  maxValue: number;
  change: number;
  changePercent: number;
}

export interface AssetHistoryResponse {
  userId: string;
  totalAssets: number;
  lastRecordedTime: string | null;
  history: AssetHistoryPoint[];
  summary: AssetHistorySummary;
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

// ============= Request Handler =============

async function assetRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBackendBaseUrl();
  const url = `${baseUrl}${path}`;

  const headers = new Headers(options.headers ?? {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('X-Client-Type', 'web');

  try {
    console.debug('[AssetAPI] Request:', { method: options.method || 'GET', url });

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    logResponse(response.status, response.statusText, response.headers.get('content-type'), url, 'AssetAPI');

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
      const { error, message } = extractErrorMessage(json);
      const errorMsg = error || message || `Request failed with status ${response.status}`;
      const { error: apiError } = handleResponseError(response.status, errorMsg, url, 'AssetAPI');
      throw apiError;
    }

    const data = (json as T) ?? ({} as T);
    logSuccess(data, url, 'AssetAPI');
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AssetApiError') {
      throw error;
    }
    const { error: apiError } = handleFetchError(error, url, 'AssetAPI');
    throw apiError;
  }
}

// ============= Public API =============

/**
 * Fetch asset history for the given number of past days.
 * 取得過去 N 天的資產歷史紀錄，用於 dashboard 折線圖
 */
export const fetchAssetHistory = (days: number = 30): Promise<AssetHistoryResponse> => {
  return assetRequest<AssetHistoryResponse>(
    `/api/asset/history?days=${days}`,
    { method: 'GET' }
  );
};
