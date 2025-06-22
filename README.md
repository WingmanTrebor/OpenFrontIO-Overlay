# OpenFrontIO Overlay Chrome Extension

This extension injects a small overlay into the OpenFrontIO game page. The overlay displays key game metrics along with buttons to retrieve game state and take specific player actions. Metrics are sent from the DevTools page through a background service worker before reaching the content script.

## Development

Load the folder as an unpacked extension in Chrome to test. Navigate to `https://openfront.io` and the overlay will appear at the top of the screen.