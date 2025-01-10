export interface StorageData {
  apiKey: string;
  useApiKey: boolean;
}

export interface Message {
  type: 'SETTINGS_UPDATED' | 'GET_SELECTED_TEXT';
  payload?: any;
}

export interface MessageResponse {
  selectedText?: string;
} 