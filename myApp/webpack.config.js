const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the config before returning it.
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': 'react-native-web/dist/exports/View',
      'react-native-gesture-handler': 'react-native-web/dist/exports/View',
      'react-native-screens': 'react-native-web/dist/exports/View',
      'react-native-reanimated': 'react-native-web/dist/exports/Animated',
      '@react-native-community/async-storage': 'react-native-web/dist/exports/AsyncStorage',
    },
    extensions: ['.web.js', '.web.jsx', '.js', '.jsx'],
    fallback: {
      ...config.resolve.fallback,
      "crypto": false,
      "stream": false,
      "path": false,
      "fs": false
    }
  };

  return config;
}; 