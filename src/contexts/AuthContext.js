"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    // Optionally verify token is still valid
                    const response = await userAPI.getMe();
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (err) {
                    console.error('Auth check failed:', err);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            setError(null);
            console.log('[AUTH] Attempting login for:', username);
            const response = await authAPI.login({ username, password });
            console.log('[AUTH] Login response:', response.data);

            const { access_token, user: userData } = response.data;
            console.log('[AUTH] Access token received:', !!access_token);
            console.log('[AUTH] User data received:', userData);

            // Save token and user data
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('[AUTH] Token saved to localStorage');
            console.log('[AUTH] Verifying token in localStorage:', localStorage.getItem('access_token'));

            setUser(userData);

            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Login failed';
            console.error('[AUTH] Login error:', err);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await authAPI.register(userData);

            // Auto-login after registration
            return await login(userData.username, userData.password);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        authAPI.logout().catch(() => { }); // Fire and forget
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
