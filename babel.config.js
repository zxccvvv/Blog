module.exports = {
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
