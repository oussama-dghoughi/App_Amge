// Configuration API pour myApp
const ENV = {
    dev: {
        // IMPORTANT: Utilisez localhost pour web, IP pour mobile
        // Pour trouver votre IP: cmd > ipconfig > IPv4 Address
        apiUrl: 'http://10.245.51.20:5000/api', // Backend local - IP du PC
    },
    prod: {
        apiUrl: 'https://your-production-backend.com/api', // Production (à définir)
    }
};

const getEnvVars = () => {
    if (__DEV__) {
        return ENV.dev;
    }
    return ENV.prod;
};

export default getEnvVars();
