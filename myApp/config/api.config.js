// Configuration API pour myApp
const ENV = {
    dev: {
        // IMPORTANT: Utilisez localhost pour web, IP pour mobile
        // Pour trouver votre IP: cmd > ipconfig > IPv4 Address
        apiUrl: 'http://172.20.10.3:5000/api', // Backend local
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
