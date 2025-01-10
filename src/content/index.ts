import { Message, MessageResponse } from '../types';

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    if (message.type === 'GET_SELECTED_TEXT') {
      const selectedText = window.getSelection()?.toString() || '';
      sendResponse({ selectedText });
    }
    return true; // Required to use sendResponse asynchronously
  }
); 