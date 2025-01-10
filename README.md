# HTML to MD Render

![HTML to MD Render Banner](images/HTML%20to%20MD%20Render%20Banner.png)

> **Current Version**: v0.1.0-alpha - This is an alpha release, expect changes and improvements.

A powerful Chrome extension that converts any webpage into clean, readable Markdown format with a single click. Built with modern web technologies and a beautiful, minimalist interface.

## Features

- 🚀 Convert any webpage to Markdown instantly
- 🎨 Clean, modern interface with Pico CSS v2
- ⌨️ Keyboard shortcut support (Ctrl+Shift+M / Cmd+Shift+M)
- 🔄 Context menu integration for easy access
- ⚙️ Optional API key configuration
- 🌙 Beautiful dark mode interface
- 🎯 Focused on simplicity and usability

## Version History

- **v0.1.0-alpha** (Current)
  - Initial alpha release
  - Basic webpage to Markdown conversion
  - Dark mode support
  - API key configuration option

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/ashraf-ali-ca/html-to-md-render.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` directory from this project

## Usage

### Quick Access
- Click the extension icon in your browser toolbar
- Use the keyboard shortcut (Ctrl+Shift+M / Cmd+Shift+M)

### Context Menu
- Right-click on any webpage to convert it to Markdown
- Right-click on selected text for specific content conversion
- Right-click on links to convert linked pages

### Settings
- Toggle API key usage for enhanced features
- Configure your API key (optional)

## Development

- Run in development mode with auto-reload:
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
  ```

## Tech Stack

- ⚛️ React for UI components
- 🎨 Pico CSS v2 for minimal, semantic styling
- 📝 TypeScript for type safety
- 🛠️ Webpack for bundling
- 🧪 Jest for testing

## Color Scheme

- Primary: `#ff6b35` (Orange)
- Background: `#1a237e` (Deep Blue)
- Text: `#ffffff` (White)
- Accents: Various transparency levels of white

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Created by [Ashraf Ali](https://ashrafali.net) 