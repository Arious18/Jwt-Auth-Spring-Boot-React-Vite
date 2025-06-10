import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authState, setAuthState] = useState(Date.now()); // Add state to trigger re-renders

    // Load user from localStorage when the component mounts
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName');
            const userEmail = localStorage.getItem('userEmail');
            const access = localStorage.getItem('access');

            if (token && userId) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUser({
                    id: userId,
                    name: userName,
                    email: userEmail,
                    access: access || 'user', // Default to 'user' if undefined
                    token: token,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkAuth();

        // Add event listener to handle storage changes from other tabs
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [authState]); // Depend on authState to trigger re-renders

    const login = (userData) => {
        const { token, userId, name, email, access } = userData;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('access', access || 'user');

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser({
            id: userId,
            name: name,
            email: email,
            access: access || 'user',
            token: token,
        });

        // Force refresh of auth state
        setAuthState(Date.now());

        // Dispatch a custom event to notify components about auth changes
        window.dispatchEvent(new Event('auth-change'));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('access');

        delete axios.defaults.headers.common['Authorization'];

        setUser(null);

        // Force refresh of auth state
        setAuthState(Date.now());

        // Dispatch a custom event to notify components about auth changes
        window.dispatchEvent(new Event('auth-change'));
    };

    const isAuthenticated = () => {
        return !!user;
    };

    // Expose a method to force refresh of auth state
    const refreshAuthState = () => {
        setAuthState(Date.now());
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated,
                loading,
                refreshAuthState,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};