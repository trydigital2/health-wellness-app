import { registerRootComponent } from 'expo';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import appConfig from './app.json';

const appName = appConfig?.expo?.name || 'HealthAndWellnessApp';

// Support both standard React Native CLI AppRegistry and Expo CLI registerRootComponent
if (Platform.OS === 'web') {
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root') || document.getElementById('main'),
  });
} else {
  // registerRootComponent calls AppRegistry.registerComponent('main', () => App)
  // which works seamlessly across React Native CLI and Expo environments!
  registerRootComponent(App);
  AppRegistry.registerComponent(appName, () => App);
}

export default App;
