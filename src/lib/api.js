import axios from 'axios';
import { getAccessToken, getUser, saveAccessToken, saveUser, clearAccessToken, clearUser } from '@/lib/tokenService';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

const api = axios.create({
    baseURL: API_URL, // Tu URL del backend
    withCredentials: true // MUY IMPORTANTE: Permite que se envíen y reciban las cookies
});

// 1. Agregar el access token a todas las peticiones
api.interceptors.request.use((config) => {
    let token = getAccessToken();
    if (!token && getUser()) {
        const userObj = getUser();
        token = userObj?.token;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// 2. Interceptar errores para hacer el refresh
api.interceptors.response.use(
    (response) => {
        return response; // Todo bien
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data?.msg === "TokenExpiredError" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Hacemos un request POST al nuevo endpoint de refresh
                const response = await api.post(
                    '/user/refresh',
                    {},
                    { withCredentials: true } // MUY IMPORTANTE enviar cookies
                );

                // Guardamos el nuevo access token
                const newAccessToken = response.data.token || response.data.accessToken;
                if (newAccessToken) {
                    saveAccessToken(newAccessToken);

                    // Update the user object in memory to reflect new token
                    if (getUser()) {
                        const userObj = getUser();
                        userObj.token = newAccessToken;
                        saveUser(userObj);
                    }
                }

                // Actualizamos el header de la petición que falló y la reintentamos
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                clearAccessToken();
                clearUser();
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
