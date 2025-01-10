import { Message, StorageData, JinaRequestHeaders } from '../types';

const defaultSettings: StorageData['settings'] = {
  imageCaption: false,
  timeout: 30,
  cacheTimeout: 3600,
  responseFormat: 'markdown' as const,
  useProxy: false,
  proxyUrl: '',
  waitForSelector: '',
  targetSelector: ''
};

// Create context menu items
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.contextMenus.create({
    id: 'convert-page',
    title: 'Convert to Markdown',
    contexts: ['page', 'link']
  });

  await chrome.contextMenus.create({
    id: 'search-selection',
    title: 'Search with Jina AI',
    contexts: ['selection']
  });

  // Initialize default settings
  const settings: StorageData = {
    apiKey: '',
    useApiKey: false,
    settings: defaultSettings
  };
  await chrome.storage.sync.set(settings);
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) => {
  const storage = await chrome.storage.sync.get(['apiKey', 'useApiKey', 'settings']) as StorageData;
  const headers: JinaRequestHeaders = {
    'x-with-generated-alt': storage.settings.imageCaption ? 'true' : undefined,
    'x-respond-with': storage.settings.responseFormat,
    'x-timeout': storage.settings.timeout.toString(),
    'x-cache-tolerance': storage.settings.cacheTimeout.toString(),
    'x-proxy-url': storage.settings.useProxy ? storage.settings.proxyUrl : undefined,
    'x-target-selector': storage.settings.targetSelector || undefined,
    'x-wait-for-selector': storage.settings.waitForSelector || undefined
  };

  const queryParams = new URLSearchParams();
  if (storage.useApiKey && storage.apiKey) {
    queryParams.set('api_key', storage.apiKey);
  }

  let url = '';
  if (info.menuItemId === 'convert-page') {
    url = info.linkUrl || tab?.url || '';
    if (url) {
      const readerUrl = `https://r.jina.ai/${url}?${queryParams.toString()}`;
      await chrome.tabs.create({ url: readerUrl });
    }
  } else if (info.menuItemId === 'search-selection' && info.selectionText) {
    const searchUrl = `https://s.jina.ai/${encodeURIComponent(info.selectionText)}?${queryParams.toString()}`;
    await chrome.tabs.create({ url: searchUrl });
  }
});

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command: string) => {
  if (command === '_execute_action') {
    const storage = await chrome.storage.sync.get(['apiKey', 'useApiKey', 'settings']) as StorageData;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];

    if (currentTab?.url) {
      const queryParams = new URLSearchParams();
      if (storage.useApiKey && storage.apiKey) {
        queryParams.set('api_key', storage.apiKey);
      }

      const readerUrl = `https://r.jina.ai/${currentTab.url}?${queryParams.toString()}`;
      await chrome.tabs.create({ url: readerUrl });
    }
  }
});

// Handle settings updates
chrome.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === 'SETTINGS_UPDATED') {
    // Reload context menus with new settings
    await chrome.contextMenus.removeAll();
    await chrome.contextMenus.create({
      id: 'convert-page',
      title: 'Convert to Markdown',
      contexts: ['page', 'link']
    });
    await chrome.contextMenus.create({
      id: 'search-selection',
      title: 'Search with Jina AI',
      contexts: ['selection']
    });
  }
}); 