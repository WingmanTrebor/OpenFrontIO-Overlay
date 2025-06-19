# OpenFrontIO Overlay Chrome Extension

This extension injects a small overlay into the OpenFrontIO game page. The overlay currently displays placeholder metrics and a button to retrieve game state. Metrics are sent from the DevTools page through a background service worker before reaching the content script. Future versions will hook this up to the actual game state.

## Development

Load the folder as an unpacked extension in Chrome to test. Navigate to `https://openfront.io` and the overlay should appear in the top left corner.