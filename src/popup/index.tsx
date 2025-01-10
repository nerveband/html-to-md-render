import React, { useEffect, useState, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { StorageData, Message } from '../types';
import '@picocss/pico';
import './styles.css';

const Popup: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [useApiKey, setUseApiKey] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['apiKey', 'useApiKey']).then((result: { [key: string]: any }) => {
      setApiKey(result.apiKey || '');
      setUseApiKey(result.useApiKey || false);
    });

    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  const handleSaveSettings = () => {
    const settings: StorageData = {
      apiKey,
      useApiKey
    };

    chrome.storage.sync.set(settings).then(() => {
      // Notify background script of settings change
      const message: Message = { type: 'SETTINGS_UPDATED' };
      chrome.runtime.sendMessage(message);
    });
  };

  const handleReadPage = () => {
    if (currentUrl) {
      const readerUrl = `https://r.jina.ai/${currentUrl}`;
      window.open(readerUrl, '_blank');
    }
  };

  return (
    <main className="container">
      <article>
        <header>
          <h3>HTML to MD Render</h3>
        </header>

        <div className="grid">
          <label>
            <input
              type="checkbox"
              role="switch"
              checked={useApiKey}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUseApiKey(e.target.checked)}
            />
            Use API Key
          </label>
        </div>

        {useApiKey && (
          <div className="grid">
            <input
              type="password"
              placeholder="Enter API Key"
              value={apiKey}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
            />
          </div>
        )}

        <div className="grid">
          <button onClick={handleReadPage} className="primary">
            Convert to Markdown
          </button>
          <button onClick={handleSaveSettings} className="secondary outline">
            Save Settings
          </button>
        </div>
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