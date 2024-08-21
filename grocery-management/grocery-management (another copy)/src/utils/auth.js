// src/utils/auth.js
import { getToken, removeToken as removeStoredToken } from './storage';

export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

export const removeToken = () => {
    removeStoredToken();
};
