# Privacy Policy

Effective October 23, 2026. This policy covers the Explain browser extension.

Explain has no servers of its own. It does not collect analytics, telemetry, or usage data, and it does not sell or share your data with anyone.

## What Explain sends, and where

Explain sends data only when you select text, right-click, and choose **Explain**. Each request goes directly from your browser to Google's Gemini API at `generativelanguage.googleapis.com`, and nowhere else. A request contains:

- the text you selected (up to 12,000 characters);
- the nearby text from the paragraph, list item, heading, or table cell that contains the selection (up to 5,000 characters);
- the page title (up to 300 characters);
- your Gemini API key, which authenticates the request.

Explain does not send the page address, the page's HTML, or anything from pages where you have not chosen **Explain**.

### Update checks

Copies installed from the GitHub zip, not from a browser store, ask GitHub (`api.github.com`) for the latest release when you open the popup, at most every six hours, or when you choose **Check for updates**. That request carries no selection, page data, or key. Store installs update through the store and never make it.

## What Explain stores

Your API key is kept in the browser's extension local storage (`chrome.storage.local`) on this device, is not synced, and is deleted when you remove Explain. Copies installed from the GitHub zip also keep the result of the last update check there (the latest version number, its download link, and when it was checked). Selections and explanations are shown on the page and discarded.

## Permissions

- `contextMenus`: add **Explain** to the right-click menu when text is selected.
- `activeTab` and `scripting`: show the Explain card on the current tab only after you choose **Explain** from that menu.
- `storage`: keep your API key on this device.
- Access to `generativelanguage.googleapis.com`: send Explain requests to Google Gemini.
- `api.github.com` (allowed in the extension's content security policy, not a permission): check for a new release in copies installed from the GitHub zip.

## Google's terms

Google processes each request under its own terms, using your API key and account. On Google's free tier, submitted content may be used to improve Google's products; Google states that paid tier content is not used for this purpose. See the [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms) and [Google's Privacy Policy](https://policies.google.com/privacy).

## Contact

Questions or concerns: open an issue at https://github.com/canmenzo/explain/issues.
