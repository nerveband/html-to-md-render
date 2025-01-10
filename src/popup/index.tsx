import React, { useEffect, useState, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { StorageData, Message, JinaRequestHeaders, ResponseFormat } from '../types';
import '@picocss/pico';
import './styles.css';
import { FiBook, FiSettings, FiHelpCircle, FiGithub, FiSave, FiSearch, FiFileText, FiKey } from 'react-icons/fi';

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

const Popup: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [useApiKey, setUseApiKey] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [settings, setSettings] = useState<StorageData['settings']>(defaultSettings);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['apiKey', 'useApiKey', 'settings']).then((result: Partial<StorageData>) => {
      setApiKey(result.apiKey || '');
      setUseApiKey(result.useApiKey || false);
      setSettings(result.settings || defaultSettings);
    });

    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  const handleSaveSettings = () => {
    const storageData: StorageData = {
      apiKey,
      useApiKey,
      settings
    };

    chrome.storage.sync.set(storageData).then(() => {
      // Notify background script of settings change
      const message: Message = { type: 'SETTINGS_UPDATED' };
      chrome.runtime.sendMessage(message);
    });
  };

  const handleConvertPage = () => {
    if (currentUrl) {
      const headers: JinaRequestHeaders = {
        'x-with-generated-alt': settings.imageCaption ? 'true' : undefined,
        'x-respond-with': settings.responseFormat,
        'x-timeout': settings.timeout.toString(),
        'x-cache-tolerance': settings.cacheTimeout.toString(),
        'x-proxy-url': settings.useProxy ? settings.proxyUrl : undefined,
        'x-target-selector': settings.targetSelector || undefined,
        'x-wait-for-selector': settings.waitForSelector || undefined
      };

      const queryParams = new URLSearchParams();
      if (useApiKey && apiKey) {
        queryParams.set('api_key', apiKey);
      }

      const readerUrl = `https://r.jina.ai/${currentUrl}?${queryParams.toString()}`;
      window.open(readerUrl, '_blank');
    }
  };

  const handleSearch = () => {
    chrome.tabs.sendMessage(
      chrome.tabs.TAB_ID_NONE,
      { type: 'GET_SELECTED_TEXT' },
      (response: { selectedText?: string }) => {
        if (response?.selectedText) {
          const searchUrl = `https://s.jina.ai/${encodeURIComponent(response.selectedText)}`;
          window.open(searchUrl, '_blank');
        }
      }
    );
  };

  const handleHelp = () => {
    window.open('https://jina.ai/reader', '_blank');
  };

  const handleKeyboardShortcuts = () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  };

  return (
    <main className="container">
      <article className="popup-content">
        <header className="header">
          <h3>HTML to MD Render</h3>
          <div className="button-group">
            <a href="https://jina.ai/reader" target="_blank" rel="noopener noreferrer" className="outline" title="Documentation">
              <FiBook />
            </a>
            <a href="https://github.com/nerveband/html-to-md-render" target="_blank" rel="noopener noreferrer" className="outline" title="GitHub Repository">
              <FiGithub />
            </a>
            <a href="chrome://extensions/shortcuts" target="_blank" rel="noopener noreferrer" className="outline" title="Customize Shortcuts">
              <FiSettings />
            </a>
          </div>
        </header>

        <div className="api-key-section">
          <label className="switch-wrapper">
            <input
              type="checkbox"
              role="switch"
              checked={useApiKey}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUseApiKey(e.target.checked)}
            />
            <FiKey /> Use API Key
          </label>
          {useApiKey && (
            <input
              type="password"
              placeholder="Enter API Key"
              value={apiKey}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
            />
          )}
        </div>

        <div className="action-buttons">
          <button onClick={handleConvertPage} className="primary">
            <FiFileText /> Convert to Markdown
          </button>
          <button onClick={handleSearch} className="secondary">
            <FiSearch /> Search Selected Text
          </button>
        </div>

        <details>
          <summary role="button" className="secondary outline settings-summary">
            <FiSettings /> Advanced Settings
          </summary>
          <div className="settings-grid">
            <label>
              <input
                type="checkbox"
                role="switch"
                checked={settings.imageCaption}
                onChange={(e) => setSettings({ ...settings, imageCaption: e.target.checked })}
              />
              Enable Image Captions
            </label>

            <label>
              Response Format
              <select
                value={settings.responseFormat}
                onChange={(e) => setSettings({ ...settings, responseFormat: e.target.value as Exclude<ResponseFormat, 'json'> })}
              >
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
                <option value="text">Text</option>
                <option value="screenshot">Screenshot</option>
              </select>
            </label>

            <label>
              Timeout (seconds)
              <input
                type="number"
                value={settings.timeout}
                onChange={(e) => setSettings({ ...settings, timeout: parseInt(e.target.value) })}
                min="0"
                max="120"
              />
            </label>

            <label>
              Cache Timeout (seconds)
              <input
                type="number"
                value={settings.cacheTimeout}
                onChange={(e) => setSettings({ ...settings, cacheTimeout: parseInt(e.target.value) })}
                min="0"
              />
            </label>

            <label>
              <input
                type="checkbox"
                role="switch"
                checked={settings.useProxy}
                onChange={(e) => setSettings({ ...settings, useProxy: e.target.checked })}
              />
              Use Proxy
            </label>

            {settings.useProxy && (
              <input
                type="url"
                placeholder="Proxy URL"
                value={settings.proxyUrl}
                onChange={(e) => setSettings({ ...settings, proxyUrl: e.target.value })}
              />
            )}

            <input
              type="text"
              placeholder="Wait for Selector (e.g., #content)"
              value={settings.waitForSelector}
              onChange={(e) => setSettings({ ...settings, waitForSelector: e.target.value })}
            />

            <input
              type="text"
              placeholder="Target Selector (e.g., .main-content)"
              value={settings.targetSelector}
              onChange={(e) => setSettings({ ...settings, targetSelector: e.target.value })}
            />
          </div>
        </details>

        <details>
          <summary role="button" className="secondary outline help-summary">
            <FiHelpCircle /> Help & Usage
          </summary>
          <div className="help-content">
            <p>
              <strong>Quick Start:</strong><br/>
              1. Click the extension icon or use Ctrl/Cmd + Shift + M<br/>
              2. Click "Convert to Markdown" for the current page<br/>
              3. Or select text and click "Search" to find related content
            </p>
            <p>
              <strong>Features:</strong><br/>
              • Smart content extraction<br/>
              • Image caption generation<br/>
              • Multiple output formats<br/>
              • Advanced customization options
            </p>
            <p>
              <a href="https://jina.ai/reader" target="_blank" rel="noopener noreferrer">
                Learn more about Jina Reader →
              </a>
            </p>
          </div>
        </details>

        <button onClick={handleSaveSettings} className="save-button">
          <FiSave /> Save Settings
        </button>
      </article>
    </main>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
); 