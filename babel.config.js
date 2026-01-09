// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//     plugins: ['react-native-worklets/plugin',],
// };
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    'react-native-worklets/plugin', // ⚠️ MUST be last
  ],
};