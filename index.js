/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotificationsConfigs from './src/config/PushNotificationConfig';
PushNotificationsConfigs.configurations();
AppRegistry.registerComponent(appName, () => App);
