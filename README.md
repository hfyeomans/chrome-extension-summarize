Simple Chrome extension using Manifest V3 that leverages Claude-3 to summarize the current tab or webpage.

You will need an Anthropic API key to use this extension. The key is currently hard coded in `background.js`, but future versions will read it from Chrome storage.

`background-debug.js` contains the debug statements I used while troubleshooting to ensure content flowed through to the popup and the page content was readable.
