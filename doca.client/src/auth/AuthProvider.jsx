import { useState, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '@/api/axios';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        const { token, username, id } = res.data;
        localStorage.setItem('token', token);
        const userData = { id, username };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('username', username);
        setUser(userData);
        return userData;
    };

    const register = async (username, email, password) => {
        await api.post('/api/auth/register', { username, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        setUser(null);
    };

    const value = useMemo(() => ({ user, login, register, logout }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};