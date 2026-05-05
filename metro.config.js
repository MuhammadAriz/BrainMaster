const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Resolution is now handled via platform extensions (.native.ts, .web.ts)
// This ensures that native libraries are never bundled for the web.

module.exports = config;
