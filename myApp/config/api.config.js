// Configuration API pour myApp
import { Platform } from 'react-native';

const getApiUrl = () => {
    // 1. Priorité au .env
    if (process.env.EXPO_PUBLIC_API_URL) {
        return `${process.env.EXPO_PUBLIC_API_URL}/api`;
        // Note: Assurez-vous que EXPO_PUBLIC_API_URL ne contient pas déjà "/api" à la fin dans le .env
    }

    // 2. Fallbacks automatiques selon l'OS si pas de .env
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000/api'; // Émulateur Android
    } else {
        return 'http://localhost:5000/api'; // iOS Simulator & Web
    }
};

const config = {
    apiUrl: getApiUrl()
};

export default config;


