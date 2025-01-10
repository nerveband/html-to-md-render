export interface StorageData {
  apiKey: string;
  useApiKey: boolean;
  settings: {
    imageCaption: boolean;
    timeout: number;
    cacheTimeout: number;
    responseFormat: Exclude<ResponseFormat, 'json'>;
    useProxy: boolean;
    proxyUrl?: string;
    waitForSelector?: string;
    targetSelector?: string;
  };
}

export type ResponseFormat = 'markdown' | 'html' | 'text' | 'screenshot' | 'json';

export interface Message {
  type: 'SETTINGS_UPDATED' | 'GET_SELECTED_TEXT' | 'CONVERT_PAGE' | 'SEARCH_TEXT';
  payload?: any;
}

export interface MessageResponse {
  selectedText?: string;
  success?: boolean;
  error?: string;
}

export interface JinaRequestHeaders {
  'x-with-generated-alt'?: string;
  'x-set-cookie'?: string;
  'x-respond-with'?: Exclude<ResponseFormat, 'json'>;
  'x-proxy-url'?: string;
  'x-cache-tolerance'?: string;
  'x-no-cache'?: string;
  'x-target-selector'?: string;
  'x-wait-for-selector'?: string;
  'x-timeout'?: string;
  'Accept'?: 'text/event-stream' | 'application/json';
} 