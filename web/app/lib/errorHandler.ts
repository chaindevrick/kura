/**
 * Centralized Error Handler
 * 统一处理 API 错误和网络错误
 */

export interface ApiErrorLog {
  url: string;
  error: string;
  stack?: string;
  isNetworkError?: boolean;
  userMessage?: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly isNetworkError: boolean;
  public readonly userMessage: string;

  constructor(message: string, status: number, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
    this.userMessage = this.generateUserMessage(message, status, isNetworkError);
  }

  private generateUserMessage(message: string, status: number, isNetworkError: boolean): string {
    if (isNetworkError) {
      return '無法連接到服務器。請檢查您的網络連接或稍後重試。';
    }

    switch (status) {
      case 400:
        return '請求參數錯誤。請檢查輸入的信息。';
      case 401:
        return 'unauthorized - 請先登錄。';
      case 403:
        return 'Forbidden - 您沒有執行此操作的權限。';
      case 404:
        return '找不到請求的資源。';
      case 500:
        return '服務器出錯。請稍後重試。';
      case 502:
      case 503:
        return '服務暫時不可用。請稍後重試。';
      default:
        return message;
    }
  }
}

/**
 * 处理 fetch 错误并返回标准化的错误信息
 */
export function handleFetchError(
  error: unknown,
  url: string,
  apiName: string = 'API'
): { error: ApiError; log: ApiErrorLog } {
  let errorMessage = 'Unknown error';
  let errorStack: string | undefined = undefined;
  let isNetworkError = false;

  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack;

    // 检测网络错误
    if (
      errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('Load failed') ||
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('connect') ||
      errorMessage.includes('timeout')
    ) {
      isNetworkError = true;
      const hint = 'Network/CORS issue or backend service unreachable';
      errorMessage = `${errorMessage} (${hint})`;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = String(error);
  }

  const apiError = new ApiError(errorMessage, 0, isNetworkError);
  const log: ApiErrorLog = {
    url,
    error: errorMessage,
  };

  if (errorStack) {
    log.stack = errorStack;
  }

  if (isNetworkError) {
    log.isNetworkError = true;
  }

  log.userMessage = apiError.userMessage;

  // 输出日志
  console.error(`[${apiName}] Request failed:`, log);

  return { error: apiError, log };
}

/**
 * 处理 HTTP 响应错误
 */
export function handleResponseError(
  status: number,
  message: string,
  url: string,
  apiName: string = 'API'
): { error: ApiError; log: ApiErrorLog } {
  const apiError = new ApiError(message, status, false);
  const log: ApiErrorLog = {
    url,
    error: message,
    userMessage: apiError.userMessage,
  };

  console.error(`[${apiName}] Response error:`, {
    status,
    ...log,
  });

  return { error: apiError, log };
}

/**
 * 安全地提取错误消息
 */
export function extractErrorMessage(
  errorResponse: unknown
): { error?: string; message?: string } {
  if (typeof errorResponse === 'object' && errorResponse !== null) {
    const obj = errorResponse as Record<string, unknown>;
    return {
      error: typeof obj.error === 'string' ? obj.error : undefined,
      message: typeof obj.message === 'string' ? obj.message : undefined,
    };
  }
  return {};
}

/**
 * 获取用户友好的错误消息
 */
export function getUserFriendlyMessage(error: ApiError | Error | string): string {
  if (error instanceof ApiError) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    // 检查常见错误
    if (error.message.includes('Network')) {
      return '網絡連接出錯，請檢查您的網絡。';
    }
    if (error.message.includes('JSON')) {
      return '服務器響應格式錯誤。';
    }
    return error.message;
  }
  return String(error);
}

/**
 * 记录成功的请求
 */
export function logSuccess(
  response: unknown,
  url: string,
  apiName: string = 'API'
): void {
  console.debug(`[${apiName}] Request successful:`, {
    url,
    response,
  });
}

/**
 * 记录响应信息
 */
export function logResponse(
  status: number,
  statusText: string,
  contentType: string | null,
  url: string,
  apiName: string = 'API'
): void {
  console.debug(`[${apiName}] Response received:`, {
    status,
    statusText,
    contentType,
    url,
  });
}
