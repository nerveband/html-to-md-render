# HTML to MD Render

A Chrome extension that converts any webpage to clean, readable Markdown format with a single click. Built on top of Jina AI's Reader API.

## Features

- Convert webpages to clean Markdown with one click
- Search selected text using Jina AI
- Customize output format (Markdown, HTML, Text, Screenshot)
- Enable image captions
- Configure proxy and selectors
- Keyboard shortcuts (Ctrl/Cmd + Shift + M)

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Load the `dist` folder as an unpacked extension in Chrome

## Development

```bash
npm install    # Install dependencies
npm run watch  # Watch for changes
npm run build  # Build for production
```

## FAQ

### Why use Jina Reader vs other HTML to Markdown solutions?

While there are many HTML to Markdown converters available, Jina Reader offers several unique advantages:

1. **Smart Content Extraction**: Unlike basic HTML scrapers, Jina Reader uses advanced algorithms to identify and extract the main content, removing clutter like ads, navigation, and footers.

2. **Image Support**: Jina Reader can automatically generate captions for images using AI, making the content more accessible and informative.

3. **Flexible Output**: Beyond just Markdown, you can get the content in various formats including HTML, plain text, or even screenshots.

4. **Reliability**: Jina Reader handles dynamic content, JavaScript-rendered pages, and complex layouts that often break traditional converters.

5. **API Integration**: Built on a production-grade API with high availability and scalability.

### Can I customize the keyboard shortcuts?

Yes! You can customize the keyboard shortcuts by:
1. Going to Chrome's Extensions page (chrome://extensions)
2. Clicking "Keyboard shortcuts" at the bottom
3. Finding "HTML to MD Render" and setting your preferred shortcut

## Tech Stack

- TypeScript
- React
- Material UI
- Webpack
- Chrome Extension APIs
- Jina AI Reader API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Ashraf Ali

## Version History

- 0.1.0-alpha: Initial release
  - Basic webpage conversion
  - Search functionality
  - Advanced settings panel
  - Keyboard shortcuts 