module.exports = {
  name: 'App_Amge',
  version: '1.0.0',
  extra: {
    platformSpecific: {
      web: {
        // Web-specific configuration
        useWebSpecificComponents: true,
      },
      native: {
        // Native-specific configuration
        useNativeSpecificComponents: true,
      },
    },
  },
  web: {
    bundler: 'webpack',
  },
}; 