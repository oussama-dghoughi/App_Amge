import { Platform } from 'react-native';

let LocalisationScreen;

if (Platform.OS === 'web') {
    LocalisationScreen = require('./localisation.web').default;
} else {
    LocalisationScreen = require('./localisation').default;
}

export default LocalisationScreen;
