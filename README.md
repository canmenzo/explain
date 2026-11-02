<p align="center"><img src="extension/icons/icon-128.png" width="64" height="64" alt=""></p>

<h1 align="center">Explain</h1>

<p align="center">Select text, right-click, choose <b>Explain</b>.<br>A short, plain answer streams in right beside it.</p>

<p align="center"><a href="https://explain.menzo.dev">Website</a> · <a href="https://github.com/canmenzo/explain/releases/latest">Download</a> · <a href="PRIVACY.md">Privacy</a></p>

<p align="center"><img src="docs/img/3-explanation.png" width="720" alt="The Explain card beside a selected word, explaining it in two sentences"></p>

## Install

1. Download `explain-chrome.zip` from the [latest release](https://github.com/canmenzo/explain/releases/latest) and unzip it.
2. Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and pick the folder.
3. Click the Explain icon, follow **Get a free key** to Google AI Studio, paste the key and save.

Firefox 140+: load `manifest.json` from `explain-firefox.zip` in `about:debugging#/runtime/this-firefox`.

## Update

Chrome Web Store and Firefox Add-ons installations update automatically through the browser when a newer version is published to the same store listing. Explain does not check GitHub for updates. Your saved key is kept.

Developer-mode ZIP and temporary Firefox installations do not receive automatic updates. Replace the files in the same folder, then reload the extension from `chrome://extensions` or `about:debugging`.

To publish an update, increase the version in `package.json`, both manifests, `Cargo.toml`, and `Cargo.lock`, run `npm run build`, then upload `dist/chrome.zip` and `dist/firefox.zip` to the existing Chrome Web Store and Firefox Add-ons listings. Keep the Firefox add-on ID (`explain@menzo.dev`) unchanged and omit custom `update_url` values so the stores manage updates. A GitHub push or release alone does not update installed extensions.

## Privacy

Only the selection, the paragraph around it and the page title go to Google's Gemini API, straight from your browser. No servers, no account, no analytics. Your key is saved in this browser only, never synced. On Google's free tier, Google may use requests to improve its products.

## Develop

Needs Node.js 20+ and Rust with the `wasm32-unknown-unknown` target.

```sh
npm run build   # Rust core to WebAssembly, then dist/chrome.zip and dist/firefox.zip
npm test        # Rust unit tests and extension tests
```

The Rust core validates selections, builds Gemini requests and parses the streamed replies. JavaScript handles the browser side: the menu, the card and the network.

## License

[MIT](LICENSE)
