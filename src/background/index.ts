import { Message } from '../types';

// Create context menu items
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.contextMenus.create({
    id: 'read-with-jina',
    title: 'Read with Jina AI',
    contexts: ['page', 'selection', 'link']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) => {
  if (info.menuItemId === 'read-with-jina') {
    let url = '';
    
    if (info.linkUrl) {
      // If clicked on a link
      url = info.linkUrl;
    } else if (info.selectionText) {
      // If text is selected, use search
      url = `https://s.jina.ai/${encodeURIComponent(info.selectionText)}`;
    } else if (tab?.url) {
      // If clicked on the page
      url = tab.url;
    }

    if (url) {
      const jinaUrl = url.startsWith('https://s.jina.ai/') 
        ? url 
        : `https://r.jina.ai/${url}`;
      
      await chrome.tabs.create({ url: jinaUrl });
    }
  }
});

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command: string) => {
  if (command === '_execute_action') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    if (currentTab?.url) {
      const jinaUrl = `https://r.jina.ai/${currentTab.url}`;
      await chrome.tabs.create({ url: jinaUrl });
    }
  }
});

// Handle settings updates
chrome.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === 'SETTINGS_UPDATED') {
    // Reload context menus with new settings
    await chrome.contextMenus.removeAll();
    await chrome.contextMenus.create({
      id: 'read-with-jina',
      title: 'Read with Jina AI',
      contexts: ['page', 'selection', 'link']
    });
  }
}); 